const arrayProto = Array.prototype;

const methodProto = Object.create(arrayProto);

const methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "revers",
];

methodsToPatch.forEach((method) => {
  Object.defineProperty(methodProto, method, {
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
    writable: true,
    configurable: true,
    enumerableL: true,
  });
});

export default function protoArgument(arr) {
  arr.__proto__ = methodProto;
}
