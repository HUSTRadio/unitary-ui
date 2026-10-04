# 配色方案

> Route: `/color-schemes`

# 配色方案

从项目标准色盘选择界面配色，分别搭配行内代码和代码块主题。色块展示每个语义角色的当前值，真实组件展示实际效果。

[查看全局变量 →](#/tokens)

UI 配色

行内代码主题

代码块主题

浅色

深色

## 语义调色盘

选择器切换后会自动显示对应调色盘。每个色块列出角色、实际色值和使用的变量；Default 保留当前 docs 配色。

画布`#ffffff`\--background

表面`#ffffff`\--card

次级表面`#f2f2f2`\--secondary

主要文字`#171717`\--foreground

次级文字`#4d4d4d`\--muted-foreground

细边框`#ebebeb`\--border

强边框`#c9c9c9`\--border-strong

主动作`#171717`\--primary

动作悬停`#383838`\--action-hover

动作文字`#ffffff`\--primary-foreground

链接`#0072f5`\--link

焦点环`#0072f5`\--focus-ring-color

成功`#46a758`\--success

警告`#ffb224`\--warning

错误`#e5484d`\--destructive

所有服务正常

## 项目概览

使用标准导航、表单和浮层，检查不同配色下的可读性与状态。

#### 项目设置

进行中

项目名称

编辑项目名称，试试焦点、悬停和禁用状态。

### 开发者笔记

使用 `loadProject(id)` 获取项目，设置 `retries = 3` 控制重试。

project.ts

```tsx
// A small, readable example
export async function loadProject(id: string) {
  const retries = 3;
+  const enabled = true;
-  const result = await fetch("/api/projects/" + id);
  return { name: "Unitary", retries, enabled };
}
```

```tsx
const count = 3;
console.log("Unitary", count);
```

示例的配色和局部浮层由 SubFrame 承载；界面明暗与 docs 外壳独立，固定代码主题也独立于界面明暗。

## 来源与接入

[查看配色 API →](#/api/color-schemes)

Default 保存了当前 docs 两种主题各 313 个运行时颜色变量。品牌蓝、绿色、琥珀方案从项目现有色阶取值；品牌蓝主动作使用 logo 的 #0D47A1。

代码主题采用 VS Code Light+、Dark+、Monokai 与 Solarized 的公认色值，并适配到 Prism 类别；不是完整复制编辑器的 TextMate 规则。Default 跟随 UI 表面与明暗，固定主题保持自己的背景和语法色。

行内代码与代码块可以独立选择。Default 行内代码保持 docs 的纯文字样式；固定主题使用各自的文字、背景与边框。

导出包含界面双主题、独立代码颜色和局部变量绑定，放在库样式之后加载。代码容器的 data-ui-theme 与界面明暗同步；data-theme 使用代码主题自身的明暗。

```tsx
<section data-color-scheme="default" data-theme="light">
  <p data-inline-code-theme="default" data-ui-theme="light">
    ...
  </p>
  <div data-code-scheme="default" data-theme="light" data-ui-theme="light">
    ...
  </div>
</section>
```

SubFrame 限定浮层挂载位置，不创建 iframe 或 Shadow DOM；全局 CSS 和主题上下文仍可能影响其它组件。本页验证展示的组件。
