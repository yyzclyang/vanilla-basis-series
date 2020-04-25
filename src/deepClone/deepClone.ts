function deepClone(source: any, weakMap = new WeakMap()) {
  if (typeof source === 'object' && source !== null) {
    // 检测是否为环
    if (weakMap.get(source)) {
      return weakMap.get(source);
    }
    const result = Array.isArray(source) ? [] : {};
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

export default deepClone;
