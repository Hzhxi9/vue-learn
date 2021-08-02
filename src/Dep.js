export default class Dep {
  /**
   * Dep.target 是一个静态属性， 值为null或者watcher实例
   * 在实例化 Watcher 时进行赋值， 待依赖收集完成后在Watcher又重置为null
   */
  static target;

  constructor() {
    this.watchers = [];
  }
  /**
   * 收集watcher
   * 在发生读取操作时并且Dep.target不为null, 进行依赖收集
   */
  depend() {
    /**防止watcher被重复收集 */
    if (this.watchers.includes(Dep.target)) return;
    /**收集watcher */
    this.watchers.push(Dep.target);
  }
  /**dep通知自己收集的所有watcher执行更新函数 */
  notify() {
    for (const watcher of this.watchers) watcher.update();
  }
}
