# Layer

> Route: `/layout/layer`

# Layer

Define the framework’s z space: semantic levels determine stacking, scopes control local configuration, and portals determine physical placement.

## Spatial and interaction guidelines

Keep content, navigation and transient surfaces clearly layered, preserving task context when covering content. Keep modal tasks focused and brief with an obvious dismissal path; avoid unnecessary nested popovers. Materials, borders and shadows express visual depth; z-index controls actual stacking. Configure them separately.

These principles draw on Apple HIG; the numerical scale below is Unitary’s implementation contract. [Materials](https://developer.apple.com/design/human-interface-guidelines/materials) · [Modality](https://developer.apple.com/design/human-interface-guidelines/modality) · [Popovers](https://developer.apple.com/design/human-interface-guidelines/popovers)

## Semantic levels

<table class="w-full text-copy-13" aria-label="Layer levels"><thead><tr><th class="p-3 text-left">Level</th><th class="p-3 text-left">Token</th><th class="p-3 text-left">z-index</th></tr></thead><tbody><tr><td class="border-t p-3 font-mono">base</td><td class="border-t p-3 font-mono">--uni-z-base</td><td class="border-t p-3">0</td></tr><tr><td class="border-t p-3 font-mono">calendar</td><td class="border-t p-3 font-mono">--uni-z-calendar</td><td class="border-t p-3">30</td></tr><tr><td class="border-t p-3 font-mono">header</td><td class="border-t p-3 font-mono">--uni-z-header</td><td class="border-t p-3">40</td></tr><tr><td class="border-t p-3 font-mono">menu</td><td class="border-t p-3 font-mono">--uni-z-menu</td><td class="border-t p-3">50</td></tr><tr><td class="border-t p-3 font-mono">drawer</td><td class="border-t p-3 font-mono">--uni-z-drawer</td><td class="border-t p-3">200</td></tr><tr><td class="border-t p-3 font-mono">modal</td><td class="border-t p-3 font-mono">--uni-z-modal</td><td class="border-t p-3">300</td></tr><tr><td class="border-t p-3 font-mono">popover</td><td class="border-t p-3 font-mono">--uni-z-popover</td><td class="border-t p-3">2001</td></tr><tr><td class="border-t p-3 font-mono">toast</td><td class="border-t p-3 font-mono">--uni-z-toast</td><td class="border-t p-3">5000</td></tr><tr><td class="border-t p-3 font-mono">tooltip</td><td class="border-t p-3 font-mono">--uni-z-tooltip</td><td class="border-t p-3">99999</td></tr><tr><td class="border-t p-3 font-mono">context-card</td><td class="border-t p-3 font-mono">--uni-z-context-card</td><td class="border-t p-3">1000000</td></tr></tbody></table>

base=0 explicitly creates a local stacking context and differs from auto. Calendar’s main popup retains 30; its preset menu uses popover. Backdrops and content retain the same band, with local order determined by their existing DOM relationships. Small internal values in Avatar and Grid describe local decorative order.

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { Layer, LayerScope, LayerPortal, useLayerStyle } from "@hustradio/unitary-ui";
```

Also accepts props defined by: `ComponentProps<"div">`

### Props & callbacks

All APIs in this table are Unitary extensions.

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">Layer.level</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">LayerLevel</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Semantic stacking role.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"base"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">LayerScope.levels</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Partial&lt;Record&lt;LayerLevel, number&gt;&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Safe integer overrides merged with the nearest parent scope.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">{}</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">LayerScope.isolate</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Isolates physical DOM descendants; portals outside still escape.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">LayerPortal.container</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Element | DocumentFragment | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Portal target; omitted or null uses body after mounting.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">document.body</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">useLayerStyle(level)</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">CSSProperties</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Returns scope variables and the role z-index for custom elements.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Scope and portal boundaries

LayerScope.levels accepts safe integers and merges sparse overrides with the nearest parent scope; removing an override restores the parent or global token. Use levels for local control across portals; variables written directly on the scope DOM inherit only through physical descendants. Use setToken, setTokens, resetToken and resetTokens for global changes, and subscribeTokens or useTokens for subscriptions.

isolate defaults to false; enabling it isolates the physical DOM subtree while body portals remain outside. Set container explicitly to keep content inside that boundary. LayerPortal uses body when container is omitted or null; it renders no portal on the server or initial hydration and creates it after mounting. Existing component container selection is preserved.

Layer primitives manage layout and stacking; the corresponding overlay components own focus, Escape, outside dismissal and ARIA. Avoid raising background content over the active modal task. Open overlays support live changes, with positioning wrappers synchronized to the actual content level.

## Semantic levels and isolation

Header layer

Popover layer

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

## Independent scopes and live updates

Popover layer: 2100

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

## Portals and custom elements

Custom surface: useLayerStyle

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
