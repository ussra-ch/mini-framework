import { render } from "./render.js";
import { addRoute, push, router } from "./route.js";
import { setState } from "./state.js";
import { mount } from "./createjsx.js";

export const freamwork = {
    state: {},
    setState,

    OldDOM: null,
    newDOM: null,
    parent: document.getElementById('app'),

    render,
    mount,

    routes: {},
    addRoute,
    router,
    push,
};


// Initialize router
window.addEventListener("hashchange", () => freamwork.router());
