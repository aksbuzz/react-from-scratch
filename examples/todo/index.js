import { createApp } from '../../packages/runtime/dist/rfs.js';
import { App } from './App.js';

const state = {
  currentTodo: '',
  edit: {
    index: null,
    original: null,
    edited: null,
  },
  todos: ['Walk the dog', 'Wash the dishes'],
};

const reducers = {
  // when user click add button
  addTodo: state => ({ ...state, currentTodo: '', todos: [...state.todos, state.currentTodo] }),
  // update todo as user type
  updateCurrentTodo: (state, payload) => ({ ...state, currentTodo: payload }),
  // when user double click todo to edit it
  startEditing: (state, index) => ({
    ...state,
    edit: {
      index,
      original: state.todos[index],
      edited: state.todos[index],
    },
  }),
  // update editing todo as user type
  editTodo: (state, payload) => ({ ...state, edit: { ...state.edit, edited: payload } }),
  // user click save button
  saveEditedTodo: state => {
    const todos = [...state.todos];
    todos[state.edit.index] = state.edit.edited;

    return {
      ...state,
      edit: { index: null, original: null, edited: null },
      todos,
    };
  },
  // user click cancel button
  cancelEditing: state => ({
    ...state,
    edit: { index: null, original: null, edited: null },
  }),
  // user click delete button
  deleteTodo: (state, index) => ({ ...state, todos: state.todos.filter((_, i) => i !== index) }),
};
const view = (state, emit) => App(state, emit);

const app = createApp({ state, reducers, view });
app.mount(document.body);
