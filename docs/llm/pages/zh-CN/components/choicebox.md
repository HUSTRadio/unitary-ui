# 选择框

> Route: `/components/choicebox`

承载更详细选项内容的大尺寸 Radio。

[返回组件](#/components)

# 选择框

Choicebox

承载更详细选项内容的大尺寸 Radio。

## 何时使用

-   选项受益于更大的点击目标，并需要附带描述或图标时，用 Choicebox 替代普通 Radio。
-   互斥选择用单选模式，可叠加的选择用多选模式——不要在同一组内混用。

## 何时不应使用

-   选项超过 4–6 个时改用 Select 或 Combobox，避免单个字段让整页滚动。
-   选项只有纯文本短标签且没有细节要展示时，普通 Radio 更紧凑。

## 示例

### 单选

互斥选项的单选卡片组。

### 多选

可叠加选择的多选卡片组。

### 自定义内容

在卡片内放置自定义内容（图标、描述、徽章等）。

## 无障碍

-   卡片整体是点击目标，但键盘语义仍是 radio/checkbox：方向键在组内移动，空格切换。
-   选中态不能只靠边框颜色，需保留可被辅助技术读取的选中语义。

## 受控行为

-   选中值由父组件受控；单选组内切换即时通知，多选组返回完整集合。
-   禁用项保留在焦点序列之外，不参与键盘遍历。

## 响应式行为

-   卡片网格随容器宽度自动折行；窄视口下退化为单列堆叠。
-   移动端保持足够卡片高度以充当舒适的大点击目标。

## 主题行为

-   选中边框、背景与描述文本颜色跟随主题变量。
-   暗色模式下选中卡片与未选中卡片保持清晰的层级差。

## 实时示例

Pro 试用两周免费

Pro立即开始

```tsx
import { ChoiceboxGroup, ChoiceboxGroupItem } from "@/components/ui/choicebox";
import { useState } from "react";

const [value, setValue] = useState("trial");

<ChoiceboxGroup
  label="select a plan"
  listClassName="flex-row"
  onChange={setValue}
  type="radio"
  value={value}
>
  <ChoiceboxGroupItem description="Free for two weeks" title="Pro Trial" value="trial" />
  <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro" />
</ChoiceboxGroup>
```

Pro 试用两周免费

Pro立即开始

```tsx
import { ChoiceboxGroup, ChoiceboxGroupItem } from "@/components/ui/choicebox";
import { useState } from "react";

const [value, setValue] = useState([] as string[]);

<ChoiceboxGroup
  label="select a plan"
  listClassName="flex-row"
  onChange={setValue}
  type="checkbox"
  value={value}
>
  <ChoiceboxGroupItem description="Free for two weeks" title="Pro Trial" value="trial" />
  <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro" />
</ChoiceboxGroup>
```

选项组已禁用

Pro 试用两周免费

Pro立即开始

单个输入已禁用

Pro 试用两周免费

Pro立即开始

```tsx
import { ChoiceboxGroup, ChoiceboxGroupItem } from "@/components/ui/choicebox";
import { useState } from "react";

const [value, setValue] = useState("");
const [value2, setValue2] = useState([] as string[]);

<div className="flex flex-col items-stretch justify-start gap-6">
  <ChoiceboxGroup
    disabled
    label="Choicebox group disabled"
    listClassName="flex-row"
    onChange={setValue}
    showLabel
    type="radio"
    value={value}
  >
    <ChoiceboxGroupItem description="Free for two weeks" title="Pro Trial" value="trial" />
    <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro" />
  </ChoiceboxGroup>

  <ChoiceboxGroup
    label="Single input disabled"
    listClassName="flex-row"
    onChange={setValue2}
    showLabel
    type="checkbox"
    value={value2}
  >
    <ChoiceboxGroupItem description="Free for two weeks" disabled title="Pro Trial" value="trial" />
    <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro" />
  </ChoiceboxGroup>
</div>
```

Pro 试用两周免费

Trial

Pro立即开始

```tsx
import { Badge } from "@/components/ui/badge";
import { ChoiceboxGroup, ChoiceboxGroupItem } from "@/components/ui/choicebox";
import { useState } from "react";

const [value, setValue] = useState("trial");

<ChoiceboxGroup
  label="select a plan"
  listClassName="flex-row"
  onChange={setValue}
  type="radio"
  value={value}
>
  <ChoiceboxGroupItem description="Free for two weeks" title="Pro Trial" value="trial">
    <div className="flex justify-center p-2">
      <Badge variant="purple">Trial</Badge>
    </div>
  </ChoiceboxGroupItem>
  <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro">
    <div className="flex justify-center p-2">
      <Badge variant="blue">Pro</Badge>
    </div>
  </ChoiceboxGroupItem>
</ChoiceboxGroup>
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { ChoiceboxGroup, ChoiceboxGroupItem } from "@/components/ui/choicebox"
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string | string[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控选择值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

-   当选项受益于更大的触控目标并带有说明或图标时使用 Choicebox。
-   互斥选项单选，可叠加选项多选；同一组内不要混用两种。
-   最多 4–6 个磁贴；超过则改用 Select 或 Combobox，避免页面为单个字段滚动。
