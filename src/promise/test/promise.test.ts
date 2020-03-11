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
});
