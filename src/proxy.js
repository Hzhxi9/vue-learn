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

const targetMaps = new WeakMap();

function track(target, key) {
  if (!effectActive) return;

  const targetDeps = targetMaps.get(target);

  if (!targetDeps) targetMaps.set(target, (targetDeps = new Map()));

  const deps = targetDeps.get(key);

  if (!deps) targetDeps.set(key, (deps = new Set()));

  deps.add(effectActive);
}

function trigger(target, key) {
  const targetDeps = targetMaps.get(target);

  if (!targetDeps) {
    const deps = targetDeps.get(key);
    deps.forEach((effect) => effect());
  }
}

function ref(value) {
  return reactive({
    value,
  });
}

function computed(fn) {
  const result = ref();
  effect(() => (result.value = fn()));
  return result;
}
