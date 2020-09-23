import BIND from '../';

describe('BIND', () => {
  test('是一个函数', () => {
    expect(BIND).toBeInstanceOf(Function);
    expect(BIND.prototype).toBeInstanceOf(Object);
  });
  test('能绑定 this', () => {
    const fn = function() {
      return this;
    };
    const thisArg1 = 'this';
    const bindFn1 = fn.BIND(thisArg1);
    const thisArg2 = {};
    const bindFn2 = fn.BIND(thisArg2);
    expect(bindFn1() === thisArg1).toBeTrue();
    expect(bindFn2() === thisArg2).toBeTrue();
  });
  test('支持绑定 this 的同时传入参数', () => {
    const fn = function(arg1: any, arg2: any) {
      return [this, arg1, arg2];
    };
    const thisArg = 123;
    const arg1 = [];
    const arg2 = {};
    const bindFn = fn.BIND(thisArg, arg1, arg2);
    const [r1, r2, r3] = bindFn();
    expect(r1 === thisArg).toBeTrue();
    expect(r2 === arg1).toBeTrue();
    expect(r3 === arg2).toBeTrue();
  });
  test('支持绑定 this 时传入一部分参数，调用时传入另外一部分参数', () => {
    const fn = function(arg1: any, arg2: any) {
      return [this, arg1, arg2];
    };
    const thisArg = 123;
    const arg1 = [];
    const arg2 = {};
    const bindFn = fn.BIND(thisArg, arg1);
    const [r1, r2, r3] = bindFn(arg2);
    expect(r1 === thisArg).toBeTrue();
    expect(r2 === arg1).toBeTrue();
    expect(r3 === arg2).toBeTrue();
  });
});
