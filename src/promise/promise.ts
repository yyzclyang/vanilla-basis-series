class PROMISE {
  public status;
  private value;
  private callbacks;
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError(`Promise resolver ${executor} is not a function`);
    }
    this.status = 'pending';
    this.value = null;
    this.callbacks = [];
    executor(this.resolve.bind(this), this.reject.bind(this));
  }
  then(onFulfilled?, onRejected?) {
    if (typeof onFulfilled !== 'function') {
      onFulfilled = () => {};
    }
    if (typeof onRejected !== 'function') {
      onRejected = () => {};
    }
    if (this.status === 'pending') {
      this.callbacks.push({
        onFulfilled,
        onRejected
      });
    }
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
    this.callbacks.forEach((callback) => {
      callback.onFulfilled(value);
    });
  }
  reject(reason) {
    if (this.status !== 'pending') {
      return;
    }
    this.status = 'rejected';
    this.value = reason;
    this.callbacks.forEach((callback) => {
      callback.onRejected(reason);
    });
  }
}

export default PROMISE;
