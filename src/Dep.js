export default class Dep {
  constructor() {
    /**存储当前dep实例 收集的所有watcher */
    this.watcher = [];
  }

  /**
   * 收集watcher
   * 在发生读取操作时，vm.xx 并且 Dep.target 不为null时进行收集依赖
   */
  depend() {
    /**防止Watcher实例被重复收集 */
    if (this.watcher.includes(Dep.target)) return;
    /**收集Watcher实例 */
    this.watcher.push(Dep.target);  
  }

  /**
   * dep 通知自己收集的所有watcher执行更新函数
   */
  notify() {
    for (const watcher of this.watchers) watcher.update();
  }
}

/**
 * Dep.target 是一个静态属性，值为null或者watcher实例
 * 在实例化Watcher时进行赋值，待依赖收集完成后在Watcher中又重新赋值为null
 */
Dep.target = null;
