export function proxy(target, sourceKey, key) {
  Object.defineProperty(target, key, {
    get() {
      return target[sourceKey][key];
    },
    set(value) {
      target[sourceKey][key] = value;
    },
  });
}

export function def(object, key, value) {
  Object.defineProperty(object, key, {
    value,
    writable: true,
    configurable: true,
    enumerable: false,
  });
}
