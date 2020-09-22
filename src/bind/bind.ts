function BIND(thisArg) {
  return function() {};
}

export default BIND;

Function.prototype.BIND = BIND;
