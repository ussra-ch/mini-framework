import { render } from "../framework/render.js";
const todoPage = {
    tag: "div",
    attrs: { class: "container" },
    children: [

        {
            tag: "div",
            attrs: { class: "todo-app" },
            children: [
                {
                    tag: "section",
                    attrs: {
                        class: "todoapp",
                        id: "root"
                    },
                    children: [
                        {
                            tag: "header",
                            attrs: {
                                class: "header",
                                "data-testid": "header"
                            },
                            children: [
                                {
                                    tag: "h1",
                                    children: ["todos"]
                                },
                                {
                                    tag: "div",
                                    attrs: { class: "input-container" },
                                    children: [
                                        {
                                            tag: "input",
                                            attrs: {
                                                class: "new-todo",
                                                id: "todo-input",
                                                type: "text",
                                                "data-testid": "text-input",
                                                placeholder: "What needs to be done?",
                                                value: "",
                                                autofocus: true,
                                                onkeydown: (e) => {
                                                    addTodo(e)

                                                }
                                            }
                                        },
                                        {
                                            tag: "label",
                                            attrs: {
                                                class: "visually-hidden",
                                                for: "todo-input"
                                            },
                                            children: ["New Todo Input"]
                                        }
                                    ]
                                }
                            ]
                        },

                        {
                            tag: "main",
                            attrs: {
                                class: "main",
                                "data-testid": "main"
                            },
                            children: [
                                {
                                    tag: "ul",
                                    attrs: {
                                        class: "todo-list",
                                        "data-testid": "todo-list",
                                        id: "todo-list"
                                    },
                                    children: []
                                }
                            ]
                        },


                    ]
                }


            ]
        },
        {
            tag: "footer",
            attrs: { class: "info" },
            children: [
                {
                    tag: "p",
                    children: ["Double-click to edit a todo"]
                },
                {
                    tag: "p",
                    children: ["Created by theis Team"]
                },
                {
                    tag: "p",
                    children: [

                        "Part of "
                        ,
                        {
                            tag: "a",
                            attrs: { href: "https://learn.zone01oujda.ma/intra/oujda/profile?event=41" },
                            children: ["zone01"]
                        }
                    ]
                }
            ]
        }

    ]
};
render(todoPage, document.getElementById("app"));