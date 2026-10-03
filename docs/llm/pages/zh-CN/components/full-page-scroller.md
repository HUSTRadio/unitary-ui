# 整屏滚动

> Route: `/components/full-page-scroller`

滚轮或触摸手势达到阈值后，一次切换一个视口大小的区块。

[返回组件](#/components)

# 整屏滚动

full-page-scroller

滚轮或触摸手势达到阈值后，一次切换一个视口大小的区块。

## 何时使用

- 演示、分屏叙事和一次浏览一个区块的页面。

## 何时不应使用

- 长文档、表格和普通网页内容应使用原生滚动或 Scroller。

## 示例

### 整屏滚动与全屏体验

鼠标累计 80px 或手指滑动 50px 后切屏；可进入浏览器全屏，Escape 退出。

## 无障碍

- 聚焦容器后使用方向键、PageUp/PageDown、Home/End；各屏具有序号标签。
- 非当前屏设置 inert 与 aria-hidden；内部输入控件保留自己的键盘行为；减少动态效果偏好关闭过渡。

## 受控行为

- index 是零起始索引；defaultIndex 初始化非受控状态；onIndexChange 报告请求的下一屏。
- 一次滚轮手势及其惯性尾部只翻一屏；新手势需要等待过渡结束和 160ms 静默。多指和缩放手势不触发翻屏。

## 响应式行为

- 默认高度是 100dvh；预览可覆盖为固定高度。orientation 支持 vertical/horizontal。
- 各屏溢出内容先在内部滚动，首尾边界允许页面继续滚动。

## 主题行为

- 容器不强制背景；演示使用共享主题变量，过渡使用 slower 时长和 ease-snap。

## 实时示例

第 1 屏 / 3

![](/gallery-coast.svg)

### 第 1 屏

滚动或滑动达到阈值后切换整屏，也可以使用方向键。

![](/gallery-desert.svg)

### 第 2 屏

滚动或滑动达到阈值后切换整屏，也可以使用方向键。

![](/gallery-forest.svg)

### 第 3 屏

滚动或滑动达到阈值后切换整屏，也可以使用方向键。

```tsx
import { useRef, useState } from "react";
import { FullPageScroller } from "@/components/ui/full-page-scroller";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export default function FullPageExample() {
  const frame = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const { locale } = useI18n();
  const zh = locale === "zh-CN";
  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="text-copy-14 text-muted-foreground">
          {zh ? `第 ${index + 1} 屏 / 3` : `Section ${index + 1} / 3`}
        </p>
        <Button
          typeName="button"
          type="secondary"
          onClick={() => frame.current?.requestFullscreen?.()}
        >
          {zh ? "全屏体验" : "Open fullscreen"}
        </Button>
      </div>
      <div
        ref={frame}
        className="h-80 w-full overflow-hidden rounded-lg border border-border bg-background [&:fullscreen]:h-dvh [&:fullscreen]:rounded-none [&:fullscreen]:border-0"
      >
        <FullPageScroller
          className="h-full"
          index={index}
          onIndexChange={setIndex}
          wheelThreshold={80}
          touchThreshold={50}
        >
          {["coast", "desert", "forest"].map((name, position) => (
            <div key={name} className="relative flex h-full w-full items-center justify-center">
              <img
                src={`/gallery-${name}.svg`}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="relative mx-6 rounded-lg bg-background-100/90 p-5 text-center text-foreground">
                <h3 className="text-heading-24">
                  {zh ? `第 ${position + 1} 屏` : `Section ${position + 1}`}
                </h3>
                <p className="mt-2 text-copy-14">
                  {zh
                    ? "滚动或滑动达到阈值后切换整屏，也可以使用方向键。"
                    : "Scroll or swipe past the threshold to change sections, or use the arrow keys."}
                </p>
              </div>
            </div>
          ))}
        </FullPageScroller>
      </div>
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { FullPageScroller } from "@/components/ui/full-page-scroller";
```

还支持以下类型中定义的属性：`Omit<ComponentProps<"div">, "onChange">`

### 属性与回调

本表 API 均为 Unitary 扩展。

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">orientation</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"vertical" | "horizontal"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">整屏切换方向。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"vertical"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">index</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控的零起始区块索引。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultIndex</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">非受控模式的初始索引。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">0</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onIndexChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(index: number) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">报告请求切换到的区块索引。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">wheelThreshold</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">累计滚轮阈值，单位像素；行和页单位会转换。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">80</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">touchThreshold</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">完成滑动时的最小距离，单位像素。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">50</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">disabled</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">禁用手势及键盘翻屏。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">每个直接子节点占据一整屏。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 保持各屏内容相关，并提供可见的进度提示。
- 整屏手势适合演示；较长内容应在各屏内部自然滚动。
