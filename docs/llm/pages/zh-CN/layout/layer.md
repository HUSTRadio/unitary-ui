# 层级

> Route: `/layout/layer`

# 层级

规范框架的 z 向空间：语义层级决定覆盖顺序，作用域控制局部配置，Portal 决定内容的物理挂载位置。

## 空间与交互规范

内容、导航与临时浮层应有清晰层次，覆盖时保留任务上下文。模态任务应聚焦、简短并提供清楚的关闭方式；避免无必要的嵌套弹出层。材质、边框和阴影表达视觉深度，z-index 管理实际覆盖顺序；两者分别配置。

规范参考 Apple HIG；下表数值是 Unitary 的实现约定。 [Materials](https://developer.apple.com/design/human-interface-guidelines/materials) · [Modality](https://developer.apple.com/design/human-interface-guidelines/modality) · [Popovers](https://developer.apple.com/design/human-interface-guidelines/popovers)

## 语义层级

<table class="w-full text-copy-13" aria-label="层级表"><thead><tr><th class="p-3 text-left">Level</th><th class="p-3 text-left">Token</th><th class="p-3 text-left">z-index</th></tr></thead><tbody><tr><td class="border-t p-3 font-mono">base</td><td class="border-t p-3 font-mono">--uni-z-base</td><td class="border-t p-3">0</td></tr><tr><td class="border-t p-3 font-mono">calendar</td><td class="border-t p-3 font-mono">--uni-z-calendar</td><td class="border-t p-3">30</td></tr><tr><td class="border-t p-3 font-mono">header</td><td class="border-t p-3 font-mono">--uni-z-header</td><td class="border-t p-3">40</td></tr><tr><td class="border-t p-3 font-mono">menu</td><td class="border-t p-3 font-mono">--uni-z-menu</td><td class="border-t p-3">50</td></tr><tr><td class="border-t p-3 font-mono">drawer</td><td class="border-t p-3 font-mono">--uni-z-drawer</td><td class="border-t p-3">200</td></tr><tr><td class="border-t p-3 font-mono">modal</td><td class="border-t p-3 font-mono">--uni-z-modal</td><td class="border-t p-3">300</td></tr><tr><td class="border-t p-3 font-mono">popover</td><td class="border-t p-3 font-mono">--uni-z-popover</td><td class="border-t p-3">2001</td></tr><tr><td class="border-t p-3 font-mono">toast</td><td class="border-t p-3 font-mono">--uni-z-toast</td><td class="border-t p-3">5000</td></tr><tr><td class="border-t p-3 font-mono">tooltip</td><td class="border-t p-3 font-mono">--uni-z-tooltip</td><td class="border-t p-3">99999</td></tr><tr><td class="border-t p-3 font-mono">context-card</td><td class="border-t p-3 font-mono">--uni-z-context-card</td><td class="border-t p-3">1000000</td></tr></tbody></table>

base=0 显式创建局部堆叠上下文，与 auto 不同。Calendar 主弹层保留 30；其预设组合菜单使用 popover。遮罩与内容保持同档，局部顺序由原有 DOM 关系决定。Avatar、Grid 等内部的小数值用于局部装饰顺序。

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { Layer, LayerScope, LayerPortal, useLayerStyle } from "@hustradio/unitary-ui";
```

还支持以下类型中定义的属性：`ComponentProps<"div">`

### 属性与回调

本表 API 均为 Unitary 扩展。

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">Layer.level</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">LayerLevel</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">语义层级角色。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"base"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">LayerScope.levels</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Partial&lt;Record&lt;LayerLevel, number&gt;&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">安全整数覆盖，与最近父作用域配置合并。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">{}</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">LayerScope.isolate</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">隔离物理 DOM 子树；外部 Portal 仍在作用域之外。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">LayerPortal.container</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Element | DocumentFragment | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">挂载目标；省略或 null 时在挂载后使用 body。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">document.body</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">useLayerStyle(level)</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">CSSProperties</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">返回作用域变量及语义 z-index，供自定义元素使用。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 作用域与 Portal 边界

LayerScope.levels 接受安全整数，并与最近父作用域的稀疏配置合并；移除覆盖后恢复父配置或全局变量。局部跨 Portal 控制使用 levels，作用域 DOM 上直接设置的 CSS 变量仅沿物理 DOM 继承。全局动态修改与恢复使用 setToken、setTokens、resetToken 和 resetTokens；订阅使用 subscribeTokens 或 useTokens。

isolate 默认 false；开启后限制物理 DOM 子树，body 中的 Portal 仍在其外部。要把内容留在隔离范围，显式设置 container。LayerPortal 的 container 省略或为 null 时使用 body，服务端与首次 hydration 不创建 Portal，客户端挂载后创建。现有组件的容器选择保持不变。

Layer 原语管理布局与层级；焦点、Escape、点击外部关闭和 ARIA 由对应浮层组件负责。不要通过抬高背景层使其抢过当前模态任务。已有浮层支持打开期间修改层级；定位包装层与内容的实际层级同步。

## 语义层级与局部隔离

页首层

弹出层

```tsx
import { useI18n } from "@hustradio/unitary-ui";
import { useState } from "react";
import { Layer, LayerScope } from "@hustradio/unitary-ui";
import { Button } from "@hustradio/unitary-ui";

export function LayerDefaultExample() {
  const zh = useI18n().locale === "zh-CN";
  const [raised, setRaised] = useState(false);
  return (
    <div>
      <Button onClick={() => setRaised(!raised)}>
        {zh ? "切换页首层级" : "Toggle header level"}
      </Button>
      <LayerScope isolate levels={raised ? { header: 2100 } : {}} className="relative mt-4 h-40">
        <Layer
          level="header"
          data-layer-hit="header"
          className="absolute inset-y-4 left-4 w-3/5 rounded-lg border bg-background-200 p-4"
        >
          {zh ? "页首层" : "Header layer"}
        </Layer>
        <Layer
          level="popover"
          data-layer-hit="popover"
          className="absolute inset-y-8 left-1/4 w-3/5 rounded-lg border bg-background-100 p-4"
        >
          {zh ? "弹出层" : "Popover layer"}
        </Layer>
      </LayerScope>
    </div>
  );
}
```

## 独立作用域与实时修改

弹出层: 2100

```tsx
import { useI18n } from "@hustradio/unitary-ui";
import { useState } from "react";
import { LayerScope } from "@hustradio/unitary-ui";
import { Button } from "@hustradio/unitary-ui";
import { Select, SelectItem } from "@hustradio/unitary-ui";
import { Tooltip } from "@hustradio/unitary-ui";

export function LayerScopedExample() {
  const zh = useI18n().locale === "zh-CN";
  const [level, setLevel] = useState(2100);
  return (
    <div className="flex flex-wrap gap-4">
      <LayerScope levels={{ popover: level, tooltip: level + 1 }} data-layer-demo="scoped">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setLevel(level === 2100 ? 2200 : 2100)}>
            {zh ? "修改已打开浮层的层级" : "Change open popup level"}
          </Button>
          <Select placeholder={zh ? "局部选择器" : "Scoped select"}>
            <SelectItem value="first">{zh ? "第一项" : "First"}</SelectItem>
            <SelectItem value="second">{zh ? "第二项" : "Second"}</SelectItem>
          </Select>
          <Tooltip text={zh ? "局部提示" : "Scoped tooltip"}>
            <Button>Tooltip</Button>
          </Tooltip>
        </div>
        <output className="text-copy-13">
          {zh ? "弹出层" : "Popover layer"}: {level}
        </output>
      </LayerScope>
      <LayerScope data-layer-demo="independent">
        <Select placeholder={zh ? "独立选择器" : "Independent select"}>
          <SelectItem value="default">{zh ? "默认层级" : "Default level"}</SelectItem>
        </Select>
      </LayerScope>
    </div>
  );
}
```

## Portal 与自定义元素

自定义表面：useLayerStyle

```tsx
import { useI18n } from "@hustradio/unitary-ui";
import { useState } from "react";
import { Layer, LayerPortal, LayerScope, useLayerStyle } from "@hustradio/unitary-ui";

function CustomSurface() {
  const zh = useI18n().locale === "zh-CN";
  return (
    <div
      style={useLayerStyle("popover")}
      className="relative rounded-lg border bg-background-100 p-4"
    >
      {zh ? "自定义表面：useLayerStyle" : "Custom surface: useLayerStyle"}
    </div>
  );
}

export function LayerPortalExample() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  return (
    <LayerScope isolate levels={{ popover: 12 }}>
      <div
        ref={setContainer}
        data-layer-demo="portal-target"
        className="relative min-h-28 rounded-lg border border-dashed p-4"
      />
      {container && (
        <LayerPortal container={container}>
          <Layer level="base">
            <CustomSurface />
          </Layer>
        </LayerPortal>
      )}
    </LayerScope>
  );
}
```
