import Promise from '../';

describe('Promise', () => {
  test('是一个类', () => {
    expect(Promise).toBeInstanceOf(Function);
    expect(Promise.prototype).toBeInstanceOf(Object);
  });
});
