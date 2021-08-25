import Watcher from "../Watcher";

export default function compileTextNode(node, vm) {
  const key = RegExp.$1.trim();

  function cb() {
    node.textContent = JSON.stringify(vm[key]);
  }

  new Watcher(cb);
}
