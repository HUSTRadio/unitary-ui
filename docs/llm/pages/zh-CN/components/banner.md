# 横幅

> Route: `/components/banner`

在容器顶部显示全宽公告或重要提示。

[返回组件](#/components)

# 横幅

banner

在容器顶部显示全宽公告或重要提示。

## 何时使用

- 在页面顶部或区块起始处展示全局公告、维护通知或关键提示，确保用户注意到。
- 公告需要操作链接时，通过 button 配置链接文案和目标。
- 当消息需要跨越完整内容宽度并提供上下文时（如部署状态变更）。

## 何时不应使用

- 不要用 Banner 展示频繁变化的动态信息——优先考虑 Toast 通知，因为它更轻量且可持久化。
- 不要在同一页面堆叠多个 Banner；超过两个说明应改用折叠面板或信息列表。
- 不要把 Banner 用于表单级别的字段验证错误——使用 ErrorText 或 Input 的 error 属性。

## 示例

### 默认横幅

展示默认的 Banner 消息文本，以及可选的链接式 CTA。

## 无障碍

- Banner 默认渲染为普通 div；仅在内容确实需要即时播报时，由调用方添加合适的语义角色。
- 消息文本应独立清晰，不能只依赖位置或颜色表达重要性。
- 链接式 CTA 的 content 应明确描述目标或动作。

## 受控行为

不适用: Banner 不维护打开、折叠或关闭状态；显示时机与移除逻辑由父组件决定。

## 响应式行为

- Banner 在父容器内占用可用宽度（最大 1080 px），并通过 flex-wrap 在空间不足时换行。
- 组件没有断点级字号或高度变化；窄屏布局由内容宽度和父容器共同决定。

## 主题行为

- Banner 外壳默认透明，文本和 CTA 使用主题变量适配暗色与亮色模式。
- 组件没有内置成功、警告或错误变体；需要语义配色时由调用方组合样式和语义。

## 实时示例

**Big News** – New components finally available

[Read more](#/components)

```tsx
import { Banner } from "@hustradio/unitary-ui";

export function BannerDefault21B111CBExample() {
  return (
    <Banner button={{ href: "#/components", content: "Read more" }}>
      <b>Big News</b> – New components finally available
    </Banner>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { Banner } from "@hustradio/unitary-ui";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">button</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">BannerButton</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可选的链接操作。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
