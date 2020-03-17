type Status = 'pending' | 'fulfilled' | 'rejected';
type OnFulfilled = (value?: any) => any;
type OnRejected = (reason?: any) => any;
type Resolve = (value?: any) => void;
type Reject = (reason?: any) => void;
type Callbacks = Array<{
  onFulfilled: OnFulfilled;
  onRejected: OnRejected;
}>;
type Executor = (resolve: Resolve, reject: Reject) => void;

class PROMISE {
  public status: Status;
  private value: any;
  private callbacks: Callbacks;
  constructor(executor: Executor) {
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
  then(onFulfilled?: OnFulfilled, onRejected?: OnRejected): PROMISE {
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
            this.executeOnFulfilledOrOnRejected(
              onFulfilled,
              value,
              resolve,
              reject
            );
          },
          onRejected: (reason) => {
            this.executeOnFulfilledOrOnRejected(
              onRejected,
              reason,
              resolve,
              reject
            );
          }
        });
      }
      if (this.status === 'fulfilled') {
        this.executeOnFulfilledOrOnRejected(
          onFulfilled,
          this.value,
          resolve,
          reject
        );
      }
      if (this.status === 'rejected') {
        this.executeOnFulfilledOrOnRejected(
          onRejected,
          this.value,
          resolve,
          reject
        );
      }
    });
  }
  private resolve(value?: any): void {
    this.resolveOrReject('resolve', value);
  }
  private reject(reason?: any): void {
    this.resolveOrReject('reject', reason);
  }
  private executeOnFulfilledOrOnRejected(
    executeFn: OnFulfilled | OnRejected,
    value: any,
    resolve: Resolve,
    reject: Reject
  ): void {
    setTimeout(() => {
      try {
        const result = executeFn.call(undefined, value);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
  private resolveOrReject(type: 'resolve' | 'reject', value: any): void {
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
    this.status = type === 'resolve' ? 'fulfilled' : 'rejected';
    this.value = value;
    this.callbacks.forEach((callback) => {
      if (type === 'resolve') {
        callback.onFulfilled.call(undefined, value);
      }
      if (type === 'reject') {
        callback.onRejected.call(undefined, value);
      }
    });
  }

  static resolve(value: any): PROMISE {
    return new PROMISE((resolve, reject) => {
      if (value instanceof PROMISE) {
        value.then(resolve, reject);
      } else {
        resolve(value);
      }
    });
  }
  static reject(reason: any): PROMISE {
    return new PROMISE((resolve, reject) => {
      if (reason instanceof PROMISE) {
        reason.then(resolve, reject);
      } else {
        reject(reason);
      }
    });
  }
  static all(promiseArray: Array<PROMISE>): PROMISE {
    return new PROMISE((resolve, reject) => {
      const results = [];
      promiseArray.forEach((promise) => {
        promise.then((value) => {
          results.push(value);
          if (results.length === promiseArray.length) {
            resolve(results);
          }
        }, reject);
      });
    });
  }
  static race(promiseArray: Array<PROMISE>): PROMISE {
    return new PROMISE((resolve, reject) => {
      promiseArray.forEach((promise) => {
        promise.then(resolve, reject);
      });
    });
  }
}

export default PROMISE;
