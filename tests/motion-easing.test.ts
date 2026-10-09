import { describe, expect, it } from "vitest";
import { cubicProgress, isNonlinearCubic, milliseconds, parseEasing } from "../src/lib/motion-easing";
import { MOTION_EASINGS } from "../src/lib/motion-easing-defaults";

describe("nonlinear motion curves", () => {
  it("keeps every canonical curve bounded and monotonic with exact endpoints", () => {
    for (const curve of Object.values(MOTION_EASINGS)) {
      expect(isNonlinearCubic(curve)).toBe(true);
      expect(cubicProgress(-1, curve)).toBe(0);
      expect(cubicProgress(2, curve)).toBe(1);
      let previous = 0;
      for (let index = 0; index <= 100; index += 1) {
        const result = cubicProgress(index / 100, curve);
        expect(result).toBeGreaterThanOrEqual(previous);
        expect(result).toBeLessThanOrEqual(1);
        previous = result;
      }
    }
  });
  it("solves the time axis and separates response, smooth motion and exit", () => {
    const response = MOTION_EASINGS["--ease-snap"];
    const smooth = MOTION_EASINGS["--ease-in-out"];
    const exit = MOTION_EASINGS["--ease-in"];
    expect(cubicProgress(0.2, response)).toBeGreaterThan(0.6);
    expect(cubicProgress(0.2, smooth)).toBeLessThan(0.1);
    expect(cubicProgress(0.2, exit)).toBeLessThan(0.1);
    expect(cubicProgress(0.5, smooth)).toBeCloseTo(0.5, 5);
    expect(cubicProgress(0.8, smooth)).toBeCloseTo(1 - cubicProgress(0.2, smooth), 5);
    expect(cubicProgress(0.5, response)).toBeGreaterThan(0.9);
  });
  it("rejects constant-speed and invalid curves while accepting CSS keywords and authored overshoot", () => {
    for (const value of ["linear", "linear(0,1)", "cubic-bezier(0,0,1,1)", "cubic-bezier(.2,.2,.8,.8)", "cubic-bezier(0,,1,1)", "cubic-bezier(2,0,1,1)", "cubic-bezier(0,NaN,1,1)", "cubic-bezier(0x0,0,.58,1)", "cubic-bezier(0b0,0,.58,1)"]) {
      expect(parseEasing(value)).toBeNull();
    }
    expect(parseEasing(" ease-in-out ")).toEqual([0.42, 0, 0.58, 1]);
    expect(parseEasing("cubic-bezier(.2,0,.3,1.1)")).toEqual([0.2, 0, 0.3, 1.1]);
    expect(isNonlinearCubic([0, , 1, ,] as unknown as number[])).toBe(false);
    expect(parseEasing("CUBIC-BEZIER(+2e-1,0,.3,1.1)")).toEqual([0.2, 0, 0.3, 1.1]);
  });
  it("converts valid CSS units without inventing a numeric fallback", () => {
    expect(milliseconds(".25s")).toBe(250);
    expect(milliseconds(" 80ms ")).toBe(80);
    for (const value of ["0s", "-2ms", "10", "NaNs", "Infinitys", ""]) expect(milliseconds(value)).toBe(0);
  });
});
