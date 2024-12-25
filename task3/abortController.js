
const asyncMap = async (array, callback, { debounceTime = 1000, concurrency = Infinity, signal = null } = {}) => {
  const startTime = Date.now();

const results = new Array(array.length);
  let currentIndex = 0;
  let aborted = false;

  const checkAborted = () => {
    if (signal?.aborted) {
      aborted = true;
      throw new Error('op cancelled');
    }
  }

  const processItem = async () => {
    while (currentIndex < array.length && !aborted) {
      checkAborted();
      const index = currentIndex++;
      try{
      results[index] = await callback(array[index], index, array);
    } catch (error) {
        if (error.name === 'AbortError' || signal?.aborted){
          aborted = true;
          throw new Error('op cancelled');
        }
        throw error;
    }
  }
};

try{
  checkAborted();
  
  const workers = Array(Math.min(concurrency, array.length))
  .fill()
  .map(() => processItem());

  await Promise.all(workers);

const executionTime = Date.now() - startTime;
if (executionTime < debounceTime) {
  await new Promise(resolve =>
    setTimeout(resolve, debounceTime - executionTime)
   );
  const abortPromise = new Promise ((_, reject) => {
    if (signal){
      signal.addEventListener('abort' , () => {
        reject(new Error('op cancelled durind debounce'));
      });
    }
});

  await Promise.race([timeoutPromise, abortPromise]);

return results;
} catch (error) {
  if (error.message.includes('cancelled')) {
    throw new Error('op cancelled');
  }
  throw error;
};

const demo = async () => {
  const numbers = [1,2,3,4,5];

  console.log('Test 1 default execution');
  const controller1 = new abortConroller();
  try{
  const result1 = await asyncMap(numbers, async (num) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return num*2;
  },
  { debounceTime: 1000,
  concurrency: 2,
  signal: controller1.signal
  }
);
  console.log('result', result1);
  } catch (error) {
    console.log('error', error.message
  }

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
