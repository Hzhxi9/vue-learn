import compileNodes from './compileNodes'

export default function mount(vm) {
  const el = document.querySelector(vm.$options.el);
  compileNodes([...el.childNodes], vm);
}
