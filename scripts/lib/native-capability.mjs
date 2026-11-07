import { PNG } from "pngjs";

import { captureNativeSurface } from "./native-capture.mjs";
import { nativeBlurMetrics } from "./native-blur.mjs";

/**
 * 原生模糊能力探测。
 *
 * 背景：`tests/native-glass/paint.e2e.ts` 用 X11 抓真实合成帧证明 backdrop-filter 生效。
 * 某些引擎/运行器组合（实测 WebKitGTK + Xvfb 软件合成）接受该属性、computed style 也解出
 * `blur(8px)`，但合成器不产出任何像素差异（varianceRatio = 1、changedFraction = 0）。
 * 这不是库的 CSS 缺陷，也不该让整条 native-paint 流水线永久红灯；但也不能用永久 skip
 * 掩盖一个可修缺陷。因此这里做三态判定，并且始终先证明「采集链路是活的」：
 *
 * - capture-broken：正对照（改不透明背景）都没让像素变化 → 采集取到陈旧帧，任何结论都不可信；
 * - blur：普通内联对照就产出模糊 → 引擎具备原生合成能力，测试必须照常跑；
 * - needs-compositing-hint：只有强制合成层才出模糊 → 这是可提示修复的缺陷，不得跳过；
 * - no-blur：两种构造都零输出且采集健康 → 运行器能力缺口，按引擎显式跳过并留证据。
 *
 * 阈值全部复用 native-blur 的判定，不在这里另立标准。
 */

const TEXTURE = "repeating-linear-gradient(90deg,#000 0 4px,#fff 4px 8px)";
const SURFACE = (extra) =>
  [
    "position:absolute",
    "left:20px",
    "top:20px",
    "width:240px",
    "height:100px",
    "background:rgb(255 255 255 / .2)",
    "backdrop-filter:blur(8px) saturate(1.6)",
    "-webkit-backdrop-filter:blur(8px) saturate(1.6)",
    extra,
  ]
    .filter(Boolean)
    .join(";");

/** 强制提升为独立合成层；用于区分「引擎不支持」与「元素未被提升」。 */
export const FORCED_LAYER = "transform:translateZ(0);will-change:transform,backdrop-filter";

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
}

async function stage(page, extra) {
  await page.setContent(
    `<body style="margin:0"><div style="position:absolute;inset:0;background:${TEXTURE}"></div><div id="capability" style="${SURFACE(extra)}"></div></body>`,
  );
  const node = page.locator("#capability");
  const box = await node.boundingBox();
  if (!box) throw new Error("Native capability surface has no visible bounds");
  return node;
}

async function capture(page, node) {
  await settle(page);
  return PNG.sync.read(await captureNativeSurface(page, node));
}

function roiFor(image, box) {
  const scale = image.width / box.width;
  return {
    x: Math.floor(24 * scale),
    y: Math.floor(8 * scale),
    width: Math.floor(Math.min(120 * scale, image.width - 48 * scale)),
    height: Math.floor(6 * scale),
  };
}

/** 与 paint.e2e.ts 的 compare() 同构：原始 / blur(0px) / 还原 三帧。 */
async function measure(page, extra) {
  const node = await stage(page, extra);
  const box = await node.boundingBox();
  const before = await capture(page, node);
  const roi = roiFor(before, box);
  const override = await page.addStyleTag({
    content:
      '#capability{backdrop-filter:blur(0px)!important;-webkit-backdrop-filter:blur(0px)!important}',
  });
  const zero = await capture(page, node);
  await override.evaluate((element) => element.parentNode?.removeChild(element));
  const restored = await capture(page, node);
  return nativeBlurMetrics(before, zero, restored, roi);
}

/**
 * 正对照：把同一 ROI 的表面改成不透明红。若像素几乎不变，说明抓到的不是当前帧，
 * 此时任何「没有模糊」的读数都不能归因于引擎能力。
 */
async function liveness(page) {
  const node = await stage(page, "");
  const box = await node.boundingBox();
  const before = await capture(page, node);
  const roi = roiFor(before, box);
  const override = await page.addStyleTag({
    content: "#capability{background:rgb(255 0 0)!important}",
  });
  const after = await capture(page, node);
  await override.evaluate((element) => element.parentNode?.removeChild(element));
  let changed = 0;
  for (let row = roi.y; row < roi.y + roi.height; row += 1) {
    for (let column = roi.x; column < roi.x + roi.width; column += 1) {
      const offset = (row * before.width + column) * 4;
      const delta = Math.max(
        ...[0, 1, 2].map((channel) => Math.abs(before.data[offset + channel] - after.data[offset + channel])),
      );
      if (delta >= 32) changed += 1;
    }
  }
  return { changedFraction: changed / (roi.width * roi.height) };
}

/**
 * @typedef {{ varianceRatio: number|null, changedFraction: number, passed: boolean }} BlurMetrics
 * @param {import("@playwright/test").Page} page
 * @returns {Promise<{state: "blur"|"no-blur"|"needs-compositing-hint"|"capture-broken", plain: BlurMetrics|null, forced: BlurMetrics|null, liveness: {changedFraction: number}}>}
 */
export async function probeNativeBlur(page) {
  const live = await liveness(page);
  const base = { plain: null, forced: null, liveness: live };
  if (live.changedFraction < 0.2) return { ...base, state: "capture-broken" };

  const plain = await measure(page, "");
  if (plain.passed) return { ...base, state: "blur", plain };

  const forced = await measure(page, FORCED_LAYER);
  if (forced.passed) return { ...base, state: "needs-compositing-hint", plain, forced };

  return { ...base, state: "no-blur", plain, forced };
}
