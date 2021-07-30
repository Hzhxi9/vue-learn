import initData from "./initData";
import mount from "./compiler";

/**
 * Vue构造函数
 * @param {*} options new Vue传递的配置对象
 */
function Vue(options) {
  this._init(options);

  /**如果存在el配置项，调用$mount方法编译模板 */
  if (this.$options.el) this.$mount();
}

Vue.prototype._init = function (options) {
  /**
   * 将options挂载到Vue实例上
   */
  this.$options = options;

  /**
   * 初始化this.$options.data
   * 1. 代理data对象上的各个属性到vue实例
   * 2. 给data对象上的各个属性设置响应式
   */
  initData(this);
};

Vue.prototype.$mount = function (vm) {
  mount(this);
};

window.Vue = Vue;
