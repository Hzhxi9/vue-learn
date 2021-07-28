import observe from "./observe";

/**
 * 通过Object.defineReactive为obj.key设置getter, setter
 * @param {*} obj
 * @param {*} key
 * @param {*} value
 */
export default function defineReactive(obj, key, value) {
  /**递归observe处理value仍然为对象的情况 */
  observe(value);

  Object.defineProperty(obj, key, {
    /**
     * 当发现obj.key有读取行为时，会被get拦截
     */
    get() {
      console.log(`拦截了getter--key=${key}`);
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
    },
  });
}
