const asyncMap = async (array, callback, debounceTime = 1000) => {
  const startTime = Date.now();

  const results = await Promise.all(
    array.map(async (item, index, array) => {
      const result = await callback(item, index, array);
      return result;
    })
  );

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

  console.log('\nTest with debounce')l
  console.time('debounceTest');
  const processedData = await asyncMap(numbers, async (num) => {
    return 'Processed ${num}';
  }, 2000);

  console.timeEnd('debounceTest');
  console.log('result', processedData);
};
