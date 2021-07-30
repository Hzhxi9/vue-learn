import compilerNode from "./compilerNode";

/**
 * 编译器
 * @param {*} vm
 */
export default function mount(vm) {
  /**获取el选择器所表示的元素 */
  const el = document.querySelector(vm.$options.el);

  /**编译节点 */
  compilerNode(Array.from(el.childNodes), vm);
}
