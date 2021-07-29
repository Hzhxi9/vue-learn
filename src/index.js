import initData from "./initData";
import mount from "./compiler";

/**
 * Vue构造函数
 * @param {*} options 实例Vue类传递的配置项
 */
function Vue(options) {
  this._init(options);
}

/**
 * 初始化Vue配置对象
 * @param {*} options
 */
Vue.prototype._init = function (options) {
  /**
   * 将options配置挂载到Vue实例上
   */
  this.$options = options;

  /**
   * 1. 初始化options.data
   * 2. 代理data对象上的各个属性到Vue实例
   * 3. 给data对象上各个属性设置响应式
   */
  initData(this);

  /**如果存在el配置项，则调用$mount方法编译模板 */
  if (this.$options.el) this.$mount();
};

Vue.prototype.$mount = function () {
  mount(this);
};

window.Vue = Vue;
