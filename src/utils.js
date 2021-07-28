/**
 * 将key代理到target上,比如代理this._data.xx 为this.xx
 *
 * @param {*} target 目标对象，比如vm
 * @param {*} sourceKey 原始key, 比如_data
 * @param {*} key 代理的原始对象上的指定属性，比如_data.xx
 */
export function proxy(target, sourceKey, key) {
  Object.defineProperty(target, key, {
    /**target.key的读取操作实际返回的是target.sourceKey.key */
    get() {
      return target[sourceKey][key];
    },
    /**target.key的赋值操作实际是target.sourceKey.key = newValue */
    set(newVal) {
      target[sourceKey][key] = newVal;
    },
  });
}

/**
 * 对象设置属性
 * @param {*} target
 * @param {*} key
 * @param {*} value
 */
export function def(target, key, value) {
  Object.defineProperty(target, key, {
    value,
    /**
     *  禁止被枚举
     *  1. 可以在递归设置数据响应式的时候跳过__ob__
     *  2. 将响应式对象字符串化时不显示__ob__对象
     */
    enumerable: false,
    writable: true,
    configurable: true,
  });
}
