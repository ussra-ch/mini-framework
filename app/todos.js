import { createElement } from "../framework/createjsx.js";
import { freamwork } from "../framework/index.js";



export function createTodoApp(filter) {
  return () => {
    const { todos, editingId, newTodoText } = freamwork.state;
    console.log(todos);
    

    const filteredTodos = todos.filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });

    const handleEditInput = (e, todo) => {
      if (e.key === 'Enter' && e.target.value.trim().length > 1) {
        freamwork.setState({
          todos: todos.map(t => t.id === todo.id ? { ...t, text: e.target.value.trim() } : t),
          editingId: null
        });
      }
    };

    return createElement({
      tag: "div",
      attrs: { class: "container" },
      children: [
        {
          tag: 'section',
          attrs: { class: 'todoapp' },
          children: [
            {
              tag: 'header',
              attrs: { class: 'header', "data-test-id": "header" },
              children: [
                { tag: 'h1', children: ['todos'] },
                {
                  tag: 'input',
                  attrs: {
                    class: 'new-todo',
                    placeholder: 'What needs to be done?',
                    autofocus: true,
                    id: 'todo-input',
                    type: 'text',
                    value: newTodoText || '',
                    data_testid: "text-input"
                  },
                  events: {
                    input: (e) => {
                      freamwork.setState({ newTodoText: e.target.value });
                    },
                    keydown: (e) => {
                      if (e.key === 'Enter' && e.target.value.trim().length > 1) {
                        freamwork.setState({
                          todos: [
                            ...todos,
                            { id: crypto.randomUUID(), text: e.target.value.trim(), completed: false }
                          ],
                          newTodoText: '' // reset input
                        });
                      }
                    }
                  }
                }
              ]
            },
            {
              tag: 'section',
              attrs: { class: 'main', data_testid: "main" },
              children: [
                ...(filteredTodos.length > 0 ? [
                  {
                    tag: 'input',
                    attrs: {
                      id: 'toggle-all',
                      class: 'toggle-all',
                      type: 'checkbox',
                      data_testid: "toggle-all",
                      checked: todos.every(t => t.completed)
                    },
                    events: {
                      change: (e) => freamwork.setState({ todos: todos.map(t => ({ ...t, completed: e.target.checked })) })
                    }
                  },
                  { tag: 'label', class: 'toggle-all-label', attrs: { htmlFor: 'toggle-all' }, children: ['Mark all as complete'] }
                ] : []),
                {
                  tag: 'ul',
                  attrs: { class: 'todo-list', data_testid: "todo-list" },
                  children: filteredTodos.map(todo => {
                    const isEditing = todo.id === editingId;

                    let liChildren;
                    if (isEditing) {
                      liChildren = [{
                        tag: 'input',
                        attrs: { class: 'edit', value: todo.text, autofocus: true },
                        events: {
                          mount: el => el.focus(),
                          keydown: e => handleEditInput(e, todo),
                          blur: e => {
                            setTimeout(() => {
                              freamwork.setState({ editingId: null });
                            }, 0)
                          },

                        }
                      }];
                    } else {
                      liChildren = [{
                        tag: 'div',
                        attrs: { class: 'view' },
                        children: [
                          {
                            tag: 'input',
                            attrs: { class: 'toggle', type: 'checkbox', checked: todo.completed },
                            events: { change: () => freamwork.setState({ todos: todos.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t) }) }
                          },
                          {
                            tag: 'label',
                            children: [todo.text || ''],
                            events: { dblclick: () => freamwork.setState({ editingId: todo.id }) }
                          },
                          {
                            tag: 'button',
                            attrs: { class: 'destroy' },
                            events: { click: () => freamwork.setState({ todos: todos.filter(t => t.id !== todo.id) }) }
                          }
                        ]
                      }];
                    }

                    return createElement({ tag: 'li', attrs: { class: `${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`, 'data-id': todo.id, key: todo.id }, children: liChildren });
                  })
                }
              ]
            },
            ...(todos.length > 0 ? [{
              tag: 'footer',
              attrs: { class: 'footer' },
              children: [
                { tag: 'span', attrs: { class: 'todo-count' }, children: [`${todos.filter(t => !t.completed).length} item${todos.filter(t => !t.completed).length !== 1 ? 's' : ''} left`] },
                {
                  tag: 'ul',
                  attrs: { class: 'filters' },
                  children: [
                    { tag: 'li', children: [{ tag: 'a', attrs: { class: filter === '' ? 'selected' : '' }, events: { click: e => freamwork.push("") }, children: ['All'] }] },
                    { tag: 'li', children: [{ tag: 'a', attrs: { class: filter === 'active' ? 'selected' : '' }, events: { click: e => freamwork.push('active') }, children: ['Active'] }] },
                    { tag: 'li', children: [{ tag: 'a', attrs: { class: filter === 'completed' ? 'selected' : '' }, events: { click: e => freamwork.push('completed') }, children: ['Completed'] }] }
                  ]
                },
                { tag: 'button', attrs: { class: 'clear-completed' }, children: ['Clear completed'], events: { click: () => freamwork.setState({ todos: todos.filter(t => !t.completed) }) } }
              ]
            }] : [])
          ]
        },
        {
          tag: "footer",
          attrs: { class: "info" },
          children: [
            { tag: "p", children: ["Double-click to edit a todo"] },
            { tag: "p", children: ["Created by @azraji @ychatoua @abalouri Team"] },
            { tag: "p", children: ["Part of ", { tag: "a", props: { href: "https://learn.zone01oujda.ma/intra/oujda/profile?event=41" }, children: ["zone01"] }] }
          ]
        }
      ]
    });
  }
}
