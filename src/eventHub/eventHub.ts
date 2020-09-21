interface EventList {
  [key: string]: Array<(eventData: unknown) => void>;
}

class EventHub {
  private eventList: EventList = {};

  // 订阅
  on(eventName: string, fn: (eventData: unknown) => void) {
    this.eventList[eventName] = this.eventList[eventName] ?? [];
    this.eventList[eventName].push(fn);
  }
  // 发布
  emit(eventName: string, eventData?: unknown) {
    if (this.eventList[eventName] === undefined) {
      return;
    }
    this.eventList[eventName].forEach((fn) => fn(eventData));
  }
  // 取消
  off(eventName: string, fn: (eventData: unknown) => void) {
    if (this.eventList[eventName] === undefined) {
      return;
    }
    const fnIndex = this.eventList[eventName].findIndex(
      (eventFn) => eventFn === fn
    );
    if (fnIndex >= 0) {
      this.eventList[eventName].splice(fnIndex, 1);
    }
  }
}

export default EventHub;
