function deepClone(source: any, weakMap = new WeakMap()) {
  // null 的 typeof 值也是 'object'
  if (
    (typeof source === 'object' || typeof source === 'function') &&
    source !== null
  ) {
    // 检测是否为环
    if (weakMap.get(source)) {
      return weakMap.get(source);
    }
    const result = initResult(source);
    // 缓存对象，便于检测为环的情况
    weakMap.set(source, result);
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        result[key] = deepClone(source[key], weakMap);
      }
    }
    return result;
  } else {
    return source;
  }
}

enum ObjectType {
  BOOLEAN = '[object Boolean]',
  NUMBER = '[object Number]',
  STRING = '[object String]',
  SYMBOL = '[object Symbol]',
  ARRAY = '[object Array]',
  OBJECT = '[object Object]',
  ERROR = '[object Error]',
  DATE = '[object Date]',
  REGEXP = '[object RegExp]',
  SET = '[object Set]',
  MAP = '[object Map]'
}

function initResult(source: any) {
  switch (Object.prototype.toString.call(source)) {
    case ObjectType.BOOLEAN:
    case ObjectType.NUMBER:
    case ObjectType.STRING: {
      return new String();
    }
    case ObjectType.SYMBOL: {
      return Object(Symbol.prototype.valueOf.call(source));
    }
    case ObjectType.ARRAY: {
      return new Array();
    }
    case ObjectType.OBJECT: {
      return new Object();
    }
    case ObjectType.ERROR: {
      return new Error(source.message);
    }
    case ObjectType.DATE: {
      return new Date(source);
    }
    case ObjectType.REGEXP: {
      return new RegExp(source.source, source.flags);
    }
  }
}

export default deepClone;
