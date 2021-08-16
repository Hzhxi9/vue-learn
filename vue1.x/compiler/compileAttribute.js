import Watcher from "../Watcher";

/**
 * 编译属性节点
 * @param {*} node 节点
 * @param {*} vm Vue实例
 */
export default function compileAttribute(node, vm) {
  /**将属性类数组节点转换为数组 */
  const attrs = Array.from(node.attributes);

  /**遍历属性数组 */
  for (const attr of attrs) {
    /**属性名称、属性值 */
    const { name, value } = attr;

    if (name.match(/v-on:click/) /**编译v-on:click指令 */)
      compilerVOnClick(node, value, vm);
    else if (name.match(/v-bind:(.*)/) /**编译v-bind指令 */)
      compileVBind(node, value, vm);
    else if (name.match(/v-model/) /**编译v-model指令 */)
      compileVModel(node, value, vm);
  }
}

/**
 * 编译v-on:click指令
 * @param {*} node 节点
 * @param {*} method 方法名
 * @param {*} vm Vue实例
 */
function compilerVOnClick(node, method, vm) {
  /**给节点添加click事件，回调函数是对应method */
  node.addEventListener("click", function (...args) {
    vm.$options.methods[method].apply(vm, args);
  });
}

/**
 * 编译v-bind指令
 * @param {*} node 节点
 * @param {*} attrValue 属性值
 * @param {*} vm Vue实例
 */
function compileVBind(node, attrValue, vm) {
  /**获取属性名 */
  const attrName = RegExp.$1;

  /**移除模板中的v-bind属性值 */
  node.removeAttribute(`v-bind:${attrName}`);

  /**当属性值发生变化时，重新执行回调函数 */
  function cb() {
    node.setAttribute(attrName, vm[attrValue]);
  }

  /**实例化Watcher, 当属性值发生变化时，dep通知watcher执行update方法，cb被执行，重新更新属性 */
  new Watcher(cb);
}

/**
 * 编译v-model指令
 * @param {*} node 节点
 * @param {*} key v-modal的属性值
 * @param {*} vm Vue实例
 */
function compileVModel(node, key, vm) {
  /**节点标签名， 类型 */
  let { tagName, type } = node;

  tagName = tagName.toLowerCase();

  if (tagName === "input" && type === "text") {
    /**<input text="text" v-model="value" /> */
    /**设置input输入框的初始值 */
    node.value = vm[key];

    /*给节点添加input事件， 当事件发生时更改响应式数据 */
    node.addEventListener("input", function () {
      vm[key] = node.value;
    });
  } else if (tagName === "input" && type === "checkbox") {
    /**<input text="checkbox" v-model="value" /> */
    /**设置input输入框的初始值 */
    node.checked = vm[key];

    /*给节点添加change事件， 当事件发生时更改响应式数据 */
    node.addEventListener("change", function () {
      vm[key] = node.checked;
    });
  } else if (tagName === "select") {
    /**<select v-model="value"/> */

    /**设置select下拉框的初始值 */
    node.value = vm[key];

    /*给节点添加change事件， 当事件发生时更改响应式数据 */
    node.addEventListener("change", function () {
      vm[key] = node.value;
    });
  }
}
