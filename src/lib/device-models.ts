/**
 * DeviceModel 注册表（item 19）。
 *
 * Phone 硬编码「iPhone 17」→ 通用 `<Device model="…">` 的数据源。
 * 数据逐台实测自 react-mockframe@1.1.0：
 * - contentWidth/Height/colors/hasLandscape 来自 dist/index.js 的 defineDevice 注册表；
 * - bezel 来自 dist/styles/mockframe-*.css 的 .mockframe.<device> padding。
 *
 * 首批设备只收录 **对称 bezel** 的设备（`bezel: number` 单值模型成立）：
 * - iPhone 17（padding 12px）、Pixel 10（12px）、Galaxy S25（10px）、iPad Pro（18px）。
 * - iPad Mini（90px/25px 不对称）、MacBook Pro / 2020（24/44/76 不对称）在单值 bezel
 *   模型下无法精确表达，按 shard-D「未实测的不进注册表」规则**缓入 Phase 2**（需扩展
 *   为 per-side bezel 模型后再注册）。
 *
 * chrome 能力掩码：status-bar / safari / notch 为 iOS 专属语义（phone-chrome.tsx），
 * Android/平板设备无对应概念，chrome 为空集；类型层通过掩码约束相关 prop 为 never。
 */

/** 设备标识（react-mockframe 支持集 ∩ 对称 bezel 实测集） */
export type DeviceModelId =
  | "iphone-17"
  | "pixel-10"
  | "galaxy-s25"
  | "ipad-pro";

/** iOS 专属 chrome 能力（phone-chrome.tsx 语义） */
export type DeviceChromeCapability = "status-bar" | "safari" | "notch";

export interface DeviceModelDef {
  id: DeviceModelId;
  /** react-mockframe device 名（defineDevice 键） */
  label: string;
  /** 分包 CSS（按需静态引入，避免全量 mockframe.css） */
  cssBundle: "iphones" | "android" | "tablets" | "laptops";
  /** 内容区宽高（不含外框） */
  contentWidth: number;
  contentHeight: number;
  /** 外框 padding（对称设备单值；CSS .mockframe.<device> padding 实测） */
  bezel: number;
  /** 机身颜色（defineDevice colors，DeviceColor 类型的数据源） */
  colors: readonly string[];
  /** 是否支持横屏 */
  landscape: boolean;
  /** chrome 能力掩码（非 iOS 设备为空集） */
  chrome: ReadonlySet<DeviceChromeCapability>;
}

export const DEVICE_MODELS: Record<DeviceModelId, DeviceModelDef> = {
  "iphone-17": {
    id: "iphone-17",
    label: "iPhone 17",
    cssBundle: "iphones",
    contentWidth: 393,
    contentHeight: 852,
    bezel: 12,
    colors: ["black", "white", "mist-blue", "sage", "lavender", "cosmic-orange", "deep-blue"],
    landscape: true,
    chrome: new Set(["status-bar", "safari", "notch"]),
  },
  "pixel-10": {
    id: "pixel-10",
    label: "Pixel 10",
    cssBundle: "android",
    contentWidth: 412,
    contentHeight: 915,
    bezel: 12,
    colors: ["obsidian", "porcelain", "mint", "rose"],
    landscape: true,
    chrome: new Set(),
  },
  "galaxy-s25": {
    id: "galaxy-s25",
    label: "Galaxy S25",
    cssBundle: "android",
    contentWidth: 412,
    contentHeight: 892,
    bezel: 10,
    colors: ["phantom-black", "icy-blue", "navy", "silver", "mint"],
    landscape: true,
    chrome: new Set(),
  },
  "ipad-pro": {
    id: "ipad-pro",
    label: "iPad Pro",
    cssBundle: "tablets",
    contentWidth: 512,
    contentHeight: 683,
    bezel: 18,
    colors: ["space-gray", "silver"],
    landscape: true,
    chrome: new Set(),
  },
};

/** 按 model 推导的机身颜色 union（如 DeviceColor<"iphone-17"> = 7 色） */
export type DeviceColor<M extends DeviceModelId> = (typeof DEVICE_MODELS)[M]["colors"][number];

/** 某 model 是否具备指定 chrome 能力（类型层 prop 约束用） */
type SetToUnion<S> = S extends ReadonlySet<infer T> ? T : never;

export type ModelHasChrome<M extends DeviceModelId, C extends DeviceChromeCapability> =
  C extends SetToUnion<(typeof DEVICE_MODELS)[M]["chrome"]> ? true : false;

/** 非 iOS 设备上 iOS 专属 prop 的类型门（不支持时收敛为 never） */
export type ChromeGate<
  M extends DeviceModelId,
  C extends DeviceChromeCapability,
  T,
> = ModelHasChrome<M, C> extends true ? T : never;
