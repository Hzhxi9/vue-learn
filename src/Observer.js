import Dep from "./Dep";
import observe from "./observe";
import protoArgument from "./protoArgument";
import defineReactive from "./defineReactive";

import { def } from "./utils";

/**为普通对象或者数组设置响应式的入口 */
export default class Observer {
  constructor(value) {
    /**为对象本身设置一个dep, 方便在更新对象本身时使用， 比如数组通知依赖更新的时候就会用到 */
    this.dep = new Dep();

    /**为对象设置__ob__属性，值为this, 标识当前对象已经是一个响应式对象 */
    def(value, "__ob__", this);

    if (Array.isArray(value)) {
      /**当前value是数组 */
      protoArgument(value);
      /**处理数组响应式 */
      this.observeArray(value);
    } else {
      /**当前value是对象，处理对象响应式 */
      this.walk(value);
    }
  }

  walk(value) {
    for (const key in value) defineReactive(value, key, value[key]);
  }

  observeArray(arr) {
    for (const value of arr) observe(value);
  }
}
