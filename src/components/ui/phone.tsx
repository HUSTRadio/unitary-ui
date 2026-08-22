import * as React from "react";
import { MockFrame } from "react-mockframe";
import "react-mockframe/styles/mockframe-iphones.css";

import { cn } from "@/lib/utils";
import { PhoneSafariChrome, PhoneStatusBar } from "./phone-chrome";

/**
 * Phone — iPhone 17 mockup 包装（react-mockframe@1.1.0）。
 *
 * 定位：截图、录屏和静态演示内容的展示组件，不发展为浏览器模拟器。
 * 其他设备请直接使用 react-mockframe 的 MockFrame。
 *
 * - 设备固定 `iPhone 17`，内容尺寸 393×852；竖屏自然外框 417×876，横屏 876×417。
 * - 7 种机身颜色，默认深色 `black`；灵动岛默认关闭（`dynamicIsland` 开启）。
 * - 自适应（autoFit）：ResizeObserver 只测量承载层宽度，MockFrame 顶部居中缩放，
 *   只缩小不放大超过 1；根容器预留缩放后的真实高度，避免裁切、横向滚动和 CLS。
 *   `zoom` 显式传入时优先于 autoFit。
 * - 动效：覆盖第三方 `transition: all`——默认无过渡；`animated` 只允许短促的
 *   transform 过渡；reduced-motion 下完全禁用。
 * - 无障碍：设备 chrome 为装饰元素（react-mockframe 内部元素不产生可聚焦控件）；
 *   `PhoneScreen` 中的截图或录屏承担可访问名称。
 * - 第三方外框金属渐变与设备颜色保留 react-mockframe 原实现，不映射为 Geist token。
 */

type IPhone17Color =
  | "black"
  | "white"
  | "mist-blue"
  | "sage"
  | "lavender"
  | "cosmic-orange"
  | "deep-blue";

/** iPhone 17 内容尺寸（react-mockframe DeviceOptions） */
const PHONE_CONTENT_WIDTH = 393;
const PHONE_CONTENT_HEIGHT = 852;
/** 外框 padding（CSS .mockframe.iphone17 padding: 12px） */
const PHONE_BEZEL = 12;

export interface PhoneProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  /** 机身颜色（7 种，默认深色 black） */
  color?: IPhone17Color;
  /** 横屏（默认 false） */
  landscape?: boolean;
  /** 灵动岛（默认关闭；内部映射为 react-mockframe 的 hideNotch） */
  dynamicIsland?: boolean;
  /** 状态栏（默认开启；详见 PhoneStatusBarOptions） */
  statusBar?: boolean | PhoneStatusBarOptions;
  /** Safari 展示层（默认关闭；详见 PhoneSafariOptions） */
  safari?: boolean | PhoneSafariOptions;
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

/**
 * 状态栏选项（展示占位层，非 Apple 官方素材）。
 * appearance="light" 表示浅色屏幕上的深色状态栏内容。
 */
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

const PHONE_CHROME_BASE = "phone-chrome";

const Phone = React.forwardRef<HTMLDivElement, PhoneProps>(
  (
    {
      className,
      color = "black",
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
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = React.useState<number | null>(null);

    const frameWidth = landscape
      ? PHONE_CONTENT_HEIGHT + PHONE_BEZEL * 2
      : PHONE_CONTENT_WIDTH + PHONE_BEZEL * 2;
    const frameHeight = landscape
      ? PHONE_CONTENT_WIDTH + PHONE_BEZEL * 2
      : PHONE_CONTENT_HEIGHT + PHONE_BEZEL * 2;

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
      zoom !== undefined ? zoom : autoFit && containerWidth !== null ? Math.min(1, containerWidth / frameWidth) : 1;
    const scaledHeight = frameHeight * effectiveZoom;

    return (
      <div
        ref={ref}
        data-slot="phone"
        className={cn("w-full min-w-0", PHONE_CHROME_BASE, className)}
        style={style}
        {...props}
      >
        <div
          ref={containerRef}
          data-slot="phone-fit-container"
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
            <MockFrame
              device="iPhone 17"
              color={color}
              width={PHONE_CONTENT_WIDTH}
              height={PHONE_CONTENT_HEIGHT}
              landscape={landscape}
              hideNotch={!dynamicIsland}
              animated={animated}
              className={cn(
                animated
                  ? "phone-frame-animated"
                  : "phone-frame-static",
                frameClassName,
              )}
            >
              {/* screen 内三重叠层：内容 → 状态栏 → Safari chrome（均装饰性） */}
              <PhoneStatusBar options={statusBar} />
              <PhoneSafariChrome options={safari} />
              {children}
            </MockFrame>
          </div>
        </div>
      </div>
    );
  },
);
Phone.displayName = "Phone";

export type PhoneScreenProps = React.ComponentProps<"div">;

function PhoneScreen({ className, ...props }: PhoneScreenProps) {
  return <div data-slot="phone-screen" className={cn("h-full w-full overflow-hidden", className)} {...props} />;
}

export {
  Phone,
  PhoneScreen,
  type PhoneProps,
  type PhoneScreenProps,
  type IPhone17Color,
  type PhoneStatusBarOptions,
  type PhoneSafariOptions,
};
