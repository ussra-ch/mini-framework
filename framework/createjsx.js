 export function createElement({ tag, attrs = {}, children = [], events = {} }) {
    return { tag, attrs, children, events };
  }