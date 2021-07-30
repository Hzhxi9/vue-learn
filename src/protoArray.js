/**获取原生数组的原型对象 */
const arrayProto = Array.prototype;

/**以原生数组的原型对象为基础创建新对象 */
const arrayMethods = Object.create(arrayProto);

/**
 * 定义七个需要被patch的数组方法，通过拦截这七个方法，来实现数组响应式
 * 这七个方法是能更改数组本身的，像concat这些方法返回一个新的数组
 **/
const methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "concat",
  "sort",
  "splice",
];

/**遍历这七个方法 */
methodsToPatch.forEach(method => {
  /**拦截这七个方法，先完成本职工作，再额外实现响应式功能 */
  Object.defineProperty(arrayMethods, method, {
    configurable: true,
    writable: true,
    enumerable: true,
    value: function (...args) {
      /**先完成本职工作 */
      const ret = arrayProto[method].apply(this, args);

      /**响应式处理 */
      let inserted = []; /**新增的参数列表 */

      /**新增方法处理 */
      switch (method) {
        case "push":
        case "unshift":
          inserted = args;
          break;
        case "splice":
          inserted = args.slice(2);
          break;
      }
      /**如果新增有新增元素， 对新增元素进行响应式处理 */
      if (inserted.length) this.__ob__.observerArray(inserted);

      /**依赖通知更新 */
      this.__ob__.dep.notify();

      return ret;
    },
  });
});

/**覆盖数组的原型对象 */
export default function protoArray(arr) {
  arr.__proto__ = arrayMethods;
}
