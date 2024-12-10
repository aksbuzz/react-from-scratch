export function setAttributes(attrs, el) {
  const { class: className, style, ...rest } = attrs;

  if (className) {
    setClass(className, el);
  }

  if (style) {
    Object.entries(style).forEach(([prop, value]) => {
      setStyle(prop, value, el);
    });
  }

  for (const [name, value] of Object.entries(rest)) {
    setAttribute(name, value, el);
  }
}

function setClass(className, el) {
  el.className = '';

  if (typeof className === 'string') {
    el.className = className;
  }

  if (Array.isArray(className)) {
    el.classList.add(...className);
  }
}

function setStyle(name, value, el) {
  el.style[name] = value;
}

function unsetStyle(name, el) {
  el.style[name] = null;
}

function setAttribute(name, value, el) {
  if (value == null) {
    removeAttribute(name, el);
  } else if (name.startsWith('data-')) {
    el.setAttribute(name, value);
  } else {
    el[name] = value;
  }
}

function removeAttribute(name, el) {
  el[name] = null;
  el.removeAttribute(name);
}
