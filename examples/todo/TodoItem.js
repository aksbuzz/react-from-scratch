import { h, hFragment } from '../../packages/runtime/dist/rfs.js';

// editingIdxs is a set of indexes of todos that are being edited
export function TodoItem({ todo, index, edit }, emit) {
  const isEditing = edit.index === index;

  if (isEditing) {
    return TodoItemInEditMode(edit, emit);
  }

  return TodoItemInViewMode(emit, index, todo);
}

function TodoItemInViewMode(emit, index, todo) {
  return h('li', {}, [
    h(
      'span',
      {
        on: {
          dblclick: () => emit('startEditing', index),
        },
      },
      [todo]
    ),
    h(
      'button',
      {
        on: { click: () => emit('deleteTodo', index) },
      },
      ['Done']
    ),
  ]);
}

function TodoItemInEditMode(edit, emit) {
  return h('li', {}, [
    h('input', {
      value: edit.edited,
      on: {
        change: ({ target }) => emit('editTodo', target.value),
      },
    }),
    h(
      'button',
      {
        on: { click: () => emit('saveEditedTodo') },
      },
      ['Save']
    ),
    h(
      'button',
      {
        on: { click: () => emit('cancelEditing') },
      },
      ['Cancel']
    ),
  ]);
}
