import Watcher from "../Watcher";
/**
 * 文本节点响应式更新
 * @param {*} node 节点
 * @param {*} vm Vue实例
 */
export default function compileTextNode(node, vm) {
  /**<span>{{value}}</span> */
  const key = RegExp.$1.trim();

  /**当响应式数据key更新时，dep通知watcher执行cb函数， cb会被调用 */
  function cb() {
    node.textContent = JSON.stringify(vm[key]);
  }

  /**实例化Watcher执行cb,触发getter，进行依赖收集 */
  new Watcher(cb);
}
