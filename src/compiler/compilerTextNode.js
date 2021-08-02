import Watcher from "../Watcher";

export default function compilerTextNode(node, vm) {
  const value = RegExp.$1.trim();

  console.log(value);

  function cb() {
    node.textContent = JSON.stringify(vm[value]);
  }

  new Watcher(cb);
}
