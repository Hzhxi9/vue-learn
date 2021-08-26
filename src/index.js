import initData from "./initData";
import mount from "./compiler";
import renderHelper from "./compiler/renderHelper";

function Vue(options) {
  this._init(options);
}

Vue.prototype._init = function (options) {
  this.$options = options;

  initData(this);

  /**安装runtime渲染工具函数 */
  renderHelper(this);

  /**实例上安装patch函数 */
  this.__patch__ = patch;

  if (this.$options.el) this._mount();
};

Vue.prototype._mount = function () {
  mount(this);
};

/**
 * 负责执行vm.$options.render函数
 * @returns
 */
Vue.prototype._render = function () {
  /**给render函数绑定this上下文为Vue实例 */
  return this.$options.render.apply(this);
};

Vue.prototype._update = function (vnode) {
  /**旧节点 */
  const prevNode = this._vnode;

  /**新节点 */
  this._vnode = vnode;

  if (!prevNode)
    this.$el = this.__patch__(
      this.$el,
      vnode
    ) /**老的VNode不存在，则说明首次渲染该组件 */;
  else
    this.$el = this.__patch__(
      prevNode,
      vnode
    ) /**后续更新组件或者首次渲染子组件， 走这里 */;
};

window.Vue = Vue;
