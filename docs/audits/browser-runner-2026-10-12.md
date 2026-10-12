# 浏览器 CI runner 选择 / Browser CI runner selection

日期 / Date: 2026-10-12

将运行完整交互矩阵的四处 job 定义统一到 `windows-2025`：docs-layout 分片、应用构建与包契约、最终发布包验收，以及已发布包的文档产物验收。README 截图已使用该 runner；lint、类型检查、单元测试、文档语料构建和 npm 发布继续使用 Ubuntu。保留源码、独立候选包及 registry 文档各 570 项浏览器用例、明暗主题和全部适用视口，保留原有 60 / 90 分钟 job 限时及 20ms 的滚动帧时间 P95 门槛。

The four job definitions running the complete interaction matrix use `windows-2025`: docs-layout shards, application build and package contracts, final release-package validation, and published-package documentation validation. README screenshots already use this runner. Lint, type checks, unit tests, documentation corpus builds, and npm publishing remain on Ubuntu. Source docs, independent candidate-package docs, and registry docs each retain all 570 browser cases, both themes, all applicable viewports, the existing 60 / 90 minute job limits, and the 20ms scroll-frame P95 gate.

## 对照证据 / Comparison evidence

分别检出迁移前 `e38d5b3974af0136139a9c83759f6dd28bd3a57f` 和迁移后 `3a38950eeb507e42653f7ae00fef64db9a71f492`，在同一 job 内串行执行原有材质滚动性能用例。两平台使用相同 Chromium `151.0.7922.34`；诊断禁用测试重试。表内值为 Glass 帧间隔 P95，约数单位为毫秒。

The pre-migration commit `e38d5b3974af0136139a9c83759f6dd28bd3a57f` and post-migration commit `3a38950eeb507e42653f7ae00fef64db9a71f492` were checked out separately and ran the original material scroll-performance case serially within the same job. Both platforms used Chromium `151.0.7922.34`, with test retries disabled for diagnosis. The table reports approximate Glass frame-interval P95 values in milliseconds.

| 环境 / Environment | 迁移前 / Before | 迁移后 / After | 证据 / Evidence |
| --- | ---: | ---: | --- |
| Ubuntu 24.04，原配置 / Original configuration | 33.3 | 33.3 | [首次对照 / Initial comparison](https://github.com/HUSTRadio/unitary-ui/actions/runs/38235150607) |
| Ubuntu 24.04，原配置、显式关闭 fixture tracing / Original configuration and tracing explicitly disabled in the test fixture | 33.3 | 33.3 | [Tracing 对照 / Tracing comparison](https://github.com/HUSTRadio/unitary-ui/actions/runs/38235673933) |
| Ubuntu 24.04，Xvfb headed Chromium | 33.4 | 33.3 | [显示模式对照 / Display-mode comparison](https://github.com/HUSTRadio/unitary-ui/actions/runs/38235673933) |
| Ubuntu 24.04，完整 SwiftShader ANGLE 合成与光栅 / Full SwiftShader ANGLE compositing and rasterization | 66.7 | 66.7 | [软件合成对照 / Software-compositor comparison](https://github.com/HUSTRadio/unitary-ui/actions/runs/38236282056) |
| Windows 2025，原配置，各重复两次 / Original configuration, two repetitions per commit | 16.7 / 16.7 | 16.7 / 16.7 | [Windows 对照 / Windows comparison](https://github.com/HUSTRadio/unitary-ui/actions/runs/38237737392) |

关闭 tracing 的有效对照是在测试 fixture 内关闭；首次运行只传入 CLI 的 tracing 参数，不能据此认定 fixture tracing 已关闭。完整 SwiftShader 实验确认合成与光栅路径已启用，但 Hybrid P95 反而达到迁移前 116.8ms、迁移后 100ms，因此没有采用这组启动参数。

The valid tracing comparison disabled tracing inside the test fixture. The initial run only supplied a CLI tracing option, which did not establish that fixture tracing was disabled. The full SwiftShader experiment confirmed enabled compositing and rasterization, but Hybrid P95 worsened to 116.8ms before migration and 100ms afterward; those launch flags were therefore not adopted.

所有对照的实际累计滚动距离均为 360px，未记录 JavaScript long task。Ubuntu 和 Windows 的默认诊断均显示软件渲染路径，不能把 Windows 的通过解释为获得物理 GPU 加速。结果表明旧源码同样触发 Ubuntu 的帧时间失败，且关闭 tracing 或切换显示模式没有消除它；Windows 在相同浏览器版本和原测试配置下，两个提交各连续两次首轮通过。该证据支持选用 Windows 执行现有门禁，不构成组件在所有设备上都达到同一帧率的保证。

Every comparison recorded 360px of actual cumulative scrolling and no JavaScript long tasks. Default diagnostics on both Ubuntu and Windows indicated software rendering, so the Windows passes do not establish physical GPU acceleration. The old source also failed the Ubuntu frame-time gate, and disabling tracing or changing display mode did not remove that failure. With the same browser version and original test configuration, both commits passed twice on Windows without retries. This supports choosing Windows for the existing gate; it does not guarantee the same frame rate on every device.

## 验收范围 / Validation scope

上述诊断仅验证 runner 选择依据。正式发布仍要求四处 job 对最终提交执行完整检查并通过；该调整没有修改材质实现、性能用例、P95 门槛或发布回执校验。最终 CI 结果以对应发布运行的报告为准。

These focused diagnostics establish the basis for runner selection. Publication still requires all four job definitions to run their complete checks against the final commit and pass. The change preserves material implementation, the performance case, its P95 threshold, and publication receipt validation. The final release run's reports remain the acceptance evidence.
