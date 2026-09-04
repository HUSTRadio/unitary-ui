# 手册

> Route: `/components/book`

响应式书籍封面组件。

[返回组件](#/components)

# 手册

Book

响应式书籍封面组件。

## 何时使用

- 在营销页面、文档着陆页封面和更新日志的醒目位置使用 Book，内容为标题载体时需要书籍的隐喻。
- 使用简单（simple）风格让标题主导设计，或使用条纹（stripe）风格用图标或彩色条纹添加类别层级。
- 在孤立的主题摄影场景中保留纹理处理，用于单篇文章或章节的视觉呈现。

## 何时不应使用

- 不要在产品信息卡和管理仪表板的平铺中使用 Book——它过于装饰性，不适合重复排列的 UI 行。
- 不要把 Book 当作可交互的内容编辑器——它是纯粹的展示框架，不支持编辑功能。
- 不要在需要无障碍优先的场景中将封面作为主要内容源——封面应被视为装饰元素，标题应由底层标题元素提供。

## 示例

### 默认手册

展示 Book 的基本用法，包含封面、书脊和厚度效果。

### 变体

展示 simple 和 stripe 两种风格变体。

### 自定义插图

展示如何替换内置插画并自定义颜色，创建个性化的书籍封面效果。

## 无障碍

- Book 的封面应标记为装饰性 chrome，标题应通过底层的 heading 元素呈现，以免屏幕阅读器双重朗读。
- 封面插图的 alt 文本应为空（decorative="true"），因为实际意义已在标题中体现。
- 书页厚度效果不应影响核心内容的可读性和聚焦能力。

## 受控行为

不适用: Book 是无交互的展示型组件，没有任何状态转换或受控属性；封面造型完全通过 props 配置。

## 响应式行为

- Book 使用响应式宽度来保留封面的宽高比，在不同视口下自动缩放而不失真。
- 窄屏上书名可能缩小字号或启用多行，但保持封面比例的完整性。

## 主题行为

- Book 的阴影、边框和渐变效果跟随主题变量，在暗色/亮色模式下自动适配。
- 可通过 props 自定义颜色（custom color）覆盖默认主题色，实现品牌一致性。

## 实时示例

The user experience of the Frontend Cloud

```tsx
import { Book } from "@/components/ui/book";

export function BookDefault21B111CBExample() {
  return <Book title="The user experience of the Frontend Cloud" />;
}
```

## 变体

The user experience of the Frontend Cloud

The user experience of the Frontend Cloud

```tsx
import { Book } from "@/components/ui/book";

export function BookVariants63D2643BExample() {
  return (
    <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
      <Book title="The user experience of the Frontend Cloud" variant="simple" width={196} />
      <Book title="The user experience of the Frontend Cloud" variant="stripe" width={196} />
    </div>
  );
}
```

## 自定义颜色

How Vercel improves your website's search engine ranking

Design Engineering at Vercel

The user experience of the Frontend Cloud

```tsx
import { Book } from "@/components/ui/book";

export function BookCustomColorA5F69A18Example() {
  return (
    <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
      <Book color="#9D2127" title="How Vercel improves your website's search engine ranking" />
      <Book
        color="#7DC1C1"
        textColor="white"
        title="Design Engineering at Vercel"
        variant="simple"
      />
      <Book color="#FED954" title="The user experience of the Frontend Cloud" />
    </div>
  );
}
```

## 自定义图标

Vercel Platform Guide

Next.js Documentation

React Essentials

```tsx
import { Book } from "@/components/ui/book";
import { ArrowRight, Atom, Triangle } from "lucide-react";

export function BookCustomIconEE5755A2Example() {
  return (
    <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
      <Book icon={<Triangle className="size-4" aria-hidden />} title="Vercel Platform Guide" />
      <Book icon={<ArrowRight className="size-4" aria-hidden />} title="Next.js Documentation" />
      <Book icon={<Atom className="size-4" aria-hidden />} title="React Essentials" />
    </div>
  );
}
```

## Custom illustration

The user experience of the Frontend Cloud

The user experience of the Frontend Cloud

```tsx
import { Book } from "@/components/ui/book";
import { ChartColumn, Waves } from "lucide-react";

export function BookCustomIllustration79A95CD3Example() {
  return (
    <div className="flex flex-row items-stretch justify-start gap-8 flex-initial">
      <Book
        illustration={<Waves className="size-8" aria-hidden />}
        title="The user experience of the Frontend Cloud"
      />
      <Book
        illustration={<ChartColumn className="size-8" aria-hidden />}
        title="The user experience of the Frontend Cloud"
        variant="simple"
      />
    </div>
  );
}
```

## Responsive

The user experience of the Frontend Cloud

```tsx
import { Book } from "@/components/ui/book";

export function BookResponsiveDE779794Example() {
  return <Book title="The user experience of the Frontend Cloud" width={{ sm: 150, md: 196 }} />;
}
```

## Width

The user experience of the Frontend Cloud

The user experience of the Frontend Cloud

The user experience of the Frontend Cloud

```tsx
import { Book } from "@/components/ui/book";

export function BookWidth3019947BExample() {
  return (
    <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
      <Book title="The user experience of the Frontend Cloud" width={300} />
      <Book title="The user experience of the Frontend Cloud" width={200} />
      <Book title="The user experience of the Frontend Cloud" width={150} />
    </div>
  );
}
```

## Textured

Design Engineering at Vercel

Design Engineering at Vercel

Design Engineering at Vercel

Design Engineering at Vercel

Design Engineering at Vercel

Design Engineering at Vercel

```tsx
import { Book } from "@/components/ui/book";

export function BookTexturedB29877FBExample() {
  return (
    <div className="flex flex-col items-stretch justify-start gap-12 flex-initial">
      <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
        <Book color="#7DC1C1" textured title="Design Engineering at Vercel" />
        <Book color="#9D2127" textured title="Design Engineering at Vercel" />
        <Book color="#FED954" textured title="Design Engineering at Vercel" />
      </div>
      <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
        <Book
          color="#7DC1C1"
          textColor="white"
          textured
          title="Design Engineering at Vercel"
          variant="simple"
        />
        <Book
          color="#9D2127"
          textColor="#ece4db"
          textured
          title="Design Engineering at Vercel"
          variant="simple"
        />
        <Book
          color="#FED954"
          textColor="#9d3b05"
          textured
          title="Design Engineering at Vercel"
          variant="simple"
        />
      </div>
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Book } from "@/components/ui/book";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">手册封面标题。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 在营销页、文档落地封面和 changelog 主视觉中使用 Book，这类内容需要「带标签的书卷」这一隐喻。
- 产品内卡片与仪表盘磁贴使用 Card；Book 对重复出现的 UI 行来说过于装饰性。
- 当标题承担设计时用 simple；当图标或色条增加分类层级时用 stripe。
- 使用响应式宽度保持封面比例；textured 处理仅用于独立的 hero 图。
- 把封面视为装饰性 chrome，标题经由底层标题元素呈现，避免屏幕阅读器重复播报。
