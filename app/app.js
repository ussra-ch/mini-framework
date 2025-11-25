import { freamwork } from "../framework/index.js"
import { createTodoApp } from "./todos.js"


freamwork.state = {
    todos: [],
    editingId: null,
    newTodoText: '',
}
console.log(12112);


freamwork.addRoute('', createTodoApp("all"))
freamwork.addRoute('active', createTodoApp("active"))
freamwork.addRoute('completed', createTodoApp("completed"))
freamwork.addRoute('notfound', () => {
    return freamwork.createElement("div", {}, ["error 404"])
})



const component = freamwork.routes[window.location.hash] ;
if (component) {
    console.log(component);
    
    freamwork.mount(component);
}


