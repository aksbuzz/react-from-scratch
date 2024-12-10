import { createApp, h, hFragment, hString } from '../../packages/runtime/dist/rfs.js';

const state = 0;
const reducers = {
  increment: (state, payload) => state + payload,
  decrement: (state, payload) => state - payload,
};
const view = (state, emit) => {
  return hFragment([
    h('h1', {}, [hString('Counter: '), hString(state)]),
    h('button', { onclick: () => emit('increment', 1) }, ['Inc']),
    h('button', { onclick: () => emit('decrement', 1) }, ['Dec']),
  ]);
};

const app = createApp({ state, reducers, view });
app.mount(document.body)
