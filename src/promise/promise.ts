class PROMISE {
  private status;
  private value;
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError(`Promise resolver ${executor} is not a function`);
    }
    this.status = 'pending';
    this.value = null;
    executor(this.resolve.bind(this), this.reject.bind(this));
  }
  then() {}
  resolve() {}
  reject() {}
}

export default PROMISE;
