import mount from "./compiler";
import initData from "./initData";

/**
 * Vue 构造函数
 * @param {*} options new Vue 时传递的配置对象
 */
export default function Vue(options) {
  this._init(options);
}

/**
 * 初始化配置对象
 */
Vue.prototype._init = function (options) {
  /**
   * 将options挂载到Vue是实例上
   */
  this.$options = options;
  /**
   * 初始化options.data
   * 代理data对象上的各个属性到Vue实例上
   * 给data对象上的各个属性设置响应式
   */
  initData(this);

  /**如果存在el配置项，则调用mount方法编译模板 */
  if (this.$options.el) this.$mount();
};

Vue.prototype.$mount = function () {
  mount(this);
};

window.Vue = Vue;
