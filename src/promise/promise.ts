class PROMISE {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError(`Promise resolver ${executor} is not a function`);
    }
    executor(this.resolve, this.reject);
  }
  then() {}
  resolve() {}
  reject() {}
}

export default PROMISE;
