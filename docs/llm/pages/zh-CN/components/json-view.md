# JSON 查看器

> Route: `/components/json-view`

以语法高亮树渲染 JSON。

[返回组件](#/components)

# JSON 查看器

JsonView

以语法高亮树渲染 JSON。

## 何时使用

- 用户需要检查、浏览或折叠展开 JSON 对象/数组时，交互式查看是核心功能。
- 作为产品界面的一部分展示 API 返回的结构化数据，允许用户逐层探索数据结构。

## 何时不应使用

- 当数据是静态文档内容而非交互式产品界面时，应使用普通的代码块，JSON View 的交互特性是不必要的开销。
- 不要将已经 stringify 的 JSON 字符串传入 data 属性——应保持原始对象或数组格式以便组件正确渲染树形结构。

## 示例

### 单行模式

将整个 JSON 对象压缩为单行展示，适合篇幅较小的数据结构或需要快速预览的场景。

### 自动换行

长键名和长值会在容器边缘自动换行，避免水平滚动条出现，适合宽表格内的紧凑布局。

### 折叠状态

默认折叠深层嵌套节点以减少初始渲染量，用户可以逐级展开感兴趣的分支，提升大数据结构的浏览效率。

### 高亮文本匹配

通过 highlightPattern 正则高亮键名或原始值中的匹配文本，帮助用户快速定位重要字段。

## 无障碍

- JSON View 的可展开/折叠节点支持键盘导航，用户可以使用方向键和回车键来遍历整个数据结构。
- 每个节点都有语义化的角色和标签，屏幕阅读器可以正确播报层级和键值信息。

## 受控行为

- 通过 defaultExpandDepth 设置初始展开深度；展开集合随后由组件内部管理。
- 组件不提供受控 expandedKeys 或展开变更回调；如需外部持有展开状态，应在调用方使用其他树组件。

## 响应式行为

不适用: JsonView 使用固定字号和缩进，不设置随视口变化的最大高度或纵向滚动；需要这些约束时由调用方容器提供。

## 主题行为

- 树的基础文字和背景跟随主题；字符串、数字、布尔值和 null 使用组件定义的语法配色。
- 匹配文本使用固定黄色高亮，键名使用显式亮/暗色值；不要把它描述为可配置的完整主题令牌方案。

## 实时示例

```tsx
{deployment: { … },cached: false,durationMs: 42}
```

## 单行

```tsx
{
  foo: "bar";
}
```

```tsx
import { JsonView } from "@/components/ui/json-view";

const data = {
  foo: "bar",
};

<JsonView data={data} defaultExpandDepth={1} />;
```

## 换行

```tsx
{
  browserApiUrl: "https://browser-api.vercel.sh/screenshot?url=https%3A%2F%2Fprocore-com-prod-f5vem4o6u-marketing-web-dev.vercel.app&width=1440&height=900&fullPage=true";
}
```

```tsx
import { JsonView } from "@/components/ui/json-view";

const data = {
  browserApiUrl:
    "https://browser-api.vercel.sh/screenshot?url=https%3A%2F%2Fprocore-com-prod-f5vem4o6u-marketing-web-dev.vercel.app&width=1440&height=900&fullPage=true",
};

<JsonView data={data} defaultExpandDepth={1} />;
```

## 折叠

```tsx
{ … }
```

```tsx
import { JsonView } from "@/components/ui/json-view";

const data = {
  trace: {
    spanId: "span_7Qk9b4",
    parentId: "span_root",
    service: "api",
  },
  request: {
    id: "req_00042",
    path: "/api/projects",
    method: "GET",
  },
  flags: ["enable-logs-json-rendering", "observability-panel"],
};

<JsonView data={data} defaultExpandDepth={0} />;
```

## 高亮

```tsx
{level: "error",requestId: "req_00042",deploymentId: "dpl_9WjH8QFQySx7",message: "Deployment request failed",statusCode: 500}
```

```tsx
import { JsonView, makeJsonViewHighlightPattern } from "@/components/ui/json-view";

const data = {
  level: "error",
  requestId: "req_00042",
  deploymentId: "dpl_9WjH8QFQySx7",
  message: "Deployment request failed",
  statusCode: 500,
};

const highlightPattern = makeJsonViewHighlightPattern(["request", "failed"]);

<JsonView data={data} defaultExpandDepth={1} highlightPattern={highlightPattern} />;
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { JsonView, makeJsonViewHighlightPattern } from "@/components/ui/json-view";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">data</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">unknown</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">以 JSON 树展示的数据。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultExpandDepth</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">初始展开深度；0 会折叠根节点。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">highlightPattern</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">RegExp | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">高亮匹配的键与原始值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 需要用户检查、扫读、折叠或展开的 JSON 对象或数组用 JSON View；需要复制时另配复制控件。
- 值是静态文档而非交互产品界面时用普通代码块。
- 源数据保持为对象或数组。传给 data 前不要预先 stringify JSON。
