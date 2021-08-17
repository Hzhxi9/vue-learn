/**
 * 将 key 代理到 target 上
 * 比如代理this.$data.xx 为this.xx
 * @param {*} target 目标对象， 比如vm
 * @param {*} sourceKey 原始key, 比如this.$data
 * @param {*} key 代理的原始对象上的指定属性，比如$data.xx
 */
export function proxy(target, sourceKey, key) {
  Object.defineProperty(target, key, {
    /**target 的读取操作实际上返回的是 target.sourceKey.key */
    get() {
      return target[sourceKey][key];
    },
    /**target 的写入操作实际设置的target[sourceKey][key] = newValue */
    set(newValue) {
      target[sourceKey][key] = newValue;
    },
  });
}

/**
 * 对象设置属性
 * @param {*} object
 * @param {*} key
 * @param {*} value
 */
export function def(object, key, value) {
  Object.defineProperty(object, key, {
    value,
    /**
     * 禁止枚举
     * 1. 可以在递归设置数据响应式的时候跳过__ob__
     * 2. 将响应式对象字符串时也不显示__ob__
     */
    enumerable: false,
    writable: true,
    configurable: true,
  });
}

/**
 * 是否为自闭合标签，内置一些自闭合标签，这里简单处理
 * @param {*} tagName
 * @returns {boolean}
 */
export function isUnaryTag(tagName) {
  const unaryTags = ["input"];
  return unaryTags.includes(tagName);
}
