import Watcher from "../Watcher";

/**
 * 文本节点响应式更新
 * 编译文本节点
 * @param {*} node 节点
 * @param {*} vm  实例
 */
export default function compileTextNode(node, vm) {
  /**
   * eg: <span>{{key}}</span>
   **/
  const key = RegExp.$1.trim();

  /**
   * 当响应式数据key更新时，dep通知watcher执行update函数，cb会被调用
   */
  function cb() {
    node.textContent = JSON.stringify(vm[key]);
  }

  /**实例化Watcher，执行cb，触发getter进行依赖收集 */
  new Watcher(cb);
}
