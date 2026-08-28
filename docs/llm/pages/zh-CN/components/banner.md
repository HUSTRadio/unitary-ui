# 横幅

> Route: `/components/banner`

横跨容器完整宽度的醒目消息，用于发布重要信息。

[返回组件](#/components)

# 横幅

Banner

横跨容器完整宽度的醒目消息，用于发布重要信息。

## 何时使用

-   在页面顶部或区块起始处展示全局公告、维护通知或关键提示，确保用户注意到。
-   需要用颜色和图标传达语义状态时（成功、警告、错误），使用 Banner 作为区域级别的错误提示。
-   当消息需要跨越完整内容宽度并提供上下文时（如部署状态变更）。

## 何时不应使用

-   不要用 Banner 展示频繁变化的动态信息——优先考虑 Toast 通知，因为它更轻量且可持久化。
-   不要在同一页面堆叠多个 Banner；超过两个说明应改用折叠面板或信息列表。
-   不要把 Banner 用于表单级别的字段验证错误——使用 ErrorText 或 Input 的 error 属性。

## 示例

### 默认横幅

展示默认的 Banner 外观，包含标题和描述文本。

## 无障碍

-   Banner 的语义相当于 alert 或 status 角色，屏幕阅读器应正确识别并朗读其内容。
-   Banner 标题使用较高级别（Heading 2 或 3），描述文本紧跟其后以保持阅读层次。
-   可关闭的 Banner 按钮应有明确的 aria-label 描述关闭动作。

## 受控行为

-   Banner 支持 open/collapsed 状态的可编程控制，开发者可以决定何时自动收起或手动干预。
-   关闭动画完成后返回焦点到触发按钮，保持键盘用户的导航连贯性。

## 响应式行为

-   Banner 在全宽容器内水平铺满，在小屏幕上自动调整内边距和字号比例。
-   移动设备上 Banner 的高度降低，内容以堆叠布局替代行内布局。

## 主题行为

-   不同语义类型的 Banner（成功、警告、错误）在暗色/亮色模式下各有对应的配色方案。
-   Banner 的背景色和边框颜色通过主题变量管理，支持全局自定义。

## 实时示例

**Big News** – New components finally available

[Read more](#/components)

```tsx
import { Banner } from "@/components/ui/banner";

<Banner button={{ href: "#/components", content: "Read more" }}>
  <b>Big News</b> – New components finally available
</Banner>
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Banner } from "@/components/ui/banner"
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">button</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">BannerButton</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可选的链接操作。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
