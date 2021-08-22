import observe from "./observe";

/**
 * 通过Object.defineProperty 为object.value 设置 getter/ setter
 * @param {*} object
 * @param {*} key
 * @param {*} value
 */
export default function defineReactive(object, key, value) {
  /**递归调用observe， 处理value仍热是对象的情况 */
  let childOb = observe(value);

  Object.defineProperty(object, key, {
    get() {
      return value;
    },

    set(newValue) {
      if (value === newValue) return;
      value = newValue;
      /**
       * 对新值进行响应式处理
       * 这里针对的是新值为非原始值的情况，比如value是对象或者数组
       */
      observe(value);
    },
  });
}
