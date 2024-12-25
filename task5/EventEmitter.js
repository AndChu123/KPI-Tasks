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
    return this.EventEmitter.subscribe(topic, (data) => {
      if (data.from !== this.name) {
        callback(data);
      }
    });
  }
}

const channel = new EventEmitter();
const entity1 = new Entity("service1", channel);
const entity2 = new Entity("service2", channel);

entity1.onMessage("updates", msg => 
                 console.log (`${entity1.name} received: ${msg.content} from ${msg.from}`)
                 );
entity2.onMessage("updates", msg => 
                 console.log (`${entity2.name} received: ${msg.content} from ${msg.from}`)
                 );

setTimeout(() => entity1.send("updates", "Hello"), 100);
setTimeout(() => entity2.send("updates", "Hi"), 250);

setTimeout(() => {
  console.log("shutdown"); 
}, 1000);

// Result: 
// service1 sending Hello
// service2 sending Hi
// service1 received: Hello from service1
// service2 received: Hello from service1
// service1 received: Hi from service2
// service2 received: Hi from service2
// shutdown 


// new result(demo update)
// service1 sending Hello
// service1 received: Hello from service1
// service2 received: Hello from service1
// service2 sending Hi
// service1 received: Hi from service2
// service2 received: Hi from service2
// shutdown


// new result(onMessage update)
// service1 sending Hello
// service2 received: Hello from service1
// service2 sending Hi
// service1 received: Hi from service2
// shutdown
