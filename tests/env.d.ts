/**
 * Vitest 测试环境的全局类型补充。
 *
 * React 的 `act()` 通过 `globalThis.IS_REACT_ACT_ENVIRONMENT` 判断是否需要
 * 以测试模式运行；React 官方类型没有声明这个全局变量，因此测试文件里直接赋值
 * 会触发 TS7017（`typeof globalThis` 没有索引签名）。
 *
 * 在这里声明一次，避免在数十个测试文件里重复使用类型断言。
 */
declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

export {};
