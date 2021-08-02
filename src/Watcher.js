import Dep from "./Dep";

export default class Watcher {
  constructor(cb) {
    this._cb = cb;
    Dep.target = this;
    cb();
    Dep.target = null;
  }
  update() {
    this._cb();
  }
}
