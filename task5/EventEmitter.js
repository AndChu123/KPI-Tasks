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

  unsubscribe(topic, callback) {
    this.subscribers.get(topic)?.delete(callback);
  }

  publish(topic, data) {
    this.subscribers.get(topic)?.forEach(callback => {
      setTimeout(() => callback(data), 0);
    });
  }
}

class Entity {
  constructor(name, EventEmitter) {
    this.name = name;
    this.EventEmitter = EventEmitter;
  }

  send(topic, message) {
    console.log(`${this.name} sending ${message}`);
    this.EventEmitter.publish(topic, {
      from: this.name,
      content: message,
      timestamp: Date.now(),
    });
  }

  onMessage(topic, callback){
    return(this.EventEmitter.subscribe(topic, callback);
  }
}
