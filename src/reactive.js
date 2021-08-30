/** ======= vue3.x ======= */

let activeEffect = null;

function effect(fn) {
  activeEffect = fn;
  activeEffect();
  /**执行后立即赋值为null */
  activeEffect = null;
}

const targetMap = new WeakMap();

/**
 * 收集依赖
 * @param {*} target 目标对象
 * @param {*} key 属性名
 * @returns
 */
function track(target, key) {
  /**
   * 如果此时activeEffect为null则直接结束
   * 这里的判断是为了避免例如 console.log(person.name) 而触发 track
   */
  if (!activeEffect) return;

  /**获取对象 */
  const depsMap = targetMap.get(target);

  /**不存在则设置初始值 */
  if (!depsMap) targetMap.set(target, (depsMap = new Map()));

  /**获取属性值 */
  const dep = depsMap.get(key);

  /**不存在则设置初始值 */
  if (!dep) dep.set(key, (dep = new Set()));

  /**把此时对应的activeEffect添加进去 */
  dep.add(activeEffect);
}

/**
 * 派发更新
 * @param {*} target
 * @param {*} key
 */
function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (depsMap) {
    const deps = depsMap.get(key);
    /**触发更新 */
    deps.forEach((effect) => effect());
  }
}

/**
 * 数据拦截
 * @param {*} target
 * @returns
 */
export default function reactive(target) {
  const handler = {
    /**
     * @param {*} target 目标对象
     * @param {*} key 属性名
     * @param {*} receiver 代理后的目标对象
     * @returns
     */
    get(target, key, receiver) {
      console.log("正在访问" + key + "属性");

      /**收集依赖 */
      track(receiver, key);

      return Reflect.get(target, key, receiver);
    },

    /**
     * @param {*} target  目标对象
     * @param {*} key 属性名
     * @param {*} value 属性值
     * @param {*} receiver 代理后的目标对象
     * @returns
     */
    set(target, key, value, receiver) {
      console.log(`将${key}由->${target[key]}->设置成->${value}`);

      Reflect.set(target, key, value, receiver);

      /**派发更新 */
      trigger(receiver, key);

      return true;
    },
  };

  return new Proxy(target, handler);
}

/**将数据设置为响应式 */
function ref(value) {
  return reactive({
    value,
  });
}

/**计算属性 */
function computed(fn) {
  const result = ref();
  effect(() => (result.value = fn()));
  return result;
}
