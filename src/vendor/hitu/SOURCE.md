# HiTu source attribution

Upstream: https://github.com/ant-design/HiTu

Fixed revision: `92119663fb5e551ccab5d0b46532c0a3317e0cc8` (2021-09-03), corresponding to `@ant-design/hitu@0.0.0-alpha.17`.

License: MIT; the original copyright and license are reproduced in `LICENSE`.

`interpolation.ts` adapts `packages/hitu/src/utils/cubicUtil.ts`, `utils/svgUtil.ts`, and `hooks/useFramer.tsx`. `layer.tsx` retains the nested translation, origin-relative matrix scaling, rotation, and opacity of `packages/hitu/src/HiTu/Chip.tsx`. `HituPlayer` adapts the original component and frame playback for React 19, StrictMode, system motion preferences, viewport and page visibility, and SSR.

`assets.tsx` contains the original vector geometry from these files at the fixed revision:

- `packages/hitu-assets/svg/3.通用组件/灰色版/箱子.svg`
- `packages/hitu-assets/svg/3.通用组件/彩色版/文件.svg`

The asset colors use existing Unitary gray tokens. Unreferenced upstream SVG IDs and editor metadata are removed, so repeated instances do not share SVG IDs. SVG props render normally instead of the upstream memoized HTML template.

This adaptation supports React shape sources with static width and height. It intentionally excludes the experimental SVG string parser and unfinished chip animation. Sparse keyframes inherit the shape transform and preceding keyframes; values outside the timeline clamp to its endpoints. Easing belongs to the start of each segment. Playback defaults to paused, frame 0, and no looping at 60 frames per second. `frames` is the total frame count, preserving the upstream range `0` through `frames - 1`; zero-frame scenes remain static. Invalid seek values are clamped. RAF advancement reports every crossed frame in order, including loop wrapping; callbacks can pause, seek or unmount without receiving the remaining stale frames. The initial frame and explicit seek destinations are reported once. Reduced motion always displays the initial frame. Viewport and page visibility pause effective playback while retaining playback intent.

The original upstream is an unmaintained prototype whose README warns against production use. This directory is a reviewed local adaptation, not a claim of upstream production support.

本地曲线维护：缺省片段采用项目 CSS token 生成的平滑非线性曲线；线性或非法的显式曲线同样使用该默认值。有效的作者非线性曲线保留。Hitu 与滚动共用纯函数求解贝塞尔时间轴，替代上游十步近似，端点准确且服务端无需访问浏览器对象；Motion 从同一模块解析曲线参数，再由其引擎执行。这是本项目的后续修改，不是上游行为或 Apple 官方参数。

Local easing maintenance: missing segments use the smooth nonlinear curve generated from the project's CSS token; linear or invalid explicit curves use the same default. Valid authored nonlinear curves remain supported. Hitu and scrolling share a pure Bezier time-axis solver that replaces the upstream ten-step approximation, preserves exact endpoints, and needs no browser globals on the server. Motion parses curve parameters from the same module and delegates execution to its engine. These are subsequent local changes, not upstream behavior or official Apple parameters.
