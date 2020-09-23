function BIND(thisArg: any, ...argArray: any[]) {
  // this 即调用 bind 的函数
  const thisFn = this;
  if (typeof thisFn !== 'function') {
    throw new TypeError('bind 不能被非函数调用');
  }
  return function(...argArray2: any[]) {
    return thisFn.apply(thisArg, argArray.concat(argArray2));
  };
}

export default BIND;

Function.prototype.BIND = BIND;
