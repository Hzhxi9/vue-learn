import { proxy } from "./utils";

import observe from "./observe";

export default function initData(vm) {
  const { data } = vm.$options;

  if (!data) vm._data = {};
  else vm._data = typeof data === "function" ? data() : data;

  for (const key in vm._data) proxy(vm, "_data", key);

  observe(vm._data);
}
