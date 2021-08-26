import Watcher from "../Watcher";

export default function mountComponent(vm) {
  /**更新组件中的函数 */
  const updateComponent = () => {
    vm._update(vm._render());
  };

  /**实例一个渲染Watcher，当响应式数据更新时，这个更新函数会被执行 */
  new Watcher(updateComponent);
}
