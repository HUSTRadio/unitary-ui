import { describe, expect, it } from "vitest";
import { nativeBlurMetrics } from "../scripts/lib/native-blur.mjs";

const roi = { x: 8, y: 8, width: 48, height: 32 };
function picture(pixel: (x: number, y: number) => number) {
  const width = 64, height = 48, data = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const offset = (y * width + x) * 4, value = pixel(x, y);
    data.set([value, value, value, 255], offset);
  }
  return { width, height, data };
}
const stripes = () => picture(x => x % 8 < 4 ? 40 : 220);
const blurred = () => picture(() => 130);

describe("native backdrop paint oracle", () => {
  it("accepts high-frequency attenuation with a reproducible restored image", () => {
    const result = nativeBlurMetrics(blurred(), stripes(), blurred(), roi);
    expect(result.passed).toBe(true);
    expect(result.varianceRatio).toBe(0);
    expect(result.changedFraction).toBe(1);
  });
  it("rejects a declared filter that paints the unchanged texture", () => {
    expect(nativeBlurMetrics(stripes(), stripes(), stripes(), roi).passed).toBe(false);
  });
  it("rejects uniform tint changes and a missing background control", () => {
    expect(nativeBlurMetrics(picture(x => x % 8 < 4 ? 60 : 240), stripes(), stripes(), roi).passed).toBe(false);
    expect(nativeBlurMetrics(blurred(), blurred(), blurred(), roi).passed).toBe(false);
  });
  it("rejects transient paint that does not restore", () => {
    expect(nativeBlurMetrics(blurred(), stripes(), picture(() => 160), roi).passed).toBe(false);
  });
  it("ignores changing outlines outside the interior ROI", () => {
    const outline = picture((x, y) => x < 4 || y < 4 ? 130 : x % 8 < 4 ? 40 : 220);
    expect(nativeBlurMetrics(outline, stripes(), outline, roi).passed).toBe(false);
  });
  it("requires comparable dimensions and an interior region", () => {
    expect(() => nativeBlurMetrics({ ...blurred(), width: 1 }, stripes(), blurred(), roi)).toThrow("Mismatched");
    expect(() => nativeBlurMetrics(blurred(), stripes(), blurred(), { ...roi, x: -1 })).toThrow("Invalid");
  });
});
