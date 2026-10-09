# Hitu 插画播放器

> Route: `/components/hitu-player`

通过显式播放控制展示按帧编排的 SVG 插画。

[返回组件](#/components)

# Hitu 插画播放器

hitu-player

通过显式播放控制展示按帧编排的 SVG 插画。

## 何时使用

- 空状态、引导或介绍页需要有明确尺寸和播放控制的插画。

## 何时不应使用

- 常规图标和表单反馈使用现有组件；播放器不提供编辑器、文本或 chips 图层。

## 示例

### 插画与播放控制

HituBox 与 HituFile 共用帧时间线，提供播放、暂停、重播和循环开关。

## 无障碍

- 默认作为装饰 SVG；有意义的插画通过 aria-label 命名，说明和按钮保留在 SVG 外。
- 减弱动效偏好会阻止播放并恢复初始帧；离屏和页面隐藏时暂停。

## 受控行为

- defaultPlay 与 defaultFrame 设置初值；ref.triggerMotion、setFrame 和 getFramerInfo 控制及读取实际状态，onPlay / onFrame 回报变化。
- HituFrame.cubic 作用于从该帧出发的片段；缺省、非法或恒等线性四元组使用 \[0.42, 0, 0.58, 1\] 平滑起止。有效的显式非线性曲线保留，稀疏变换继承前值，首末帧准确到达目标。
- 示例中 Motion 控制外围容器，Hitu 控制 SVG 内部图层；两者分别负责自己的节点。

## 响应式行为

- width / height 定义 SVG 坐标系；使用 CSS 在容器内等比缩放，避免改变图层坐标。

## 主题行为

- 内置 HituBox / HituFile 使用组件库色彩 token；自定义形状的配色由调用方定义。

## 实时示例

暂无文件

添加文件，开始整理你的工作区。

循环

已暂停

```tsx
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { HituPlayer, type HituPlayerRef } from "@/components/ui/hitu-player";
import { HituBox, HituFile } from "@/vendor/hitu/assets";
import { MotionProvider, motion, useMotionTransition } from "@/lib/motion";
import { useI18n } from "@/lib/i18n";

const shapes = [
  {
    source: HituFile,
    x: 160,
    y: 32,
    scaleX: 0.2,
    scaleY: 0.2,
    originX: 0,
    originY: 0,
    frames: [
      { frame: 0, y: 32 },
      { frame: 60, y: 96 },
      { frame: 119, y: 32 },
    ],
  },
  { source: HituBox, x: 96, y: 160, scaleX: 0.32, scaleY: 0.32, originX: 0, originY: 0 },
];

function Illustration({ autoPlay }: { autoPlay: boolean }) {
  const player = useRef<HituPlayerRef>(null);
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(false);
  const transition = useMotionTransition("feedback");
  const zh = useI18n().locale === "zh-CN";
  return (
    <div data-motion-hitu-demo className="w-full">
      <EmptyState
        className="px-4 py-6"
        title={zh ? "暂无文件" : "No Files Yet"}
        description={
          zh ? "添加文件，开始整理你的工作区。" : "Add a file to start organizing your workspace."
        }
        icon={
          <motion.div
            initial={transition.skipAnimations ? false : { opacity: 0 }}
            animate={{ opacity: 1, y: playing ? -4 : 0 }}
            transition={transition}
            className="w-60 max-w-full"
          >
            <HituPlayer
              ref={player}
              width={512}
              height={512}
              frames={120}
              shapes={shapes}
              defaultPlay={autoPlay}
              loop={loop}
              onPlay={setPlaying}
              className="block h-auto w-full"
            />
          </motion.div>
        }
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            typeName="button"
            size="small"
            data-motion-play
            onClick={() => player.current?.triggerMotion(true)}
          >
            {zh ? "播放" : "Play"}
          </Button>
          <Button
            typeName="button"
            type="secondary"
            size="small"
            data-motion-pause
            onClick={() => player.current?.triggerMotion(false)}
          >
            {zh ? "暂停" : "Pause"}
          </Button>
          <Button
            typeName="button"
            type="secondary"
            size="small"
            data-motion-replay
            onClick={() => {
              player.current?.setFrame(0);
              player.current?.triggerMotion(true);
            }}
          >
            {zh ? "重播" : "Replay"}
          </Button>
          <Checkbox checked={loop} data-motion-loop onChange={() => setLoop(!loop)}>
            {zh ? "循环" : "Loop"}
          </Checkbox>
        </div>
        <p role="status" className="text-label-12 text-muted-foreground">
          {playing ? (zh ? "正在播放" : "Playing") : zh ? "已暂停" : "Paused"}
        </p>
      </EmptyState>
    </div>
  );
}

export default function HituPlayerExample({ autoPlay = false }: { autoPlay?: boolean }) {
  return (
    <MotionProvider>
      <Illustration autoPlay={autoPlay} />
    </MotionProvider>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { HituPlayer, HituBox, HituFile } from "@hustradio/unitary-ui";
```

还支持以下类型中定义的属性：`Omit<SVGProps<SVGSVGElement>, "ref" | "width" | "height" | "onPlay">`

### 属性与回调

本表 API 均为 Unitary 扩展。

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">width / height</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">SVG 画布尺寸及 viewBox 坐标。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">shapes</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">readonly HituShape[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">具有固有 width/height 的 React SVG 资源、基础变换和可选的有序关键帧。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">frames</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">总帧数，以每秒 60 帧推进；索引从零到 frames - 1。零帧保持静态；负数或非有限值转为零。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">0</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultFrame</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">初始帧，限制在当前帧范围内；减少动画时恢复此帧。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">0</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultPlay</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">初始播放请求；实际播放还要求可见且动画偏好允许。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">loop</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">在请求播放且允许动画时重复时间线。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onPlay</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(playing: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">报告实际播放状态变化，包括可见性或动画偏好导致的暂停。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onFrame</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(frame: number) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">报告播放或定位产生的帧变化。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">ref.triggerMotion</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(playing?: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">请求播放/暂停；省略时切换请求。手动暂停后不会自动恢复。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">ref.setFrame</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(frame: number) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">定位到当前帧范围内的指定帧。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">ref.getFramerInfo</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; { play: boolean; frame: number }</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">读取当前帧及实际播放状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">shape.source</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">HituShapeSource</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">带有数值 width 和 height 的 React SVG 组件；内置资源包含 HituBox 和 HituFile。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">shape transforms</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">x, y, rotate, scaleX, scaleY, originX, originY, opacity</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">变换完整图层；原点是资源尺寸的比例。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">shape.frames</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">readonly HituFrame[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">关键帧包含帧号和稀疏变换；可选非线性 cubic 缓动作用于从该帧出发的片段。缺省、非法或恒等线性四元组使用 [0.42, 0, 0.58, 1]。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">aria-label / aria-labelledby</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">为有意义的插画命名；未命名时作为装饰内容，从辅助技术中隐藏。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

React shape 是 v1 唯一图层来源，不解析 svgText，也不支持 chips 子路径动画。离屏或页面隐藏时暂停，恢复可见后只恢复仍请求播放的实例；卸载和场景切换会清理 RAF。

## 最佳实践

- 装饰插画从辅助技术中隐藏；有意义的内容通过 aria-label 命名。
- 提供播放控制，并在挂载前预留插画尺寸。
