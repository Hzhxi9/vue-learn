import initData from "./initData";
import mount from "./compiler";
import patch from "./compiler/patch";
import renderHelper from "./compiler/renderHelper";

function Vue(options) {
  this._init(options);
}

Vue.prototype._init = function (options) {
  this.$options = options;

  initData(this);

  /**安装runtime渲染工具函数 */
  renderHelper(this);

  /**实例上安装patch函数 */
  this.__patch__ = patch;

  if (this.$options.el) this._mount();
};

Vue.prototype._mount = function () {
  mount(this);
};

/**
 * 负责执行vm.$options.render函数
 * @returns
 */
Vue.prototype._render = function () {
  /**给render函数绑定this上下文为Vue实例 */
  return this.$options.render.apply(this);
};

Vue.prototype._update = function (vnode) {
  /**旧节点 */
  const prevNode = this._vnode;

  /**新节点 */
  this._vnode = vnode;

  if (!prevNode)
    this.$el = this.__patch__(
      this.$el,
      vnode
    ) /**老的VNode不存在，则说明首次渲染该组件 */;
  else
    this.$el = this.__patch__(
      prevNode,
      vnode
    ) /**后续更新组件或者首次渲染子组件， 走这里 */;
};

window.Vue = Vue;

// import reactive from "./reactive";

// const data = {
//   name: "yy",
//   age: 20,
// };

// const proxyData = reactive(data);

// console.log(proxyData.name);

// proxyData.name = "YY";

/** =========== 基础类型 ========== */
// let name = "yy",
//   age = 22,
//   money = 20;

// let myself = "",
//   otherMyself = "";

// const effect1 = () => (myself = `${name}今年${age}岁，存款${money}元`);
// const effect2 = () => (otherMyself = `${age}岁的${name}竟然有${money}元`);

// const dep = new Set();

// function track() {
//   dep.add(effect1);
//   dep.add(effect2);
// }

// function trigger() {
//   dep.forEach((effect) => effect());
// }

// track();

// effect1();
// effect2();

// console.log(myself);
// console.log(otherMyself);

// money = 3000;

// trigger();

// console.log(myself);
// console.log(otherMyself);
/** =========== 基础类型 ========== */

/* ========= 单个对象 ============ */

// const p = { name: "yy", age: 22 };

// let nameStr1 = "",
//   nameStr2 = "";

// let ageStr1 = "",
//   ageStr2 = "";

// const effectNameStr1 = () => (nameStr1 = `${p.name}真大-nameStr-1`);
// const effectNameStr2 = () => (nameStr2 = `${p.name}真小-nameStr-2`);

// const effectAgeStr1 = () => (ageStr1 = `${p.age}真老-ageStr-1`);
// const effectAgeStr2 = () => (ageStr2 = `${p.age}真老-ageStr-2`);

// const depsMap = new Map();

// function track(key) {
//   let dep = depsMap.get(key);
//   if (!dep) depsMap.set(key, (dep = new Set()));

//   if (key === "name") {
//     dep.add(effectNameStr1);
//     dep.add(effectNameStr2);
//   } else {
//     dep.add(effectAgeStr1);
//     dep.add(effectAgeStr2);
//   }
// }

// function trigger(key) {
//   const dep = depsMap.get(key);
//   if (dep) dep.forEach((effect) => effect());
// }

// track("name");
// track("age");

// effectNameStr1();
// effectNameStr2();

// effectAgeStr1();
// effectAgeStr2();

// console.log(nameStr1, nameStr2, ageStr1, ageStr2);

// p.name = "new YY";
// p.age = "1888";

// trigger("name");
// trigger("age");

// console.log(nameStr1, nameStr2, ageStr1, ageStr2);

/* ========= 单个对象 ============ */

/** ======= 多个对象 =========== */

/**存储多个对象 */
let activeEffect = null;

function effect(fn) {
  activeEffect = fn;
  activeEffect();
  activeEffect = null;
}

const targetMap = new WeakMap();

function track(target, key) {
  /**
   * 如果此时activeEffect为null则不执行下面
   * 这里判断是为了避免例如console.log(person.name) 而触发 track
   */
  if (!activeEffect) return;

  /**获取对象 */
  let depsMap = targetMap.get(target);

  /**不存在则添加， key为当前对象， value为 存储属性值的Map对象 */
  if (!depsMap) targetMap.set(target, (depsMap = new Map()));

  /**在存储属性值的Map对象中取值 */
  let dep = depsMap.get(key);

  /**不存在则设置一个空的Set对象 */
  if (!dep) depsMap.set(key, (dep = new Set()));

  /**把此时的activeEffect添加进去 */
  dep.add(activeEffect);
}

function trigger(target, key) {
  let depsMap = targetMap.get(target);

  if (depsMap) {
    const deps = depsMap.get(key);
    if (deps) deps.forEach((effect) => effect());
  }
}

function reactive(target) {
  const handler = {
    /**
     *
     * @param {*} target 目标对象
     * @param {*} key 属性名
     * @param {*} receiver Proxy对象
     * @returns
     */
    get(target, key, receiver) {
      console.log("正在访问" + key + "属性");

      /**收集依赖 */
      track(receiver, key);

      return Reflect.get(target, key, receiver);
    },

    /**
     *
     * @param {*} target  目标对象
     * @param {*} key 属性名
     * @param {*} value 属性值
     * @param {*} receiver Proxy对象
     * @returns
     */
    set(target, key, value, receiver) {
      console.log(`将${key}由->${target[key]}->设置成->${value}`);

      Reflect.set(target, key, value, receiver);

      /**触发通知更新 */
      trigger(receiver, key);

      return true;
    },
  };

  return new Proxy(target, handler);
}

function ref(initValue) {
  return reactive({
    value: initValue,
  });
}

function computed(fn) {
  const result = ref();
  effect(() => (result.value = fn()));
  return result;
}

let num1 = ref(5);
let num2 = ref(8);
let sum1 = computed(() => num1.value * num2.value);
let sum2 = computed(() => sum1.value * 10);

console.log(sum1.value); // 40
console.log(sum2.value); // 400

num1.value = 10;

console.log(sum1.value); // 80
console.log(sum2.value); // 800

num2.value = 16;

console.log(sum1.value); // 160
console.log(sum2.value); // 1600

let sum = 1;

let num = ref(2);

effect(() => (sum = num.value * 100));

num.value = 9;

console.log(sum);

const person = reactive({ name: "林三心", age: 22 });
const animal = reactive({ type: "dog", height: 50 });
let nameStr1 = "";
let nameStr2 = "";
let ageStr1 = "";
let ageStr2 = "";
let typeStr1 = "";
let typeStr2 = "";
let heightStr1 = "";
let heightStr2 = "";

const effectNameStr1 = () => {
  nameStr1 = `${person.name}是个大菜鸟`;
};
const effectNameStr2 = () => {
  nameStr2 = `${person.name}是个小天才`;
};
const effectAgeStr1 = () => {
  ageStr1 = `${person.age}岁已经算很老了`;
};
const effectAgeStr2 = () => {
  ageStr2 = `${person.age}岁还算很年轻啊`;
};
const effectTypeStr1 = () => {
  typeStr1 = `${animal.type}是个大菜鸟`;
};
const effectTypeStr2 = () => {
  typeStr2 = `${animal.type}是个小天才`;
};
const effectHeightStr1 = () => {
  heightStr1 = `${animal.height}已经算很高了`;
};
const effectHeightStr2 = () => {
  heightStr2 = `${animal.height}还算很矮啊`;
};

// track(person, "name"); // 收集person.name的依赖
// track(person, "age"); // 收集person.age的依赖
// track(animal, "type"); // animal.type的依赖
// track(animal, "height"); // 收集animal.height的依赖

effect(effectNameStr1);
effect(effectNameStr2);
effect(effectAgeStr1);
effect(effectAgeStr2);
effect(effectTypeStr1);
effect(effectTypeStr2);
effect(effectHeightStr1);
effect(effectHeightStr2);

console.log(nameStr1, nameStr2, ageStr1, ageStr2);
// 林三心是个大菜鸟 林三心是个小天才 22岁已经算很老了 22岁还算很年轻啊

console.log(typeStr1, typeStr2, heightStr1, heightStr2);
// dog是个大菜鸟 dog是个小天才 50已经算很高了 50还算很矮啊

person.name = "sunshine_lin";
person.age = 18;
animal.type = "猫";
animal.height = 20;

trigger(person, "name");
trigger(person, "age");
trigger(animal, "type");
trigger(animal, "height");

console.log(nameStr1, nameStr2, ageStr1, ageStr2);
// sunshine_lin是个大菜鸟 sunshine_lin是个小天才 18岁已经算很老了 18岁还算很年轻啊

console.log(typeStr1, typeStr2, heightStr1, heightStr2);
// 猫是个大菜鸟 猫是个小天才 20已经算很高了 20还算很矮啊

/** ======= 多个对象 =========== */
