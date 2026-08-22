import * as React from "react";
import { MockFrame } from "react-mockframe";
import "react-mockframe/styles/mockframe-iphones.css";
import "react-mockframe/styles/mockframe-android.css";
import "react-mockframe/styles/mockframe-tablets.css";
import "react-mockframe/styles/mockframe-laptops.css";

import { cn } from "@/lib/utils";
import {
  type ChromeGate,
  DEVICE_MODELS,
  type DeviceColor,
  type DeviceModelId,
} from "@/lib/device-models";
import { PhoneSafariChrome, PhoneStatusBar } from "./phone-chrome";

/**
 * Device — 通用设备 mockup 包装（react-mockframe@1.1.0）。
 *
 * item 19：Phone 硬编码「iPhone 17」抽象为 `<Device model="…">`，设备数据
 * 来自 `src/lib/device-models.ts` 注册表（逐台实测 content/bezel/colors）。
 *
 * - model 必填；color 按 model 推导的 union 类型约束。
 * - iOS 专属 chrome（statusBar / safari / dynamicIsland）按设备 chrome 掩码
 *   在类型层收敛为 never；运行时传入不支持设备会 console.warn（dev）并忽略。
 * - autoFit / zoom / animated 逻辑与 Phone 一致（ResizeObserver 只缩小不放大）。
 * - 无障碍：设备 chrome 为装饰元素；`DeviceScreen` 中的截图/录屏承担可访问名称。
 * - 分包 CSS 按需静态引入（vite 摇掉未用设备样式），不引全量 mockframe.css。
 */

/** 状态栏选项（展示占位层，非 Apple 官方素材）。 */
export interface PhoneStatusBarOptions {
  /** 时间文本（默认 "08:00"，tabular 数字） */
  time?: string;
  /** 蜂窝信号格数 0–4（默认 4） */
  cellular?: 0 | 1 | 2 | 3 | 4;
  /** Wi-Fi 信号格数 0–3（默认 3） */
  wifi?: 0 | 1 | 2 | 3;
  /** 电池电量 0–100（默认 100，图标填充量反映电量） */
  battery?: number;
  /** 明暗外观（默认 "light"：浅色屏幕配深色内容） */
  appearance?: "light" | "dark";
}

/** Safari 展示层选项（装饰性 chrome，按钮不可操作，网址经 prop 受控更新）。 */
export interface PhoneSafariOptions {
  /** 布局：compact 底部三胶囊 / bottom 底部面板 / top 顶部地址+底部按钮条 */
  layout?: "compact" | "bottom" | "top";
  /** 网址（原样展示，过长省略；空值回退 example.com） */
  url?: string;
  /** 明暗外观（默认 "light"） */
  appearance?: "light" | "dark";
}

export interface DeviceProps<M extends DeviceModelId = DeviceModelId>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  /** 设备标识（必填，见 DEVICE_MODELS 注册表） */
  model: M;
  /** 机身颜色（按 model 推导的 union；默认注册表 colors 首项） */
  color?: DeviceColor<M>;
  /** 横屏（默认 false） */
  landscape?: boolean;
  /** 灵动岛（仅 chrome 含 "notch" 的设备；默认关闭） */
  dynamicIsland?: ChromeGate<M, "notch", boolean>;
  /** 状态栏（仅 chrome 含 "status-bar"；默认开启） */
  statusBar?: ChromeGate<M, "status-bar", boolean | PhoneStatusBarOptions>;
  /** Safari 展示层（仅 chrome 含 "safari"；默认关闭） */
  safari?: ChromeGate<M, "safari", boolean | PhoneSafariOptions>;
  /** 窄容器自动缩小适配（默认 true；只缩小不放大超过 1） */
  autoFit?: boolean;
  /** 显式缩放（传入时优先于 autoFit） */
  zoom?: number;
  /** 允许短促的 transform 过渡（默认 false；reduced-motion 下强制禁用） */
  animated?: boolean;
  /** 透传到 MockFrame 根元素（.mockframe）的类名 */
  frameClassName?: string;
  children?: React.ReactNode;
}

const DEVICE_CHROME_BASE = "device-chrome";

export const Device = React.forwardRef<HTMLDivElement, DeviceProps>(
  (
    {
      className,
      model,
      color,
      landscape = false,
      dynamicIsland = false,
      statusBar = true,
      safari = false,
      autoFit = true,
      zoom,
      animated = false,
      frameClassName,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const def = DEVICE_MODELS[model];
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = React.useState<number | null>(null);

    // 未注册设备（理论上类型层已排除，运行期兜底）
    if (!def) {
      if (import.meta.env?.DEV) {
        console.error(`[Device] 未注册设备 model="${model}"（DEVICE_MODELS 缺失定义）。`);
      }
      return null;
    }

    const frameWidth = landscape
      ? def.contentHeight + def.bezel * 2
      : def.contentWidth + def.bezel * 2;
    const frameHeight = landscape
      ? def.contentWidth + def.bezel * 2
      : def.contentHeight + def.bezel * 2;

    // 运行时 chrome 掩码检查：iOS 专属 prop 用于不支持的设备 → dev warn + 忽略
    const hasChrome = (cap: "status-bar" | "safari" | "notch") => def.chrome.has(cap);
    const warnUnsupported = (cap: string, value: unknown) => {
      if (import.meta.env?.DEV && value !== undefined && value !== false) {
        console.warn(`[Device] model="${model}" 不支持 "${cap}"（iOS 专属 chrome），已忽略。`);
      }
    };
    warnUnsupported("notch", dynamicIsland);
    warnUnsupported("status-bar", statusBar);
    warnUnsupported("safari", safari);

    const effectiveDynamicIsland = hasChrome("notch") ? dynamicIsland : false;
    const effectiveStatusBar = hasChrome("status-bar") ? statusBar : false;
    const effectiveSafari = hasChrome("safari") ? safari : false;

    React.useEffect(() => {
      if (!autoFit || zoom !== undefined) return;
      const el = containerRef.current;
      if (!el || typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver((entries) => {
        const width = entries[0]?.contentRect.width;
        if (typeof width === "number") setContainerWidth(width);
      });
      observer.observe(el);
      return () => observer.disconnect();
    }, [autoFit, zoom]);

    /** 显式 zoom 优先；autoFit 只缩小、不放大超过 1 */
    const effectiveZoom =
      zoom !== undefined
        ? zoom
        : autoFit && containerWidth !== null
          ? Math.min(1, containerWidth / frameWidth)
          : 1;
    const scaledHeight = frameHeight * effectiveZoom;

    return (
      <div
        ref={ref}
        data-slot="device"
        data-model={model}
        className={cn("w-full min-w-0", DEVICE_CHROME_BASE, className)}
        style={style}
        {...props}
      >
        <div
          ref={containerRef}
          data-slot="device-fit-container"
          className="mx-auto w-full min-w-0"
          style={{ height: scaledHeight }}
        >
          <div
            style={{
              width: frameWidth,
              transform: effectiveZoom !== 1 ? `scale(${effectiveZoom})` : undefined,
              transformOrigin: "top center",
              margin: "0 auto",
            }}
          >
            {/* def.label/colors 来自运行时注册表，MockFrame 的联合类型按静态设备名收窄，
                此处经单一 any 断言桥接（注册表与 MockFrame DeviceOptions 均已实测对齐）。 */}
            <MockFrame
              {...({ device: def.label, color: color ?? def.colors[0] } as any)}
              width={def.contentWidth}
              height={def.contentHeight}
              landscape={landscape}
              hideNotch={!effectiveDynamicIsland}
              animated={animated}
              className={cn(
                animated ? "phone-frame-animated" : "phone-frame-static",
                frameClassName,
              )}
            >
              {/* screen 内三重叠层：内容 → 状态栏 → Safari chrome（均装饰性） */}
              <PhoneStatusBar options={effectiveStatusBar} />
              <PhoneSafariChrome options={effectiveSafari} />
              {children}
            </MockFrame>
          </div>
        </div>
      </div>
    );
  },
);
Device.displayName = "Device";

export type DeviceScreenProps = React.ComponentProps<"div">;

function DeviceScreen({ className, ...props }: DeviceScreenProps) {
  return (
    <div
      data-slot="device-screen"
      className={cn("h-full w-full overflow-hidden", className)}
      {...props}
    />
  );
}

export { DeviceScreen };
