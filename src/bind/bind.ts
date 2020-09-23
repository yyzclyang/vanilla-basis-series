function BIND(thisArg: any, ...argArray: any[]) {
  // this 即调用 bind 的函数
  const thisFn = this;
  return function(...argArray2: any[]) {
    return thisFn.apply(thisArg, argArray.concat(argArray2));
  };
}

export default BIND;

Function.prototype.BIND = BIND;
