**Mini Framework**
- **Location**: `framework/`

A small virtual-DOM based UI framework with a tiny router and store. It provides a minimal JSX-like element creator, a renderer with keyed diffing, a simple store for state management, and an event cleanup registry.

**Goals**: minimal API surface, easy-to-follow code, suitable for learning and small apps (see `app/` example).

**Quick Start**
- **Open example**: serve the project root and open `app/indext.html` in your browser.
	- Example static server (run from repository root):
		```bash
		python3 -m http.server 8000
		# then open http://localhost:8000/app/indext.html
		```

**Core Concepts**
- **VNode**: a plain JS object created by `createElement({ tag, attrs, children, events })` that represents the virtual DOM node.
- **Renderer**: converts VNodes to real DOM nodes and updates them with a diffing algorithm that supports keyed children.
- **Store**: small pub/sub store with `getState()`, `update(newState)`, and `subscribe(cb)`.
- **Router**: simple hash-based router with `addRoute`, `start`, and `link` helpers.
- **Event registry**: registers DOM events and provides cleanup hooks when routes change.

**API Reference**

- **`createElement({ tag, attrs = {}, children = [], events = {} })`**
	- Location: `framework/createjsx.js`
	- Returns: `{ tag, attrs, children, events }` VNode object.
	- Usage: build the tree structure for the renderer. `children` can be strings, numbers or nested VNodes.

- **`createRealElement(vNode)`**
	- Location: `framework/core.js`
	- Internal: turns a VNode into a real DOM node.
	- Attributes handling:
		- Boolean props: `checked`, `autofocus`, `selected` are applied as DOM properties.
		- `style` accepts an object and is applied via `Object.assign(el.style, value)`.
		- `htmlFor` maps to `for` attribute.
		- `value` is set both as property and attribute.
	- Events: uses `registerDomEvent` to attach handlers and register cleanup.
	- Mount hook: if `vNode.events.mount` is a function, it is called with the created element (queued with `queueMicrotask`).

- **`render(newTree, container, oldTree, newroot)`**
	- Location: `framework/render.js`
	- Full mount: if `newroot` is truthy, the container is cleared and `newTree` is appended.
	- Diffing: `updateElement(oldVNode, newVNode, parent)` updates attributes, events, and children.
	- Keyed children: use `attrs.key` on VNodes to help the renderer preserve identity and reorder children efficiently.
	- Event queueing: adds/removes DOM listeners inside a microtask to avoid interleaving issues.

- **Store API**
	- Create: `framework.createStore(initialState)` (see `framework/state.js`).
	- Instance methods:
		- `getState()` — returns the current state object.
		- `update(newState)` — merges `newState` into the store and notifies subscribers.
		- `subscribe(cb)` — adds `cb` (called immediately with current state and later on updates).
		- `juststate(newState)` — internal helper used by the app in some render flows (it replaces/merges state without notifying subscribers).

# Mini Framework

Location: `framework/`

A tiny virtual-DOM UI framework with a minimal store and router. It's intentionally small and educational: the code is easy to read and modify, and the `app/` folder contains a working todo example you can inspect.

This document explains how the framework works and provides clear, copy-pasteable examples so a new user can start building UIs without guessing.

## Features

- Virtual DOM represented by simple VNode objects.
- Element factory: `createElement({ tag, attrs, children, events })`.
- Renderer with keyed diffing and efficient updates (`render.js`).
- Tiny store (`createStore`) with `subscribe`, `getState`, and `update`.
- Hash-based router with route registration and link helper.
- Event registry for automatic cleanup when routes change.

---

## Quick Start

1. Serve the repository root and open the example app page:

```bash
python3 -m http.server 8000
# Then open http://localhost:8000/app/indext.html
```

2. Open `app/todos.js` and `app/app.js` to see a full example using the framework.

---

## How the framework models UI (short)

- VNodes are plain objects that describe what to render. The renderer turns VNodes into DOM nodes and updates them by comparing old and new VNodes.
- Use `attrs.key` for list items to preserve identity and allow efficient reordering.
- Event listeners are registered through the event registry so the router can clean them up on navigation.

---

## Creating Elements

Use `createElement({ tag, attrs = {}, children = [], events = {} })` to construct VNodes. This is the only required step to describe UI.

Example: create a simple `div` with text

```js
import { createElement } from '../framework/createjsx.js';

const vnode = createElement({
	tag: 'div',
	attrs: { class: 'box' },
	children: ['Hello world']
});

// Later: render(vnode, container, oldVNode)
```

Explanation: `createElement` only returns a plain object. The actual DOM node is created when the renderer (in `framework/core.js`) processes the VNode.

---

## Nesting Elements

Children are provided as an array. Each child can be:

- a string or number (becomes a text node),
- a VNode returned by `createElement`,
- or `null`/`undefined` which will be ignored.

Example: nested structure

```js
const tree = createElement({
	tag: 'section',
	attrs: { class: 'container' },
	children: [
		createElement({ tag: 'h1', children: ['Todos'] }),
		createElement({ tag: 'ul', children: [
			createElement({ tag: 'li', children: ['Item 1'] }),
			createElement({ tag: 'li', children: ['Item 2'] })
		]})
	]
});
```

The renderer walks the tree recursively and creates real DOM nodes for each VNode (or text node for strings).

---

## Adding Attributes

Set attributes using the `attrs` object. The renderer has special handling for some attributes:

- Boolean properties: `checked`, `autofocus`, `selected` are assigned as DOM properties.
- `style`: pass an object and it will be applied with `Object.assign(el.style, value)`.
- `htmlFor`: maps to the `for` attribute on labels.
- `value`: sets both the DOM property and the `value` attribute.

Example: attributes and styles

```js
createElement({
	tag: 'input',
	attrs: {
		id: 'task',
		type: 'text',
		value: 'buy milk',
		autofocus: true,
		style: { padding: '8px', border: '1px solid #ccc' }
	}
});
```

Note: any attribute not handled specially is set with `element.setAttribute(key, value)`.

---

## Adding Events

Use the `events` object to attach event handlers. Handlers are plain functions that receive the DOM `Event`.

Example: a button with a click handler

```js
createElement({
	tag: 'button',
	attrs: { class: 'btn' },
	events: {
		click: (e) => { console.log('clicked', e); }
	},
	children: ['Click me']
});
```

Implementation details:

- `core.createRealElement` calls `registerDomEvent(element, eventType, handler)` to attach the listener.
- `registerDomEvent` stores a cleanup function in the framework's event registry so listeners can be removed when routes change or when you explicitly call cleanup.
- You can also provide a `mount` event handler which the renderer will call after the element is attached to the DOM (it runs inside a `queueMicrotask`). This is handy for focusing inputs:

```js
createElement({
	tag: 'input',
	attrs: { class: 'edit' },
	events: {
		mount: el => el.focus()
	}
});
```

---

## Rendering

Call `render(newTree, container, oldTree, newroot)` to render or update the DOM.

- If `newroot` is truthy the container will be cleared and `newTree` is appended (full mount).
- Otherwise the renderer diffs `oldTree` and `newTree` and updates only the parts that changed.

Typical render loop pattern (see `app/app.js`):

```js
import { render } from '../framework/render.js';
import { store } from './todos.js';

let oldVNode = null;
const root = document.getElementById('app');

store.subscribe(state => {
	const newVNode = createTodoApp(state, state.route);
	render(newVNode, root, oldVNode, state.render);
	oldVNode = newVNode;
});
```

This approach keeps `oldVNode` so the renderer has something to diff against and perform efficient updates.

---

## Lists and Keys

When rendering lists, include a `key` in `attrs` (e.g., `attrs: { key: item.id }`). The renderer uses these keys to map old children to new children and reduce DOM churn.

Example list item

```js
createElement({ tag: 'li', attrs: { key: todo.id }, children: [todo.text] })
```

Without keys the renderer falls back to index-based identity which causes unnecessary DOM moves when order changes.

---

## Store and Router

Store:

- Create a store with `framework.createStore(initialState)`.
- `getState()` returns the state.
- `update(newState)` merges and notifies subscribers.
- `subscribe(cb)` adds a subscriber which is immediately invoked with the current state.

Router:

- Use `framework.router.addRoute(path, renderFn)` to add routes.
- `framework.router.start()` activates the router and listens for `hashchange`.
- Use `framework.router.link(e, route)` inside anchor handlers to change the hash and prevent full page reload.

Router calls `runEventCleanups()` before navigating so DOM event listeners registered by the previous view are properly removed.

---

## Why things work this way

- Plain VNodes: Keeping virtual nodes as plain objects keeps the framework tiny and easy to reason about. There's no compile step or JSX transformer required.
- Diffing with keys: Keys are used to preserve identity across reorders. This reduces DOM manipulation and keeps input focus, checked state, etc.
- Event registry: The registry allows the router to remove old listeners on navigation, preventing memory leaks and duplicated handlers.
- Microtasks for mount/events: The renderer queues some operations with `queueMicrotask` to ensure the DOM is in a stable state before calling mount hooks or applying batched event changes.

---

## Common patterns & examples

- Add a new todo when Enter is pressed (from `app/todos.js`):

```js
events: {
	keydown: e => {
		if (e.key === 'Enter' && e.target.value.trim().length > 0) {
			store.update({
				todos: [
					...todos,
					{ id: Date.now(), text: e.target.value.trim(), completed: false }
				],
				newTodoText: ''
			});
		}
	}
}
```

- Toggle a todo completed state:

```js
events: { change: () => store.update({ todos: todos.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t) }) }
```

---

## Best practices

- Use `attrs.key` for list items.
- Prefer `store.update` to ensure subscribers are notified.
- Use `events.mount` for DOM-only initialization (focus, measurements).
- Keep handlers small and update state via `store.update` so the render loop runs from a single source of truth.

---

## Where to look in the code

- `framework/createjsx.js` — `createElement` factory.
- `framework/core.js` — VNode -> DOM creation, attributes, event attachment, mount hook.
- `framework/render.js` — diffing, keyed children handling, event queueing.
- `framework/state.js` — `createStore` and `router` implementation.
- `framework/eventRegistry.js` — event registry and cleanup.
- `app/` — example app: `app/app.js` and `app/todos.js`.

---

If you'd like, I can now:

- Add a short `README.md` at the project root that links to this doc and shows the minimal start commands.
- Add a compact API reference file listing each exported function signature.

