import { describe, expect, test } from "vitest";
import { createGlassSampler, glassBodyOpacity, glassDistance, glassEdgeLighting, glassFresnel, glassMapPreservesOrientation, glassMapSize, glassRefractionWidth, glassSample, type GlassGeometry } from "../src/lib/glass-optics";

const geometry: GlassGeometry = { width: 320, height: 180, radii: [24, 24, 24, 24], edge: 12, refraction: 8, ior: 1.5, thickness: 1 };
describe("screen-space glass lens", () => {
  test("keeps the flat center exactly stationary", () => {
    for (const [x, y] of [[160, 90], [80, 60], [250, 120]]) {
      const sample = glassSample(x, y, geometry);
      expect(sample.dx).toBe(0); expect(sample.dy).toBe(0);
    }
  });
  test("samples inward symmetrically for a convex lens", () => {
    const left = glassSample(1, 90, geometry), right = glassSample(319, 90, geometry);
    expect(left.dx).toBeGreaterThan(2); expect(right.dx).toBeLessThan(-2);
    expect(left.dx).toBeCloseTo(-right.dx); expect(left.dy).toBe(0);
    expect(glassSample(160, 1, geometry).dy).toBeGreaterThan(2);
  });
  test("IOR, thickness and zero refraction change the physical displacement", () => {
    const sample = (patch: Partial<GlassGeometry>) => Math.abs(glassSample(4, 90, { ...geometry, ...patch }).dx);
    expect(sample({ ior: 1 })).toBeCloseTo(0);
    expect(sample({ thickness: 0 })).toBe(0); expect(sample({ refraction: 0 })).toBe(0);
    expect(sample({ ior: 1.8 })).toBeGreaterThan(sample({ ior: 1.2 }));
    expect(sample({ thickness: 1 })).toBeGreaterThan(sample({ thickness: 0.5 }));
  });
  test("joins the center continuously, bounds small controls and honors individual corners", () => {
    expect(Math.abs(glassSample(11.99, 90, geometry).dx)).toBeLessThan(0.001);
    const small = { ...geometry, width: 32, height: 20, refraction: 200, thickness: 4 };
    expect(Math.abs(glassSample(1, 10, small).dx)).toBeLessThanOrEqual(3);
    const asymmetric = { ...geometry, radii: [0, 24, 24, 0] as const };
    expect(glassDistance(0, 0, asymmetric)).toBe(0);
    expect(glassDistance(320, 0, asymmetric)).toBeGreaterThan(0);
  });
  test("caps map resolution while preserving aspect ratio", () => {
    expect(glassMapSize(320, 180)).toEqual({ width: 320, height: 180 });
    expect(glassMapSize(4096, 2048)).toEqual({ width: 1024, height: 512 });
  });
  test("roughness broadens GGX highlights in normal space", () => {
    const sample = (angle: number) => ({ ...glassSample(319, 90, geometry), nx: 0, ny: -1, sinIncident: Math.sin(angle), normalZ: Math.cos(angle) });
    const polished = glassEdgeLighting(1.5, 0.1, 0), rough = glassEdgeLighting(1.5, 0.9, 0);
    expect(polished(sample(Math.PI / 8)).key).toBeGreaterThan(rough(sample(Math.PI / 8)).key);
    expect(rough(sample(Math.PI / 3)).key).toBeGreaterThan(polished(sample(Math.PI / 3)).key);
  });
  test("dielectric Fresnel matches normal, oblique and grazing incidence", () => {
    expect(glassFresnel(1, 1.5)).toBeCloseTo(0.04, 8);
    expect(glassFresnel(0.5, 1.5)).toBeCloseTo(0.0891867, 6);
    expect(glassFresnel(0, 1.5)).toBe(1);
    for (const cosine of [0, 0.001, 0.5, 1]) expect(glassFresnel(cosine, 1)).toBe(0);
  });
  test("the bevel reaches grazing incidence and increases the internal optical path", () => {
    const rim = glassSample(0, 90, geometry), shoulder = glassSample(5, 90, geometry);
    expect(rim.normalZ).toBe(0); expect(rim.fresnel).toBe(1);
    expect(rim.pathLength).toBeGreaterThan(shoulder.pathLength);
    expect(shoulder.pathLength).toBeGreaterThan(geometry.thickness);
    for (const x of [0, 1, 4, 8, 12]) {
      const sample = glassSample(x, 90, geometry);
      expect(sample.sinIncident ** 2 + sample.normalZ ** 2).toBeCloseTo(1, 10);
    }
  });
  test("soft displacement limiting preserves variation at a strongly refracting rim", () => {
    const strong = { ...geometry, refraction: 24 };
    const outer = Math.abs(glassSample(0.5, 90, strong).dx);
    const inner = Math.abs(glassSample(1.5, 90, strong).dx);
    expect(outer).toBeGreaterThan(inner + 0.01);
    expect(outer).toBeLessThan(geometry.edge * 0.75);
  });
  test("corner rays rotate continuously while retaining the same bevel depth", () => {
    const straight = glassSample(319, 90, geometry);
    for (const angle of [-Math.PI / 2, -Math.PI / 4, 0]) {
      const sample = glassSample(296 + 23 * Math.cos(angle), 24 + 23 * Math.sin(angle), geometry);
      expect(sample.fresnel).toBeCloseTo(straight.fresnel, 8);
      expect(Math.hypot(sample.dx, sample.dy)).toBeCloseTo(Math.abs(straight.dx), 8);
      expect(sample.nx).toBeCloseTo(Math.cos(angle), 8);
      expect(sample.ny).toBeCloseTo(Math.sin(angle), 8);
    }
    const before = glassSample(295.99, 1, geometry), after = glassSample(296.01, 1, geometry);
    expect(Math.hypot(before.dx - after.dx, before.dy - after.dy)).toBeLessThan(0.01);
    const lighting = glassEdgeLighting(1.5, 0.18, 0);
    expect(Math.abs(lighting(before).key - lighting(after).key)).toBeLessThan(0.01);
  });
  test("edge light follows azimuth while equal media have no residual glint", () => {
    const left = glassSample(0.5, 90, geometry), right = glassSample(319.5, 90, geometry);
    const light = glassEdgeLighting(1.5, 0.18, -Math.PI / 2);
    const reverse = glassEdgeLighting(1.5, 0.18, Math.PI / 2);
    expect(light(left).key).toBeGreaterThan(light(right).key);
    expect(reverse(right).key).toBeCloseTo(light(left).key, 8);
    expect(light(left).environment).toBe(light(right).environment);
    expect(glassEdgeLighting(1, 0.18, 0)(glassSample(0, 90, { ...geometry, ior: 1 }))).toEqual({ key: 0, environment: 0 });
    for (const roughness of [0, 0.18, 1]) for (const x of [0, 0.001, 0.5, 5, 12]) {
      const result = glassEdgeLighting(1.5, roughness, Math.PI)(glassSample(x, 90, geometry));
      for (const value of Object.values(result)) { expect(Number.isFinite(value)).toBe(true); expect(value).toBeGreaterThanOrEqual(0); expect(value).toBeLessThanOrEqual(1); }
    }
  });
  test("small corners stop the normal field before its medial-axis seam", () => {
    const small = { ...geometry, radii: [6, 6, 6, 6] as const };
    expect(glassRefractionWidth(small)).toBe(6);
    const sample = createGlassSampler(small);
    const a = sample(313.99, 173.98), b = sample(313.98, 173.99);
    expect(Math.hypot(a.dx - b.dx, a.dy - b.dy)).toBeLessThan(0.001);
    expect(sample(314, 174).dx).toBe(0); expect(sample(314, 174).dy).toBe(0);
    expect(glassRefractionWidth({ ...small, radii: [0, 6, 6, 6] })).toBe(0);
  });
  test("the source mapping keeps both principal derivatives above one half", () => {
    for (const patch of [
      {}, { radii: [6, 6, 6, 6] as const }, { radii: [4, 8, 12, 20] as const, refraction: 24, thickness: 4 },
      { width: 32, height: 20, radii: [3, 3, 3, 3] as const, refraction: 24, thickness: 4 },
    ]) {
      const g = { ...geometry, ...patch }, sample = createGlassSampler(g), e = glassRefractionWidth(g);
      for (let depth = 0.01; depth < e; depth += 0.031) {
        const x = g.width - depth, y = g.height / 2, epsilon = 0.00001;
        const derivative = 1 + (sample(x + epsilon, y).dx - sample(x - epsilon, y).dx) / (2 * epsilon);
        expect(derivative).toBeGreaterThanOrEqual(0.5 - 1e-6);
        const radius = g.radii[1], angle = -Math.PI / 4;
        const corner = sample(g.width - radius + (radius - depth) * Math.cos(angle), radius + (radius - depth) * Math.sin(angle));
        expect(1 - Math.hypot(corner.dx, corner.dy) / (radius - depth)).toBeGreaterThanOrEqual(0.5 - 1e-6);
      }
    }
  });
  test("the integrated curve has continuous slopes at every lookup boundary", () => {
    const sample = createGlassSampler(geometry), epsilon = 1e-5;
    for (let i = 1; i < 256; i++) {
      const x = geometry.width - geometry.edge * (1 - i / 256), y = geometry.height / 2;
      const at = sample(x, y).dx;
      const left = (at - sample(x - epsilon, y).dx) / epsilon;
      const right = (sample(x + epsilon, y).dx - at) / epsilon;
      expect(Math.abs(left - right)).toBeLessThan(0.0001);
    }
  });
  test("uniform body tint changes only with the refracted absorption path", () => {
    for (const opacity of [0, 0.52, 0.62, 0.68, 1]) for (const path of [0, 1, 1.34, 4]) {
      expect(glassBodyOpacity(opacity, 0, path)).toBeCloseTo(opacity, 12);
    }
    const center = glassSample(160, 90, geometry), rim = glassSample(0, 90, geometry);
    expect(glassBodyOpacity(0.52, 0.08, center.pathLength)).toBeCloseTo(1 - 0.48 * Math.exp(-0.08), 12);
    expect(glassBodyOpacity(0.52, 0.08, rim.pathLength)).toBeGreaterThan(glassBodyOpacity(0.52, 0.08, center.pathLength));
  });
  test("lighting is independent of distance masks when the surface normal is unchanged", () => {
    const light = glassEdgeLighting(1.5, 0.18, 0), s = glassSample(319, 90, geometry);
    expect(light({ ...s, distance: -12, t: 0 })).toEqual(light({ ...s, distance: 0, t: 1 }));
    const flat = glassSample(160, 90, geometry);
    expect(light(flat).environment).toBeCloseTo(0.04, 12);
    expect(light(glassSample(0, 90, geometry)).environment).toBe(1);
  });
  test("quantized maps preserve orientation and reject reversed source cells", () => {
    const g = { ...geometry, width: 80, height: 40, radii: [6, 6, 6, 6] as const };
    const size = glassMapSize(g.width, g.height), sample = createGlassSampler(g), scale = glassRefractionWidth(g) * 1.5;
    const data = new Uint8ClampedArray(size.width * size.height * 4);
    for (let y = 0; y < size.height; y++) for (let x = 0; x < size.width; x++) {
      const s = sample(x + 0.5, y + 0.5), i = (y * size.width + x) * 4;
      data[i] = Math.round((s.dx / scale + 0.5) * 256); data[i + 1] = Math.round((s.dy / scale + 0.5) * 256);
    }
    expect(glassMapPreservesOrientation(data, size.width, size.height, scale, g)).toBe(true);
    const i = (20 * size.width + 40) * 4;
    data[i] = 255; data[i + 4] = 0;
    expect(glassMapPreservesOrientation(data, size.width, size.height, scale, g)).toBe(false);
  });
  test("stronger thickness, IOR and refraction never reverse the optical response", () => {
    for (const radius of [6, 24]) for (const depth of [0, 1, 3, 5]) {
      for (const [key, values] of [
        ["thickness", [0, 0.25, 0.5, 1, 2, 3, 4]],
        ["ior", [1, 1.1, 1.2, 1.5, 2, 2.5]],
        ["refraction", [0, 2, 4, 8, 16, 24]],
      ] as const) {
        let previous = 0;
        for (const value of values) {
          const sample = glassSample(geometry.width - depth, geometry.height / 2, { ...geometry, radii: [radius, radius, radius, radius], [key]: value });
          const displacement = Math.hypot(sample.dx, sample.dy);
          expect(displacement).toBeGreaterThanOrEqual(previous - 1e-9); previous = displacement;
        }
      }
    }
  });
});
