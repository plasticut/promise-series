function isPromise(obj) {
  return !!obj && (obj instanceof Promise || (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function');
}

module.exports = {
  isPromise
};
