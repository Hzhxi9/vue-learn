import Dep from "./Dep";

export default class Watcher {
  /**
   * 回调函数，负责更新DOM的回调函数
   * @param {*} cb
   */
  constructor(cb) {
    /**备份cb函数 */
    this.__cb__ = cb;

    /**赋值Dep.target */
    Dep.target = this;

    /**
     * 执行cb函数
     * cb函数中会发生vm.xx的属性读取，进行依赖收集
     **/
    cb();

    /**依赖收集完毕，Dep.target重新赋值为null,防止重复收集 */
    Dep.target = null;
  }

  /**
   * 响应式数据更新时，dep通知watcher执行update方法
   * 让update方法执行this.__cb__函数更新DOM
   */
  update() {
    this.__cb__();
  }
}
