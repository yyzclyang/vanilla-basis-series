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
}

export default EventHub;
