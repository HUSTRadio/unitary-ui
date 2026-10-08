# Hitu + Motion 接入指南

[English](./hitu-motion.en.md)

Motion 负责 React 内容的进入、退出和状态变化，Hitu 负责 SVG 插画内部的关键帧。所有公共 API 从 `@hustradio/unitary-ui` 根入口导入；完整 API 与真实示例见官网的 `/components/motion` 和 `/components/hitu-player`，其[双语指南源](../site/src/content/component-guides/guides-26-motion.ts)与本指南保持一致。

## 安装与基础配置

```sh
pnpm add @hustradio/unitary-ui
```

项目需要 React / ReactDOM 19。组件库已将 `motion@14.0.0` 固定为常规依赖，无需另外安装 Motion 或原始 Hitu npm 包。在浏览器应用入口导入样式；原生 Node 服务端代码只导入包根，不直接导入 CSS：

```tsx
import "@hustradio/unitary-ui/styles.css";
```

用 `MotionProvider` 包住使用 `motion` 的内容。它组合 `MotionConfig` 与 `LazyMotion`，按需加载 `domAnimation`；根入口的 `motion` 基于精简 `m` 实现。默认 `reducedMotion="user"` 跟随系统偏好，`"always"` 强制静态呈现。

## 状态动画与作用域时序

以下示例可作为独立 React 组件使用。`AnimatePresence` 在内容移除时保留退出动画的生命周期；业务状态、键盘操作和焦点仍由应用管理。

```tsx
import { useState, type CSSProperties } from "react";
import {
  AnimatePresence, Button, MotionProvider, motion, useMotionTransition,
} from "@hustradio/unitary-ui";

function StatePanel() {
  const [shown, setShown] = useState(true);
  const [scope, setScope] = useState<HTMLDivElement | null>(null);
  const transition = useMotionTransition("state", { target: scope });

  return (
    <div ref={setScope} style={{ "--uni-motion-state": "180ms" } as CSSProperties}>
      <Button typeName="button" onClick={() => setShown(!shown)}>Toggle</Button>
      <AnimatePresence initial={false}>
        {shown && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={transition}
          >
            Content follows the scoped timing token.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MotionDemo() {
  return <MotionProvider><StatePanel /></MotionProvider>;
}
```

`useMotionTransition(tier, options)` 默认档位为 `state`，`options` 使用公共 `TokenOptions`。省略 `target` 时读取文档根；`target: null` 表示目标尚未挂载。局部覆盖应作用于传给 hook 的元素。hook 读取计算后的 CSS 级联，并响应 token API 写入、祖先主题或样式属性与相关媒体查询变化。

| 档位 | 时长 token | 缓动 token |
| --- | --- | --- |
| `feedback` | `--uni-motion-feedback` | `--ease-snap` |
| `state` | `--uni-motion-state` | `--ease-snap` |
| `overlay` | `--uni-motion-overlay` | `--ease-pop` |
| `expansive` | `--uni-motion-expansive` | `--ease-snap` |

时长支持 `ms` / `s`，转换为 Motion 的秒；缓动支持有效的 `cubic-bezier(...)` 及 `linear`、`ease`、`ease-in`、`ease-out`、`ease-in-out`。缺失、非法、零时长或减少动画时，返回零时长、零延迟且 `skipAnimations: true` 的过渡，不补入数字默认时长。

## 插画、播放控制与 EmptyState

`HituBox` 和 `HituFile` 使用现有主题色彩 token，固有尺寸均为 1024 × 1024。播放器的 `width` / `height` 定义画布坐标；CSS 可等比缩放显示尺寸。把稳定的 `shapes` 放在组件外或用 `useMemo` 保持引用，避免普通重渲染被当作场景切换。

```tsx
import { useRef, useState } from "react";
import {
  Button, EmptyState, HituBox, HituFile, HituPlayer, MotionProvider,
  motion, useMotionTransition, type HituPlayerRef, type HituShape,
} from "@hustradio/unitary-ui";

const shapes: readonly HituShape[] = [
  {
    source: HituFile, x: 160, y: 32,
    scaleX: 0.2, scaleY: 0.2, originX: 0, originY: 0,
    frames: [{ frame: 0, y: 32 }, { frame: 60, y: 96 }, { frame: 119, y: 32 }],
  },
  {
    source: HituBox, x: 96, y: 160,
    scaleX: 0.32, scaleY: 0.32, originX: 0, originY: 0,
  },
];

function Illustration() {
  const player = useRef<HituPlayerRef>(null);
  const [playing, setPlaying] = useState(false);
  const transition = useMotionTransition("feedback");

  return (
    <EmptyState
      title="No files yet"
      description="Add a file to start organizing your workspace."
      icon={
        <motion.div animate={{ y: playing ? -4 : 0 }} transition={transition}>
          <HituPlayer
            ref={player} width={512} height={512} frames={120} shapes={shapes}
            onPlay={setPlaying} style={{ width: 240, maxWidth: "100%", height: "auto" }}
          />
        </motion.div>
      }
    >
      <Button typeName="button" onClick={() => player.current?.triggerMotion(true)}>Play</Button>
      <Button typeName="button" onClick={() => player.current?.triggerMotion(false)}>Pause</Button>
      <Button typeName="button" onClick={() => {
        player.current?.setFrame(0);
        player.current?.triggerMotion(true);
      }}>Replay</Button>
      <p role="status">{playing ? "Playing" : "Paused"}</p>
    </EmptyState>
  );
}

export function IllustrationDemo() {
  return <MotionProvider><Illustration /></MotionProvider>;
}
```

此组合使用现有 `EmptyState.icon` 槽位。Motion 只写外围 `div` 的变换，Hitu 只写内部 SVG 图层；不要让两个引擎共同修改同一节点的变换。

| 配置或方法 | 行为 |
| --- | --- |
| `width`、`height`、`shapes` | 必填的画布尺寸和 React SVG 图层 |
| `frames` | 总帧数，默认 `0`；`120` 对应索引 `0`–`119`，时间线按 60 fps 推进 |
| `defaultFrame`、`defaultPlay`、`loop` | 初始值分别为 `0`、`false`、`false`；`loop` 可动态更新 |
| `ref.triggerMotion(true / false)` | 请求播放或暂停；省略参数切换播放意图；在末帧请求播放会重播 |
| `ref.setFrame(frame)` | 定位并限制在有效索引内；减少动画时不执行定位 |
| `ref.getFramerInfo()` | 返回 `{ play, frame }`，其中 `play` 是实际播放状态 |
| `onPlay(play)` | 报告实际播放的变化，包括可见性或减少动画导致的暂停 |
| `onFrame(frame)` | 报告初始帧、定位帧及每个跨过的时间线帧，包含循环回绕 |

`defaultFrame` 与 `defaultPlay` 是初始值，不是受控属性；后续控制使用 ref。零帧场景保持静态。更换 `shapes` 引用会恢复初始帧；帧数变化会限制当前帧并重置播放时钟。

## 自定义 React SVG shape

`source` 必须是符合 `HituShapeSource` 的 React SVG 组件，并提供静态数字 `width` / `height`；只写 `viewBox` 不足以给图层引擎提供原点尺寸。

```tsx
import type { SVGProps } from "react";
import type { HituShape, HituShapeSource } from "@hustradio/unitary-ui";

const Dot: HituShapeSource = Object.assign(
  (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 48 48" width={48} height={48} {...props}>
      <circle cx={24} cy={24} r={20} fill="var(--gray-700)" />
    </svg>
  ),
  { width: 48, height: 48 },
);

export const dotShapes: readonly HituShape[] = [{
  source: Dot, x: 64, y: 64, originX: 0.5, originY: 0.5,
  frames: [
    { frame: 0, rotate: 0, opacity: 1, cubic: [0.2, 0, 0.2, 1] },
    { frame: 119, rotate: 180, scaleX: 1.2, scaleY: 1.2, opacity: 0.5 },
  ],
}];
```

支持 `x` / `y`、`rotate`、`scaleX` / `scaleY`、`originX` / `originY` 和 `opacity`。原点是资产宽高的比例；旋转单位是度。关键帧按递增索引排列，省略的变换继承图层和前一关键帧；`cubic` 属于从当前关键帧开始的片段。默认位移和旋转为 `0`，缩放和透明度为 `1`，原点为 `0.5`。使用渐变、遮罩或 clipPath 时，由自定义资产用 React `useId` 等方式隔离每个实例的引用 ID。

## 减少动画、可见性与服务端

- 系统偏好动态开启时，在途 Motion 动画完成，Hitu 停止 JS 播放并显示初始帧。`MotionProvider reducedMotion="always"` 同样约束其内的两种动画；嵌套 provider 不能取消外层的强制静态策略。
- Hitu 离屏或页面隐藏时暂停。恢复可见后，只恢复仍请求播放的实例；手动暂停后不会自动恢复。暂停、场景切换和卸载均清理 RAF。
- 导入包根与 SSR 不访问浏览器全局对象。Hitu 在服务端输出确定的静态初始帧，客户端再读取偏好和可见性；不要依赖动画作为首屏内容出现的条件。
- Hitu 默认是装饰插画，`aria-hidden` 为 `true`。说明性插画提供 `aria-label` 或 `aria-labelledby`，会默认得到 `role="img"`；把说明文字、播放按钮和状态放在 SVG 外。动画不替代键盘、焦点和内容语义。

## 来源、范围与验证

运行时内置并适配自 [ant-design/HiTu 固定提交](https://github.com/ant-design/HiTu/tree/92119663fb5e551ccab5d0b46532c0a3317e0cc8) `92119663fb5e551ccab5d0b46532c0a3317e0cc8`。上游是明确标记不可直接用于生产的原型；本项目负责 React 19、生命周期、SSR 与偏好的本地适配维护。来源与 MIT 许可见 [SOURCE.md](../../src/vendor/hitu/SOURCE.md)、[LICENSE](../../src/vendor/hitu/LICENSE) 和[第三方声明](../../THIRD_PARTY_NOTICES.md)。

本期只支持完整 React SVG 图层与箱子、文件资产，不支持 `svgText`、chips 子路径动画、插画编辑器或全量资产库。现有 Modal、Drawer、Toast、Collapse、Tabs 动效保持原实现。生产兼容性、实际消费构建增量和检查命令见[接入验收报告](../audits/hitu-motion-2026-10-08.md)；统一根入口增加常规依赖，不能理解为所有消费者零成本。

[Motion 真实示例](../site/src/examples/motion/default.example.tsx) · [Hitu 真实示例](../site/src/examples/hitu-player/default.example.tsx)
