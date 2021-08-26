import compileToFunction from "./compileToFunction";
import mountComponent from "./mountComponent";

export default function mount(vm) {
  if (!vm.$options.render) {
    let template = "";

    if (vm.$options.template) {
      template = vm.$options.template;
    } else if (vm.$options.el) {
      template = document.querySelector(vm.$options.el).outerHTML;
      vm.$options.el = document.querySelector(vm.$options.el);
    }

    const render = compileToFunction(template);
    vm.$options.render = render;
  }

  /**初次渲染 */
  mountComponent(vm);
}
