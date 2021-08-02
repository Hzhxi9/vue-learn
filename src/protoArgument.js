/**通过拦截数组七个方法进行数据响应式 */

/**获取数组默认原型对象 */
const arrayProto = Array.prototype;

/**以数组默认原型对象创建新的对象 */
const arrayMethods = Object.create(arrayProto);

/**
 * 被patch的七个数组方法，通过拦截这个七个方法来实现数组响应式
 * 只有这七个方法能更改数组本身，返回一个新的数组
 */
const methodToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "sort",
  "splice",
  "concat",
];

/**遍历methodToPatch */
methodToPatch.forEach(method => {
  /**拦截数组的七个方法，先完成本职工作，再额外完成响应式工作 */
  Object.defineProperty(arrayMethods, method, {
    value: function (...args) {
      /**先完成本职工作 */
      const ret = arrayProto[method].apply(this, args);
      /**响应式处理 */

      let inserted = []; /**新增的元素列表 */

      switch (method) {
        case "push":
        case "unshift":
          inserted = args;
          break;
        case "splice":
          inserted = args.slice(2);
          break;
      }
      /**如果数组存在新增的元素， 则对新增的元素进行响应式处理 */
      if (inserted.length) this.__ob__.observeArray(inserted);

      /**依赖通知更新 */
      this.__ob__.dep.notify();

      return ret;
    },
    configurable: true,
    writable: true,
    enumerable: true,
  });
});

/**
 * 覆盖数组的原型对象
 * @param {*} arr
 */
export default function protoArgument(arr) {
  arr.__proto__ = arrayMethods;
}
