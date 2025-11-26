import { render } from "./render.js";
import { freamwork } from "./index.js";

let stateQueue = [];
let isRendering = false;

function flushStateQueue() {
    if (isRendering) return; 

    if (stateQueue.length > 0) {
        isRendering = true;
        
        for (const update of stateQueue) {
            freamwork.state = { 
                ...freamwork.state, 
                ...update 
            };
        }
        
        stateQueue = [];

        const newVDom = freamwork.newDOM(); 
        
        render(newVDom, freamwork.parent, freamwork.OldDOM);
        
        freamwork.OldDOM = newVDom;
        
        isRendering = false;
    }
}

export function setState(newStateOrFn) {
    let newState;
    if (typeof newStateOrFn === 'function') {
        newState = newStateOrFn(freamwork.state);
    } else {
        newState = newStateOrFn;
    }
    if (!newState || typeof newState !== 'object') {
        console.error("setState: The new state must be an object or a function returning an object.");
        return; 
    }

    stateQueue.push(newState);

    setTimeout(flushStateQueue, 0); 
}

