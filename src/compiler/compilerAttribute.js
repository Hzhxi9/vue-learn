import Watcher from "../Watcher";

/**
 * 编译属性节点，实现指令
 * @param {*} node
 * @param {*} vm
 */
export default function compilerAttribute(node, vm) {
  /**将类数组格式的属性转换为数组 */
  const attrs = Array.from(node.attributes);

  /**遍历属性属性 */
  for (const attr of attrs) {
    /**解构获取name, value */
    const { name, value } = attr;

    if (name.match(/v-on:click/) /**编译v-on:click指令 */)
      compilerVOnClick(node, value, vm);
    else if (name.match(/v-bind:(.*)/) /**编译v-bind指令 */)
      compilerVBind(node, value, vm);
    else if (name.match(/v-model/) /**编译v-model指令 */)
      compilerVModel(node, value, vm);
  }
}
/**
 * 编译v-on:click指令
 * @param {*} node 节点
 * @param {*} method 方法名
 * @param {*} vm Vue实例
 */
function compilerVOnClick(node, method, vm) {
  /**给节点添加一个click事件， 回调函数是对应的method */
  node.addEventListener("click", function (...args) {
    /**给method绑定this上下文 */
    vm.$options.methods[method].apply(vm, args);
  });
}

/**
 * 编译v-bind指令
 * @param {*} node 节点
 * @param {*} attrValue 属性值
 * @param {*} vm Vue实例
 */
function compilerVBind(node, attrValue, vm) {
  /**属性名称 */
  const attrName = RegExp.$1;

  /**移除模板中的v-bind属性 */
  node.removeAttribute(`v-bind:${attrName}`);

  /**当属性值发生变化时， 重新执行回调函数 */
  function cb() {
    node.setAttribute(attrName, vm[attrValue]);
  }

  /**实例化 Watcher，当属性值发生变化时，dep 通知 watcher 执行 update 方法，cb 被执行，重新更新属性 */
  new Watcher(cb);
}

/**
 * 编译v-model指令
 * @param {*} node 节点
 * @param {*} key v-model 的属性值
 * @param {*} vm Vue实例
 */
function compilerVModel(node, key, vm) {
  /**节点标签名、 类型 */
  let { tagName, type } = node;

  /**标签名转换为小写 */
  tagName = tagName.toLowerCase();

  if (tagName === "input" && type === "text") {
    /**<input type="text" v-model="value" /> */
    node.value = vm[key]; /**设置input输入框的初始值 */

    /**给节点添加input事件，当事件发生时更改响应式数据 */
    node.addEventListener("input", function () {
      vm[key] = node.value;
    });
  } else if (tagName === "input" && type === "checkbox") {
    /**<input type="checkbox" v-model="value" /> */
    node.checked = vm[key]; /**设置选择框的初始值 */

    /**给节点添加change事件，当事件发生时更改响应式数据 */
    node.addEventListener("change", function () {
      vm[key] = node.checked;
    });
  } else if (tagName === "select") {
    /**<select v-model="value" /> */
    node.value = vm[key]; /**设置下拉框的初始值 */

    /**给节点添加change事件，当事件发生时更改响应式数据 */
    node.addEventListener("change", function () {
      vm[key] = node.value;
    });
  }
}
