const arrayProto = Array.prototype;

const arrayMethods = Object.create(arrayProto);

const arrayToPatch = [
  "push",
  "pop",
  "unshift",
  "shift",
  "splice",
  "concat",
  "sort",
];

arrayToPatch.forEach((method) => {
  Object.defineProperty(arrayMethods, method, {
    value: function (...args) {
      const ret = arrayProto[method].apply(this, args);

      return ret;
    },
    configurable: true,
    writable: true,
    enumerable: true,
  });
});

/**
 * 覆盖数组arr的原型对象
 * @param {*} value
 */
export default function protoArgument(value) {
  value.__proto__ = arrayMethods;
}
