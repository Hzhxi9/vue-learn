import compileToFunction from "./compileToFunction";

export default function mount(vm) {
  if (!vm.$options.render) {
    let template = "";

    if (vm.$options.template) template = vm.$options.template;
    else {
      template = document.querySelector(vm.$options.el).outerHTML;
      vm.$el = document.querySelector(vm.$options.el);
    }

    const render = compileToFunction(template);
    vm.$options.render = render;
  }
}
