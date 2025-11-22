// had l function kachd lia l VDOM mn 3and l user wkatkhdm hia b DOm bach trj3o real DOM
function createRealElement(element) {
  if (element.tag == 'text') {

  }
  const newElement = document.createElement(element.tag) // there is a special tag = text rdi balk mno mn ba3d :)
  const HTMLevents = [] //binma 3raft ach khas ydar bihoum wsafi

  if (element.attrs && Object.keys(element.attrs).length > 0) {
    newElement.__listeners__ = [];
    for (attribute in element.attrs) {
      if (element.attrs.hasOwnProperty(attribute)) {
        if (attribute.startsWith("on")) {
          HTMLevents.push(element.attrs[attribute])
        } else if (attribute.startsWith("$")) {
          const event = attribute.slice(1)
          const func = element.attrs[attribute]
          if (typeof func === 'function') {
            newElement.addEventListener(event, func)
            newElement.__listeners__.push({
              type: event,
              handler: func
            });
          } else {
            console.error(`Handler for event ${key} is not a function.`);
          }
        } else {
          newElement.setAttribute(attribute, element.attrs[attribute])
        }
      }
    }
  }
  if (element.children == undefined || element.children.length == 0) {
    return newElement
  }

  element.children.forEach(node => {
    const realChild = createRealElement(node)
    // if (realChild != undefined){
    newElement.appendChild(realChild)
    // newElement.push(realChild)
    // }
  });
  return newElement
}