import observe from "./observe";
import Dep from "./Dep";

/**
 * 通过Object.defineReactive为obj.key设置getter, setter
 * @param {*} obj
 * @param {*} key
 * @param {*} value
 */
export default function defineReactive(obj, key, value) {
  /**递归observe处理value仍然为对象的情况 */
  const childOb = observe(value);

  const dep = new Dep();

  Object.defineProperty(obj, key, {
    /**
     * 当发现obj.key有读取行为时，会被get拦截
     */
    get() {
      console.log(`拦截了getter--key=${key}`);
      /**读取数据时 Dep.target不为null，则进行依赖收集 */
      if (Dep.target) {
        dep.depend();
        /**存在子ob，一起完成依赖收集 */
        if (childOb) childOb.dep.depend();
      }

      return value;
    },
    /**
     * 当发现obj.key = xx 有赋值行为，会被set拦截
     */
    set(newVal) {
      console.log(`拦截了setter--${key}=${newVal}`);
      /**新值没有变化直接返回 */
      if (newVal === value) return;
      /**新值替换老值 */
      value = newVal;
      /**为新值进行响应式处理 */
      observe(value);

      /**数据更新，让dep通知自己收集的所有watcher执行update方法 */
      dep.notify()
    },
  });
}
