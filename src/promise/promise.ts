class PROMISE {
  public status;
  private value;
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError(`Promise resolver ${executor} is not a function`);
    }
    this.status = 'pending';
    this.value = null;
    executor(this.resolve.bind(this), this.reject.bind(this));
  }
  then(onFulfilled?, onRejected?) {
    if (this.status === 'fulfilled') {
      setTimeout(() => {
        onFulfilled(this.value);
      });
    }
    if (this.status === 'rejected') {
      setTimeout(() => {
        onRejected(this.value);
      });
    }
  }
  resolve(value) {
    if (this.status !== 'pending') {
      return;
    }
    this.status = 'fulfilled';
    this.value = value;
  }
  reject(reason) {
    if (this.status !== 'pending') {
      return;
    }
    this.status = 'rejected';
    this.value = reason;
  }
}

export default PROMISE;
