class DataStream {
  constructor(source, batchSize = 1000) {
    this.source = source;
    this.batchsize = batchSize;
  }
}

async *[Symbol.asyncIterator]() {
  let offset = 0;
  while(true) {
    const batch = await this.source.slice(offset, offset + this.batchSize);
    if (batch.length === 0) break;
    yield* batch;
    offset += this.batchSize;
  }
}

map(fn) {
  const self = this;
  return new DataStream({
    async slice(start, end) {
      const batch = await self.source.slice(start, end);
      return batch.map(fn);
    }
  }, this batchSize);
}

filter(predicate) {
  const self = this;
  return new DataStream({
    async slice(start, end) {
      const batch = await self.source,slice(start, end);
      return batch.filter(predicate);
    }
  }, this.batchSize);
}

async reduce(fn, initial) {
  let result = initial;
  for await(const item of this) {
    result = fn(result, item);
  }
  return result;
}

const bigDataSource = {
  data: Array.from({ length: 1000 }, (_, i) => i),
  slice(start, end) {
    return Promise.resolve(this.data.slice(start, end));
  }
};

async function demo() {
  const stream = new DataStream(bigDataSource, 100);

  console.log('stream processing')
  let count = 0

  for await(const item of stream
           .filter(x => x % 2 === 0)
           .map(x => x*2)) {
    if (count < 5) console.log('element', item);
    count++;
           }

  console.log('total processed elements', count);
}


