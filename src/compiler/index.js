import compileNode from "./compileNode";

/**
 * 编译器
 */
export default function mount(vm) {
  /**
   * 获取el选择器所表示的元素
   */
  const el = document.querySelector(vm.$options.el);

  /**
   * 编译节点
   */
  compileNode(Array.from(el.childNodes), vm);
}
