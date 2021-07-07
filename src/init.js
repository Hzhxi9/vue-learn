import initData from "./initData";

/**
 * 初始化配置对象
 * @param {*} options
 */
Vue.prototype._init = function (options) {
  /**将$options 配置挂载到Vue实例上 */
  this.$options = options;

  /**
   *  初始化options.data
   *  代理data对象上的各个属性到Vue实例
   *  给data对象上的各个属性设置响应式
   */
  initData(this);
};
