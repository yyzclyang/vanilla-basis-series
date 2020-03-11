class PROMISE {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError(`Promise resolver ${executor} is not a function`);
    }
    executor();
  }
  then() {}
}

export default PROMISE;
