# 视频

> Route: `/components/video`

嵌入带内置播放控件的视频。

[返回组件](#/components)

# 视频

Video

嵌入带内置播放控件的视频。

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

不适用: Video 是一个展示型组件，主要负责嵌入和渲染视频内容，不提供 play/pause/seek 等受控 API 接口。完整的媒体控制应由第三方播放器库实现。

## 响应式行为

- Video 会保持内部视频的固定宽高比，容器自适应父级宽度，确保在各种视口下不会发生布局偏移。

## 主题行为

不适用: Video 组件渲染的是 HTML 原生 video 元素及其操作系统/浏览器的默认控件，不直接参与应用的主题配色系统。

## 实时示例

## 不循环

```tsx
import { Video } from "@/components/ui/video";

<div className="w-full min-w-0 max-w-[600px]">
  <Video height={582} lazy={false} loop={false} src="/demo.mp4" width={600} />
</div>;
```

## 无控件

```tsx
import { Video } from "@/components/ui/video";

<div className="w-full min-w-0 max-w-[600px]">
  <Video controls={false} height={582} lazy={false} src="/demo.mp4" width={600} />
</div>;
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Video } from "@/components/ui/video";
```

原生属性：`VideoHTMLAttributes<HTMLVideoElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">src</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">媒体地址。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onEnded</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactEventHandler&lt;HTMLVideoElement&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">原生媒体生命周期回调。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 内嵌播放控制与惰性加载支持的短片用 Video。
- 锁定内部视频宽高比，让媒体加载时容器不回流。
- 自动播放时尊重 prefers-reduced-motion，并提供暂停的 poster 回退。
