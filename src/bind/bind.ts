function BIND(thisArg) {
  // this 即调用 bind 的函数
  const thisFn = this;
  return function() {
    return thisFn.apply(thisArg);
  };
}

export default BIND;

Function.prototype.BIND = BIND;
