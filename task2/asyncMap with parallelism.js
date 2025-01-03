const asyncMap = async (array, callback, { debounceTime = 1000, concurrency = Infinity } = {}) => {
  const startTime = Date.now();

const results = new Array(array.length);
  let currentIndex = 0;

  const processItem = async () => {
    while (currentIndex < array.length) {
      const index = currentIndex++;
      results[index] = await callback(array[index], index, array);
    }
  };

  const workers = Array(Math.min(concurrency, array.length))
  .fill()
  .map(() => processItem());

  await Promise.all(workers);

const executionTime = Date.now() - startTime;
if (executionTime < debounceTime) {
  await new Promise(resolve =>
    setTimeout(resolve, debounceTime - executionTime)
                    );
}

return results;
};

const demo = async () => {
  const numbers = [1,2,3,4,5];

  console.log('Test 1 full parallelism');
  const multipliedNumbers = await asyncMap(numbers, async (num) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return num*2;
  },
  { debounceTime: 1000 }
);
  console.log('result', multipliedNumbers);

  console.log('\nTest 2 limited parallelism')
  console.time('limitedParallelism');
  const processedData = await asyncMap(numbers, async (num) => {
    return `Processed ${num}`;
  }, 
{
 debounceTime: 2000,
 concurrency: 2
}
    );

  console.timeEnd('limitedParallelism');
  console.log('result', processedData);

    console.log('\nTest 3: Sequential execution');
  console.time('sequential');
  const sequentialData = await asyncMap(
    numbers,
    async (num) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return `Sequential ${num}`;
    },
    { 
      debounceTime: 1000,
      concurrency: 1 
    }
  );
  console.timeEnd('sequential');
  console.log('result:', sequentialData);
};

demo().catch(console.error);
