import observe from "./observe";
import Dep from "./Dep";

/**
 * 通过 Object.defineReactive 为 object.key 设置 getter， setter
 * getter 依赖收集
 * setter 通知更新
 *
 * @param {*} object
 * @param {*} key
 * @param {*} value
 */
export default function defineReactive(object, key, value) {
  /**递归调用observe, 处理value仍然是对象的情况 */
  const childOb = observe(value);

  const dep = new Dep();

  Object.defineProperty(object, key, {
    /**当发现object.key读取时，会被get拦截 */
    get() {
      /**读取数据时，Dep.target不为null, 进行依赖收集 */
      if (Dep.target) {
        dep.depend();
        /**存在子ob， 进行依赖子ob的依赖收集 */
        if (childOb) childOb.dep.depend();
      }
      return value;
    },
    /**当发现object.key赋值时，会被set拦截 */
    set(newValue) {
      /**新值与老值相等，返回 */
      if (newValue === value) return;

      value = newValue;
      /**对新值进行响应式处理，这里针对value为数组或者对象 */
      observe(value);

      /**通知数据更新，让dep通知收集的所有watcher执行update方法 */
      dep.notify();
    },
  });
}
