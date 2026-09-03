# 搜索框

> Route: `/components/search-input`

带标准前置图标的搜索字段。

[返回组件](#/components)

# 搜索框

Search Input

带标准前置图标的搜索字段。

## 何时使用

- 需要用户输入文本查询驱动结果过滤的场景。
- 需要一个带可视化搜索图标前缀、便于识别的输入控件。

## 何时不应使用

- 用于普通表单输入（姓名、地址等），应使用通用 Input 组件。
- 仅需静态文字展示时，不应使用交互型输入控件。

## 示例

### 基础搜索输入

最简单的搜索输入用法，带有默认搜索图标前缀和占位提示文本。

### 加载中状态的搜索输入

在搜索结果正在更新时通过加载指示器向用户提供实时反馈。

## 无障碍

- 输入框拥有语义明确的类型（role=search）和可访问名称，方便屏幕阅读器识别用途。
- 应与可见标签或等效的可访问名称关联，以确保无障碍上下文完整。

## 受控行为

不适用: 搜索输入以展示查询值为主，受控行为依赖上层组件管理 value 和 onChange，组件自身不具备额外的受控特性。

## 响应式行为

- 在不同视口宽度下自适应输入框宽度，保持可点击的命中区域。

## 主题行为

- 支持暗色模式下颜色反转，并可与整体品牌主题保持一致。

## 实时示例

```tsx
import { SearchInput } from "@/components/ui/search-input";
import { useState } from "react";

export function SearchInputDefault37A8EEC1Example() {
  const [value, setValue] = useState("");

  return (
    <SearchInput
      aria-label="Search"
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
```

## with-cmdk

⌘K

```tsx
import { SearchInput } from "@/components/ui/search-input";
import { useState } from "react";

export function SearchInputWithCmdkC25FADFBExample() {
  const [value, setValue] = useState("");

  return (
    <SearchInput
      aria-label="Search"
      cmdk
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
```

## disabled

⌘K

```tsx
import { SearchInput } from "@/components/ui/search-input";
import { useState } from "react";

export function SearchInputDisabled17EB3C01Example() {
  const [value, setValue] = useState("");

  return (
    <SearchInput
      aria-label="Search"
      cmdk
      disabled
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
```

## loading

加载中

```tsx
import { SearchInput } from "@/components/ui/search-input";
import { useState } from "react";

export function SearchInputLoadingB4A070A2Example() {
  const [value, setValue] = useState("Project A");

  return (
    <SearchInput
      aria-label="Search"
      loading
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
```

## custom-prefix

```tsx
import { Sparkles } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { useState } from "react";

export function SearchInputCustomPrefix3441EADCExample() {
  const [value, setValue] = useState("");

  return (
    <SearchInput
      aria-label="Search"
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      prefix={<Sparkles className="size-4" aria-hidden />}
      value={value}
    />
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { SearchInput } from "@/components/ui/search-input";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控搜索词。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">React.ChangeEventHandler&lt;HTMLInputElement&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">接收原生输入变更事件。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">cmdk</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">空值时显示 Command-K 提示。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">loading</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">用加载器替换搜索图标。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">prefix</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">自定义前置内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 查询驱动的过滤用 Search Input，而非普通表单文本输入。
- 提供可见标签或等效可访问名称，并在结果更新时保留查询。
