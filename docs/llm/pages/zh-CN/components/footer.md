# 页脚

> Route: `/components/footer`

A page footer with link columns and optional leading and trailing slots.

[返回组件](#/components)

# 页脚

footer

A page footer with link columns and optional leading and trailing slots.

## 何时使用

- 页面底部需要分组链接或附加信息时。

## 何时不应使用

- 页面顶部导航应使用 Navbar；局部操作应使用 Toolbar。

## 示例

### 链接页脚

分组链接与前置内容。

## 无障碍

- 组件渲染 footer，链接使用原生锚点；链接文案由调用方提供。

## 受控行为

不适用: Footer 没有内部交互状态。

## 响应式行为

- 窄屏链接列堆叠；较宽视口与前后插槽并排。

## 主题行为

- 文字与分隔线使用语义 token。

## 实时示例

**Unitary**

Resources

- [Components](#/components)
- [Guides](#/guides)

```tsx
import { Footer } from "@/components/ui/footer";

export default function FooterExample() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-background">
      <Footer
        columns={[
          {
            title: "Resources",
            links: [
              { label: "Components", href: "#/components" },
              { label: "Guides", href: "#/guides" },
            ],
          },
        ]}
        slotLeading={<strong className="text-sm">Unitary</strong>}
      />
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { Footer } from "@/components/ui/footer";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">columns</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">FooterColumn[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">带标题的链接列。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">slotLeading</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">链接列之前的内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">slotTrailing</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">链接列之后的内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">sticky</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">将页脚固定到视口底部。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>
