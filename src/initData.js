import { proxy } from "utils";

import observe from "observe";

/**
 * 初始化options.data
 * 代理data对象上的各个属性到Vue实例
 * 给data对象的各个属性设置为响应式能力
 * @param {*} vm
 */

export default function initData(vm) {
  /**获取data对象 */
  const { data } = vm.$options;

  /**设置vm.data对象， 保证它的值肯定是一个对象 */
  if (!data) vm._data = {};
  else vm._data = typeof data === "function" ? data() : data;

  /**代理，将data对象上的各个属性代理到Vue实例上，支持通过this.xx的方式访问 */
  for (const key in vm._data) {
    proxy(vm, "data", key);
  }

  /**设置响应式 */
  observe(vm._data);
}
