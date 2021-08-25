import Dep from "./Dep";
import observe from "./observe";

export default function defineReactive(object, key, value) {
  if (arguments.length === 2) {
    return object[key];
  }
  
  const childOb = observe(value);

  const dep = new Dep();

  Object.defineProperty(object, key, {
    get() {
      if (Dep.target) {
        dep.depend();
        if (childOb) childOb.dep.depend();
      }

      return value;
    },
    set(newValue) {
      if (newValue === value) return;

      value = newValue;

      observe(value);

      dep.notify();
    },
  });
}
