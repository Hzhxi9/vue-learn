import { def } from "./utils";

import defineReactive from "./defineReactive";
import protoArgument from "./protoArgument";
import observe from "./observe";

/**为普通对象或者数组设置响应式的入口 */
export default class Observer {
  constructor(value) {
    this.value = value;

    /**
     * 为对象设置__ob__属性，值为this，标识当前对象已经是一个响应式对象
     */
    def(value, "__ob__", this);

    if (Array.isArray(value)) {
      /**数组响应式 */
      protoArgument(value);
      this.observeArray(value);
    } else {
      /**对象响应式 */
      this.walk(value);
    }
  }

  /**
   * 遍历对象所有属性，给每个属性设置响应式
   * @param {*} value
   */
  walk(value) {
    for (const key in value) defineReactive(value, key, value[key]);
  }

  /**
   * 遍历数组的每个元素，为每个元素设置响应式
   * 为了处理元素为对象的情况，已到达this.arr[index].xx是响应式
   * @param {*} arr
   */
  observeArray(arr) {
    for (const value of arr) observe(value);
  }
}
