/** Independent screen-space lens model. No scene/DOM pixels are read here. */
export interface GlassGeometry {
  width: number;
  height: number;
  radii: readonly [number, number, number, number];
  edge: number;
  refraction: number;
  ior: number;
  thickness: number;
}

export const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value));

/** Air-to-glass, unpolarized Fresnel; equal media have no reflecting interface. */
export function glassFresnel(cosIncident: number, ior: number): number {
  const eta = clamp(ior, 1, 2.5);
  if (eta === 1) return 0;
  const ci = clamp(cosIncident, 0, 1);
  const ct = Math.sqrt(Math.max(0, 1 - (1 - ci * ci) / (eta * eta)));
  const perpendicular = (ci - eta * ct) / (ci + eta * ct);
  const parallel = (eta * ci - ct) / (eta * ci + ct);
  return (perpendicular * perpendicular + parallel * parallel) / 2;
}

/** Signed distance to circular CSS corners, ordered TL, TR, BR, BL. */
export function glassDistance(x: number, y: number, g: GlassGeometry): number {
  const px = x - g.width / 2, py = y - g.height / 2;
  const r = g.radii[py < 0 ? (px < 0 ? 0 : 1) : (px < 0 ? 3 : 2)];
  const qx = Math.abs(px) - g.width / 2 + r;
  const qy = Math.abs(py) - g.height / 2 + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

/** Keep the active normal field outside the rounded contour's medial axis. */
export function glassRefractionWidth(g: GlassGeometry): number {
  return Math.max(0, Math.min(g.edge, Math.min(g.width, g.height) * 0.2, ...g.radii));
}

/** 均匀基材只按实际光程吸收。Uniform base transmission follows Beer–Lambert along the optical path. */
export function glassBodyOpacity(opacity: number, absorption: number, pathLength: number): number {
  return 1 - (1 - clamp(opacity, 0, 1)) * Math.exp(-clamp(absorption, 0, 1) * Math.max(0, pathLength));
}

/** Integrate a bounded, continuous Snell slope once per geometry, not per texel. */
export function createGlassSampler(g: GlassGeometry) {
  const edge = glassRefractionWidth(g);
  const thickness = clamp(g.thickness, 0, 4), eta = clamp(g.ior, 1, 2.5);
  const strength = clamp(g.refraction, 0, 24) * thickness, limit = edge * 0.75;
  const segments = 256, slopes = new Float64Array(segments + 1), integral = new Float64Array(segments + 1);
  if (edge > 0 && eta > 1 && strength > 0) {
    for (let i = 0; i <= segments; i++) {
      const t = i / segments, sine = t * t * (3 - 2 * t), derivative = 6 * t * (1 - t);
      const cosine = Math.sqrt(Math.max(0, 1 - sine * sine));
      const transmittedCosine = Math.sqrt(1 - sine * sine / (eta * eta));
      const bend = Math.tan(Math.asin(sine) - Math.asin(sine / eta));
      const angleSlope = (i === segments ? Math.sqrt(6) : derivative / Math.max(1e-12, cosine))
        - derivative / (eta * transmittedCosine);
      slopes[i] = clamp(strength * (1 + bend * bend) * angleSlope, 0, edge * 0.5);
      if (i > 0) integral[i] = integral[i - 1] + (slopes[i - 1] + slopes[i]) / (2 * segments);
    }
  }
  return (x: number, y: number) => {
    const distance = glassDistance(x, y, g);
    const t = edge > 0 ? clamp(1 + distance / edge, 0, 1) : 0;
    if (t === 0) return { distance, t, nx: 0, ny: 0, sinIncident: 0, normalZ: 1, pathLength: thickness, fresnel: glassFresnel(1, g.ior), dx: 0, dy: 0 };
    // Ease the arc normal into both the reading plane and the grazing outer rim.
    const sinIncident = t * t * (3 - 2 * t);
    const normalZ = Math.sqrt(Math.max(0, 1 - sinIncident * sinIncident));
    const sinTransmitted = sinIncident / eta;
    const cosTransmitted = Math.sqrt(Math.max(0, 1 - sinTransmitted * sinTransmitted));
    const segment = Math.min(segments - 1, Math.floor(t * segments)), local = t - segment / segments;
    // Linear slope interpolation and its exact integral give C1 displacement.
    const integrated = integral[segment] + slopes[segment] * local
      + 0.5 * (slopes[segment + 1] - slopes[segment]) * segments * local * local;
    // 先积分再软限幅，保持厚度/IOR 的单调响应。Soften after integration to retain monotonic optical inputs.
    const displacement = limit * Math.tanh(integrated / limit);
    // Analytic SDF gradient avoids finite-difference bias at straight/arc tangencies.
    const px = x - g.width / 2, py = y - g.height / 2;
    const radius = g.radii[py < 0 ? (px < 0 ? 0 : 1) : (px < 0 ? 3 : 2)];
    const qx = Math.abs(px) - g.width / 2 + radius, qy = Math.abs(py) - g.height / 2 + radius;
    const gx = Math.max(qx, 0), gy = Math.max(qy, 0), length = Math.hypot(gx, gy);
    const nx = length > 0 ? (gx === 0 ? 0 : Math.sign(px) * gx / length) : qx > qy ? Math.sign(px) : 0;
    const ny = length > 0 ? (gy === 0 ? 0 : Math.sign(py) * gy / length) : qx > qy ? 0 : Math.sign(py);
    const fresnel = glassFresnel(normalZ, g.ior);
    const pathLength = thickness / Math.max(0.0001, cosTransmitted);
    // SVG displacement maps specify source coordinates: a convex lens samples inward.
    return { distance, t, nx, ny, sinIncident, normalZ, pathLength, fresnel, dx: displacement === 0 || nx === 0 ? 0 : -nx * displacement, dy: displacement === 0 || ny === 0 ? 0 : -ny * displacement };
  };
}

export function glassSample(x: number, y: number, g: GlassGeometry) {
  return createGlassSampler(g)(x, y);
}

/** Reject quantized bilinear source maps that reverse orientation at any cell corner. */
export function glassMapPreservesOrientation(data: Uint8ClampedArray, width: number, height: number, scale: number, g: GlassGeometry): boolean {
  const stepX = g.width / width, stepY = g.height / height, unit = scale / 256;
  for (let y = 0; y < height - 1; y++) for (let x = 0; x < width - 1; x++) {
    const a = (y * width + x) * 4, b = a + 4, c = a + width * 4, d = c + 4;
    const tx = stepX + (data[b] - data[a]) * unit, ty = (data[b + 1] - data[a + 1]) * unit;
    const bx = stepX + (data[d] - data[c]) * unit, by = (data[d + 1] - data[c + 1]) * unit;
    const lx = (data[c] - data[a]) * unit, ly = stepY + (data[c + 1] - data[a + 1]) * unit;
    const rx = (data[d] - data[b]) * unit, ry = stepY + (data[d + 1] - data[b + 1]) * unit;
    if (!(tx * ly - ty * lx > 1e-8 && tx * ry - ty * rx > 1e-8
      && bx * ly - by * lx > 1e-8 && bx * ry - by * rx > 1e-8)) return false;
  }
  return true;
}

/** Fixed studio-light elevation; existing azimuth and roughness tokens remain authoritative. */
export function glassEdgeLighting(ior: number, roughness: number, azimuth: number) {
  const lx = Math.sin(azimuth), ly = -Math.cos(azimuth);
  const elevation = Math.SQRT1_2;
  const halfSin = Math.sin(Math.PI / 8), halfCos = Math.cos(Math.PI / 8);
  const alpha = clamp(roughness, 0.08, 1), a2 = alpha * alpha;
  const halfFresnel = glassFresnel(halfCos, ior);
  const smith = (cosine: number) => 2 * cosine / (cosine + Math.sqrt(a2 + (1 - a2) * cosine * cosine));
  return (s: ReturnType<typeof glassSample>) => {
    const direction = s.nx * lx + s.ny * ly;
    const nl = Math.max(0, (s.sinIncident * direction + s.normalZ) * elevation);
    const nh = Math.max(0, s.sinIncident * direction * halfSin + s.normalZ * halfCos);
    const denominator = 1 + (a2 - 1) * nh * nh;
    const distribution = a2 / (Math.PI * denominator * denominator);
    // Smith G1(view)/N·V has a finite limit at the grazing edge.
    const visible = 2 / (s.normalZ + Math.sqrt(a2 + (1 - a2) * s.normalZ * s.normalZ));
    const specular = halfFresnel * distribution * visible * smith(nl) / 4;
    return {
      key: clamp(specular, 0, 1),
      environment: s.fresnel,
    };
  };
}

/** Longest dimension is bounded independently of DPR. */
export function glassMapSize(width: number, height: number) {
  const ratio = Math.min(1, 1024 / Math.max(width, height));
  return { width: Math.max(1, Math.ceil(width * ratio)), height: Math.max(1, Math.ceil(height * ratio)) };
}
