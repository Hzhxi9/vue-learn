/**
 * 将key代理到target上,比如代理this._data.xx为this.xx
 * @param {*} target 目标对象，比如vm
 * @param {*} sourceKey 原始key, 比如_data
 * @param {*} key 代理的原始对象上指定的属性， 比如_data.xx
 */
export function proxy(target, sourceKey, key) {
  Object.defineProperty(target, key, {
    /**target.key 的读取操作实际上返回的是target.sourceKey.key */
    get() {
      return target[sourceKey][key];
    },
    /**target.key 的写入操作实际上是target.sourceKey.key = newValue */
    set(newValue) {
      target[sourceKey][key] = newValue;
    },
  });
}

export function def(object, key, value) {
  Object.defineProperty(object, key, {
    value,
    writable: true,
    configurable: true,
    /**
     * 设置为false, 禁止被枚举
     * 1. 可以在递归设置数据响应式的时候跳过__ob__对象
     * 2. 将响应式对象字符串化时不显示__ob__对象
     **/
    enumerable: false,
  });
}
