# 加载更多按钮

> Route: `/components/load-more-button`

向分页列表追加更多项目的全宽按钮。

[返回组件](#/components)

# 加载更多按钮

Load More Button

向分页列表追加更多项目的全宽按钮。

## 何时使用

- 用户在信息流或数据列表中需要手动触发加载更多内容时，比自动加载更能让用户掌控浏览节奏。
- 列表内容分多页加载，需要在当前页面底部放置一个明确的加载更多入口来保持页面结构清晰。

## 何时不应使用

- 如果可以使用无限滚动（监听视口位置自动加载），优先使用自动加载而非要求用户每次手动点击按钮。
- 对于固定数量的完整数据集，应使用编号分页器让用户可以自由跳转到任何页码，而不是仅支持向后追加。

## 示例

### 默认加载更多按钮

最基本的加载更多内容按钮：占据整行宽度，带有标准的加载状态和文案，适用于大多数需要分页加载数据的场景。

### 加载中状态

按钮在进入加载状态后显示旋转指示器和禁用外观，防止用户重复提交请求，同时传达系统正在处理新内容的信号。

### 自定义空闲文案

children 可定制非加载状态的按钮文案；loading=true 时组件固定显示本地化的 Loading...。

## 无障碍

- 按钮使用原生 <button> 元素，确保键盘用户可通过 Tab 导航和操作，并在加载状态下自动禁用以防止重复触发。
- 加载状态下的按钮会通过 aria-busy 告知屏幕阅读器当前正在加载新内容。

## 受控行为

- 通过 loading prop 控制按钮的加载状态，调用方管理数据加载的生命周期并在完成时重置按钮状态。
- 可以通过 onClick 回调拦截点击事件来处理实际的数据加载逻辑，按钮本身不执行网络请求。

## 响应式行为

不适用: Load More Button 始终占据容器全宽，其尺寸变化由外层容器的填充和间距决定。组件自身不包含响应式断点逻辑。

## 主题行为

- 按钮的背景色、边框和文字颜色均从主题令牌获取，包括深色模式下的自动适配和高对比度模式的特殊处理。
- 加载状态的渐变动画和禁用态的透明度遵循设计系统的交互反馈规范。

## 实时示例

3 results loaded

```tsx
import { useState } from "react";
import { LoadMoreButton } from "@/components/ui/load-more-button";

export function LoadMoreButtonDefault21B111CBExample() {
  const [count, setCount] = useState(3);

  return (
    <div className="flex w-full flex-col gap-3">
      <p role="status" className="text-copy-13 text-muted-foreground">
        {count} results loaded
      </p>
      <LoadMoreButton onClick={() => setCount((value) => value + 3)}>Load More</LoadMoreButton>
    </div>
  );
}
```

## 加载中

```tsx
import { LoadMoreButton } from "@/components/ui/load-more-button";

export function LoadMoreButtonLoadingDC380888Example() {
  return <LoadMoreButton loading>Loading...</LoadMoreButton>;
}
```

## 无间距

3 results loaded

```tsx
import { useState } from "react";
import { LoadMoreButton } from "@/components/ui/load-more-button";

export function LoadMoreButtonNoGap7BF8EBE8Example() {
  const [count, setCount] = useState(3);

  return (
    <div className="flex w-full flex-col">
      <p role="status" className="text-copy-13 text-muted-foreground">
        {count} results loaded
      </p>
      <LoadMoreButton noGap onClick={() => setCount((value) => value + 3)}>
        Load More
      </LoadMoreButton>
    </div>
  );
}
```

## 无圆角

3 results loaded

```tsx
import { useState } from "react";
import { LoadMoreButton } from "@/components/ui/load-more-button";

export function LoadMoreButtonNoBorderRadius7DFF5DD3Example() {
  const [count, setCount] = useState(3);

  return (
    <div className="flex w-full flex-col gap-3">
      <p role="status" className="text-copy-13 text-muted-foreground">
        {count} results loaded
      </p>
      <LoadMoreButton noBorderRadius onClick={() => setCount((value) => value + 3)}>
        Load More
      </LoadMoreButton>
    </div>
  );
}
```

## 自定义文案

3 results loaded

```tsx
import { useState } from "react";
import { LoadMoreButton } from "@/components/ui/load-more-button";

export function LoadMoreButtonCustomTextCFD55183Example() {
  const [count, setCount] = useState(3);

  return (
    <div className="flex w-full flex-col gap-3">
      <p role="status" className="text-copy-13 text-muted-foreground">
        {count} results loaded
      </p>
      <LoadMoreButton onClick={() => setCount((value) => value + 3)}>
        Show More Results
      </LoadMoreButton>
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { LoadMoreButton } from "@/components/ui/load-more-button";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">loading</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">加载更多结果时显示进度。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
