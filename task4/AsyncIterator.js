class DataStream {
  constructor(source, batchSize = 1000) {
    this.source = source;
    this.batchsize = batchSize;
  }
}
