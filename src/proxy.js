function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      track(receiver, key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      Reflect.set(target, key, value, receiver);
      trigger(receiver, key);
      return true;
    },
  };
  return new Proxy(target, handler);
}

let effectActive = null;

function effect(fn) {
  effectActive = fn;
  effectActive();
  effectActive = null;
}

const targetMap = new WeakMap();

function track(target, key) {
  if (!effectActive) return;

  const depsMap = targetMap.get(target);

  if (!depsMap) depsMap.set(target, (depsMap = new Map()));

  const deps = depsMap.get(key);

  if (!deps) deps.set(key, (deps = new Set()));

  deps.add(effectActive);
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    const deps = depsMap.get(key);
    deps.forEach((effect) => effect());
  }
}

function ref(value) {
  return reactive({
    value,
  });
}

function computed(fn) {
  let result = ref();
  effect(() => (result.value = fn()));
  return result;
}
