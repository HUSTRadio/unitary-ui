# 数据表格

> Route: `/components/data-table`

用带类型的列渲染调用方持有的行数据，并显式处理加载、空与错误状态。

[返回组件](#/components)

# 数据表格

data-table

用带类型的列渲染调用方持有的行数据，并显式处理加载、空与错误状态。

## 何时使用

- 同一批数据要用多列对照阅读，且每列有自己的渲染方式（链接、徽标、数值对齐）。
- 需要稳定的行标识来避免列表重排或单元格重建。
- 加载、空、错误三种状态需要与表格骨架统一呈现。

## 何时不应使用

- 少量键值对用 Description；单列清单用 Bar List。
- 需要排序、选择、编辑或虚拟滚动时，等对应能力交付后再用；v1 只做展示。
- 需要自定义表头合并、复杂 colSpan 排版时直接用 Table 组合。

## 示例

### 列定义与四种状态

columns 决定表头与单元格，rows 与 getRowKey 决定数据行；切换 loading / empty / error 观察状态互斥。

## 无障碍

不适用: 本轮不含无障碍增强：DataTable 复用 Table 的语义化 table 结构，不额外声明 aria-sort、选择态或键盘网格导航；这些留待表格交互专项。

## 受控行为

- rows 完全受控：组件不复制、不排序、不筛选，也不发起请求。
- loading 优先于 error，error 优先于 empty，三者都显式传入，不由空数组推断。
- getRowKey(row, index) 每行调用一次，key 稳定时行节点在重渲染间保持不变。
- onRowClick 只回调行数据与下标，选中态与导航由调用方决定。

## 响应式行为

- 容器使用 w-full min-w-0，表格随外层宽度伸缩，不撑破栅格。
- 列宽可传数字或 CSS 长度写入 colgroup；不传时由 Table 自行分配。
- 骨架行与错误消息行复用同一列数，切换状态时表头不跳动。

## 主题行为

- 外观通过 colorScheme 透传给 Table（basic / striped / bordered / interactive），颜色全部来自既有语义 token。
- 骨架块使用 gray-alpha-300，并在 motion-reduce 下关闭脉冲动画。

## 实时示例

<table class="w-full caption-bottom border-collapse text-copy-14 text-muted-foreground"><caption class="mt-4 text-copy-13 text-muted-foreground">Build artifacts</caption><colgroup class=""><col class=""><col class="" style="width: 120px;"><col class="" style="width: 160px;"></colgroup><thead class="[&amp;_tr]:border-b [&amp;_tr]:border-gray-alpha-400" data-header-row=""><tr class="transition-colors data-[state=selected]:bg-gray-100"><th scope="col" class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Artifact</th><th scope="col" class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right align-middle">Size</th><th scope="col" class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right align-middle">Updated</th></tr></thead><tbody class="[&amp;_td:first-child]:rounded-l-sm [&amp;_td:last-child]:rounded-r-sm [&amp;_tr:where(:nth-child(odd))]:bg-background-200"><tr class="transition-colors data-[state=selected]:bg-gray-100" data-row-index="0"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">unitary-ui-0.1.0-beta.1.tgz</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right align-middle">1.2 MB</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right align-middle">2 minutes ago</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-row-index="1"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">unitary-ui.css</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right align-middle">643 kB</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right align-middle">2 minutes ago</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-row-index="2"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">types.tar.gz</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right align-middle">310 kB</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right align-middle">5 minutes ago</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-row-index="3"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">fonts.zip</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right align-middle">25.2 MB</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right align-middle">yesterday</td></tr></tbody></table>

```tsx
import { useState } from "react";
import { Button, DataTable, type DataTableColumn } from "@hustradio/unitary-ui";

interface Artifact {
  id: string;
  name: string;
  size: string;
  updated: string;
}

const rows: Artifact[] = [
  { id: "a", name: "unitary-ui-0.1.0-beta.1.tgz", size: "1.2 MB", updated: "2 minutes ago" },
  { id: "b", name: "unitary-ui.css", size: "643 kB", updated: "2 minutes ago" },
  { id: "c", name: "types.tar.gz", size: "310 kB", updated: "5 minutes ago" },
  { id: "d", name: "fonts.zip", size: "25.2 MB", updated: "yesterday" },
];

const columns: DataTableColumn<Artifact>[] = [
  { id: "name", header: "Artifact", cell: (row) => row.name },
  { id: "size", header: "Size", cell: (row) => row.size, align: "right", width: 120 },
  { id: "updated", header: "Updated", cell: (row) => row.updated, align: "right", width: 160 },
];

type DemoState = "ready" | "loading" | "empty" | "error";

export function DataTableBasic4E2D81B7Example() {
  const [state, setState] = useState<DemoState>("ready");

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {(["ready", "loading", "empty", "error"] as DemoState[]).map((option) => (
          <Button
            key={option}
            type={state === option ? "default" : "tertiary"}
            size="tiny"
            onClick={() => setState(option)}
          >
            {option}
          </Button>
        ))}
      </div>
      <DataTable<Artifact>
        caption="Build artifacts"
        columns={columns}
        rows={state === "empty" ? [] : rows}
        getRowKey={(row) => row.id}
        colorScheme="striped"
        headerRow
        loading={state === "loading"}
        loadingRows={3}
        empty="No artifacts have been published yet."
        error={
          state === "error"
            ? "Could not load artifacts. Retry when the network recovers."
            : undefined
        }
      />
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { DataTable } from "@hustradio/unitary-ui";
```

还支持以下类型中定义的属性：`ComponentProps<"div">`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">columns</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">DataTableColumn&lt;T&gt;[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">带 id、表头与单元格渲染的列定义。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">rows</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">readonly T[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">调用方持有的行，按给定顺序渲染。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">getRowKey</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(row, index) =&gt; Key</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">稳定的行标识。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">caption</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可选的表格标题。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">loading</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">渲染骨架行而非数据行。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">loadingRows</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">加载时的骨架行数。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">3</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">error</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">渲染一条跨列消息行；优先于空态与数据行。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">empty</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">空数据时的消息。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">colorScheme</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"basic" | "striped" | "bordered" | "interactive"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">透传给 Table 的外观。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">headerRow</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">把表头行标记为列头（scope=col）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">headerCol</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">把首列标记为行头。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">columnDividers</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">在单元格之间添加分隔线。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">rowHeight</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number | "auto"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">固定行高或内容自适应。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">align</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">MaybeAlign</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">表格默认单元格对齐。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">frame</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"outline" | "none"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">透传给 TableRoot 的外框。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">rowClassName</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(row, index) =&gt; string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">逐行类名钩子。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onRowClick</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(row, index) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">行点击回调；同时加上指针光标。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- rows 是唯一数据源，并提供 getRowKey；DataTable 不排序、不筛选、不分页。
- 列 id 保持稳定，单元格在多次渲染间才不会重建。
- 加载、空、错误都是显式属性，不要用空数组去猜。
- 分页、排序、选择由调用方组合；v1 只做展示层。
