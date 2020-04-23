import deepClone from '../';

describe('deepClone', () => {
  test('是一个函数', () => {
    expect(deepClone).toBeFunction();
  });
  test('能复制基本类型', () => {
    const sources = [123, '123', true, false, undefined, null, Symbol()];
    sources.map((source) => {
      expect(source).toEqual(deepClone(source));
    });
  });
});
