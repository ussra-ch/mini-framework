
import { freamwork} from "./index.js";
import { render } from "./render.js";


// Handle navigation
export function router() {
    const component = freamwork.routes[window.location.hash.slice(2) || ''];
    
    if (component) {        
        freamwork.newDOM = component
         const newDom = freamwork.newDOM();
         render( newDom, freamwork.parent, freamwork.OldDOM);
        freamwork.OldDOM = newDom
    }
};


export function addRoute(path, component) {
    freamwork.routes[path] = component;
};


export const push = (path) => {
    window.location.hash = `#/${path}`;
    router()
}
