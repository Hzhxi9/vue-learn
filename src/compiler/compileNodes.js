import compileTextNode from "./compileTextNode";
import compileAttribute from './compileAttribute'

export default function compileNodes(nodes, vm) {
  for (let i = 0, len = nodes.length; i < len; i++) {
    const node = nodes[i];

    

    if (node.nodeType === 1) {
      compileAttribute(node, vm);
      compileNodes([...node.childNodes], vm);
    } else if (node.nodeType === 3 && node.textContent.match(/{{(.*)}}/)) {
      compileTextNode(node, vm);
    }
  }
}
