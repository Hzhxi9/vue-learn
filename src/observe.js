import Observer from "./Observer";

/**
 * 通过Observer类为对象设置响应式能力
 * @param {*} value
 * @returns Observer实例
 */
export default function observe(value) {
  /**
   * 递归结束条件，当value不是对象结束递归
   */
  if (typeof value !== "object") return;

  /**
   * value.__ob__ 是Observer 实例
   * 如果存在value.__ob__, 说明value对象已经具有响应式能力，直接返回已有的响应式对象
   */
  if (value.__ob__) return value.__ob__;

  /**
   * 返回Observer实例
   */
  return new Observer(value);
}
