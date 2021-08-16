import compilerNode from './compilerNode'

export default function mount(vm) {
  const el = document.querySelector(vm.$options.el);

  /**编译节点 */
  compileNode(Array.from(el.childNodes), vm);
}
