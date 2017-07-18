function eachSeries1(arr, iteratorFn) {
  return new Promise((resolve, reject) => {
    const entries = arr.entries();

    let next = () => {
      const entry = entries.next();
      if (entry.done) {
        return resolve();
      }

      const result = iteratorFn(entry.value[1], entry.value[0]);
      if (result instanceof Promise) {
        result.then(next, reject);
      } else {
        next();
      }
    };
    next();
  });
}

function eachSeries2(arr, iteratorFn) {
  const entries = arr.entries();
  const results = [];

  function pushResult(result) {
    results.push(result);
    return next();
  }

  function next() {
    const entry = entries.next();
    if (entry.done) {
      return results;
    }

    const result = iteratorFn(entry.value[1], entry.value[0]);
    if (result instanceof Promise) {
      return result.then(pushResult);
    }

    return pushResult(result);
  }

  return Promise.resolve().then(next);
}

function eachSeries3(arr, iteratorFn) {
  return arr.reduce((promise, item, currentIndex) => {
    return promise.then(() => iteratorFn(item, currentIndex));
  }, Promise.resolve());
}

function eachSeries4(arr, iteratorFn) {
  const iterator = (item, index) => {
    return () => iteratorFn(item, index);
  };
  const li = arr.length;

  let promise = Promise.resolve();
  for (let i=0; i<li; i++) {
    promise = promise.then(iterator(arr[i], i));
  }
  return promise;
}

module.exports = {
  eachSeries1,
  eachSeries2,
  eachSeries3,
  eachSeries4
};
