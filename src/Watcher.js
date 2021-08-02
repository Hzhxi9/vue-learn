import Dep from "./Dep";

export default class Watcher {
  /**
   *  @param {*} cb 回调函数，负责更新DOM的回调函数
   */
  constructor(cb) {
    /**备份cb函数 */
    this._cb = cb;
    /**赋值Dep.target */
    Dep.target = this;
    /**执行cb函数， cb函数中会发生vm.xx的属性读取，进行依赖收集 */
    cb();
    /**依赖收集完毕之后， Dep.target重新置为null， 防止重复收集 */
    Dep.target = null;
  }
  /**响应式更新时，dep通知watcher执行update方法  */
  update() {
    /**update方法执行时this._cb函数更新DOM */
    this._cb();
  }
}
