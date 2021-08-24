import mount from "./compiler";
import initData from "./initData";

function Vue(options) {
  this.init(options);
}

Vue.prototype.init = function (options) {
  this.$options = options;
  initData(this);

  if (this.$options.el) this.$mount();
};

Vue.prototype.$mount = function () {
  mount(this);
};

window.Vue = Vue;
