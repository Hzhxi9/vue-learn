import initData from "./initData";

/**
 * Vue 构造函数
 * @param {*} options 配置对象
 */
function Vue(options) {
  this._init(options);
}

/**
 * Vue初始化
 * @param {*} options
 */
Vue.prototype._init = function (options) {
  /**
   * 将options挂载到vue实例上
   */
  this.$options = options;

  /**
   * 初始化options.data
   * 代理data对象上的各个属性到Vue实例
   * 给data对象上的各个属性设置响应式能力
   */
  initData(this);
};

window.Vue = Vue;
