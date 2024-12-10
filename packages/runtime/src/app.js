import { Dispatcher } from './dispatcher';
import { mountDOM } from './mount-dom';
import { unmountDOM } from './unmount-dom';

/**
 * Function to create app instance
 * @param {{ state: Object, view: Function, reducers: Object }} options
 * @return {{ mount: Function, unmount: Function }}
 */
export function createApp({ state, view, reducers = {} }) {
  let parentEl = null;
  let vDOM = null;

  const dispatcher = new Dispatcher();
  // re-render whenever state changes after every command
  const subscriptions = [dispatcher.afterEveryCommand(render)];

  /**
   * Function that emits event of type eventName with payload
   * @param {string} eventName
   * @param {Object} payload
   */
  function emit(eventName, payload) {
    dispatcher.dispatch(eventName, payload);
  }

  /**
   * Function that renders the app
   */
  function render() {
    if (vDOM) {
      unmountDOM(vDOM);
    }

    vDOM = view(state, emit);
    mountDOM(vDOM, parentEl);
  }

  // Register reducers
  for (const actionName in reducers) {
    const reducer = reducers[actionName];
    const subs = dispatcher.subscribe(actionName, payload => {
      state = reducer(state, payload);
    });
    subscriptions.push(subs);
    // subscriptions array consist of unsubscribe functions
  }

  return {
    /**
     * Mount the app to parentEl
     * @param {Element} parentEl
     */
    mount(_parentEl) {
      parentEl = _parentEl;
      render();
    },
    /**
     * Unmount the app
     */
    unmount() {
      unmountDOM(vDOM);
      vDOM = null;
      subscriptions.forEach(unsubscribe => unsubscribe());
    },
  };
}
