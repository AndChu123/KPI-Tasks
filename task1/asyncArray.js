const asyncMap = async (array, callback, debounceTime = 1000) => {
  const startTime = Date.now();

  const results = await Promise.all(
    array.map(async (item, index, array) => {
      const result = await callback(item, indexm array);
      return result;
    })
  );

  return results;
};
