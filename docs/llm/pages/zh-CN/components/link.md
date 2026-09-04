# 链接

> Route: `/components/link`

导航到站内或外部目标，并按平台呈现对应图标。

[返回组件](#/components)

# 链接

Link

导航到站内或外部目标，并按平台呈现对应图标。

## 何时使用

- 在段落、说明文字或导航列表中提供行内跳转。
- 链接 GitHub、GitLab、Gitee 等受支持的代码托管平台时，让平台品牌图标帮助用户识别目的地。

## 何时不应使用

- 会改变应用状态的操作应使用 Button；需要按钮外观的导航应使用 ButtonLink。
- 不要把仅靠图标表达、没有可见文案的链接交给 Link；此组件面向文本链接。

## 示例

### 站内、平台与普通外链

站内链接不附图标；代码托管平台把品牌图标放在左侧且不显示 ExternalLink；其他 HTTP(S) 外链在右侧显示通用外链指示符。

## 无障碍

- 使用能独立说明目的地的可见文案，避免“点击这里”等脱离上下文后失去意义的标签。
- 外链图标均为 aria-hidden；屏幕阅读器仍以链接文案作为可访问名称。
- 组件保留键盘 focus-visible 双环和原生锚点语义。

## 受控行为

不适用: Link 是无内部状态的原生锚点包装；导航由 href 与浏览器处理。

## 响应式行为

- Link 采用 inline-flex，使图标与文案在窄视口中保持同一链接单元。
- 长链接文案的换行由所在文本容器控制，不设置固定宽度或断点。

## 主题行为

- 文字、下划线和图标均使用语义颜色 token，随浅色/深色主题切换。
- 品牌图标通过 simpleicons mask + currentColor 呈现，不嵌入厂商固定色。

## 实时示例

[Button documentation](/components/button)[GitHub repository](https://github.com/HUSTRadio/unitary-ui)[GitLab repository](https://gitlab.com/gitlab-org/gitlab)[MDN Web Docs](https://developer.mozilla.org)

```tsx
import { Link } from "@/components/ui/link";

export function LinkDefault37A8EEC1Example() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
      <Link href="/components/button">Button documentation</Link>
      <Link href="gh:HUSTRadio/unitary-ui">GitHub repository</Link>
      <Link href="https://gitlab.com/gitlab-org/gitlab">GitLab repository</Link>
      <Link href="https://developer.mozilla.org">MDN Web Docs</Link>
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Link } from "@/components/ui/link";
```

原生属性：`ComponentProps<"a">`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">href</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">站内路径、HTTP(S) URL 或 gh:/github: 简写。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">iconSide</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"left" | "right"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">覆盖图标位置；代码托管平台品牌默认左置，普通外链指示符默认右置。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可见链接文案。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 行内导航使用 Link；醒目的主要操作使用 Button 或 ButtonLink。
- 相对路径保留当前浏览上下文；HTTP(S) 目标在新标签页打开并带 noreferrer。
- 代码托管平台链接把品牌图标放在文案左侧，不再重复显示 ExternalLink 指示符。
- 普通外链仍在文案右侧保留 ExternalLink 指示符。
- gh: 或 github: 简写仅用于 GitHub owner/repository 目标。
