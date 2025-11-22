import { render } from "../framework/render.js";
import { createTodoApp } from "./todos.js";
import { framework } from "../framework/state.js";


class App {
    constructor() {
        this.root = document.getElementById('app');
        this.store = framework.createStore({
            todos: [],
        });

        this.oldVNode = null;

        if (!this.root) {
            console.error("The root element with id='app' was not found in the DOM.");
            return;
        }

        this.setupRenderer();
        this.setupRouting();
    }

    renderer(filter) {
        const state = this.store.getState();
        const newnode = createTodoApp(state, filter);
        render(newnode, this.root, this.oldVNode);
        this.oldVNode = newnode;
    }

    notFoundRenderer() {
        const vnode = {
            tag: 'div',
            attrs: { class: 'not-found' },
            children: ['404 - Page Not Found']
        };
        render(vnode, this.root, this.oldVNode);
        this.oldVNode = vnode;
    }

    setupRenderer() {
        this.store.subscribe(() => {
            framework.router.navigate();
        });
    }

    setupRouting() {
        framework.router.addRoute('', () => this.renderer(''));
        framework.router.addRoute('active', () => this.renderer('active'));
        framework.router.addRoute('completed', () => this.renderer('completed'));

        // set Not Found handler
        framework.router.setNotFound(() => this.notFoundRenderer());

        framework.router.start();
    }
}

new App();
