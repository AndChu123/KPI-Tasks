const asyncMap = (array, callback, debounceTime = 1000) => {
  const startTime = Date.now();

  return Promise.all(
    array.map((item, index, array) => 
      callback(item, index, array)
  )
).then((results) => {
const executionTime = Date.now() - startTime;
if (executionTime < debounceTime) {
  return new Promise(resolve =>
    setTimeout(() => resolve(results), debounceTime - executionTime)
  );
}
return results;
});
};

const demo = async () => {
  const numbers = [1,2,3,4,5];

  console.log('Test 1');
  asyncMap(numbers, async (num) => {
    return new Promise(resolve => setTimeout(resolve(num * 2), 100));;
  }).then((multipliedNumbers) => {
  console.log('result', multipliedNumbers);

  console.log('\nTest with debounce')
  console.time('debounceTest');
  return asyncMap(numbers, async (num) => {
    return Promise.resolve(`Processed ${num}`);
  }, 2000);
  }).then((processedData) => {
  console.timeEnd('debounceTest');
  console.log('result', processedData);
  })
};

demo().catch(console.error);
