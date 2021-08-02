import initData from "./initData";
import mount from './compiler'
function Vue(options) {
  this._init(options);
}

Vue.prototype._init = function (options) {
  this.$options = options;

  initData(this);

  if (this.$options.el) this.$mount();
};

Vue.prototype.$mount = function () {
  mount(this);
};

window.Vue = Vue;
