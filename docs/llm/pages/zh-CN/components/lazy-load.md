# 延迟加载

> Route: `/components/lazy-load`

内容接近视口或局部滚动容器时首次挂载。

[返回组件](#/components)

# 延迟加载

lazy-load

内容接近视口或局部滚动容器时首次挂载。

## 何时使用

- 长列表、屏外图表或媒体希望在接近视口时才挂载。

## 何时不应使用

- 首屏关键内容应立即显示；简单图片优先使用原生 loading="lazy"。

## 示例

### 局部滚动容器中的图片

占位骨架保留图片宽高比；滚动后观察已挂载数量增加，离开视口后仍保持挂载。

## 无障碍

- 为加载后的图片提供 alt；占位尺寸由调用方预留；LazyLoad 不默认播报每次挂载。

## 受控行为

- 首次达到 rootMargin 与 threshold 条件时挂载一次；之后保留内容及其内部状态。
- onLoad 表示挂载而非网络请求完成；disabled 或缺少 IntersectionObserver 时立即渲染。
- 延迟内容不包含在服务端 HTML 中；需要立即服务端渲染时使用 disabled。

## 响应式行为

- root 可以是局部滚动容器；默认 null 表示浏览器视口，rootMargin 默认 200px。
- 通过宽高、min-height 或 aspect-ratio 保留占位尺寸，避免观察器目标没有高度及布局跳动。

## 主题行为

- 组件不设置视觉主题；演示通过 Skeleton 和背景 token 适配主题。

## 实时示例

已挂载 1 / 6 张图片；向下滚动加载更多。

![风景插画 1](/gallery-coast.svg)

```tsx
import { useState } from "react";
import { LazyLoad } from "@/components/ui/lazy-load";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n";

export default function LazyLoadExample() {
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(0);
  const { locale } = useI18n();
  const zh = locale === "zh-CN";
  return (
    <div className="w-full space-y-3">
      <p role="status" className="text-copy-14 text-muted-foreground">
        {zh
          ? `已挂载 ${loaded} / 6 张图片；向下滚动加载更多。`
          : `${loaded} / 6 images mounted; scroll down to load more.`}
      </p>
      <div
        ref={setViewport}
        data-slot="lazy-demo-viewport"
        tabIndex={0}
        aria-label={zh ? "延迟加载图片列表" : "Lazy image list"}
        className="h-80 overflow-y-auto rounded-lg border border-border p-3 focus-ring"
      >
        <div className="space-y-4">
          {["coast", "desert", "forest", "coast", "desert", "forest"].map((name, position) => (
            <LazyLoad
              key={position}
              root={viewport}
              rootMargin="80px"
              className="aspect-[16/9] w-full overflow-hidden rounded-md"
              placeholder={<Skeleton className="h-full w-full" />}
              onLoad={() => setLoaded((count) => count + 1)}
            >
              <img
                src={`/gallery-${name}.svg`}
                alt={zh ? `风景插画 ${position + 1}` : `Landscape illustration ${position + 1}`}
                width={960}
                height={540}
                className="h-full w-full object-cover"
              />
            </LazyLoad>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { LazyLoad } from "@/components/ui/lazy-load";
```

还支持以下类型中定义的属性：`ComponentProps<"div">`

### 属性与回调

本表 API 均为 Unitary 扩展。

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">placeholder</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">首次显示前的占位内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">root</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Element | Document | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">IntersectionObserver 滚动根节点；null 使用浏览器视口。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">null</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">rootMargin</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">观察器边距，用于提前加载。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"200px"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">threshold</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">要求的相交比例。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">0</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onLoad</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">延迟内容首次挂载时调用一次；不代表图片下载完成。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">disabled</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">立即渲染内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">首次挂载后保持挂载的内容子树。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 通过占位内容预留尺寸，避免布局跳动。
- 简单图片可使用原生 loading="lazy"；需要延迟整个子树时使用 LazyLoad。
