const {isPromise} = require('./util');

function mapSeries1(arr, iteratorFn) {
  const result = [];

  return arr
    .reduce((promise, item, currentIndex) => {
      return promise.then(() => iteratorFn(item, currentIndex)).then(data => result.push(data));
    }, Promise.resolve())
    .then(() => result);
}

function mapSeries2(arr, iteratorFn) {
  return new Promise((resolve, reject) => {
    const entries = arr.entries();
    const results = new Array(arr.length);

    const next = () => {
      const entry = entries.next();
      if (entry.done) {
        resolve(results);
        return;
      }
      const index = entry.value[0];
      // skip deleted items to preserve 'reduce' behaviour
      if (arr.hasOwnProperty(index)) {
        const result = iteratorFn(entry.value[1], index);
        if (isPromise(result)) {
          result.then(data => {
            results[index] = data;
            next();
          }, reject);
        } else {
          results[index] = result;
          next();
        }
      } else {
        next();
      }
    };
    next();
  });
}

module.exports = {
  mapSeries1,
  mapSeries2
};
