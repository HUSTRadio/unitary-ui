# 编辑菜单

> Route: `/components/edit-menu`

在存在文本选区时浮现的横向胶囊式编辑操作条。

[返回组件](#/components)

# 编辑菜单

Edit Menu

在存在文本选区时浮现的横向胶囊式编辑操作条。

## 何时使用

- 需要对当前选中的文本执行剪切、复制、粘贴、全选、查询或共享时。
- 希望操作条紧贴选区、随选区消失而隐藏时。

## 何时不应使用

- 对某个对象（行、文件、画布元素）执行操作——那是 ContextMenu 的场景。
- 需要常驻可见的编辑按钮组，而不是随选区浮现的浮层。

## 示例

### 默认编辑菜单

选中文本后浮现胶囊工具条，并提供剪切、复制、粘贴、全选、查询与共享。

## 无障碍

- 胶囊容器使用 role="toolbar" 并带 aria-label，每个操作是可聚焦的原生 button。
- Escape 关闭胶囊；点击胶囊不会清除当前选区。
- 触屏：容器与胶囊都抑制原生 callout 与原生上下文菜单，长按不会与胶囊叠出第二套编辑菜单。

## 受控行为

- 组件自行监听选区，调用方只需提供各操作回调；未提供回调的标准操作不会渲染。
- Cut 由组件复制文本后交给 onCut，删除动作由调用方执行；回调同时给出已 trim 文本与选区原文，删除请用原文（否则首尾空白会残留）。
- 剪贴板写入失败时不触发 onCut / onCopy，改为 onError：可见反馈由调用方渲染，避免未复制成功就删除内容。

## 响应式行为

- 上方空间不足时翻转到选区下方；水平居中于选区并 clamp 进视口，垂直方向同样 clamp（选区贴近视口底部时不再溢出下沿）。
- 滚动与视口缩放时收起，避免浮层与选区脱节。

## 主题行为

- 胶囊背景、分隔线与文字色跟随主题 Token，暗色模式下保持对比度。
- 入场缩放淡入动画在 prefers-reduced-motion 下禁用。

## 实时示例

Select any words in this sentence to reveal the floating edit capsule above the selection.

Long-press or drag to select text, then use the capsule actions.

```tsx
import * as React from "react";

import { EditMenu } from "@/components/ui/edit-menu";

const INITIAL_TEXT =
  "Select any words in this sentence to reveal the floating edit capsule above the selection.";

export function EditMenuDefault3F2A9C71Example() {
  const textRef = React.useRef<HTMLParagraphElement>(null);
  const [text, setText] = React.useState(INITIAL_TEXT);
  const [log, setLog] = React.useState<string | null>(null);

  const selectAll = React.useCallback(() => {
    const node = textRef.current;
    if (!node) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, []);

  return (
    <div className="w-full max-w-[420px] space-y-3">
      <EditMenu
        // 删除必须用选区原文（rawText）：用已 trim 的文本会残留首尾空白（HIG-AUD-021）
        onCut={(selected, rawText) => {
          setText((current) => current.replace(rawText, ""));
          setLog(`Cut ${selected.length} characters.`);
        }}
        onCopy={(selected) => setLog(`Copied ${selected.length} characters.`)}
        onPaste={() => {
          void navigator.clipboard
            .readText()
            .then((value) => setLog(value ? `Pasted: ${value}` : "Clipboard is empty."))
            .catch(() => setLog("Clipboard read is blocked."));
        }}
        onSelectAll={selectAll}
        onLookUp={(selected) => setLog(`Looking up “${selected}”.`)}
        onShare={(selected) => setLog(`Sharing “${selected}”.`)}
        // 剪贴板不可用时 onCut / onCopy 不会触发；这里给出可见反馈（HIG-AUD-021）
        onError={() => setLog("Clipboard write is blocked — the selection was left untouched.")}
      >
        <p ref={textRef} className="text-copy-14 leading-6 text-foreground">
          {text}
        </p>
      </EditMenu>
      <p className="text-copy-13 text-gray-900">
        {log ?? "Long-press or drag to select text, then use the capsule actions."}
      </p>
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { EditMenu } from "@/components/ui/edit-menu";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">组件监听文本选区的可选中内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">standardActions</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">readonly EditMenuStandardAction[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">启用的标准操作及其顺序；默认为 cut、copy、paste、selectAll、lookUp、share。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">actions</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">readonly EditMenuAction[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">追加在标准操作之后、以分隔线隔开的自定义操作。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onCut</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(text: string, rawText: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">复制选区后收到「已 trim 文本」与「选区原文」，删除动作由调用方执行（应用原文）。剪贴板写入失败时不触发。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onCopy</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(text: string, rawText: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">组件复制选区后收到「已 trim 文本」与「选区原文」。剪贴板写入失败时不触发。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onPaste</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">粘贴回调；组件不会替你读取剪贴板。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onSelectAll</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">全选容器内的内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onLookUp</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(text: string, rawText: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">查询当前选区（已 trim 文本与选区原文）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onShare</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(text: string, rawText: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">共享当前选区（已 trim 文本与选区原文）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onError</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(error: unknown) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">剪贴板写入失败。此时不触发 Cut / Copy 回调，可见反馈由调用方渲染。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">offset</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">胶囊与选区之间的间距（像素）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">8</td></tr></tbody></table>

## 最佳实践

- 对当前文本选区执行操作使用 EditMenu；对右键或长按唤出的对象操作使用 ContextMenu。
- 只为真正实现了的操作传入回调——EditMenu 会省略没有回调的标准操作，而不是显示一个点了没反应的项。
- Cut 视为“复制 + 调用方删除”：组件复制选区文本，再把文本交给 onCut 处理删除。
- Paste 交给调用方自行读取剪贴板，避免为组件申请剪贴板读权限。
