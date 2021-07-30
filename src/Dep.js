/**data 函数中return的对象是一个dep，函数中的key分别对应一个dep */
export default class Dep {
  /**
   * Dep的静态属性，值为null或者Watcher实例
   * 在实例化Watcher时进行赋值，待依赖收集完成后在Watcher中又重新赋值为null
   */
  static target = null;

  constructor() {
    /**存储当前dep实例收集的所有watcher */
    this.watchers = [];
  }
  /**
   * 收集watcher，在发生读取操作时(vm.xx)并且target不为null进行依赖收集
   * @returns
   */
  depend() {
    /**防止Watcher实例重复收集 */
    if (this.watchers.includes(Dep.target)) return;
    /**收集Watcher实例 */
    this.watchers.push(Dep.target);
  }
  /**
   * dep通知自己收集的Watcher实例执行更新
   */
  notify() {
    for (const watcher of this.watchers) watcher.update();
  }
}
