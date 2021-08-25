import Dep from "./Dep";
import observe from "./observe";
import protoArgument from "./protoArgument";
import defineReactive from './defineReactive'

import { def } from "./utils";

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

  observeArray(arr) {
    for (const item of arr) observe(item);
  }

  walk(object) {
    for (const key in object) defineReactive(object, key, object[key]);
  }
}
