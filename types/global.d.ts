declare global {
  interface Function {
    BIND(this: Function, thisArg: any, ...argArray: any[]): any;
  }
}

export {};
