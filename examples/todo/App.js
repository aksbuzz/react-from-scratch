import { h, hFragment } from '../../packages/runtime/dist/rfs.js';
import { CreateTodo } from './CreateTodo.js';
import { TodoList } from './TodoList.js';

export function App(state, emit) {
  return hFragment([h('h1', {}, ['My Todos']), CreateTodo(state, emit), TodoList(state, emit)]);
}
