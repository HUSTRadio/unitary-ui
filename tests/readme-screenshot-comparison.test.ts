// @vitest-environment node
import { PNG } from "pngjs";
import { describe, expect, it } from "vitest";
import { screenshotsMatch } from "../scripts/lib/readme-screenshots.mjs";

function fixture({
  width = 20,
  height = 20,
  pixels = 0,
  delta = 0,
  alpha = 255,
  compression = 9,
} = {}) {
  const image = new PNG({ width, height });
  image.data.fill(255);
  for (let pixel = 0; pixel < pixels; pixel += 1) {
    const offset = pixel * 4;
    image.data[offset] -= delta;
    image.data[offset + 1] -= delta;
    image.data[offset + 2] -= delta;
    image.data[offset + 3] = alpha;
  }
  return PNG.sync.write(image, { deflateLevel: compression });
}

describe("README PNG comparison", () => {
  it("compares pixels rather than PNG compression bytes", () => {
    const expected = fixture({ compression: 0 });
    const actual = fixture({ compression: 9 });
    expect(expected.equals(actual)).toBe(false);
    expect(screenshotsMatch(expected, actual)).toBe(true);
  });

  it("accepts the observed 9-pixel corner noise and the 16-pixel limit", () => {
    expect(screenshotsMatch(fixture(), fixture({ pixels: 9, delta: 10 }))).toBe(true);
    expect(screenshotsMatch(fixture(), fixture({ pixels: 16, delta: 10 }))).toBe(true);
  });

  it("rejects larger areas, stronger color changes, alpha changes, dimensions, and invalid PNGs", () => {
    for (const actual of [
      fixture({ pixels: 17, delta: 1 }),
      fixture({ pixels: 1, delta: 11 }),
      fixture({ pixels: 1, alpha: 254 }),
      fixture({ width: 21 }),
      Buffer.from("invalid PNG"),
    ]) {
      expect(screenshotsMatch(fixture(), actual)).toBe(false);
    }
  });
});
