import compileToFunction from "./compileToFunction";

export default function mount(vm) {
  /**判断是否存在render选项， 没有提供则编译生成render函数 */
  if (!vm.$options.render) {
    /**获取模板 */
    let template = "";

    if (vm.$options.template) /**模板存在*/ template = vm.$options.template;
    else if (vm.$options.el) {
      const el = document.querySelector(vm.$options.el);
      /**存在挂载点 */
      template = el.outerHTML;
      /**在实例上记录挂载点，this._update中会用到 */
      vm.$el = el;
    }

    /**生成渲染函数 */
    const render = compileToFunction(template);

    /**将渲染函数挂载到$options中 */
    vm.$options.render = render;
    console.log(vm.$options.render, "==vm.$options.render");
  }
}
