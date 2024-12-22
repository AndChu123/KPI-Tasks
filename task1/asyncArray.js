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
