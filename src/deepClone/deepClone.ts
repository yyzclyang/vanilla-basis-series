function deepClone(source: any) {
  if (typeof source === 'object' && source !== null) {
    const result = {};
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        result[key] = deepClone(source[key]);
      }
    }
    return result;
  } else {
    return source;
  }
}

export default deepClone;
