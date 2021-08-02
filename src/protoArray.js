const arrayProto = Array.prototype;

const arrayMethods = Object.create(arrayProto);

const methodsToPatch = [
  "push",
  "pop",
  "unshift",
  "shift",
  "sort",
  "splice",
  "concat",
];

methodsToPatch.forEach((method) => {
  Object.defineProperty(arrayMethods, method, {
    value: function (...args) {
      const ret = arrayProto[method].apply(this, args);

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

      if (inserted.length) this.__ob__.observeArray(inserted);

      this.__ob__.dep.notify();
      return ret;
    },
    configurable: true,
    writable: true,
    enumerable: true,
  });
});

export default function protoArray(arr) {
  arr.__proto__ = arrayMethods;
}
