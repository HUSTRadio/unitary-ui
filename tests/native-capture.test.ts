import { describe, expect, it } from "vitest";
import { PNG } from "pngjs";
import { nativeCaptureOrigin, cropNativeSurface } from "../scripts/lib/native-capture.mjs";

const colors = [[253, 0, 101], [0, 251, 87], [19, 31, 249], [247, 197, 7]];
function calibrated(scale: number, phase = 0) {
  const image = new PNG({ width: 160, height: 120 });
  for (let y = 11; y < 11 + 4 * scale; y++) for (let x = 7; x < 7 + 32 * scale; x++)
    image.data.set([...colors[(Math.floor((x - 7) / (8 * scale)) + phase) % colors.length], 255], (y * image.width + x) * 4);
  return image;
}
describe("native display readback geometry", () => {
  for (const scale of [1, 2]) it(`locates the content origin at DPR${scale} and crops physical pixels`, () => {
    const image = calibrated(scale), origin = nativeCaptureOrigin(image);
    expect(origin).toEqual({ x: 7, y: 11, scale });
    const crop = cropNativeSurface(image, { x: 2, y: 2, width: 12, height: 10 }, origin);
    expect([crop.width, crop.height]).toEqual([12 * scale, 10 * scale]);
    expect([...crop.data.slice(0, 4)]).toEqual([...colors[0], 255]);
  });
  it("rejects missing calibration and clipped native surfaces", () => {
    expect(() => nativeCaptureOrigin(new PNG({ width: 160, height: 120 }))).toThrow("calibration");
    expect(() => cropNativeSurface(calibrated(2), { x: 100, y: 0, width: 100, height: 10 }, { x: 7, y: 11, scale: 2 })).toThrow("beyond");
  });
  it("requires the current presentation marker and rejects a stale compositor frame", () => {
    expect(nativeCaptureOrigin(calibrated(2, 1), 1)).toEqual({ x: 7, y: 11, scale: 2 });
    expect(() => nativeCaptureOrigin(calibrated(2), 1)).toThrow("calibration");
  });
});
