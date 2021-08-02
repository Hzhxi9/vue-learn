import { proxy } from "./utils";

import observe from "./observe";
/**
 * 1、初始化 options.data
 * 2、代理 data 对象上的各个属性到 Vue 实例
 * 3、给 data 对象上的各个属性设置响应式能力
 * @param {*} vm
 */
export default function initData(vm) {
  /**解构获取配置对象上的data属性 */
  const { data } = vm.$options;

  /**
   * 判断data是否存在， 设置vm.$data选项， 确保data是一个对象
   * 判断data的类型，若是一个函数直接调用返回
   **/
  if (!data) vm._data = {};
  else vm._data = typeof data === "function" ? data() : data;

  /** 代理，将 data 对象上的的各个属性代理到 Vue 实例上，支持 通过 this.xx 的方式访问  */
  for (const key in vm._data) proxy(vm, "_data", key);

  /**设置响应式 */
  observe(vm._data);
}
