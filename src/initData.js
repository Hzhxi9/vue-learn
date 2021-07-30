import observe from "./observe";
import { proxy } from "./utils";

export default function initData(vm) {
  /**解构获取data选项 */
  const { data } = vm.$options;

  /**
   * 1. 判断data， 没有传递data，设置默认值
   * 2. 判断data类型，函数就调用data，返回一个对象
   **/
  if (!data) vm._data = {};
  else vm._data = typeof data === "function" ? data() : data;

  /**
   * 设置代理，将data对象上的各个属性代理到vue实例上，支持通过this.xx的方式调用
   */
  for (const key in vm._data) proxy(vm, "_data", key);

  /**
   * 设置响应式data
   */
  observe(vm._data);
}
