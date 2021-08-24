import { def } from "./utils";

import Dep from "./Dep";
import defineReactive from "./defineReactive";
import protoArgument from "./protoArgument";
import observe from "./observe";

export default class Observer {
  constructor(value) {
    def(value, "__ob__", this);

    this.dep = new Dep();

    if (Array.isArray(value)) {
      protoArgument(value);
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  walk(obj) {
    for (const key in obj) defineReactive(obj, key, obj[key]);
  }

  observeArray(arr) {
    for (const item of arr) observe(item);
  }
}
