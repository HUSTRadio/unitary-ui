# 动效

> Route: `/components/motion`

让 React 动画使用局部动效 token，并响应减弱动效偏好。

[返回组件](#/components)

# 动效

motion

让 React 动画使用局部动效 token，并响应减弱动效偏好。

## 何时使用

- 需要可组合的 React 状态动画，并希望沿用组件库时序和减弱动效策略。

## 何时不应使用

- 简单颜色反馈继续使用 CSS；不要为添加动效替换现有浮层的焦点和卸载逻辑。

## 示例

### 状态切换

切换局部内容，使用 state 档位与 AnimatePresence 处理退场。

## 无障碍

- reducedMotion="user" 跟随系统偏好；"always" 始终关闭动效。useMotionTransition 在减弱动效、无效 token 或线性曲线下返回即时过渡。
- 动画不替代内容语义、键盘操作和焦点管理。

## 受控行为

- 调用方管理业务状态；useMotionTransition 接受 feedback、state、overlay、expansive 四档及可选 TokenOptions.target。四档默认 150 / 250 / 350 / 500ms，均读取 --ease-snap。

## 响应式行为

不适用: 不自动改变断点或布局；移动端布局仍由内容组件控制。

## 主题行为

- 读取目标元素当前级联 token，响应局部覆盖与主题变化；服务器不读取 DOM。--ease-snap 默认 cubic-bezier(0.22, 1, 0.36, 1)，可局部覆盖为有效的非线性曲线；该参数是本项目选择，不是 Apple 官方值或弹簧配置。

## 实时示例

内容遵循状态切换时序 token 和你的动画偏好。

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion, MotionProvider, useMotionTransition } from "@/lib/motion";
import { useI18n } from "@/lib/i18n";

function StatePanel() {
  const [shown, setShown] = useState(true);
  const transition = useMotionTransition("state");
  const zh = useI18n().locale === "zh-CN";
  return (
    <div className="w-full space-y-4" data-motion-demo>
      <Button
        typeName="button"
        type="secondary"
        data-motion-toggle
        onClick={() => setShown(!shown)}
      >
        {zh ? "切换内容" : "Toggle Content"}
      </Button>
      <div className="flex min-h-24 items-center">
        <AnimatePresence initial={false}>
          {shown && (
            <motion.div
              key="content"
              data-motion-content
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={transition}
              className="w-full rounded-lg border border-border bg-background p-4 text-copy-14"
            >
              {zh
                ? "内容遵循状态切换时序 token 和你的动画偏好。"
                : "Content follows the state timing token and your motion preference."}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function MotionExample() {
  return (
    <MotionProvider>
      <StatePanel />
    </MotionProvider>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import {
  MotionProvider,
  motion,
  AnimatePresence,
  useMotionTransition,
} from "@hustradio/unitary-ui";
```

### 属性与回调

本表 API 均为 Unitary 扩展。

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">MotionProvider.children</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">使用精简 motion 元素或 HituPlayer 的内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">MotionProvider.reducedMotion</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"user" | "always"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">遵循系统偏好，或强制即时 UI 转场与静态插画。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"user"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">motion</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">typeof import("motion/react-m")</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">精简 Motion 元素，如 motion.div；放在 MotionProvider 中，按需加载 DOM 动画能力。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">AnimatePresence</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">typeof import("motion/react").AnimatePresence</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">在退出动画完成前保留被移除且带 key 的子元素。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">useMotionTransition(tier, options)</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(tier?: MotionTier, options?: TokenOptions) =&gt; Transition</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">将 CSS 级联时长与非线性缓动转换为 Motion 参数；缺失、非法、线性、零时长或减少动画时即时完成。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">tier = "state"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">tier</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"feedback" | "state" | "overlay" | "expansive"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">选择现有时长档位；四档均读取 --ease-snap，快速响应并柔和收尾。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"state"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">options.target</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">HTMLElement | SVGElement | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可选 token 作用域；省略时读取文档根节点，null 表示尚无目标。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

一个节点只有一个动画实现负责变换。减少动画偏好动态变化时，Provider 会跳过 JS 动画；SSR 使用即时转场。现有浮层和反馈组件继续使用各自的生命周期逻辑。

## 最佳实践

- 通过 MotionProvider 包裹动画内容，并使用 useMotionTransition 取得时序。
- 一个元素由一个动画实现控制；保留现有浮层的焦点与生命周期行为。
