export default class Dep {
  /**
   * Dep.target 是一个静态属性，值为null或者watcher实例
   * 在实例化Watcher时进行赋值，待依赖收集完成后在Watcher中又重新赋值为null
   */
  static target = null;

  constructor() {
    /** 存储当前dep实例收集的所有依赖 */
    this.watchers = [];
  }

  /**
   * 收集watcher
   * 在发生读取操作时(vm.xx)并且Dep.target不为null时候进行依赖收集
   */
  depend() {
    /**防止Watcher实例重复被收集 */
    if (this.watchers.includes(Dep.target)) return;
    /**收集Watcher实例 */
    this.watchers.push(Dep.target);
  }

  /**
   * dep通知自己收集的所有watcher执行更新函数
   */
  notify() {
    for (const watcher of this.watchers) watcher.update();
  }
}
