function BIND(thisArg: any, ...argArray: any[]) {
  // this 即调用 bind 的函数
  const thisFn = this;
  return function() {
    return thisFn.apply(thisArg, argArray);
  };
}

export default BIND;

Function.prototype.BIND = BIND;
