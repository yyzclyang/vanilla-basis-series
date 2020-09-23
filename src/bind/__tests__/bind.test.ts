import BIND from '../';

describe('BIND', () => {
  test('是一个函数', () => {
    expect(BIND).toBeInstanceOf(Function);
    expect(BIND.prototype).toBeInstanceOf(Object);
  });
  test('能固定 this', () => {
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
});
