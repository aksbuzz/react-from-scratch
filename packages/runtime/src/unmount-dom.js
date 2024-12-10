import { removeEventListeners } from './events';
import { DOM_TYPES } from './h';

export function unmountDOM(vDOM) {
  switch (vDOM.type) {
    case DOM_TYPES.TEXT:
      removeTextNode(vDOM);
      break;
    case DOM_TYPES.ELEMENT:
      removeElementNode(vDOM);
      break;
    case DOM_TYPES.FRAGMENT:
      removeFragmentNode(vDOM);
      break;
    default:
      throw new Error(`Can't unmount DOM of type: ${vDOM.type}`);
  }

  delete vDOM.el;
}

function removeTextNode(vDOM) {
  const { el } = vDOM;
  el.remove();
}

function removeFragmentNode(vDOM) {
  const { children } = vDOM;
  children.forEach(unmountDOM);
}

function removeElementNode(vDOM) {
  const { el, children, listeners } = vDOM;

  el.remove();
  children.forEach(unmountDOM);

  if (listeners) {
    removeEventListeners(listeners, el);
    delete vDOM.listeners;
  }
}
