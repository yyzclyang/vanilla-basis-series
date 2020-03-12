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
              let result;
              try {
                result = onFulfilled(value);
              } catch (error) {
                reject(error);
              }
              if (result === promise) {
                throw new TypeError('Chaining cycle detected for promise');
              } else {
                if (result instanceof PROMISE) {
                  result.then(resolve, reject);
                } else {
                  resolve(result);
                }
              }
            });
          },
          onRejected: (reason) => {
            setTimeout(() => {
              let result;
              try {
                result = onRejected(reason);
              } catch (error) {
                reject(error);
              }
              if (result === promise) {
                throw new TypeError('Chaining cycle detected for promise');
              } else {
                if (result instanceof PROMISE) {
                  result.then(resolve, reject);
                } else {
                  resolve(result);
                }
              }
            });
          }
        });
      }
      if (this.status === 'fulfilled') {
        setTimeout(() => {
          let result;
          try {
            result = onFulfilled(this.value);
          } catch (error) {
            reject(error);
          }
          if (result === promise) {
            throw new TypeError('Chaining cycle detected for promise');
          } else {
            if (result instanceof PROMISE) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          }
        });
      }
      if (this.status === 'rejected') {
        setTimeout(() => {
          let result;
          try {
            result = onRejected(this.value);
          } catch (error) {
            reject(error);
          }
          if (result === promise) {
            throw new TypeError('Chaining cycle detected for promise');
          } else {
            if (result instanceof PROMISE) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
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
