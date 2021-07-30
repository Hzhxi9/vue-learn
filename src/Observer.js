import defineReactive from "./defineReactive";
import protoArray from "./protoArray";
import observe from "./observe";
import Dep from "./Dep";

import { def } from "./utils";

export default class Observer {
  constructor(value) {
    /**
     * 为对象本事设置一个dep,方便在更新对象本身时使用
     * 比如数组通知依赖更新时使用
     */
    this.dep = new Dep();

    /**
     * 为对象设置一个__ob__属性，值为this，标识当前对象已经具有响应式能力
     **/
    def(value, "__ob__", this);

    /**
     * 判断当前value是数组还是对象
     */
    if (Array.isArray(value)) {
      /**当前value是数组 */

      /**重写数组原型方法 */
      protoArray(value);

      /**设置数组响应式 */
      this.observerArray(value);
    } else {
      /**当前value是对象 */
      this.walk(value);
    }
  }

  /**遍历对象所有属性，为这些属性设置getter/setter */
  walk(object) {
    for (const key in object) defineReactive(object, key, object[key]);
  }

  /**
   * 遍历数组的每个元素，为每个元素设置响应式
   * 这里是为了处理元素为对象的情况，已达到this.arr[index].xx是响应式的目的
   * @param {*} array
   */
  observerArray(array) {
    for (const value of array) observe(value);
  }
}
