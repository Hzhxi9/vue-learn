import compilerTextNode from "./compilerTextNode";
import compilerAttribute from "./compilerAttribute";

/**
 * 递归遍历整棵节点树
 * @param {*} nodes 节点
 * @param {*} vm Vue 实例
 */
export default function compilerNode(nodes, vm) {
  /**遍历当前节点数的所有子节点 */
  for (let i = 0, len = nodes.length; i < len; i++) {
    const node = nodes[i];
    if (node.nodeType === 1 /**元素节点 */) {
      /**编译元素上的属性节点 */
      compilerAttribute(node, vm);

      /**递归遍历自己节点 */
      compilerNode(Array.from(node.childNodes), vm);
    } else if (node.nodeType === 3 && node.textContent.match(/{{(.*)}}/)) {
      /**编译文本节点 */
      compilerTextNode(node, vm);
    }
  }
}
