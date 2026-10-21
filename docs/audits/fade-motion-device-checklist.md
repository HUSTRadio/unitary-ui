# Fade motion device checklist / 淡入淡出真机验收

Status / 状态：**PENDING — no physical devices available / 待验，当前没有真实设备。**

The automated engine matrix is separate evidence. Playwright WebKit is not a
physical iPhone, and a narrow viewport or CDP touch injection does not prove
native scrolling or hardware composition. Do not mark this checklist passed
from automated results.

自动引擎矩阵单独记录。Playwright WebKit 不是实体 iPhone；窄视口或 CDP 触摸注入
不能证明原生滚动或硬件合成。不得用自动化通过替代本清单的真机结果。

## Open the same artifact / 打开同一构建产物

1. Run `pnpm exec playwright install chromium firefox webkit` once, then
   `pnpm run test:motion`. Keep its evidence directory, tested commit and the
   `artifact` path and `manifestSha256` from its summary.
   首次安装三个浏览器，再运行完整动画检查，保留本次证据目录、提交号及摘要中的
   `artifact` 路径与 `manifestSha256`。
2. After the check exits, serve the generated artifact on the computer:
   检查结束后，在电脑上预览刚才生成的产物：

   ```sh
   pnpm exec vite preview --config docs/vite.config.ts --outDir ../.scratch/motion-browsers/run-<id>/artifact --host 0.0.0.0 --port 5213 --strictPort
   ```

3. Connect the phone to the same LAN and open
   `http://<computer-LAN-IP>:5213/site/build/motion-regression.html`.
   手机连接同一局域网，使用电脑局域网 IP 打开上述地址。
4. Replace `run-<id>` with the directory printed by the check. Keep that artifact
   unchanged; its `.vite/manifest.json` SHA-256 must match the summary. A different
   artifact requires a new record.
   将 `run-<id>` 替换为检查输出的实际目录。验收期间保持该副本不变，其
   `.vite/manifest.json` 的 SHA-256 必须与摘要一致；更换产物应新建记录。

The fixture uses the library theme and styles, with normal animation playback.
Light/Dark and solid/acrylic/glass controls are at the top. The red carousel has
a blue backing; the slow toast viewport deliberately exits in 400ms.
夹具复用库主题和样式，动画正常播放。顶部可切换明暗主题与三种材质；轮播红图的
蓝色底用于暴露透底，慢通知视口故意使用 400ms 退出。

## Device matrix / 设备矩阵

| Device / 设备 | Browser / 浏览器 | Status / 状态 |
| --- | --- | --- |
| Physical iPhone, record model and iOS / 实体 iPhone，记录机型和 iOS | Safari, record version / 记录版本 | Pending / 待验 |
| Physical Android phone, record model and OS / 实体安卓手机，记录机型和系统 | Chrome, record version / 记录版本 | Pending / 待验 |

## Procedure and acceptance / 操作及标准

Run in both Light and Dark, portrait and landscape. Repeat rapid switching,
drag dismissal and reopening ten times each. Record unsupported OS settings as
unsupported, not passed.
分别在明暗主题、横竖屏下执行。快速切换、拖拽关闭、重开各重复十轮。
系统不提供的偏好设置应记为“不支持”，不得记为通过。

| Action / 操作 | Expected / 预期 |
| --- | --- |
| Open/close Modal and each drawer; close early during entrance / 打开关闭模态框与各类抽屉，并在进入中关闭 | Content appears promptly; mask and panel leave together; no empty blocking layer / 内容及时出现，遮罩和面板同步退出，无残留阻挡层 |
| Switch the red carousel rapidly in both directions / 连续正反切换红图 | No blue/white/black flash; scale continues smoothly / 无蓝、白、黑闪烁，缩放连续 |
| Drag Drawer below dismissal distance, then beyond it / 先小幅拖拽，再拖过关闭距离 | Small drag returns; dismissal continues from release position / 小幅拖拽归位，关闭从释放位置继续 |
| Use drawer-reject and drag past dismissal distance / 打开 drawer-reject 并拖过关闭距离 | Controlled rejection returns the panel without closing / 受控拒绝关闭后正常归位 |
| Add a toast and dismiss immediately; toggle slow viewport / 添加通知后立即关闭，并切换慢视口 | No opacity jump; item survives until all mounted views finish / 无透明度跳变，等待已挂载视口完成后移除 |
| Open expand-panel and use its Close and reopen button (reopens 50ms into the default exit) / 打开 expand-panel，使用内部 Close and reopen 按钮，在默认退出的第 50ms 重开 | Reopened panel remains present and interactive / 重开的面板不误卸载，可正常操作 |
| Scroll before opening a modal; try scrolling behind it; close / 先滚动页面，再打开模态浮层并尝试滚动背景，最后关闭 | Background stays locked while open, unlocks afterward; keyboard focus returns to trigger when applicable / 打开时锁定背景，关闭后恢复，适用时键盘焦点回到触发器 |
| Enable/disable system reduced motion while open or exiting / 在打开或退出期间切换系统减少动画 | Motion settles promptly; no stranded overlay or toast / 动画及时结束，无浮层或通知残留 |
| Repeat with acrylic/glass; use reduced transparency if provided / 在 acrylic、glass 下复查，系统提供时开启减少透明度 | Readable content, no abrupt flash; transparency fallback is recorded separately / 内容可读、无突闪，透明度降级结果单独记录 |

## Evidence record / 结果记录

Copy one record per device/build. Do not insert credentials, local filesystem
paths or private network addresses into committed reports.
每个设备和构建复制一份记录；提交报告时不要包含凭据、本机文件路径或私有网络地址。

| Field / 字段 | Value / 结果 |
| --- | --- |
| Commit and dirty-change description / 提交与未提交变更说明 | Pending / 待填 |
| Manifest SHA-256 / 产物指纹 | Pending / 待填 |
| Device, OS, browser version / 设备、系统、浏览器版本 | Pending / 待填 |
| Theme, orientation, texture, OS preferences / 主题、方向、材质、系统偏好 | Pending / 待填 |
| Cases, repetitions, observed results / 场景、重复次数、观察结果 | Pending / 待填 |
| Recording or screenshots / 录屏或截图 | Pending / 待填 |
| Failures, unsupported settings, follow-up / 失败、不支持项与后续 | Pending / 待填 |
| Final status / 最终状态 | Pending / 待验 |
