const arrayPrototype = Array.prototype;

const arrayMethods = Object.create(arrayPrototype);

const methodsToPatch = [
  "push",
  "pop",
  "unshift",
  "shift",
  "splice",
  "sort",
  "reverse",
];

methodsToPatch.forEach(method => {
  Object.defineProperty(arrayMethods, method, {
    value: function (...args) {
      const ret = arrayPrototype[method].apply(this, args);

      let inserted = [];

      switch (method) {
        case "push":
        case "unshift":
          inserted = args;
          break;
        case "splice":
          inserted = args.splice(2);
          break;
      }

      if (inserted.length) this.__ob__.observeArray(inserted);

      this.__ob__.dep.notify();

      return ret;
    },
    writable: true,
    configurable: true,
    enumerable: true,
  });
});

export default function protoArgument(value) {
  value.__proto__ = arrayMethods;
}
