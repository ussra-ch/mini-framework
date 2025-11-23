import { render } from "../framework/render.js";
import { createTodoApp } from "./todos.js";
import { framework } from "../framework/state.js";
import { store } from "./todos.js";


class App {
    constructor() {
        this.root = document.getElementById('app');
        this.oldVNode = null;

        if (!this.root) {
            console.error("The root element with id='app' was not found in the DOM.");
            return;
        }

        this.setupRenderer();
        this.setupRouting();
    }

    renderer(filter) {
        const state = store.getState()
        if (filter!= state.route ){
            console.log(323232232323);
            
            store.update({ route: `${filter}`,render : true })
        }
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
        store.subscribe((state) => {             
            const newnode = createTodoApp(state, state.route);
            render(newnode, this.root, this.oldVNode,state.render);
            this.oldVNode = newnode

        });
    }

    setupRouting() {
        framework.router.addRoute('', () => this.renderer(''));
        framework.router.addRoute('active', () => this.renderer('active'));
        framework.router.addRoute('completed', () => this.renderer('completed'));
        framework.router.setNotFound(() => this.notFoundRenderer()); // makaynch dakchi liakt9Alab 3lih

        framework.router.start(); // run route
    }
}

new App();

