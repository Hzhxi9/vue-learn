import Dep from "./Dep";

export default class Watcher {
  constructor(cb) {
    /**备份cb */
    this._cb = cb;
    /**设置Dep.target为当前watcher实例 */
    Dep.target = this;
    /**执行cb */
    cb();
    /**初始化Dep.target */
    Dep.target = null;
  }
  /**响应式数据更新时，dep通知watcher执行watcher.update方法，update执行cb函数更新DOM */
  update() {
    this._cb();
  }
}
