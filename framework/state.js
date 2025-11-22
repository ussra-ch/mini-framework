export const framework = {
  createStore(initialState) {
    let state = { ...initialState };
    let subscribers = [];
    return {
      getState: () => state,
      update: (newState) => {
        state = { ...state, ...newState };
        subscribers.forEach((cb) => cb(state));
      },
      subscribe: (cb) => {
        subscribers.push(cb);
        cb(state); 
      }
    };
  },

  router: {
    routes: new Map(),
    addRoute(path, renderFn) {
      this.routes.set(path, renderFn);
    },
    start() {
      const navigate = () => {
        const path = window.location.hash || '/';            
        const renderFn = this.routes.get(path.slice(1)) || this.routes.get('/');
        if (renderFn) {
          renderFn();
        }
      };   
      navigate()
      window.addEventListener('hashchange', navigate);
    },
     link(e,routess){
          e.preventDefault();
          window.history.pushState({}, '', `/#${routess}`);
           this.start();
}   
  }
};