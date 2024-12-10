import { setAttributes } from './attributes';
import { addEventListeners } from './events';
import { DOM_TYPES } from './h';

export function mountDOM(vDOM, parentEl) {
  switch (vDOM.type) {
    case DOM_TYPES.TEXT:
      createTextNode(vDOM, parentEl);
      break;
    case DOM_TYPES.ELEMENT:
      createElementNode(vDOM, parentEl);
      break;
    case DOM_TYPES.FRAGMENT:
      createFragmentNode(vDOM, parentEl);
      break;
    default:
      throw new Error(`Can't mount DOM of type: ${vDOM.type}`);
  }
}

function createTextNode(vDOM, parentEl) {
  const { value } = vDOM;

  // create text node
  const textNode = document.createTextNode(value);
  // save reference
  vDOM.el = textNode;

  // append to parent
  parentEl.append(textNode);
}

function createFragmentNode(vDOM, parentEl) {
  const { children } = vDOM;
  vDOM.el = parentEl;

  // append each child to parent element
  children.forEach(child => mountDOM(child, parentEl));
}

function createElementNode(vDOM, parentEl) {
  const { tag, props, children } = vDOM;

  // create element node
  const element = document.createElement(tag);
  // add attrs and event listeners
  addProps(element, props, vDOM);
  // save reference
  vDOM.el = element;

  // mount children
  children.forEach(child => mountDOM(child, element));
  // append to parent
  parentEl.append(element);
}

function addProps(el, props, vDOM) {
  const { on: events, ...attrs } = props;

  // add event listeners and save reference
  vDOM.listeners = addEventListeners(events, el);
  setAttributes(attrs, el);
}
