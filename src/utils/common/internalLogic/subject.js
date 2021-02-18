export function Subject() {
  this.list = {};
  this.cacheTrigger = {};
  this.listen = (key, callback) => {
    if (!this.list[key]) {
      this.list[key] = [];
    }
    if (this.cacheTrigger[key]) {
      callback(...this.cacheTrigger[key]);
      this.cacheTrigger[key] = undefined;
    }
    this.list[key].push(callback);
  };
  this.trigger = (key, ...value) => {
    if (!this.list[key]) {
      this.cacheTrigger[key] = [...value];
      return;
    }
    this.run(key, ...value);
  };
  this.run = (key, ...value) => {
    this.list[key].forEach((callback) => {
      callback(...value);
    });
  };
  this.remove = (key, fn) => {
    let fns = this.list[key];
    if (!fns) {
      return false;
    }
    if (!fn) {
      fns && (fns.length = 0);
    } else {
      for (let i = fns.length - 1; i >= 0; i--) {
        let _fn = fns[i];
        if (_fn === fn) {
          fns.splice(i, 1);
        }
      }
    }
  };
  this.hasListen = (key) => {
    if (this.list[key]) {
      if (this.list[key].length > 0) {
        return true;
      }
    }
    return false;
  };
  this.getList = () => {
    return this.list;
  };
}
