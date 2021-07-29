import Watcher from "../Watcher";

/**
 * v-on:click、v-bind 和 v-model指令
 * 编译属性节点
 * @param {*} node 节点
 * @param {*} vm Vue实例
 */
export default function compileAttribute(node, vm) {
  /**将类数组格式的属性节点转换为数组 */
  const attrs = Array.from(node.attributes);

  /**遍历属性数组 */
  for (const attr of attrs) {
    /**属性名称、 属性值 */
    const { name, value } = attr;

    if (name.match(/v-on:click/)) {
      /**编译 v-on:click 指令 */
      console.log(value, "===");
      compileVOnClick(node, value, vm);
    } else if (name.match(/v-bind:(.*)/)) {
      /**编译 v-bind 指令 */
      compileVBind(node, value, vm);
    } else if (name.match(/v-model/)) {
      /**编译 v-model 指令 */
      compileVModel(node, value, vm);
    }
  }
}

/**
 * 编译v-on:click 指令
 * @param {*} node 节点
 * @param {*} method 方法名
 * @param {*} vm Vue实例
 */
function compileVOnClick(node, method, vm) {
  /**
   * 给节点添加一个click事件
   * 回调函数是对应的methods
   */
  node.addEventListener("click", function (...args) {
    /**给method 绑定this 上下文 */
    vm.$options.methods[method].apply(vm, args);
  });
}

/**
 * 编译v-bind 指令
 * @param {*} node 节点
 * @param {*} attrValue 属性值
 * @param {*} vm Vue实例
 */
function compileVBind(node, attrValue, vm) {
  /**获取属性名称 */
  const attrName = RegExp.$1;

  /**移除模板中的v-bind属性 */
  node.removeAttribute(`v-bind:${attrName}`);

  /**当属性变化时，重新执行回调函数 */
  function cb() {
    node.setAttribute(attrName, vm[attrValue]);
  }

  /**实例Watcher，当属性值发生变化时，dep通知watcher执行update方法，cb被执行，重新更新属性 */
  new Watcher(cb);
}

/**
 * 编译v-model 指令
 * @param {*} node 节点
 * @param {*} key v-model 的属性值
 * @param {*} vm Vue实例
 */
function compileVModel(node, key, vm) {
  /**获取节点标签名， 类型 */
  let { tagName, type } = node;

  /**标签名转换为小写 */
  tagName = tagName.toLowerCase();

  if (
    tagName === "input" &&
    type === "text" /**<input type="text" v-mode="value"/> */
  ) {
    /**设置input 输入框的初始值 */
    node.value = vm[key];

    /**
     * 给节点添加input事件
     * 当事件发生时更改响应式数据
     */
    node.addEventListener("input", function () {
      vm[key] = node.value;
    });
  } else if (
    tagName === "input" &&
    type === "checkbox" /**<input type="checkbox" v-mode="value"/> */
  ) {
    /**设置选择框的初始状态 */
    node.checked = vm[key];

    /**
     * 给节点添加change事件
     * 当事件发生时更改响应式数据
     **/
    node.addEventListener("change", function () {
      vm[key] = node.checked;
    });
  } else if (tagName === "select" /**<select  v-mode="value"/> */) {
    /**设置下拉框初始选中的选项 */
    node.value = vm[key];

    /**
     * 添加change事件
     * 当事件发生时更改响应式数据
     */
    node.addEventListener("change", function () {
      vm[key] = node.value;
    });
  }
}
