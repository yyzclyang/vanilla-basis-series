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
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }
  then(onFulfilled?, onRejected?) {
    const nextPromise = new PROMISE((resolve, reject) => {
      if (typeof onFulfilled !== 'function') {
        onFulfilled = resolve;
      }
      if (typeof onRejected !== 'function') {
        onRejected = reject;
      }
      if (this.status === 'pending') {
        this.callbacks.push({
          onFulfilled: (value) => {
            setTimeout(() => {
              this.executeOnFulfilledOrOnRejected(
                nextPromise,
                onFulfilled,
                value,
                resolve,
                reject
              );
            });
          },
          onRejected: (reason) => {
            setTimeout(() => {
              this.executeOnFulfilledOrOnRejected(
                nextPromise,
                onRejected,
                reason,
                resolve,
                reject
              );
            });
          }
        });
      }
      if (this.status === 'fulfilled') {
        setTimeout(() => {
          this.executeOnFulfilledOrOnRejected(
            nextPromise,
            onFulfilled,
            this.value,
            resolve,
            reject
          );
        });
      }
      if (this.status === 'rejected') {
        setTimeout(() => {
          this.executeOnFulfilledOrOnRejected(
            nextPromise,
            onRejected,
            this.value,
            resolve,
            reject
          );
        });
      }
    });
    return nextPromise;
  }
  resolve(value) {
    if (this.status !== 'pending') {
      return;
    }
    if (value === this) {
      throw new TypeError('Chaining cycle detected for promise');
    }
    if (value instanceof Object) {
      const then = value.then;
      if (typeof then === 'function') {
        return then.call(
          value,
          this.resolve.bind(this),
          this.reject.bind(this)
        );
      }
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
    if (reason === this) {
      throw new TypeError('Chaining cycle detected for promise');
    }
    if (reason instanceof Object) {
      const then = reason.then;
      if (typeof then === 'function') {
        return then.call(
          reason,
          this.resolve.bind(this),
          this.reject.bind(this)
        );
      }
    }
    this.status = 'rejected';
    this.value = reason;
    this.callbacks.forEach((callback) => {
      callback.onRejected(reason);
    });
  }
  executeOnFulfilledOrOnRejected(
    nextPromise,
    executeFn,
    value,
    resolve,
    reject
  ) {
    try {
      const result = executeFn(value);
      if (result === nextPromise) {
        reject(new TypeError('Chaining cycle detected for promise'));
      }
      if (result instanceof PROMISE) {
        result.then(resolve, reject);
      } else {
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  }
}

export default PROMISE;
