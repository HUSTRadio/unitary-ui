// Tremor Raw · getYAxisDomain [v0.0.0] / hasOnlyOneValueForKey [v0.1.0] —— 源码内置自
// github.com/tremorlabs/tremor（Apache-2.0，© Tremor contributors）
// 本地适配：合并为单一 chart-utils 模块；去除 any，逻辑与上游保持一致。

export const getYAxisDomain = (
  autoMinValue: boolean,
  minValue: number | undefined,
  maxValue: number | undefined,
) => {
  const minDomain = autoMinValue ? "auto" : (minValue ?? 0)
  const maxDomain = maxValue ?? "auto"
  return [minDomain, maxDomain]
}

export function hasOnlyOneValueForKey(
  array: Array<Record<string, unknown>>,
  keyToCheck: string,
): boolean {
  let count = 0

  for (const obj of array) {
    if (Object.prototype.hasOwnProperty.call(obj, keyToCheck)) {
      count += 1
      if (count > 1) {
        return false
      }
    }
  }

  return true
}
