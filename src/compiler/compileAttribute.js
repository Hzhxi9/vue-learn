import Watcher from "../Watcher";

export default function compileAttribute(node, vm) {
  const attrs = [...node.attributes];

  for (const attr of attrs) {
    const { name, value } = attr;

    console.log(name,value)
    if (name.match(/v-on:click/)) compileVOnClick(node, value, vm);
    else if (name.match(/v-bind:(.*)/)) compileVBind(node, value, vm);
    else if (name.match(/v-model/)) compileVModel(node, value, vm);
  }
}

function compileVOnClick(node, method, vm) {
  node.addEventListener("click", function (...args) {
    vm.$options.methods[method].apply(vm, args);
  });
}

function compileVBind(node, attrValue, vm) {
  const attrName = RegExp.$1.trim();

  node.removeAttribute(`v-bind:${attrName}`);

  function cb() {
    node.setAttribute(attrName, vm[attrValue]);
  }

  new Watcher(cb);
}

function compileVModel(node, key, vm) {
  let { tagName, type } = node;
  tagName = tagName.toLowerCase();

  if (tagName === "input" && type === "text") {
    node.value = vm[key];

    node.addEventListener("input", function () {
      vm[key] = node.value;
    });
  } else if ((tagName === "input", type === "checkbox")) {
    node.checked = vm[key];
    node.addEventListener("change", function () {
      vm[key] = node.checked;
    });
  } else if (tagName === "select") {
    node.value = vm[key];
    node.addEventListener("change", function () {
      vm[key] = node.value;
    });
  }
}
