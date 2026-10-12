# 视频

> Route: `/components/video`

嵌入视频，提供播放控件和延迟加载。

[返回组件](#/components)

# 视频

video

嵌入视频，提供播放控件和延迟加载。

## 何时使用

- 需要在页面中嵌入视频片段，并要求开箱即用的播放控制和懒加载性能优化。
- 需要在营销页面、文档封面或产品演示页中展示视频内容，同时保持页面的视觉一致性。

## 何时不应使用

- 如果需要对视频的播放逻辑进行完全定制化的控制，建议使用成熟的第三方播放器库（如 Video.js 或 Plyr）。
- 对于仅需静态图片的场景，请使用 Image 组件而不是 Video——减少不必要的网络请求和资源消耗。

## 示例

### 循环播放

展示控制视频循环播放属性的用法，关闭 loop 后视频播完即停止。

### 无边控播放

隐藏内置播放控件，呈现沉浸式全屏观看体验，适合背景类视频。

## 无障碍

- Video 组件锁定内部视频的宽高比，防止容器在媒体加载时重新流动；这对屏幕阅读器用户和键盘导航用户同样重要。
- 如需自动播放，请尊重 prefers-reduced-motion 偏好并提供暂停状态的视频海报作为回退。

## 受控行为

- Video 没有声明式 playing 或 currentTime props；内部控制层自行同步播放状态。
- 通过 HTMLVideoElement ref 调用 play()、pause() 或设置 currentTime，可控制播放。

## 响应式行为

- Video 会保持内部视频的固定宽高比，容器自适应父级宽度，确保在各种视口下不会发生布局偏移。

## 主题行为

- controls={true} 时组件渲染自定义播放按钮、时间和进度条；控制层的背景、文字和阴影使用主题样式。

## 实时示例

```tsx
import { Video } from "@hustradio/unitary-ui";

export function VideoDefault37A8EEC1Example() {
  return (
    <div className="w-full min-w-0 max-w-[600px]">
      <Video height={582} lazy={false} poster="/demo-poster.png" src="/demo.mp4" width={600} />
    </div>
  );
}
```

## 不循环

```tsx
import { Video } from "@hustradio/unitary-ui";

export function VideoNoLoopAE976739Example() {
  return (
    <div className="w-full min-w-0 max-w-[600px]">
      <Video height={582} lazy={false} loop={false} src="/demo.mp4" width={600} />
    </div>
  );
}
```

## 无控件

```tsx
import { Video } from "@hustradio/unitary-ui";

export function VideoNoControlsA3B62E68Example() {
  return (
    <div className="w-full min-w-0 max-w-[600px]">
      <Video controls={false} height={582} lazy={false} src="/demo.mp4" width={600} />
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { Video } from "@hustradio/unitary-ui";
```

还支持以下类型中定义的属性：`VideoHTMLAttributes<HTMLVideoElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">src</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">媒体地址。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onEnded</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactEventHandler&lt;HTMLVideoElement&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">原生媒体生命周期回调。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 内嵌播放控制与惰性加载支持的短片用 Video。
- 锁定内部视频宽高比，让媒体加载时容器不回流。
- 自动播放时尊重 prefers-reduced-motion，并提供暂停的 poster 回退。
