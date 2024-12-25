class EventEmitter {
  constructor() {
    this.subscribers = new Map();
  }

  subscribe(topic, callback){
    if(!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
  }
    this.subscribers.get(topic).add(callback);

    return() => this.unsubscribe(topic, callback);
  }
}
