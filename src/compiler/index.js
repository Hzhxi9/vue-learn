import compilerNode from './compilerNode'

export default function mount(vm) {
  const el = document.querySelector(vm.$options.el);

  compilerNode(Array.from(el.childNodes), vm)
}
