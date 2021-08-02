import defineReactive from "./defineReactive";
import protoArray from "./protoArray";
import observe from "./observe";
import Dep from "./Dep";

import { def } from "./utils";

export default class Observer {
  constructor(value) {
    this.dep = new Dep();
    
    def(value, "__ob__", this);

    if (Array.isArray(value)) {
      protoArray(value);
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  walk(value) {
    for (const key in value) defineReactive(value, key, value[key]);
  }

  observeArray(arr) {
    for (const value of arr) observe(value);
  }
}
