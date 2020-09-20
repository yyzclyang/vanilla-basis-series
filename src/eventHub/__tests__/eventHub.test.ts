import EventHub from '../';

describe('EventHub', () => {
  test('是一个类', () => {
    expect(EventHub).toBeInstanceOf(Function);
    expect(EventHub.prototype).toBeInstanceOf(Object);
  });
});
