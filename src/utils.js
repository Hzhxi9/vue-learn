/**
 * 将key代理到target上
 * 比如 代理this._data.xx 为 this.xx
 * @param {*} target 目标对象，比如vm
 * @param {*} sourceKey 原始key， 比如_data
 * @param {*} key 代理的原始对象上的指定属性， 比如_data.xx
 */
export function proxy(target, sourceKey, key) {
  Object.defineProperty(target, key, {
    get() {
      return target[sourceKey][key];
    },
    set(val) {
      target[sourceKey][key] = val;
    },
  });
}

/**
 * 为对象设置属性，比如__ob__
 * @param {*} object 目标对象
 * @param {*} key 属性名
 * @param {*} value 属性值
 */
export function def(object, key, value) {
  Object.defineProperty(object, key, {
    value,
    configurable: true,
    /**
     * 禁止被枚举
     * 1. 可以在递归设置数据响应式的时候跳过__ob__对象
     * 2. 将响应式对象字符串化也不显示__ob__对象
     */
    enumerable: false,
    writable: true,
  });
}
