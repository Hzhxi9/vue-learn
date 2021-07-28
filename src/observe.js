import Observer from "./Observer";


/**
 * 通过Observer类为对象设置响应式能力
 * @param {*} value
 */
export default function observe(value) {
  
  /**
   * 避免无限递归
   * 当value不是对象直接结束递归
   */
  if (typeof value !== "object") return;

  /**
   * value.__ob__ 是Observer实例
   * 如果value.__ob__ 属性已经存在，说明value对象已经具备响应式能力直接返回已有的响应式对象
   */
  if (value.__ob__) return value.__ob__;

  /**
   * 返回响应式对象
   */
  return new Observer(value);
}
