import { runEventCleanups } from "./eventRegistry.js";

class Store {
  constructor(initialState) {
    this.state = { ...initialState };
    this.subscribers = [];
  }

  getState() {
    return this.state;
  }
  juststate(newState) {
    this.state = { ...this.state, ...newState };

  }

  update(newState) {
    this.state = { ...this.state, ...newState };
    this.subscribers.forEach((cb) => cb(this.state));
  }

  subscribe(cb) {
    this.subscribers.push(cb);
    cb(this.state);
  }
}


export class Router {
  constructor() {
    this.routes = new Map();
    this.notFoundFn = null;
  }

  addRoute(path, renderFn) {
    this.routes.set(path, renderFn);
  }

  setNotFound(fn) {
    this.notFoundFn = fn;
  }

  getPath() {
    const hash = window.location.hash;    
    if (hash.startsWith("#/")) {
      return hash.slice(2);  
    }

    return "";
  }

  navigate() {
    runEventCleanups();

    const path = this.getPath();     
    const renderFn = this.routes.get(path);

    if (renderFn) {
      renderFn();
    } else if (this.notFoundFn) {
      this.notFoundFn();
    } else {
      console.warn(`route not found here: ${path}`);
    }
  }

  start() {
    this.navigate();
    window.addEventListener("hashchange", this.navigate.bind(this));
  }

  link(e, route) {
    e.preventDefault();
    window.location.hash = `/${route}`;
  }
}

export const framework = {

  createStore(initialState) {
    return new Store(initialState);
  },

  router: new Router()
};