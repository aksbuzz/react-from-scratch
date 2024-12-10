import { h, hFragment } from '../../packages/runtime/dist/rfs.js';
import { TodoItem } from './TodoItem.js';

export function TodoList({ todos, edit }, emit) {
  return h(
    'ul',
    {},
    todos.map((todo, index) => TodoItem({ todo, index, edit }, emit))
  );
}
