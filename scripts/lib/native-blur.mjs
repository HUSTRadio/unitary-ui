/** Quantify native blur on a known grayscale texture, away from text/radii.
 * Inputs are decoded RGBA images; no browser or image decoder is required here. */
export function nativeBlurMetrics(blurred, zero, restored, roi) {
  const images = [blurred, zero, restored];
  if (!images.every(image => image.width === zero.width && image.height === zero.height
    && image.data.length === image.width * image.height * 4)) throw Error("Mismatched native blur images");
  const { x, y, width, height } = roi;
  if (![x, y, width, height].every(Number.isInteger) || x < 0 || y < 0 || width < 4 || height < 4
    || x + width > zero.width || y + height > zero.height) throw Error("Invalid native blur ROI");
  const sums = [0, 0], squares = [0, 0];
  let changed = 0, unrestored = 0;
  const count = width * height;
  for (let row = y; row < y + height; row++) for (let column = x; column < x + width; column++) {
    const offset = (row * zero.width + column) * 4;
    for (let image = 0; image < 2; image++) {
      const bytes = images[image].data;
      const luma = .2126 * bytes[offset] + .7152 * bytes[offset + 1] + .0722 * bytes[offset + 2];
      sums[image] += luma; squares[image] += luma * luma;
    }
    const delta = Math.max(...[0, 1, 2, 3].map(channel => Math.abs(blurred.data[offset + channel] - zero.data[offset + channel])));
    const restoreDelta = Math.max(...[0, 1, 2, 3].map(channel => Math.abs(blurred.data[offset + channel] - restored.data[offset + channel])));
    if (delta > 2) changed++;
    if (restoreDelta > 2) unrestored++;
  }
  const variances = squares.map((square, index) => Math.max(0, square / count - (sums[index] / count) ** 2));
  const result = { roi, baselineVariance: variances[1], blurredVariance: variances[0],
    varianceRatio: variances[1] > 0 ? variances[0] / variances[1] : null,
    changedFraction: changed / count, unrestoredFraction: unrestored / count };
  // A blank baseline cannot prove sampling. Grayscale prevents saturation from
  // passing the oracle, and restoration rejects motion/paint timing artifacts.
  return { ...result, passed: result.baselineVariance >= 9 && result.varianceRatio !== null
    && result.varianceRatio <= .5 && result.changedFraction >= .2 && result.unrestoredFraction <= .01 };
}
