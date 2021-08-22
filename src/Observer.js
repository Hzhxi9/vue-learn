import { def } from "./utils";

import observe from "./observe";
import protoArgument from "./protoArgument";
import defineReactive from "./defineReactive";

export default class Observer {
  /**
   *
   * @param {*} value
   */
  constructor(value) {
    def(value, "__ob__", this);

    if (Array.isArray(value)) {
      /**value为数组 */
      protoArgument(value);
      this.observerArray(value);
    } else {
      /**value为普通对象 */
      this.walk(value);
    }
  }

  /**
   * 遍历对象的每个属性，为这些属性设置getter/setter拦截
   * @param {*} object
   */
  walk(object) {
    for (const key in object) defineReactive(object, key, object[key]);
  }

  /**
   * 遍历数组的每个元素，为这些元素设置响应式
   * 这里处理了元素为对象的情况，以达到this.array[idx].xx是响应式的目的
   * @param {*} array
   */
  observerArray(array) {
    for (const item of array) observe(item);
  }
}
