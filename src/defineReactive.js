import observe from "./observe";
import Dep from "./Dep";

export default function defineReactive(obj, key, value) {
  const childOb = observe(value);

  const dep = new Dep();

  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {
        dep.depend();

        if (childOb) childOb.dep.depend();
      }

      return value;
    },

    set(newValue) {
      if (value === newValue) return;

      value = newValue;

      observe(value);

      dep.notify();
    },
  });
}
