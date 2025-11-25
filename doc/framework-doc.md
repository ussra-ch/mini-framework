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

- **Router**
	- Instance: `framework.router` (in `framework/state.js`).
	- Methods:
		- `addRoute(path, renderFn)` — registers a route handler. Hash routes use `#/path` (internal path string excludes the `#/`).
		- `setNotFound(fn)` — set fallback render function.
		- `start()` — initializes router and listens to `hashchange`.
		- `link(e, route)` — helper to `preventDefault()` and change the `location.hash` to `#/route`.
	- On navigate the router calls `runEventCleanups()` to remove previously registered DOM event listeners.

- **Event registry**
	- `registerDomEvent(element, type, handler)` — attaches the listener and records a cleanup function in an internal `eventRegistry` set.
	- `runEventCleanups()` — executes and clears all registered cleanup functions.

**Example: Minimal app flow (based on `app/app.js` and `app/todos.js`)**
- HTML: ensure an app root exists:
	```html
	<div id="app"></div>
	```
- Create a store and component tree (see `app/todos.js`):
	- `const store = framework.createStore({ todos: [], editingId: null, newTodoText: '', route: 'all' })`
	- A component function returns a VNode tree using `createElement`. Attach DOM event handlers under `events`.
	- Example VNode for an input:
		```js
		createElement({
			tag: 'input',
			attrs: { class: 'new-todo', value: state.newTodoText, placeholder: 'What needs to be done?' },
			events: {
				input: e => store.update({ newTodoText: e.target.value }),
				keydown: e => { if (e.key === 'Enter') /* add todo */ }
			}
		})
		```
- Render loop (see `app/app.js`):
	- Keep the previous VNode in `this.oldVNode`.
	- `store.subscribe(state => { const newnode = createTodoApp(state, state.route); render(newnode, rootEl, this.oldVNode, state.render); this.oldVNode = newnode; })`.
	- To force a full re-render, pass `newroot` truthy in the `render` call.

**Best Practices & Notes**
- Use `attrs.key` on list items to preserve identity when rendering lists.
- Use `events.mount` to run code after the element is attached (e.g., focus an input).
- Prefer using `store.update({...})` to ensure subscribers are notified.
- The renderer supports style objects and common boolean DOM props.
- The framework assumes small apps; it is intentionally minimal and educational.

**Known quirks / implementation notes**
- Event comparisons in the renderer rely on presence of handlers — ensure `events` is an object mapping event names to functions.
- `juststate` exists for internal non-notifying state changes; prefer `update` in app code.
- `app/indext.html` is the example entry point (note: file is named `indext.html` in the repo).

**Where to look in the code**
- `framework/createjsx.js` — VNode factory (`createElement`).
- `framework/core.js` — VNode -> DOM creation and attribute/event handling.
- `framework/render.js` — diffing algorithm and DOM updates.
- `framework/state.js` — `createStore` and `router`.
- `framework/eventRegistry.js` — event cleanup registry.
- `app/` — an opinionated example app (`app/app.js`, `app/todos.js`).

If you want, I can:
- add more code examples (smaller focused snippets),
- add a reference section with each function signature in full,
- or create a README that explains how to extend the framework.

