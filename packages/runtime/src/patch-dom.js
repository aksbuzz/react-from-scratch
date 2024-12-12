import { removeAttribute, setAttribute, setStyle, unsetStyle } from './attributes';
import { addEventListener } from './events';
import { DOM_TYPES, extractChildren } from './h';
import { mountDOM } from './mount-dom';
import { areNodesEqual } from './nodes-equal';
import { unmountDOM } from './unmount-dom';
import { ARRAY_DIFF_OP, arraysDiff, arraysDiffSequence } from './utils/array';
import { objectsDiff } from './utils/object';
import { isNotBlankOrEmptyString } from './utils/string';

/**
 * To patch DOM, we compare two vDOMs
 *
 * 1. We compare props of nodes of both vDOMs
 * 2. We compare array of both vDOMs (Ex: className given as array)
 * 3. We compare children of nodes of both vDOMs
 *    - we want to convert old children array to new children array
 *    - for that we will record series of operations required
 */
export function patchDOM(oldVDOM, newVDOM, parentEl) {
  if (!areNodesEqual(oldVDOM, newVDOM)) {
    // find the index of the element in the parent
    const index = findIndexInParent(parentEl, el);
    unmountDOM(oldVDOM);
    mountDOM(newVDOM, parentEl, index);

    return newVDOM;
  }

  // save the reference of the old element to new element
  newVDOM.el = oldVDOM.el;

  switch (newVDOM.type) {
    case DOM_TYPES.TEXT: {
      patchText(oldVDOM, newVDOM);
      return newVDOM;
    }
    case DOM_TYPES.ELEMENT: {
      patchElement(oldVDOM, newVDOM);
      break;
    }
  }

  patchChildren(oldVDOM, newVDOM);

  return newVDOM;
}

function findIndexInParent(parentEl, el) {
  const index = Array.from(parentEl.childNodes).indexOf(el);
  if (index < 0) return null;

  return index;
}

/**
 *
 * PATCH TEXT
 *
 */
function patchText(oldVDOM, newVDOM) {
  const el = oldVDOM.el;

  if (oldVDOM.value !== newVDOM.value) {
    el.nodeValue = newVDOM.value;
  }
}

/**
 *
 * PATCH ELEMENT
 *
 */
function patchElement(oldVDOM, newVDOM) {
  const el = oldVDOM.el;
  const { class: oldClass, style: oldStyle, on: oldEvents, ...oldAttrs } = oldVDOM.props;
  const { class: newClass, style: newStyle, on: newEvents, ...newAttrs } = newVDOM.props;
  const { listeners } = oldVDOM;

  patchAttrs(el, oldAttrs, newAttrs);
  patchStyles(el, oldStyle, newStyle);
  patchClasses(el, oldClass, newClass);

  newVDOM.listeners = patchEvents(el, listeners, oldEvents, newEvents);
}

function patchAttrs(el, oldAttrs, newAttrs) {
  const { added, removed, updated } = objectsDiff(oldAttrs, newAttrs);

  for (const attr of removed) {
    removeAttribute(attr, el);
  }

  for (const attr of added.concat(updated)) {
    setAttribute(attr, newAttrs[attr], el);
  }
}

function patchStyles(el, oldStyle = {}, newStyle = {}) {
  const { added, removed, updated } = objectsDiff(oldStyle, newStyle);

  for (const style of removed) {
    unsetStyle(style, el);
  }

  for (const style of added.concat(updated)) {
    setStyle(style, newStyle[style], el);
  }
}

function patchClasses(el, oldClass = [], newClass = []) {
  const oldClasses = toClassList(oldClass);
  const newClasses = toClassList(newClass);

  const { added, removed } = arraysDiff(oldClasses, newClasses);

  if (removed.length > 0) el.classList.remove(...removed);

  if (added.length > 0) el.classList.add(...added);
}

function toClassList(classes = '') {
  return Array.isArray(classes)
    ? classes.filter(isNotBlankOrEmptyString)
    : classes.split(/(\s+)/).filter(isNotBlankOrEmptyString);
}

function patchEvents(el, listeners = {}, oldEvents = {}, newEvents = {}) {
  const { added, removed, updated } = objectsDiff(oldEvents, newEvents);

  // remove any 'removed' or 'modified' listeners
  for (const eventName of removed.concat(updated)) {
    el.removeEventListener(eventName, listeners[eventName]);
  }

  const addedListeners = {};

  // add any 'added' or 'modified' listeners
  for (const eventName of added.concat(updated)) {
    const listener = addEventListener(eventName, newEvents[eventName], el);
    addedListeners[eventName] = listener;
  }

  return addedListeners;
}

/**
 *
 * PATCH CHILDREN
 *
 */

function patchChildren(oldVDOM, newVDOM) {
  const oldChildren = extractChildren(oldVDOM);
  const newChildren = extractChildren(newVDOM);

  const diffSeq = arraysDiffSequence(oldChildren, newChildren, areNodesEqual);

  const parentEl = oldVDOM.el;

  for (const op of diffSeq) {
    const { index, item, originalIndex } = op;
    switch (op.op) {
      case ARRAY_DIFF_OP.ADD:
        mountDOM(item, parentEl, index);
        break;
      case ARRAY_DIFF_OP.REMOVE:
        unmountDOM(item);
        break;
      case ARRAY_DIFF_OP.MOVE:
        // todo: understand more
        const oldChild = oldChildren[originalIndex];
        const newChild = newChildren[index];
        const el = oldChild.el;
        const elAtTargetIndex = parentEl.childNodes[index];

        parentEl.insertBefore(el, elAtTargetIndex);
        patchDOM(oldChild, newChild, parentEl);
        break;
      case ARRAY_DIFF_OP.NOOP:
        patchDOM(oldChildren[originalIndex], newChildren[index], parentEl);
        break;
    }
  }
}
