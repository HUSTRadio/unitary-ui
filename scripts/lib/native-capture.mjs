import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";

const run = promisify(execFile);
const colors = [[253, 0, 101], [0, 251, 87], [19, 31, 249], [247, 197, 7]];
export class NativeCaptureError extends Error {
  constructor(message, display) { super(message); this.display = display; }
}
export function nativeCaptureOrigin(image, phase = 0) {
  const matches = (x, y, color) => x < image.width && colors[(color + phase) % colors.length].every((channel, index) => Math.abs(image.data[(y * image.width + x) * 4 + index] - channel) <= 1);
  for (let y = 0; y < image.height; y++) for (let x = 0; x < image.width - 32; x++) {
    if (!matches(x, y, 0)) continue;
    let length = 0; while (matches(x + length, y, 0)) length++;
    const scale = length / 8;
    if ([1, 2].includes(scale) && [1, 2, 3].every(color => matches(x + color * length + 2 * scale, y, color))) return { x, y, scale };
    x += Math.max(0, length - 1);
  }
  throw Error("Virtual display calibration is missing; native paint evidence is incomplete");
}

export function cropNativeSurface(image, bounds, origin) {
  const x = origin.x + Math.round(bounds.x * origin.scale), y = origin.y + Math.round(bounds.y * origin.scale);
  const width = Math.round(bounds.width * origin.scale), height = Math.round(bounds.height * origin.scale);
  if (x < 0 || y < 0 || width < 1 || height < 1 || x + width > image.width || y + height > image.height)
    throw Error("Surface extends beyond the virtual display");
  const cropped = new PNG({ width, height });
  PNG.bitblt(image, cropped, x, y, width, height, 0, 0);
  return cropped;
}

export async function captureNativeSurface(page, surface) {
  if (process.env.UNITARY_NATIVE_GLASS_XVFB !== "1") return surface.screenshot();
  if (process.platform !== "linux") throw Error("Xvfb capture requires Linux");
  const phase = await page.evaluate(colors => {
    let marker = document.querySelector("[data-native-display-calibration]");
    if (!marker) {
      marker = document.createElement("div"); marker.setAttribute("data-native-display-calibration", "0");
      marker.setAttribute("aria-hidden", "true");
      marker.style.cssText = "all:initial;position:fixed!important;left:0!important;top:0!important;width:32px!important;height:4px!important;z-index:2147483647!important;pointer-events:none!important";
      document.body.append(marker);
    }
    const phase = (Number(marker.getAttribute("data-native-display-calibration")) + 1) % colors.length;
    marker.setAttribute("data-native-display-calibration", String(phase));
    const stops = colors.map((_, index) => `rgb(${colors[(index + phase) % colors.length].join(" ")}) ${index * 8}px ${(index + 1) * 8}px`);
    marker.style.setProperty("background", `linear-gradient(90deg,${stops.join(",")})`, "important");
    return phase;
  }, colors);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const bounds = await surface.boundingBox();
  if (!bounds) throw Error("Native surface has no visible bounds");
  let display, lastError;
  const started = Date.now();
  // DOM RAF does not prove that a separate compositor has presented the frame.
  // Wait for this capture's new marker phase, retaining the last display on failure.
  while (Date.now() - started < 10_000) {
    const { stdout } = await run("python3", [fileURLToPath(new URL("../capture-x11.py", import.meta.url))], { encoding: "buffer", maxBuffer: 32 * 1024 * 1024 });
    display = stdout;
    let image, origin;
    try { image = PNG.sync.read(stdout); origin = nativeCaptureOrigin(image, phase); }
    catch (error) { lastError = error; await page.waitForTimeout(16); continue; }
    const dpr = await page.evaluate(() => devicePixelRatio);
    if (origin.scale !== dpr) throw new NativeCaptureError(`Requested DPR${dpr} does not match native display scale ${origin.scale}`, display);
    try { return PNG.sync.write(cropNativeSurface(image, bounds, origin)); }
    catch (error) { throw new NativeCaptureError(String(error), display); }
  }
  throw new NativeCaptureError(String(lastError), display);
}
