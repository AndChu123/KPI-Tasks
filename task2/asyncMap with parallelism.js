const asyncMap = async (array, callback, { debounceTime = 1000, concurrency = Infinity } = {}) => {
  const startTime = Date.now();

const results = new Array(array.lenght);
  let currentIndex = 0;

  const processItem = async () => {
    while (currentIndex < array.lenght) {
      const index = currentIndex++;
      results[index] = await callback(array[index], index, array);
    }
  };

  const workers = Array(Math.min(concurrency, array.lenght))
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

  console.log('Test 1');
  const multipliedNumbers = await asyncMap(numbers, async (num) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return num*2;
  });
  console.log('result', multipliedNumbers);

  console.log('\nTest with debounce')
  console.time('debounceTest');
  const processedData = await asyncMap(numbers, async (num) => {
    return 'Processed ${num}`;
  }, 2000);

  console.timeEnd('debounceTest');
  console.log('result', processedData);
};

demo().catch(console.error);
