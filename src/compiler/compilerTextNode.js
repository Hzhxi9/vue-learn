import Watcher from "../Watcher";
/**文本节点响应式更新 */
export default function compilerTextNode(node, vm) {
  /**<span>{{value}}</span> */
  const key = RegExp.$1.trim();

  /**当响应式数据key更新时，dep通知 watcher执行update 函数，cb会被调用 */
  function cb() {
    node.textContent = JSON.stringify(vm[key]);
  }

  /**实例化Watcher, 执行cb, 触发getter， 进行依赖收集 */
  new Watcher(cb);
}
