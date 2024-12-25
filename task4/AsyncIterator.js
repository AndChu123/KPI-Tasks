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
