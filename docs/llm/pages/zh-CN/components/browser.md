# 浏览器

> Route: `/components/browser`

将截图和示例置于逼真的浏览器窗口中。

[返回组件](#/components)

# 浏览器

Browser

将截图和示例置于逼真的浏览器窗口中。

## 何时使用

- 在落地页、文档或 changelog 文章中展示产品截图、录屏与演示时，用 Browser 提供真实的浏览器窗框。
- 需要让静态截图获得“可运行产品”的视觉语境，又不想引入真实交互组件时。

## 何时不应使用

- 不要在 Browser 框架里渲染真实产品 UI——窗框暗示这是截图，不是可交互的界面。
- 不要用 Browser 包裹需要用户操作的实时组件；真实交互请直接用组件本身。

## 示例

### 基本组合

在浏览器窗口框架内放置截图或演示内容，展示标准的营销展示结构。

## 无障碍

- 浏览器窗框是装饰性元素，应携带 aria-hidden；实际语义由内部图片或视频承载。
- 内部截图必须提供描述产品状态的替代文本，而不是复述窗框装饰。

## 受控行为

不适用: Browser 是纯展示型框架组件，不管理任何交互状态。

## 响应式行为

- 窗框随容器宽度等比缩放，内部媒体保持自身宽高比。
- 在窄视口下窗框装饰（地址栏等）随整体缩小，不单独换行。

## 主题行为

- 窗框背景与边框颜色跟随主题变量，暗色模式下呈现深色窗口外观。
- 交通灯圆点等装饰色在两种主题下保持辨识度。

## 实时示例

https://vercel.com

Screenshot or demo content

```tsx
import { Browser } from "@/components/ui/browser";

export function BrowserComposition47FCA483Example() {
  return (
    <div className="w-full max-w-2xl">
      <Browser address="https://vercel.com">
        <div className="flex h-24 items-center justify-center bg-gray-alpha-100 text-copy-14 text-muted-foreground">
          Screenshot or demo content
        </div>
      </Browser>
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Browser } from "@/components/ui/browser";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">address</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">装饰性浏览器框中显示的地址。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 在落地页、文档和 changelog 文章中，把 Browser 用作截图、demo 和录屏周围的营销 chrome。
- 不要在 Browser 框内渲染真实产品 UI；chrome 暗示的是截图，而非可交互界面。
- 浏览器 chrome 是装饰性的，应携带 aria-hidden；含义由内部图片或视频承载。
