import EventHub from '../';

let eventHub: EventHub;

beforeEach(() => {
  eventHub = new EventHub();
});

describe('EventHub', () => {
  test('是一个类', () => {
    expect(EventHub).toBeInstanceOf(Function);
    expect(EventHub.prototype).toBeInstanceOf(Object);
  });
  test('eventHub 能订阅一个事件之后，通过 emit 触发它', () => {
    const fn = jest.fn();
    eventHub.on('test-event', fn);
    eventHub.emit('test-event');
    expect(fn).toBeCalled();
  });
  test('eventHub 能订阅一个事件之后，通过 emit 触发它并传入一个参数，这个参数会被订阅事件的函数调用时使用', () => {
    const fn = jest.fn();
    eventHub.on('test-event', fn);
    eventHub.emit('test-event', 'event-data');
    expect(fn).toBeCalled();
    expect(fn).toBeCalledWith('event-data');
  });
  test('eventHub 需先订阅再触发', () => {
    const fn = jest.fn();
    eventHub.emit('test-event');
    eventHub.on('test-event', fn);
    expect(fn).not.toBeCalled();
  });
});
