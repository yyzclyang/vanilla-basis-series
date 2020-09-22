import BIND from '../';

describe('BIND', () => {
  test('是一个函数', () => {
    expect(BIND).toBeInstanceOf(Function);
    expect(BIND.prototype).toBeInstanceOf(Object);
  });
});
