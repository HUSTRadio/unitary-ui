import { PNG } from "pngjs";

// Chromium 的圆角抗锯齿实测有 9 个灰度像素、最大 10/255 的采样差。
// Observed Chromium corner antialiasing varies in 9 pixels by at most 10/255.
export const SCREENSHOT_TOLERANCE = Object.freeze({ maxDifferingPixels: 16, maxChannelDelta: 10 });

export function screenshotsMatch(expectedBuffer, actualBuffer) {
  if (expectedBuffer.equals(actualBuffer)) return true;
  try {
    const expected = PNG.sync.read(expectedBuffer);
    const actual = PNG.sync.read(actualBuffer);
    if (expected.width !== actual.width || expected.height !== actual.height) return false;
    let differingPixels = 0;
    for (let offset = 0; offset < expected.data.length; offset += 4) {
      if (expected.data[offset + 3] !== actual.data[offset + 3]) return false;
      let differs = false;
      for (let channel = 0; channel < 3; channel += 1) {
        const delta = Math.abs(expected.data[offset + channel] - actual.data[offset + channel]);
        if (delta > SCREENSHOT_TOLERANCE.maxChannelDelta) return false;
        if (delta > 0) differs = true;
      }
      if (differs && ++differingPixels > SCREENSHOT_TOLERANCE.maxDifferingPixels) return false;
    }
    return true;
  } catch {
    return false;
  }
}
