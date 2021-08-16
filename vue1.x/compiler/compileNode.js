import compileAttribute from "./compileAttribute";
import compileTextNode from "./compileTextNode";
/**
 * 递归遍历整棵节点数
 * @param {*} nodes 节点
 * @param {*} vm Vue实例
 */
export default function compileNode(nodes, vm) {
  for (let i = 0, len = nodes.length; i < len; i++) {
    const node = nodes[i];
    if (node.nodeType === 1 /**元素节点 */) {
      /**编译元素上的所有属性节点 */
      compileAttribute(node, vm);
      /**递归编译子节点 */
      compileNode(Array.from(node.childNodes), vm);
    } else if (node.nodeType === 3 && node.textContent.match(/{{(.*)}}/)) {
      /**编译文本节点 */
      compileTextNode(node, vm);
    }
  }
}
