import Dep from "./Dep";
import observe from "./observe";

/**
 * 通过Object.defineProperty 为object.key 设置getter / setter
 * @param {*} object
 * @param {*} key
 * @param {*} value
 */
export default function defineReactive(object, key, value) {
  /**递归调用observe, 处理value 仍然是对象的情况 */
  const childOb = observe(value);

  const dep = new Dep();

  Object.defineProperty(object, key, {
    /**拦截object.key的读取操作 */
    get() {
      if (Dep.target) {
        /**读取数据并且target不为null时，进行依赖收集 */
        dep.depend();
        /**存在子ob, 进行依赖收集 */
        if (childOb) childOb.dep.depend();
      }

      return value;
    },
    /**拦截object.key的写入操作 */
    set(newValue) {
      /**新值与旧值相等时， 没有改变直接返回 */
      if (value === newValue) return;

      value = newValue;

      /**对新值进行响应式处理 */
      observe(value);

      /**数据更新，让dep通知自己收集的所有watcher执行update方法 */
      dep.notify();
    },
  });
}
