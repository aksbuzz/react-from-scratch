// h() - function to create hypertext
// react uses React.createElement()

import { withoutNulls } from './utils/array';

export const DOM_TYPES = {
  TEXT: 'text',
  ELEMENT: 'element',
  FRAGMENT: 'fragment',
};

/**
 * h() - function to create hypertext
 * @param {string} tag tag name
 * @param {Object} [props={}] attributes of the element
 * @param {Array} [children=[]] children of the element
 * @returns {Object} vDOM object
 */
export function h(tag, props = {}, children = []) {
  return {
    tag,
    props,
    // some children could be string instead of object, in which case we transform them
    // to TEXT nodes
    // some children may be null, so we filter them
    children: mapTextNodes(withoutNulls(children)),
    type: DOM_TYPES.ELEMENT,
  };
}

/**
 * hString() - function to create TEXT node
 * @param {string} str value of the TEXT node
 * @returns {Object} vDOM object
 */
export function hString(str) {
  return { type: DOM_TYPES.TEXT, value: str };
}

/**
 * hFragment() - function to create FRAGMENT node
 * @param {Array} vNodes virtual nodes to be wrapped in the fragment
 * @returns {Object} vDOM object
 */
export function hFragment(vNodes) {
  return {
    type: DOM_TYPES.FRAGMENT,
    children: mapTextNodes(withoutNulls(vNodes)),
  };
}


function mapTextNodes(children) {
  return children.map(child => (typeof child === 'string' ? hString(child) : child));
}
