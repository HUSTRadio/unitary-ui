# 材质

> Route: `/materials`

# 材质

圆角、填充、描边与阴影的预设。

Surface 位于页面内，Floating 位于页面之上。每个预设都是 elevation 视觉契约；层叠顺序由独立的 layer token 管理，不由材质本身决定。

## 表面

位于页面内、正常文档流中。选择能清晰表达层次所需的最低 elevation。

material-base

基础

日常使用。圆角 6px。

Class

material-base

Radius

6px

material-small

小

轻微抬升。圆角 6px。

Class

material-small

Radius

6px

material-medium

中型

进一步抬升。圆角 12px。

Class

material-medium

Radius

12px

material-large

大

进一步抬升。圆角 12px。

Class

material-large

Radius

12px

## 浮层

位于页面之上。不要叠加同一材质；阴影不能替代 focus ring 或 ARIA 语义。请在双主题下检查分离度。

material-tooltip

工具提示

Lightest shadow. Corner 6px. Tooltips will be the only floating element with a triangular stem.

Class

material-tooltip

Radius

6px

material-menu

菜单

Lift from page. Radius 12px.

Class

material-menu

Radius

12px

material-modal

弹窗

Further lift. Radius 12px.

Class

material-modal

Radius

12px

material-fullscreen

全屏

最大抬升。圆角 16px。

Class

material-fullscreen

Radius

16px
