import Observer from "./Observer";
/**
 * 通过 Observer 类为对象设置响应式能力
 * @param {*} value
 * @returns
 */
export default function observe(value) {
  /**递归结束标志, 当value不是对象结束递归调用 */
  if (typeof value !== "object") return;

  /**
   * value.__ob__ 是Observer的实例
   * 如果value.__ob__属性已经存在，说明value对象已经存在响应式能力，直接返回已有的响应式对象
   */
  if (value.__ob__) return value.__ob__;

  /**
   * 返回Observer实例
   */
  return new Observer(value);
}
