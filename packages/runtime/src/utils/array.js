export function withoutNulls(arr) {
  return arr.filter(item => item !== null);
}

export function arraysDiff(o, n) {
  return {
    added: n.filter(item => !o.includes(item)),
    removed: o.filter(item => !n.includes(item)),
  };
}

export const ARRAY_DIFF_OP = {
  ADD: 'add',
  REMOVE: 'remove',
  MOVE: 'move',
  NOOP: 'noop',
};

// Main function to compute the sequence of operations to transform array `o` into array `n`
export function arraysDiffSequence(o, n, equalsFn) {
  const sequence = [];
  const arr = new ArrayWithIndices(o, equalsFn);

  n.forEach((item, i) => {
    if (arr.isRemoval(i, n)) {
      sequence.push(arr.remove(i));
      return;
    }

    if (arr.isNoop(item, i)) {
      sequence.push(arr.noop(i));
      return;
    }

    if (arr.isAddition(item)) {
      sequence.push(arr.add(item, i));
      return;
    }

    sequence.push(arr.move(item, i));
  });

  sequence.push(...arr.removeRemaining(n.length));

  return sequence;
}

// Helper class to manage the old array and its original indices
class ArrayWithIndices {
  constructor(array, equalsFn) {
    this.array = [...array];
    this.originalIndices = array.map((_, i) => i);
    this.equalsFn = equalsFn;
  }

  // Check if the item at index `i` in the old array is no longer in the new array
  isRemoval(i, n) {
    return (
      // Item is not found in the new array
      i < this.array.length && n.findIndex(item => this.equalsFn(item, this.array[i])) === -1
    );
  }

  // Remove the item at the specified index and return the REMOVE operation
  remove(index) {
    return {
      op: ARRAY_DIFF_OP.REMOVE,
      index,
      item: this.array.splice(index, 1)[0], // Remove the item from the array and include it in the operation
    };
  }

  // Check if the item at `index` in the new array is the same as in the old array
  isNoop(item, index) {
    return (
      // Compare items at the current index
      index < this.array.length && this.equalsFn(this.array[index], item)
    );
  }

  // Return a NOOP operation for the item at the specified index
  noop(index) {
    return {
      op: ARRAY_DIFF_OP.NOOP,
      index,
      item: this.array[index],
      originalIndex: this.originalIndices[index], // The original index of the item
    };
  }

  // Check if an item in the new array does not exist in the old array
  isAddition(item) {
    return this.array.findIndex(el => this.equalsFn(el, item)) === -1; // Item is not found in the old array
  }

  // Add a new item to the array and return the ADD operation
  add(item, index) {
    this.array.splice(index, 0, item); // Insert the item into the array at the specified index
    this.originalIndices.splice(index, 0, -1); // Insert a placeholder (-1) for the original index
    return {
      op: ARRAY_DIFF_OP.ADD,
      index,
      item,
    };
  }

  // Move an item from its original position to a new position in the array
  move(item, toIndex) {
    // Find the index of the item in the old array
    const fromIndex = this.array.findIndex(el => this.equalsFn(el, item));
    // Remove the item from its original position
    const [movedItem] = this.array.splice(fromIndex, 1);
    // Insert the item at its new position
    this.array.splice(toIndex, 0, movedItem);

    // Remove the item's original index
    const [originalIndex] = this.originalIndices.splice(fromIndex, 1);
    // Insert the original index at the new position
    this.originalIndices.splice(toIndex, 0, originalIndex);

    return {
      op: ARRAY_DIFF_OP.MOVE,
      from: fromIndex,
      index: toIndex,
      originalIndex,
      item: movedItem,
    };
  }

  // Remove all remaining items from the old array after a specified index
  removeRemaining(startIndex) {
    const removed = [];
    while (this.array.length > startIndex) {
      removed.push(this.remove(startIndex));
    }
    return removed;
  }
}
