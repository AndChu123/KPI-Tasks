const asyncMap = (array, iteratee, callback, debounceTime = 1000) => {
  const startTime = Date.now();
  let completed = 0;
  const results = new Array(array.length);
  let hasError = false;

  array.forEach((item, index) => {
    iteratee(item, (error, result) => {
      if(hasError) return;

      if(error) {
        hasError = true;
        return callback(error);
      }

      results[index] = result;
      completed++;

      if (completed === array.length) {
        const executionTime = Date.now() - startTime;

        if(executionTime < debounceTime) {
          setTimeout(() => {
            callback(null, results);
          }, debounceTime - executionTime);
        } else {
          callback(null, results);
        }
      }
    });
  });
};


console.log('test 1');
asyncMap(
  [1,2,3],
  (data, cb) => {
    setTimeout(() => {
      cb(null, data * 2);
    }, 1000);
  },
  (err, result) => {
    console.log('error', err);
    console.log('result', result);
  }
);

console.log('\ntest 2 error');
asyncMap(
  [1,2,3],
  (data, cb) => {
    setTimeout(() => {
      if (data === 2) {
        cb(new Error('failed on number 2'));
      } else{
      cb(null, data * 2);
      }
    }, 1000);
  },
  (err, result) => {
    console.log('error', err);
    console.log('result', result);
  }
);

console.log('\ntest 3 with debounce');
console.time('debounceTest');
asyncMap(
  [1,2,3],
  (data, cb) => {
    setTimeout(() => {
      cb(null, `Processed ${data}`);
    }, 10);
  },
  (err, result) => {
    console.timeEnd('debounceTest');
    console.log('error', err);
    console.log('result', result);
  },
  2000
);
