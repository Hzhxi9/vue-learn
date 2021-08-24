export function proxy(target, sourceKey, key) {
  Object.defineProperty(target, key, {
    get() {
      return target[sourceKey][key];
    },
    set(newValue) {
      target[sourceKey][key] = newValue;
    },
  });
}

export function def(object, key, value) {
  Object.defineProperty(object, key, {
    value,
    enumerable: false,
    writable: true,
    configurable: true,
  });
}
