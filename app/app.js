import { freamwork } from "../framework/index.js"
import { createTodoApp } from "./todos.js"
import {initRouter} from "../framework/route.js"


freamwork.state = {
    todos: [],
    editingId: null,
    newTodoText: '',
}
console.log(12112);


freamwork.addRoute('', createTodoApp(""))
freamwork.addRoute('active', createTodoApp("active"))
freamwork.addRoute('completed', createTodoApp("completed"))
// freamwork.addRoute('notfound', () => {
//     return freamwork.createElement("div", {}, ["404"])
// })
initRouter()





