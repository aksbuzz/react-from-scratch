/**
 * {
 *  type: DOM_TYPES.ELEMENT,
 *  props: {
 *    on: {
 *      mouseover: () => console.log(),
 *      click: () => console.log(),
 *    }
 *  }
 * }
 */


/**
 * Add event listeners to an element
 */
export function addEventListeners(listeners = {}, el) {
  const addedListeners = {};

  Object.entries(listeners).forEach(listener => {
    const [eventName, handler] = listener;
    addedListeners[eventName] = addEventListener(eventName, handler, el);
  });

  return addedListeners;
}

export function addEventListener(eventName, handler, el) {
  el.addEventListener(eventName, handler);
  return handler;
}

export function removeEventListeners(listener, el) {
  Object.entries(listener).forEach(([eventName, handler]) => {
    el.removeEventListener(eventName, handler)
  })
}