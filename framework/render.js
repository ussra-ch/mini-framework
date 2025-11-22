import { createRealElement } from "./core.js";

export function render(newTree, container,oldTree) {
    console.log(newTree,container,oldTree);  
    updateElement(container, newTree, oldTree);
}
export function updateElement(parent, newNode, oldNode, index = 0) {
    // support arrays of vnodes
    if (Array.isArray(newNode)) {
        for (let i = 0; i < newNode.length; i++) {
            const newChild = newNode[i];
            const oldChild = oldNode ? oldNode[i] : null;
            updateElement(parent, newChild, oldChild, i);
        }
        return;
    }
    if (!parent) return;

    const existing = parent.childNodes[index];

    if (changed(newNode, oldNode)) {
        const newEl = createRealElement(newNode);
        if (existing) {
            parent.replaceChild(newEl, existing);
        } else {
            parent.appendChild(newEl);
        }
        return;
    }

    updateProps(existing, newNode.props || {}, oldNode?.props || {});

    const newChildren = newNode.children || [];
    const oldChildren = oldNode?.children || [];

    const max = Math.max(newChildren.length, oldChildren.length);
    for (let i = 0; i < max; i++) {
        updateElement(existing, newChildren[i], oldChildren[i], i);
    }
}
export function changed(n1, n2) {
    return typeof n1 !== typeof n2 ||
        (typeof n1 === "string" && n1 !== n2) ||
        n1?.tag !== n2?.tag;
}
export function updateProps(el, newProps, oldProps) {
    if (!el) return;

    // remove old props
    for (let key in oldProps) {
        if (!(key in newProps)) {
            el.removeAttribute(key);
        }
    }

    // add/update new props
    for (let key in newProps) {
        if (newProps[key] !== oldProps[key]) {
            // handle class and style specially
            if (key === 'class') el.className = newProps[key];
            else if (key === 'style' && typeof newProps[key] === 'object') Object.assign(el.style, newProps[key]);
            else el.setAttribute(key, newProps[key]);
        }
    }
}