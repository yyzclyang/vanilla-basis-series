import Promise from '../';

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
  test('new Promise(fn), fn 会立即执行', () => {
    const fn = jest.fn();
    new Promise(fn);
    expect(fn).toBeCalled();
  });
});
