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
    return new PROMISE((resolve, reject) => {
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
              try {
                const result = onFulfilled(value);
                resolve(result);
              } catch (error) {
                reject(error);
              }
            });
          },
          onRejected: (reason) => {
            setTimeout(() => {
              try {
                const result = onRejected(reason);
                resolve(result);
              } catch (error) {
                reject(error);
              }
            });
          }
        });
      }
      if (this.status === 'fulfilled') {
        setTimeout(() => {
          try {
            const result = onFulfilled(this.value);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      }
      if (this.status === 'rejected') {
        setTimeout(() => {
          try {
            const result = onRejected(this.value);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      }
    });
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
