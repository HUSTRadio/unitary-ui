import * as React from "react";

import { cn } from "@/lib/utils";
import type { PhoneSafariOptions, PhoneStatusBarOptions } from "./phone";

/**
 * Phone 状态栏与 Safari 展示层。
 *
 * 全部为**装饰性展示占位层**（非 Apple 官方素材、非真实模拟器）：
 * - chrome 均为非交互元素绘制，不可聚焦、不接收点击，aria-hidden="true"；
 * - 可访问名称由 PhoneScreen 中的截图/录屏承担（Geist Phone "treat the chrome
 *   as decorative"）。
 *
 * 状态栏：本地 React/SVG 实现。时间为 tabular 数字文本；蜂窝/Wi-Fi/电池为独立
 * 绘制的通用几何图标，不复制或打包 Apple 官方图标。竖屏按 393×852 校准。
 * 时间字体：Apple 平台命中 SF Pro（-apple-system/BlinkMacSystemFont），其他平台
 * 回退 HarmonyOS Sans / HarmonyOS Sans SC（自托管），配合 tabular-nums 与
 * 非 Apple 环境的视觉补偿参数（-0.12px 字距 + 0.25px 垂直校正）。
 *
 * Safari：compact 底部三胶囊 / bottom 底部面板 / top 顶部地址胶囊+底部按钮条，
 * 布局与安全区语义借鉴 liquidframe（MIT）；网址经 prop 受控更新，原样展示，
 * 过长中间省略，空值回退 example.com。
 */

const DEFAULT_STATUS_BAR: Required<PhoneStatusBarOptions> = {
  time: "08:00",
  cellular: 4,
  wifi: 3,
  battery: 100,
  appearance: "light",
};

const DEFAULT_SAFARI: Required<PhoneSafariOptions> = {
  layout: "compact",
  url: "example.com",
  appearance: "light",
};

/** 网址展示：去首尾空白，过长中间省略（保留域名头尾），空值回退 example.com */
function displayUrl(raw: string | undefined): string {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return "example.com";
  if (trimmed.length <= 32) return trimmed;
  return `${trimmed.slice(0, 20)}…${trimmed.slice(-11)}`;
}

function clampLevel(value: number, max: number): number {
  return Math.max(0, Math.min(max, Math.round(value)));
}

/* ---------------- 状态栏几何图标（通用几何，非官方素材） ---------------- */

function CellularIcon({ level, ...props }: { level: number } & React.SVGProps<SVGSVGElement>) {
  const filled = clampLevel(level, 4);
  return (
    <svg
      viewBox="0 0 18 12"
      aria-hidden="true"
      className="h-3 w-[18px]"
      fill="currentColor"
      {...props}
    >
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={i * 4.5}
          y={9 - i * 3}
          width={3}
          height={3 + i * 3}
          rx={1}
          opacity={i < filled ? 1 : 0.25}
        />
      ))}
    </svg>
  );
}

function WifiIcon({ level, ...props }: { level: number } & React.SVGProps<SVGSVGElement>) {
  const filled = clampLevel(level, 3);
  return (
    <svg
      viewBox="0 0 16 12"
      aria-hidden="true"
      className="h-3 w-4"
      fill="currentColor"
      {...props}
    >
      {/* 三段圆弧以扇形近似：外/中/内 */}
      <path d="M8 10.8a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2Z" opacity={filled >= 1 ? 1 : 0.25} />
      <path
        d="M8 4.6c1.7 0 3.24.66 4.4 1.72l-1.42 1.5A4.44 4.44 0 0 0 8 6.6c-1.14 0-2.18.43-2.98 1.22L3.6 6.32A6.36 6.36 0 0 1 8 4.6Z"
        opacity={filled >= 2 ? 1 : 0.25}
      />
      <path
        d="M8 .8c2.76 0 5.26 1.1 7.1 2.88l-1.42 1.48A8.06 8.06 0 0 0 8 2.8c-2.2 0-4.2.9-5.68 2.36L.9 3.68A10.02 10.02 0 0 1 8 .8Z"
        opacity={filled >= 3 ? 1 : 0.25}
      />
    </svg>
  );
}

function BatteryIcon({ percent, ...props }: { percent: number } & React.SVGProps<SVGSVGElement>) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const innerWidth = Math.max(0, (clamped / 100) * 18);
  return (
    <svg viewBox="0 0 25 12" aria-hidden="true" className="h-[12px] w-[25px]" {...props}>
      <rect
        x="0.5"
        y="0.5"
        width="21"
        height="11"
        rx="3.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.35"
      />
      <rect x="2" y="2" width={innerWidth} height="8" rx="2" fill="currentColor" />
      <path d="M23 4v4a2.2 2.2 0 0 0 0-4Z" fill="currentColor" fillOpacity="0.4" />
    </svg>
  );
}

/* ---------------- 状态栏 ---------------- */

/** 时间渲染：冒号独立 token（.phone-status-colon 消费 --font-metric-colon 做光学对齐） */
function TimeText({ value }: { value: string }) {
  const parts = value.split(/([:])/);
  return (
    <>
      {parts.map((part, i) =>
        part === ":" ? (
          <span key={i} className="phone-status-colon">
            :
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function PhoneStatusBar({
  options,
  island = false,
}: {
  options: boolean | PhoneStatusBarOptions | undefined;
  /** 灵动岛开启时容器与库绘制岛条带同轴（岛中心 = 屏幕坐标 24.5px = 外框坐标 36.5px），默认关闭维持现状 */
  island?: boolean;
}) {
  if (options === false || options === undefined) return null;
  const o: Required<PhoneStatusBarOptions> =
    options === true ? DEFAULT_STATUS_BAR : { ...DEFAULT_STATUS_BAR, ...options };
  const dark = o.appearance === "dark";
  const battery = Math.max(0, Math.min(100, Math.round(o.battery)));

  return (
    <div
      data-slot="phone-status-bar"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 z-20 flex items-center justify-between pl-[27px] pr-[22px]",
        // 岛对齐几何：MockFrame 的 .dynamic-island 挂在**外框层**（anatomy 渲染于
        // .screen 之前），top:22px/height:29px 相对 .mockframe；本组件渲染在 .screen
        // 屏幕层内，屏幕因 bezel(12px) 整体下移——top 须取 22−12=10px 才与岛同轴
        // （岛中心 = 外框 36.5px = 屏幕 24.5px）。此前把两个 top 值当同一参照系
        // （22px），状态栏比岛低 12px。
        // 基线说明：font-metrics 的 --font-metric-baseline 公式已修正为"字形视觉
        // 中心 vs 行盒中心"（17px HarmonyOS Sans 实测 −0.5px 上移），两种模式统一
        // 消费，无需再按模式归零。
        island
          ? "top-[10px] h-[29px]"
          : "top-0 h-[54px] pt-[13px]",
        dark ? "text-white" : "text-black",
      )}
    >
      <span className="phone-status-time text-[17px] font-semibold leading-none">
        <TimeText value={o.time} />
      </span>
      <span className="flex items-center gap-[5px]">
        <CellularIcon level={o.cellular} />
        <WifiIcon level={o.wifi} />
        <BatteryIcon data-battery-icon="" percent={battery} />
      </span>
    </div>
  );
}

/* ---------------- Safari 展示层 ---------------- */

function SafariUrlPill({ url, dark }: { url: string; dark: boolean }) {
  return (
    <span
      className={cn(
        "mx-auto flex h-[34px] min-w-0 flex-1 items-center justify-center rounded-full px-3",
        dark ? "bg-white/15 text-white" : "bg-black/[0.07] text-gray-1000",
      )}
    >
      <span className="truncate text-[13px] leading-none">{url}</span>
    </span>
  );
}

function SafariButtonRow({ dark }: { dark: boolean }) {
  // 装饰按钮：通用几何形状，非交互元素
  const dot = cn("h-[18px] w-[18px] rounded-full", dark ? "bg-white/80" : "bg-gray-900");
  const square = cn(
    "h-[16px] w-[16px] rounded-sm border-[2px]",
    dark ? "border-white/80" : "border-gray-900",
  );
  return (
    <span className="flex items-center justify-around px-4 py-2">
      <span className={dot} />
      <span className={square} />
      <span className={dot} />
    </span>
  );
}

export function PhoneSafariChrome({
  options,
}: {
  options: boolean | PhoneSafariOptions | undefined;
}) {
  if (!options) return null;
  const o: Required<PhoneSafariOptions> =
    options === true ? DEFAULT_SAFARI : { ...DEFAULT_SAFARI, ...options };
  const dark = o.appearance === "dark";
  const url = displayUrl(o.url);

  const panelBg = dark ? "bg-[#1c1c1e]/90" : "bg-background-200/90";
  const panelClass = cn("pointer-events-none absolute inset-x-0 z-20 backdrop-blur-md", panelBg);

  return (
    <div data-slot="phone-safari" aria-hidden="true">
      {o.layout === "top" && (
        <>
          <div className={cn(panelClass, "top-[50px] flex items-center gap-3 px-4 pb-2")}>
            <span
              className={cn("h-[18px] w-[18px] rounded-full", dark ? "bg-white/70" : "bg-gray-900")}
            />
            <SafariUrlPill url={url} dark={dark} />
            <span
              className={cn("size-[18px] rounded-full", dark ? "bg-white/70" : "bg-gray-900")}
            />
          </div>
          <div className={cn(panelClass, "bottom-0")}>
            <SafariButtonRow dark={dark} />
            <div
              className="mx-auto mb-[6px] h-[5px] w-[130px] rounded-full bg-current opacity-40"
              style={{ color: dark ? "#fff" : "#000" }}
            />
          </div>
        </>
      )}

      {o.layout === "bottom" && (
        <div className={cn(panelClass, "bottom-0 px-3 pb-[8px] pt-2")}>
          <div className="mb-2 flex items-center gap-2">
            <span
              className={cn(
                "h-[18px] w-[18px] shrink-0 rounded-full",
                dark ? "bg-white/70" : "bg-gray-900",
              )}
            />
            <SafariUrlPill url={url} dark={dark} />
            <span
              className={cn(
                "size-[18px] shrink-0 rounded-full",
                dark ? "bg-white/70" : "bg-gray-900",
              )}
            />
          </div>
          <SafariButtonRow dark={dark} />
        </div>
      )}

      {o.layout === "compact" && (
        <div className={cn(panelClass, "bottom-0 pb-[8px] pt-2")}>
          <span
            className="mx-auto flex h-[34px] w-auto items-center justify-around gap-6 rounded-full px-6"
            style={{
              background: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.07)",
              color: dark ? "#fff" : "#000",
            }}
          >
            <span className={cn("h-[16px] w-[16px] rounded-full bg-current opacity-80")} />
            <span className="flex items-center gap-1.5">
              <span className="h-[14px] w-[14px] rounded-sm border-2 border-current opacity-80" />
              <span className="max-w-[120px] truncate text-[13px] leading-none">{url}</span>
              <span className="text-[13px] leading-none opacity-60">↻</span>
            </span>
            <span className="h-[16px] w-[10px] rounded-[3px] border border-current opacity-80" />
          </span>
          <div
            className="mx-auto mt-[6px] h-[5px] w-[130px] rounded-full"
            style={{ background: dark ? "#ffffff66" : "#00000066" }}
          />
        </div>
      )}
    </div>
  );
}
