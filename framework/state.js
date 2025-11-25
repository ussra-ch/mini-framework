import { render } from "./render.js";
import { freamwork } from "./index.js";

export function setState(newState) {    
    freamwork.state ={ ...freamwork.state, ...newState };  
    const newVDom = freamwork.newDOM(); 
    render(newVDom, freamwork.parent,freamwork.OldDOM);
     freamwork.OldDOM = newVDom;
};