function BIND(thisArg: any, ...argArray: any[]) {
  // this 即调用 bind 的函数
  const thisFn = this;
  if (typeof thisFn !== 'function') {
    throw new TypeError('bind 不能被非函数调用');
  }
  function boundFn(...argArray2: any[]) {
    // 如果 boundFn.prototype 在 this 的原型链上面，说明是用 new 调用的
    return thisFn.apply(
      boundFn.prototype.isPrototypeOf(this) ? this : thisArg,
      argArray.concat(argArray2)
    );
  }

  return boundFn;
}

export default BIND;

Function.prototype.BIND = BIND;
