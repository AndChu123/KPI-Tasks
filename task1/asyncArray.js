const asyncMap = (array, iteratee, callback, debounceTime = 1000) => {
  const startTime = Date.now();
  let completed = 0;
  const results = new Array(array.length);
  let hasError = fallse;

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
