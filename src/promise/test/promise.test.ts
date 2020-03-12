import Promise from '../';

beforeEach(() => {
  jest.useFakeTimers();
});
afterEach(() => {
  jest.useRealTimers();
});

describe('Promise', () => {
  test('是一个类', () => {
    expect(Promise).toBeInstanceOf(Function);
    expect(Promise.prototype).toBeInstanceOf(Object);
  });
  test('new Promise() 必须接受一个函数', () => {
    expect(() => {
      // @ts-ignore
      new Promise();
    }).toThrow(TypeError);
    expect(() => {
      // @ts-ignore
      new Promise('promise');
    }).toThrow(TypeError);
    expect(() => {
      // @ts-ignore
      new Promise(null);
    }).toThrow(TypeError);
  });
  test('new Promise(fn) 会生成一个对象，对象有 then 方法', () => {
    const promise = new Promise(() => {});
    expect(promise.then).toBeInstanceOf(Function);
  });
  test('new Promise(fn)，fn 会立即执行', () => {
    const fn = jest.fn();
    new Promise(fn);
    expect(fn).toBeCalled();
  });
  test('new Promise(fn)，fn 执行的时候接受 resolve 和 reject 两个函数', () => {
    new Promise((resolve, reject) => {
      expect(resolve).toBeInstanceOf(Function);
      expect(reject).toBeInstanceOf(Function);
    });
  });
  test('promise.then(success)，success 会在 resolve 被调用的时候执行', () => {
    const spy = jest.fn();
    new Promise((resolve, reject) => {
      resolve();
    }).then(spy);
    expect(spy).not.toBeCalled();
    jest.runAllTimers();
    expect(spy).toBeCalled();
  });
  test('promise.then(success,fail)，fail 会在 reject 被调用的时候执行', () => {
    const spy = jest.fn();
    new Promise((resolve, reject) => {
      reject();
    }).then(() => {}, spy);
    expect(spy).not.toBeCalled();
    jest.runAllTimers();
    expect(spy).toBeCalled();
  });
  test('promise(executor)，executor 的参数 resolve 异步执行时，then 方法的函数正常异步执行', () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
        spy2();
      }, 100);
    }).then(spy1);
    jest.runAllTimers();
    expect(spy1).toBeCalled();
    expect(spy2).toHaveBeenCalledBefore(spy1);
  });
  test('promise(executor)，executor 的参数 reject 异步执行时，then 方法的函数正常异步执行', () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject();
        spy2();
      }, 100);
    }).then(undefined, spy1);
    jest.runAllTimers();
    expect(spy1).toBeCalled();
    expect(spy2).toHaveBeenCalledBefore(spy1);
  });
  test('2.2.1 then 的参数不是函数就忽略', () => {
    const promise1 = new Promise((resolve, reject) => {
      resolve();
    });
    const promise2 = new Promise((resolve, reject) => {
      reject();
    });
    expect(() => {
      promise1.then(undefined);
    }).not.toThrow();
    expect(() => {
      promise2.then(() => {}, undefined);
    }).not.toThrow();
  });
  test('2.2.2 resolve 之后改变状态，并调用 then 的第一个函数，且只会调用一次', () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const promise = new Promise((resolve, reject) => {
      resolve(1);
      resolve(2);
      reject(3);
    });
    expect(promise.status).toEqual('fulfilled');
    promise.then(spy1, spy2);
    jest.runAllTimers();
    expect(spy1).toBeCalledTimes(1);
    expect(spy1).toBeCalledWith(1);
    expect(spy2).toBeCalledTimes(0);
  });
  test('2.2.3 reject 之后改变状态，并调用 then 的第二个函数，且只会调用一次', () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const promise = new Promise((resolve, reject) => {
      reject(1);
      reject(2);
      resolve(3);
    });
    expect(promise.status).toEqual('rejected');
    promise.then(spy1, spy2);
    jest.runAllTimers();
    expect(spy1).toBeCalledTimes(0);
    expect(spy2).toBeCalledTimes(1);
    expect(spy2).toBeCalledWith(1);
  });
  test('2.2.4 在代码执行完毕之前，不得调用 then 的函数（resolve）', () => {
    const spy = jest.fn();
    new Promise((resolve, reject) => {
      resolve();
    }).then(spy);
    expect(spy).toBeCalledTimes(0);
    jest.runAllTimers();
    expect(spy).toBeCalledTimes(1);
  });
  test('2.2.4 在代码执行完毕之前，不得调用 then 的函数（reject）', () => {
    const spy = jest.fn();
    new Promise((resolve, reject) => {
      reject();
    }).then(undefined, spy);
    expect(spy).toBeCalledTimes(0);
    jest.runAllTimers();
    expect(spy).toBeCalledTimes(1);
  });
  test('2.2.5 then 的函数被调用时，不能有 this（resolve）', () => {
    new Promise((resolve) => {
      resolve();
    }).then(function() {
      'use strict';
      expect(this).toEqual(undefined);
    });
    jest.runAllTimers();
  });
  test('2.2.5 then 的函数被调用时，不能有 this（reject）', () => {
    new Promise((resolve, reject) => {
      reject();
    }).then(
      () => {},
      function() {
        'use strict';
        expect(this).toEqual(undefined);
      }
    );
    jest.runAllTimers();
  });
  test('2.2.6 then 可以在同一个 promise 中多次调用（resolve）', () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const spy3 = jest.fn();
    const promise = new Promise((resolve, reject) => {
      resolve();
    });
    promise.then(spy1);
    promise.then(spy2);
    promise.then(spy3);
    jest.runAllTimers();
    expect(spy1).toBeCalledTimes(1);
    expect(spy2).toBeCalledTimes(1);
    expect(spy3).toBeCalledTimes(1);
    expect(spy1).toHaveBeenCalledBefore(spy2);
    expect(spy2).toHaveBeenCalledBefore(spy3);
  });
  test('2.2.6 then 可以在同一个 promise 中多次调用（reject）', () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const spy3 = jest.fn();
    const promise = new Promise((resolve, reject) => {
      reject();
    });
    promise.then(undefined, spy1);
    promise.then(undefined, spy2);
    promise.then(undefined, spy3);
    jest.runAllTimers();
    expect(spy1).toBeCalledTimes(1);
    expect(spy2).toBeCalledTimes(1);
    expect(spy3).toBeCalledTimes(1);
    expect(spy1).toHaveBeenCalledBefore(spy2);
    expect(spy2).toHaveBeenCalledBefore(spy3);
  });
  test('2.2.7 then 必须返回一个 Promise', () => {
    const promise1 = new Promise((resolve, reject) => {
      resolve();
    });
    const promise2 = promise1.then();
    expect(promise2).toBeInstanceOf(Promise);
  });
  test('2.2.7.1 如果 onFulfilled 或 onRejected 返回一个值 x, 运行 Promise Resolution Procedure [[Resolve]](promise2, x)', () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    new Promise((resolve, reject) => {
      resolve();
    })
      .then(() => 'x')
      .then(spy1);
    new Promise((resolve, reject) => {
      reject();
    })
      .then(undefined, () => 'y')
      .then(spy2);
    jest.runAllTimers();
    expect(spy1).toBeCalledWith('x');
    expect(spy2).toBeCalledWith('y');
  });
  test('2.2.7.1 如果 onFulfilled 返回一个值 x, 运行 Promise Resolution Procedure [[Resolve]](promise2, x)', () => {
    const spy = jest.fn();
    new Promise((resolve, reject) => {
      resolve();
    })
      .then(() => 'x')
      .then(spy);
    jest.runAllTimers();
    expect(spy).toBeCalledWith('x');
  });
  test('2.2.7.1 如果 onRejected 返回一个值 x, 运行 Promise Resolution Procedure [[Resolve]](promise2, x)', () => {
    const spy = jest.fn();
    new Promise((resolve, reject) => {
      reject();
    })
      .then(undefined, () => 'y')
      .then(spy);
    jest.runAllTimers();
    expect(spy).toBeCalledWith('y');
  });
  test('2.2.7.1 （executor 的 resolve 异步执行）如果 onFulfilled 返回一个值 x, 运行 Promise Resolution Procedure [[Resolve]](promise2, x)', () => {
    const spy = jest.fn();
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      });
    })
      .then(() => 'x')
      .then(spy);
    jest.runAllTimers();
    expect(spy).toBeCalledWith('x');
  });
  test('2.2.7.1 （executor 的 reject 异步执行）如果 onRejected 返回一个值 x, 运行 Promise Resolution Procedure [[Resolve]](promise2, x)', () => {
    const spy = jest.fn();
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject();
      });
    })
      .then(undefined, () => 'y')
      .then(spy);
    jest.runAllTimers();
    expect(spy).toBeCalledWith('y');
  });
  test('2.2.7.2 如果 onFulfilled 抛出一个异常 e，promise2 必须被拒绝（rejected）并把 e 当作原因', () => {
    const spy = jest.fn();
    new Promise((resolve, reject) => {
      resolve();
    })
      .then(() => {
        throw new Error();
      })
      .then(undefined, spy);
    jest.runAllTimers();
    expect(spy).toBeCalledWith(new Error());
  });
  test('2.2.7.2 如果 onRejected 抛出一个异常 e，promise2 必须被拒绝（rejected）并把 e 当作原因', () => {
    const spy = jest.fn();
    new Promise((resolve, reject) => {
      reject();
    })
      .then(undefined, () => {
        throw new Error();
      })
      .then(undefined, spy);
    jest.runAllTimers();
    expect(spy).toBeCalledWith(new Error());
  });
  test('2.2.7.3 如果 onFulfilled 不是一个方法，并且 promise1 已经完成（fulfilled），promise2 必须使用与 promise1 相同的值来完成（fulfilled）', () => {
    const spy = jest.fn();
    new Promise((resolve, reject) => {
      resolve('x');
    })
      .then()
      .then(spy);
    jest.runAllTimers();
    expect(spy).toBeCalledWith('x');
  });
  test('2.2.7.4 如果 onRejected 不是一个方法，并且 promise1 已经被拒绝（rejected），promise2 必须使用与 promise1 相同的值来完成（rejected）', () => {
    const spy = jest.fn();
    new Promise((resolve, reject) => {
      reject('x');
    })
      .then()
      .then(undefined, spy);
    jest.runAllTimers();
    expect(spy).toBeCalledWith('x');
  });
  test('2.3.1 如果 promise 和 onFulfilled 的返回值引用同一个对象，则用 TypeError 作为原因拒绝（reject）promise。', () => {
    expect(() => {
      const promise = new Promise((resolve, reject) => {
        resolve();
      }).then(() => promise);
      jest.runAllTimers();
    }).toThrow(TypeError);
  });
  test('2.3.1 如果 promise 和 onRejected 的返回值x 引用同一个对象，则用 TypeError 作为原因拒绝（reject）promise。', () => {
    expect(() => {
      const promise = new Promise((resolve, reject) => {
        reject();
      }).then(undefined, () => promise);
      jest.runAllTimers();
    }).toThrow(TypeError);
  });
  test('2.3.1 （executor 的 resolve 异步执行）如果 promise 和 onFulfilled 的返回值引用同一个对象，则用 TypeError 作为原因拒绝（reject）promise。', () => {
    expect(() => {
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        });
      }).then(() => promise);
      jest.runAllTimers();
    }).toThrow(TypeError);
  });
  test('2.3.1 （executor 的 reject 异步执行）如果 promise 和 onRejected 的返回值x 引用同一个对象，则用 TypeError 作为原因拒绝（reject）promise。', () => {
    expect(() => {
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject();
        });
      }).then(undefined, () => promise);
      jest.runAllTimers();
    }).toThrow(TypeError);
  });
  test('2.3.2 如果 onFulfilled 返回的是一个 promise，采用 promise 的状态', () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    new Promise((resolve, reject) => {
      resolve();
    })
      .then(
        () =>
          new Promise((resolve, reject) => {
            resolve('x');
          })
      )
      .then(spy1);
    new Promise((resolve, reject) => {
      resolve();
    })
      .then(
        () =>
          new Promise((resolve, reject) => {
            reject('y');
          })
      )
      .then(undefined, spy2);
    jest.runAllTimers();
    expect(spy1).toBeCalledWith('x');
    expect(spy2).toBeCalledWith('y');
  });
  test('2.3.2 如果 onRejected 返回的是一个 promise，采用 promise 的状态', () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    new Promise((resolve, reject) => {
      reject();
    })
      .then(
        undefined,
        () =>
          new Promise((resolve, reject) => {
            resolve('x');
          })
      )
      .then(spy1);
    new Promise((resolve, reject) => {
      reject();
    })
      .then(
        undefined,
        () =>
          new Promise((resolve, reject) => {
            reject('y');
          })
      )
      .then(undefined, spy2);
    jest.runAllTimers();
    expect(spy1).toBeCalledWith('x');
    expect(spy2).toBeCalledWith('y');
  });
  test('2.3.2 （executor 的 resolve 异步执行）如果 onFulfilled 返回的是一个 promise，采用 promise 的状态', () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      });
    })
      .then(
        () =>
          new Promise((resolve, reject) => {
            resolve('x');
          })
      )
      .then(spy1);
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      });
    })
      .then(
        () =>
          new Promise((resolve, reject) => {
            reject('y');
          })
      )
      .then(undefined, spy2);
    jest.runAllTimers();
    expect(spy1).toBeCalledWith('x');
    expect(spy2).toBeCalledWith('y');
  });
  test('2.3.2 （executor 的 reject 异步执行）如果 onRejected 返回的是一个 promise，采用 promise 的状态', () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject();
      });
    })
      .then(
        undefined,
        () =>
          new Promise((resolve, reject) => {
            resolve('x');
          })
      )
      .then(spy1);
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject();
      });
    })
      .then(
        undefined,
        () =>
          new Promise((resolve, reject) => {
            reject('y');
          })
      )
      .then(undefined, spy2);
    jest.runAllTimers();
    expect(spy1).toBeCalledWith('x');
    expect(spy2).toBeCalledWith('y');
  });
});
