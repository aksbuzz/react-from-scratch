import { setAttributes } from './attributes';
import { addEventListeners } from './events';
import { DOM_TYPES } from './h';

export function mountDOM(vDOM, parentEl, index) {
  switch (vDOM.type) {
    case DOM_TYPES.TEXT:
      createTextNode(vDOM, parentEl, index);
      break;
    case DOM_TYPES.ELEMENT:
      createElementNode(vDOM, parentEl, index);
      break;
    case DOM_TYPES.FRAGMENT:
      createFragmentNode(vDOM, parentEl, index);
      break;
    default:
      throw new Error(`Can't mount DOM of type: ${vDOM.type}`);
  }
}

function insert(el, parentEl, index) {
  if (index == null) {
    parentEl.append(el);
    return;
  }

  if (index < 0) {
    throw new Error(`Index out of bound`);
  }

  const children = parentEl.childNodes;

  if (index >= children.length) {
    parentEl.append(el);
  } else {
    parentEl.insertBefore(el, children[index]);
  }
}

function createTextNode(vDOM, parentEl, index) {
  const { value } = vDOM;

  // create text node
  const textNode = document.createTextNode(value);
  // save reference
  vDOM.el = textNode;

  insert(textNode, parentEl, index);
}

function createFragmentNode(vDOM, parentEl, index) {
  const { children } = vDOM;
  vDOM.el = parentEl;

  // append each child to parent element
  children.forEach((child, i) => mountDOM(child, parentEl, index ? index + i : null));
}

function createElementNode(vDOM, parentEl, index) {
  const { tag, props, children } = vDOM;

  // create element node
  const element = document.createElement(tag);
  // add attrs and event listeners
  addProps(element, props, vDOM);
  // save reference
  vDOM.el = element;

  // mount children
  children.forEach(child => mountDOM(child, element));
  insert(element, parentEl, index);
}

function addProps(el, props, vDOM) {
  const { on: events, ...attrs } = props;

  // add event listeners and save reference
  vDOM.listeners = addEventListeners(events, el);
  setAttributes(attrs, el);
}
