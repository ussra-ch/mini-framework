// had l function kachd lia l VDOM mn 3and l user wkatkhdm hia b DOm bach trj3o real DOM
export function createRealElement(vNode) {
  if (typeof vNode === 'string' || typeof vNode === 'number') {
    const textNode = document.createTextNode(vNode.toString());
    return textNode;
  }

  if (!vNode || !vNode.tag) return document.createTextNode('');

  const element = document.createElement(vNode.tag);
  vNode.el = element;

  const attrs = vNode.attrs || {};
  Object.keys(attrs).forEach((key) => {
    const value = attrs[key];
    if (key === 'checked' || key === 'autofocus' || key === 'selected') {
      element[key] = !!value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key === 'htmlFor') {
      element.setAttribute('for', value);
    } else if (key === 'value') {
      element.value = value || '';
    } else {
      element.setAttribute(key, value);
    }
  });

  const events = vNode.events || {};
  Object.keys(events).forEach((eventType) => {
    element.addEventListener(eventType, events[eventType]);
  });

  const children = vNode.children || [];
  children.forEach((child) => {
    if (child) {
      element.appendChild(createRealElement(child));
    }
  });

  queueMicrotask(() => {
    if (vNode.events && typeof vNode.events.mount === 'function') {
      vNode.events.mount(element);
    }
  });

  return element;
}