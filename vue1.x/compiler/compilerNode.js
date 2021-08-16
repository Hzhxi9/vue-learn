import compilerAttribute from "./compileAttribute";
import compilerTextNode from "./compilerTextNode";

export default function compilerNode(nodes, vm) {
  for (let i = 0, len = nodes.length; i < len; i++) {
    const node = nodes[i];
    if (node.nodeType === 1) {
      compilerAttribute(node, vm);
      compilerNode(Array.from(node.childNodes), vm);
    } else if (node.nodeType === 3 && node.textContent.match(/{{(.*)}}/)) {
      compilerTextNode(node, vm);
    }
  }
}
