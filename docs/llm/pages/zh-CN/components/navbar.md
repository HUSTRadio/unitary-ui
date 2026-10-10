# 顶部导航

> Route: `/components/navbar`

A page header with static, pinned, or auto-hiding scroll behavior.

[返回组件](#/components)

# 顶部导航

navbar

A page header with static, pinned, or auto-hiding scroll behavior.

## 何时使用

- 页面需要固定、随文档滚动或向下滚动隐藏的顶栏时。

## 何时不应使用

- 应用级命令分组应使用 Toolbar，侧栏导航应使用 SidebarNav。

## 示例

### 固定顶栏

在预览区域中展示默认顶栏。

## 无障碍

- 组件渲染 header；调用方须给交互按钮提供可访问名称。

## 受控行为

- 滚动状态由内部监听；forceVisible 由调用方控制，适用于打开导航或搜索时保持顶栏显示。

## 响应式行为

- 顶栏内容和宽度由调用方安排；auto-hide 使用视口固定定位。solidOnScroll 依据绝对距离超过 80px 补色，返回阈值内才清除；forceVisible 在导航打开时保持显示，键盘焦点也保持顶栏可见。scrollTarget 可指定滚动容器。

## 主题行为

- solid 模式使用背景与边框语义 token。

## 实时示例

UnitaryWorkspace

Page content begins below the header.

```tsx
import { Navbar } from "@/components/ui/navbar";

export default function NavbarExample() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-background">
      <Navbar scrollBehavior="static" className="flex items-center px-5">
        <span className="font-semibold">Unitary</span>
        <span className="ml-auto text-sm text-muted-foreground">Workspace</span>
      </Navbar>
      <div className="border-t border-border p-6 text-sm text-muted-foreground">
        Page content begins below the header.
      </div>
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { Navbar } from "@/components/ui/navbar";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">scrollBehavior</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"static" | "pinned" | "auto-hide"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">顶栏定位与滚动行为。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"pinned"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">variant</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"solid" | "transparent"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">初始表面样式。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"solid"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">solidOnScroll</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">绝对滚动位置超过 80px 时为透明顶栏补底色，上滚仍保持至回到阈值内。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">forceVisible</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">导航或搜索打开时保持自动隐藏顶栏可见。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">scrollTarget</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">HTMLElement | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可选滚动容器；null 或省略时观察文档。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">height</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string | number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">CSS 高度类名或内联数字高度；默认 h-16。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"h-16"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">由调用方编排的顶栏内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
