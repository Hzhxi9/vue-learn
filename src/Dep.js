export default class Dep {
  static target = null;
  constructor() {
    this.watchers = [];
  }

  depend() {
    if (this.watchers.includes(Dep.target)) return;
    this.watchers.push(Dep.target);
  }

  notify() {
    for (const watcher of this.watchers) watcher.update();
  }
}
