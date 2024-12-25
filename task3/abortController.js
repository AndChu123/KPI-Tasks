
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
  const timeoutPromise = new Promise(resolve =>
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

  console.log('\nTest 2 cancel during execution')
  const controller2 = new abortController();
  setTimeout(() => controller2.abort(), 150);
  try{
  const result2 = await asyncMap(numbers, async (num) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return num * 2;
  }, 
{
 debounceTime: 2000,
 concurrency: 2,
  signal: controller2.signal
}
    );
    console.log('result', result2);
  } catch (error) {
    console.log('error', error.message);
  }

    console.log('\nTest 3 cancel during debounce');
  const controller3 = new abortController();
  setTimeout(() => controller3.abort(), 1100);
  try{
  const result3 = await asyncMap(numbers, async (num) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return num * 2;
    },
    { 
      debounceTime: 1000,
      concurrency: infinity,
      signal: controller3.signal
    }
  );
    console.log('result', result3);
  } catch (error) {
    console.log('error', error.message);
  }
};

demo().catch(console.error);
