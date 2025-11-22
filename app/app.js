import { render } from "../framework/render.js";
import { createTodoApp ,store} from "./todos.js";
import { framework } from "../framework/state.js";

const root = document.getElementById('app');

if (!root) {
    console.error("The root element with id='root' was not found in the DOM.");
}
let oldVNode = null;

store.subscribe((state) => {
  const newnode = createTodoApp(state,state.route);
  render(newnode, root, oldVNode);
  oldVNode = newnode;
});

framework.router.addRoute('', () => store.update({ route: '' }));
framework.router.addRoute('active', () => store.update({ route: 'active' }));
framework.router.addRoute('completed', () => store.update({ route: 'completed' }));
framework.router.start();