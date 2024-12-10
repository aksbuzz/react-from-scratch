import { h } from '../../packages/runtime/dist/rfs.js';

export function CreateTodo({ currentTodo }, emit) {
  return h('div', {}, [
    h('label', { for: 'todo-input' }, ['New Todo']),
    h('input', {
      type: 'text',
      id: 'todo-input',
      value: currentTodo,
      on: {
        change: ({ target }) => emit('updateCurrentTodo', target.value),
        keydown: ({ key }) => {
          if (key === 'Enter' && currentTodo.length >= 3) {
            emit('addTodo');
          }
        },
      },
    }),
    h(
      'button',
      {
        disabled: currentTodo.length < 3,
        on: { click: () => emit('addTodo') },
      },
      ['Add']
    ),
  ]);
}
