import Watcher from "../Watcher";

export default function compilerAttribute(node, vm) {
  const attrs = Array.from(node.attributes);

  for (const attr of attrs) {
    const { value, name } = attr;
    if (name.match(/v-on:click/)) compilerVClick(node, value, vm);
    else if (name.match(/v-bind:(.*)/)) compilerVBind(node, value, vm);
    else if (name.match(/v-model/)) compilerVModel(node, value, vm);
  }
}

function compilerVClick(node, method, vm) {
  node.addEventListener("click", function (...args) {
    vm.$options.methods[method].apply(vm, args);
  });
}

function compilerVBind(node, attrValue, vm) {
  const attrName = RegExp.$1;
  node.removeAttribute(`v-bind:${attrName}`);

  function cb() {
    node.setAttribute(attrName, vm[attrValue]);
  }

  new Watcher(cb);
}

function compilerVModel(node, key, vm) {
  let { tagName, type } = node;

  tagName = tagName.toLowerCase();

  if (tagName === "input" && type === "text") {
    node.value = vm[key];
    node.addEventListener("input", function () {
      vm[key] = node.value;
    });
  } else if (tagName === "input" && type === "checkbox") {
    node.checked = vm[key];
    node.addEventListener("change", function () {
      vm[key] = node.checked;
    });
  } else if (tagName === "select") {
      node.value = vm[key]
      node.addEventListener('change', function(){
          vm[key] = node.value
      })
  }
}
