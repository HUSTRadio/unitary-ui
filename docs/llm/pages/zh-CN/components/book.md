# 手册

> Route: `/components/book`

用书籍封面造型展示文章、手册或营销内容。

[返回组件](#/components)

# 手册

book

用书籍封面造型展示文章、手册或营销内容。

## 何时使用

- 在营销页、文档首页或更新日志中，用书籍封面突出文章或手册。
- 使用简单（simple）风格让标题主导设计，或使用条纹（stripe）风格用图标或彩色条纹添加类别层级。
- 纹理效果适合单独展示的文章或章节封面。

## 何时不应使用

- 不要在产品信息卡和管理仪表板的平铺中使用 Book——它过于装饰性，不适合重复排列的 UI 行。
- Book 用于封面展示，不支持内容编辑。
- 重要标题和内容应以可读文字提供，不能只放在封面图中。

## 示例

### 默认手册

展示 Book 的基本用法，包含封面、书脊和厚度效果。

### 变体

展示 simple 和 stripe 两种风格变体。

### 自定义插图

展示如何替换内置插画并自定义颜色，创建个性化的书籍封面效果。

## 无障碍

- 标题使用可读文字；仅作装饰的图案应对屏幕阅读器隐藏。
- 自定义插图仅作装饰时，图片使用 alt=""，SVG 使用 aria-hidden。
- 书页厚度效果不应影响核心内容的可读性和聚焦能力。

## 受控行为

不适用: Book 是展示组件，没有任何状态转换或受控属性；封面造型完全通过 props 配置。

## 响应式行为

- width 可传数值或按断点设置的宽度，封面按比例缩放。
- 窄屏上应保持书名简短，并检查所设宽度是否适合容器。

## 主题行为

- Book 的阴影、边框和渐变效果跟随主题变量，适配明暗主题。
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

How Unitary improves your website's search engine ranking

Design Engineering at Unitary

The user experience of the Frontend Cloud

```tsx
import { Book } from "@/components/ui/book";

export function BookCustomColorA5F69A18Example() {
  return (
    <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
      <Book color="#9D2127" title="How Unitary improves your website's search engine ranking" />
      <Book
        color="#7DC1C1"
        textColor="white"
        title="Design Engineering at Unitary"
        variant="simple"
      />
      <Book color="#FED954" title="The user experience of the Frontend Cloud" />
    </div>
  );
}
```

## 自定义图标

Unitary Platform Guide

Next.js Documentation

React Essentials

```tsx
import { Book } from "@/components/ui/book";
import { ArrowRight, Atom, Triangle } from "lucide-react";

export function BookCustomIconEE5755A2Example() {
  return (
    <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
      <Book icon={<Triangle className="size-4" aria-hidden />} title="Unitary Platform Guide" />
      <Book icon={<ArrowRight className="size-4" aria-hidden />} title="Next.js Documentation" />
      <Book icon={<Atom className="size-4" aria-hidden />} title="React Essentials" />
    </div>
  );
}
```

## 自定义插图

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

## 响应式

The user experience of the Frontend Cloud

```tsx
import { Book } from "@/components/ui/book";

export function BookResponsiveDE779794Example() {
  return <Book title="The user experience of the Frontend Cloud" width={{ sm: 150, md: 196 }} />;
}
```

## 自定义宽度

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

## 纹理封面

Design Engineering at Unitary

Design Engineering at Unitary

Design Engineering at Unitary

Design Engineering at Unitary

Design Engineering at Unitary

Design Engineering at Unitary

```tsx
import { Book } from "@/components/ui/book";

export function BookTexturedB29877FBExample() {
  return (
    <div className="flex flex-col items-stretch justify-start gap-12 flex-initial">
      <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
        <Book color="#7DC1C1" textured title="Design Engineering at Unitary" />
        <Book color="#9D2127" textured title="Design Engineering at Unitary" />
        <Book color="#FED954" textured title="Design Engineering at Unitary" />
      </div>
      <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
        <Book
          color="#7DC1C1"
          textColor="white"
          textured
          title="Design Engineering at Unitary"
          variant="simple"
        />
        <Book
          color="#9D2127"
          textColor="#ece4db"
          textured
          title="Design Engineering at Unitary"
          variant="simple"
        />
        <Book
          color="#FED954"
          textColor="#9d3b05"
          textured
          title="Design Engineering at Unitary"
          variant="simple"
        />
      </div>
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { Book } from "@/components/ui/book";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">手册封面标题。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 在营销页、文档首页或更新日志中，用 Book 突出文章或手册。
- 产品卡片和仪表盘列表使用 Card，避免重复使用装饰性封面。
- 以标题为主时用 simple；需要图标或分类色条时用 stripe。
- 用响应式 width 保持封面比例；纹理效果适合单独展示的封面。
- 标题使用可读文字；仅作装饰的图案应对屏幕阅读器隐藏。
