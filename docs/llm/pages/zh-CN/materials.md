# 材质

> Route: `/materials`

# 材质

圆角、填充、描边与阴影的预设。

Surface 用于页面内的容器，Floating 用于浮层。材质预设定义圆角、背景、边框和阴影；显示顺序由层级变量单独控制。

## 表面

用于页面内的容器。用较轻的阴影区分层次，避免过度突出。

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

用于弹出面板。避免重复叠加材质，保留焦点指示和 ARIA 属性，并检查明暗主题下是否清晰。

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
