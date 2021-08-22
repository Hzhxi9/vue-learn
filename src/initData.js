import { proxy } from "./utils";

import observe from "./observe";

/**
 * 1. 初始化options.data
 * 2. 代理data对象各个属性到Vue实例上
 * 3. 给data对象上的各个属性设置响应式
 *
 * @param {*} vm
 */
export default function initData(vm) {
  /**获取data选项 */
  const { data } = vm.$options;

  /**设置vm._data选项， 保证他一定是个对象 */
  if (!data) vm._data = {};
  else vm._data = typeof data === "function" ? data() : data;

  /**设置代理，将data对象上的各个属性代理到Vue实例上，支持通过this.xx的方式访问 */
  for (const key in vm._data) proxy(vm, "_data", key);

  /**设置响应式 */
  observe(vm._data);
}
