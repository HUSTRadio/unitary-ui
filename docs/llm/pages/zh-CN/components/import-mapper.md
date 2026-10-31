# 导入映射器

> Route: `/components/import-mapper`

把已解析的源列映射到目标字段，校验映射并预览行，然后再提交。

[返回组件](#/components)

# 导入映射器

import-mapper

把已解析的源列映射到目标字段，校验映射并预览行，然后再提交。

## 何时使用

- 用户已经选定文件、调用方也已解析出表头与行，接下来只需决定「哪一列对应哪个字段」。
- 需要在提交前让用户确认实际会被导入的内容。
- 必填字段与重复映射需要逐字段提示，而不是等到提交后才知道。

## 何时不应使用

- 还没解析文件时，先用 Upload/文件选择把内容读进来。
- 只是展示一个普通表单，用 Field 组合即可。
- 需要列级编辑与粘贴修正时，等 DataTable 编辑能力落地后再组合。

## 示例

### 映射、校验与预览

受控 mapping 决定预览列；把两个字段映射到同一列会立刻报重复，清空必填列则禁止提交。

## 无障碍

不适用: 本轮不含无障碍增强：字段错误通过可见文案与 Field 的 error 区域表达，未添加 aria-describedby/aria-invalid 等关联；播报策略由调用方决定。

## 受控行为

- source 与 mapping 都是受控输入：组件不读文件、不解析 CSV、不发请求，也不缓存映射。
- 校验是纯函数：必填缺失、重复映射、列越界三类问题逐字段给出一条，任意一条都阻止提交。
- 预览只显示已映射字段，行数受 previewLimit 控制；total 始终是源记录总数。
- 提交时把 resolveImportRows 的结果交给 onSubmit；pending 期间禁用提交，error 用 ErrorCard 呈现。

## 响应式行为

- 根容器 w-full min-w-0，字段行按列堆叠，窄屏不挤压下拉框。
- 预览复用 DataTable，宽度随容器收缩，列数等于已映射字段数。

## 主题行为

- 字段标签与错误文案使用既有 gray/error 语义色，下拉框复用 Select 的主题行为。
- 预览表沿用 DataTable 的 colorScheme="striped"，两档主题下都由语义 token 驱动。

## 实时示例

Import contacts

Name \*

Email \*

Note

<table class="w-full caption-bottom border-collapse text-copy-14 text-muted-foreground"><caption class="mt-4 text-copy-13 text-muted-foreground">预览 · 6</caption><colgroup class=""><col class=""><col class=""></colgroup><thead class="[&amp;_tr]:border-b [&amp;_tr]:border-gray-alpha-400" data-header-row=""><tr class="transition-colors data-[state=selected]:bg-gray-100"><th scope="col" class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Name</th><th scope="col" class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Email</th></tr></thead><tbody class="[&amp;_td:first-child]:rounded-l-sm [&amp;_td:last-child]:rounded-r-sm [&amp;_tr:where(:nth-child(odd))]:bg-background-200"><tr class="transition-colors data-[state=selected]:bg-gray-100" data-row-index="0"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Ada Lovelace</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">ada@example.com</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-row-index="1"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Grace Hopper</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">grace@example.com</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-row-index="2"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Alan Turing</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">alan@example.com</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-row-index="3"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Barbara Liskov</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">barbara@example.com</td></tr></tbody></table>

```tsx
import { useState } from "react";
import { ImportMapper, type ImportField, type ImportMapping } from "@hustradio/unitary-ui";

const source = {
  columns: ["Full name", "Mail", "Remark"],
  records: [
    ["Ada Lovelace", "ada@example.com", "first batch"],
    ["Grace Hopper", "grace@example.com", "first batch"],
    ["Alan Turing", "alan@example.com", "second batch"],
    ["Barbara Liskov", "barbara@example.com", ""],
    ["Edsger Dijkstra", "edsger@example.com", "second batch"],
    ["Ken Thompson", "ken@example.com", ""],
  ],
};

const fields: ImportField[] = [
  { id: "name", label: "Name", required: true },
  { id: "email", label: "Email", required: true },
  { id: "note", label: "Note" },
];

export function ImportMapperMapping3C7F0A15Example() {
  const [mapping, setMapping] = useState<ImportMapping>({ name: 0, email: 1 });
  const [imported, setImported] = useState<number | null>(null);

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <ImportMapper
        title="Import contacts"
        source={source}
        fields={fields}
        mapping={mapping}
        onMappingChange={(next) => setMapping(next)}
        onSubmit={(rows) => setImported(rows.length)}
        previewLimit={4}
      />
      {imported !== null ? (
        <p data-demo-status className="text-copy-13 text-gray-700">
          Imported {imported} rows.
        </p>
      ) : null}
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import {
  ImportMapper,
  validateImportMapping,
  buildImportPreview,
  resolveImportRows,
  canSubmitImport,
} from "@hustradio/unitary-ui";
```

还支持以下类型中定义的属性：`ComponentProps<"div">`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">source</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ImportSource</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">调用方提供的已解析表头与数据行。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">fields</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ImportField[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">目标字段：id、label、required。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">mapping</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ImportMapping</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控的字段到列映射；null 表示未映射。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onMappingChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(next) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">报出下一次完整映射。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onSubmit</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(rows) =&gt; void | Promise</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">接收按字段解析的行；省略则不渲染操作区。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">pending</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">禁用提交并切换为进行中文案。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">error</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">提交错误，渲染在 ErrorCard 中。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">标题。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">previewLimit</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">预览行数上限；&lt;= 0 表示不限。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">5</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">submitLabel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">提交按钮文案覆盖。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">pendingLabel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">进行中文案覆盖。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">emptyLabel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">源数据没有列时显示。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 文件解析自己做，只把 columns 与 records 传进来；组件不读文件、不发请求。
- 映射保持受控，提交被拒时可以恢复上一版映射。
- 必填缺失、重复映射、列越界是三类独立问题，任意一条都阻止提交。
- 预览只显示已映射字段，让复核的人看到真正会被导入的内容。
