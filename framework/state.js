class Store {
  constructor(initialState) {
    this.state = { ...initialState };
    this.subscribers = [];
  }

  getState() {
    return this.state;
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

class Router {
  constructor() {
    this.routes = new Map();
  }

  addRoute(path, renderFn) {
    this.routes.set(path, renderFn);
  }

  navigate() {
    const path = window.location.hash.slice(1) || '';              
    const renderFn = this.routes.get(path); 
    if (renderFn) {
      renderFn();
    } else {
      // ila route ma kaynach, nrender Not Found
      if (this.notFoundFn) {
        this.notFoundFn();
      } else {
        console.warn(`Route "${path}" not found`);
      }
    }
  }
  start() {
    this.navigate();
    window.addEventListener('hashchange', this.navigate.bind(this));
  }

  link(e, route) {
    e.preventDefault();
    console.log(route);
    
    window.location.hash = route;
  }

  setNotFound(fn) {
    this.notFoundFn = fn;
  }
}


export const framework = {
  
  createStore(initialState) {
    return new Store(initialState);
  },

  router: new Router()
};