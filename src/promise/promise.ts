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
    const promise = new PROMISE((resolve, reject) => {
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
                if (result === promise) {
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
            });
          },
          onRejected: (reason) => {
            setTimeout(() => {
              try {
                const result = onRejected(reason);
                if (result === promise) {
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
            });
          }
        });
      }
      if (this.status === 'fulfilled') {
        setTimeout(() => {
          try {
            const result = onFulfilled(this.value);
            if (result === promise) {
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
        });
      }
      if (this.status === 'rejected') {
        setTimeout(() => {
          try {
            const result = onRejected(this.value);
            if (result === promise) {
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
        });
      }
    });
    return promise;
  }
  resolve(value) {
    if (this.status !== 'pending') {
      return;
    }
    if (value === this) {
      throw new TypeError('Chaining cycle detected for promise');
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
    this.status = 'rejected';
    this.value = reason;
    this.callbacks.forEach((callback) => {
      callback.onRejected(reason);
    });
  }
}

export default PROMISE;
