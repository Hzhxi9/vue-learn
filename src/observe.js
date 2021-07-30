import Observer from "./Observer";

/**
 * 通过 Observer 类为对象设置响应式能力
 * @param {*} value
 * @returns Observer 实例
 */
export default function observe(value) {
  /**
   * 递归停止条件，当value不是对象时结束递归
   */
  if (typeof value !== "object") return;

  /**
   *  value.__ob__ 是 Observer实例
   *  如果value.__ob__ 属性已经存在，说明value对象已经具有响应式能力，直接返回已有的响应式对象
   */
  if (value.__ob__) return value.__ob__;

  /*
   * 没有就实例Observer实例
   **/
  return new Observer(value);
}
