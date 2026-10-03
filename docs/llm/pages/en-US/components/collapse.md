# Collapse

> Route: `/components/collapse`

Expand or collapse supporting content, such as FAQs and advanced settings, under a heading.

[Back to Components](#/components)

# Collapse

collapse

Expand or collapse supporting content, such as FAQs and advanced settings, under a heading.

## When to use

- Optional, advanced, or repetitive content that most users skip on most visits: FAQs, advanced settings, request payload previews.
- When you need to accommodate large amounts of information on one page without burying the main content under the weight of exposition.

## When not to use

- When content is critical for every user; use page sections with regular headings instead. Collapsing essential content hides what the page is about.
- Don't put primary destructive actions inside a closed Collapse; the user has to click twice to reach the warning, reducing safety.

## Examples

### Default collapse panel

A Collapse with a closed default state; headings use Title Case to name the topic rather than the action.

### Expanded collapse panel

Demonstrates the expanded state of a Collapse panel along with the smooth transition animation when opening content.

### Multi-open collapse panel

multiple allows several panels to stay open, useful for FAQs.

### Compact-size collapse panel

Small-size variant optimized for dense layouts or constrained spaces like sidebars where vertical room is limited.

### Plus-icon collapse panel

With icon="plus" the indicator rotates 45° counter-clockwise into an × (high-frequency feedback tier), matching the "reveal more" reading of FAQ panels.

### Disabled collapse panel

When disabled, the whole row (text and icon) drops opacity and switches to a not-allowed cursor; aria-disabled and the blocked toggle semantics stay intact.

## Accessibility

- The trigger is a <button> with aria-expanded that flips on toggle, and aria-controls pointing at the content panel's id.
- Panel content remains in the DOM even when closed (via hidden or visibility style), so search and find-in-page still locate it.

## Controlled behavior

- Collapse supports externally controlled open state via the open prop and onOpenChange callback; developers can manage whether a panel is expanded from the parent component.
- In uncontrolled mode, internal state manages open/close toggling independently; controlled mode is recommended when multiple Collapses coexist on a page to precisely manage the expansion set.

## Responsive behavior

- Collapse panels automatically increase touch target sizes on small viewports to ensure tap operability on mobile devices.
- Multiple panel mode maintains consistent multi-selection behavior across screen sizes without altering the interaction logic due to layout changes.

## Theme behavior

- Transition animation speed, arrow direction icons, and other visual details stay consistent with design system tokens.
- Divider and border colors adapt automatically across themes.

## Live Demo

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

```tsx
import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

export function CollapseDefault37A8EEC1Example() {
  return (
    <>
      <Collapse className="border-b">
        <h3 className="text-[24px] font-semibold text-foreground">
          <CollapseTrigger>Question A</CollapseTrigger>
        </h3>
        <CollapseContent>
          <p className="mb-4 text-copy-16 text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </CollapseContent>
      </Collapse>
      <Collapse className="border-b">
        <h3 className="text-[24px] font-semibold text-foreground">
          <CollapseTrigger>Question B</CollapseTrigger>
        </h3>
        <CollapseContent>
          <p className="mb-4 text-copy-16 text-muted-foreground">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur.
          </p>
        </CollapseContent>
      </Collapse>
    </>
  );
}
```

## Plus

Plus 图标展开时逆时针旋转 45° 变成 ×，收起时回到加号，适合 FAQ 这类「展开更多」的语义。

旋转走高频微反馈档位（--uni-motion-feedback），与悬停、颜色变化保持同一节奏。

```tsx
import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

export function CollapsePlus9C4E1A7BExample() {
  return (
    <>
      <Collapse icon="plus" className="border-b">
        <h3 className="text-[24px] font-semibold text-foreground">
          <CollapseTrigger>Question A</CollapseTrigger>
        </h3>
        <CollapseContent>
          <p className="mb-4 text-copy-16 text-muted-foreground">
            Plus 图标展开时逆时针旋转 45° 变成 ×，收起时回到加号，适合 FAQ 这类「展开更多」的语义。
          </p>
        </CollapseContent>
      </Collapse>
      <Collapse icon="plus" className="border-b" defaultOpen>
        <h3 className="text-[24px] font-semibold text-foreground">
          <CollapseTrigger>Question B</CollapseTrigger>
        </h3>
        <CollapseContent>
          <p className="mb-4 text-copy-16 text-muted-foreground">
            旋转走高频微反馈档位（--uni-motion-feedback），与悬停、颜色变化保持同一节奏。
          </p>
        </CollapseContent>
      </Collapse>
    </>
  );
}
```

## Disabled

正常状态：触发器可聚焦、可点击，键盘聚焦时显示内嵌焦点环。

不可达内容：禁用态触发器整体降不透明度并切换为 not-allowed 光标，点击不会展开。

```tsx
import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

export function CollapseDisabled2F7D5B6EExample() {
  return (
    <>
      <Collapse className="border-b">
        <h3 className="text-[24px] font-semibold text-foreground">
          <CollapseTrigger>Question A</CollapseTrigger>
        </h3>
        <CollapseContent>
          <p className="mb-4 text-copy-16 text-muted-foreground">
            正常状态：触发器可聚焦、可点击，键盘聚焦时显示内嵌焦点环。
          </p>
        </CollapseContent>
      </Collapse>
      <Collapse className="border-b" disabled>
        <h3 className="text-[24px] font-semibold text-foreground">
          <CollapseTrigger>Question B</CollapseTrigger>
        </h3>
        <CollapseContent>
          <p className="mb-4 text-copy-16 text-muted-foreground">
            不可达内容：禁用态触发器整体降不透明度并切换为 not-allowed 光标，点击不会展开。
          </p>
        </CollapseContent>
      </Collapse>
    </>
  );
}
```

## Expanded

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

```tsx
import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

export function CollapseExpandedE72D5D8DExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Collapse size="small" className="rounded-[8px] border border-gray-alpha-400 p-4">
        <CollapseTrigger className="text-label-14 text-foreground">Question A</CollapseTrigger>
        <CollapseContent className="pt-2 text-copy-14 text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </CollapseContent>
      </Collapse>
      <Collapse size="small" defaultOpen className="rounded-[8px] border border-gray-alpha-400 p-4">
        <CollapseTrigger className="text-label-14 text-foreground">Question B</CollapseTrigger>
        <CollapseContent className="pt-2 text-copy-14 text-muted-foreground">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur.
        </CollapseContent>
      </Collapse>
    </div>
  );
}
```

## Multiple

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

```tsx
import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

export function CollapseMultiple14070FDBExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Collapse size="small" defaultOpen className="rounded-[8px] border border-gray-alpha-400 p-4">
        <CollapseTrigger className="text-label-14 text-foreground">Question A</CollapseTrigger>
        <CollapseContent className="pt-2 text-copy-14 text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </CollapseContent>
      </Collapse>
      <Collapse size="small" defaultOpen className="rounded-[8px] border border-gray-alpha-400 p-4">
        <CollapseTrigger className="text-label-14 text-foreground">Question B</CollapseTrigger>
        <CollapseContent className="pt-2 text-copy-14 text-muted-foreground">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur.
        </CollapseContent>
      </Collapse>
    </div>
  );
}
```

## Small

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

```tsx
import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

export function CollapseSmall5263293FExample() {
  return (
    <Collapse
      size="small"
      className="w-full max-w-sm rounded-[8px] border border-gray-alpha-400 p-3"
    >
      <CollapseTrigger className="text-label-13 text-foreground">Question A</CollapseTrigger>
      <CollapseContent className="pt-1.5 text-copy-13 text-muted-foreground">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua.
      </CollapseContent>
    </Collapse>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { Collapse, CollapseTrigger, CollapseContent } from "@/components/ui/collapse";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled expanded state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultOpen</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Initial uncontrolled state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Called when expansion changes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default" | "small" | "bare"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Trigger padding scale.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">icon</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"chevron" | "plus"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Indicator glyph; plus rotates 45° into an × when open.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"chevron"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">indicatorAlign</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"inline" | "end"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Indicator placement: inline sits right after the title, end pushes it to the row's trailing edge.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"end"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">as</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ElementType</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Trigger element type. Non-button elements have no button styling and use role=button with Enter/Space support.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">disabled</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Blocks toggling and dims the row.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>

## Best Practices

- Use Collapse for optional, advanced, or repetitive content that most users skip on most visits (FAQ, advanced settings, request payload preview).
- For top-level structure that every user reads, use page sections with regular headings; collapsing primary content hides what the page is about.
- Default state is closed unless the first-time visitor must read the content to act.
- Animate the open/close transition; jump-cuts make the page feel like it teleported.
- Don’t nest Collapse more than one level deep. Two-level nesting hides too much and breaks the keyboard tab path.
- Heading is Title Case and names the topic, not the action (Advanced Settings, not Show Advanced Settings).
- Don’t put primary destructive actions inside a closed Collapse; the user has to click twice to reach the warning.
- The trigger is a <button> with aria-expanded that flips on toggle and aria-controls pointing at the panel id.
- Render the panel content in the DOM when closed (with hidden or visibility) so search and find-in-page still hit it; lazy-render only for expensive content.
