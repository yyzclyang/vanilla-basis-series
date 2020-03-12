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
  test('promise(executor)，executor 的参数 resolve 异步执行时，then 方法的函数正常执行', () => {
    const spy = jest.fn();
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 100);
    }).then(spy);
    jest.runAllTimers();
    expect(spy).toBeCalled();
  });
  test('promise(executor)，executor 的参数 reject 异步执行时，then 方法的函数正常执行', () => {
    const spy = jest.fn();
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject();
      }, 100);
    }).then(undefined, spy);
    jest.runAllTimers();
    expect(spy).toBeCalled();
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
});
