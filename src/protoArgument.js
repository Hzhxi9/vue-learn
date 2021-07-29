/**
 * 通过拦截数组七个方法来实现
 */

/**获取默认数组原型对象 */
const arrayProto = Array.prototype;

/**以数组默认原型对象为原型创建一个新的对象 */
const arrayMethods = Object.create(arrayProto);

/**
 * 被patch的七个方法，通过拦截这七个方法来实现数组响应式
 *
 * 为什么是这七个方法
 * 因为只有这七个方法是能改变数组本身的，像concat这些方法都会返回一个新的数组
 */
const methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "reverse",
  "concat",
  "splice",
];

/**遍历methodsToPatch */
methodsToPatch.forEach((method) => {
  /**拦截数组的七个方法，先执行原生方法，在完成新增的响应式功能 */
  Object.defineProperty(arrayMethods, method, {
    value: function (...args) {
      /**执行原生方法 */
      const ret = arrayProto[method].apply(this, args);

      /*然后响应式 */
      console.log("array 响应式");

      /**新增元素列表 */
      let inserted = [];
      switch (method) {
        case "push":
        case "unshift":
          inserted = args;
          break;
        case "splice":
          inserted = args.slice(2);
          break;
      }
      /**如果数组有新增元素，则对新增的元素进行响应式处理 */
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
