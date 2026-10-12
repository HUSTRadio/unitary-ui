# 项目横幅

> Route: `/components/project-banner`

在项目页面显示需要处理的通知，并提供解决操作。

[返回组件](#/components)

# 项目横幅

project-banner

在项目页面显示需要处理的通知，并提供解决操作。

## 何时使用

- 需要在项目级别展示紧急状态时使用 Project Banner，如逾期账单、活跃回滚、攻击缓解或即将到期阻止部署的试用。
- 根据严重程度匹配语义变体：error 用于关键停机或支付阻塞状态，warning 用于非即时的异常状态，success 用于积极的安全状态，gray 用于常规项目通知。
- 始终提供一个可解决该状态的行动按钮，一条没有解决路径的横幅等于死胡同。

## 何时不应使用

- 不要把 Project Banner 用于可简单关闭的信息——如果消息能在不解决根本状态的情况下被忽略，它不应该成为横幅。
- 不要在单个页面堆叠多个 Project Banner——同时显示一个即可，堆叠互相竞争的消息会让最紧急的状态被淹没。
- 不要将其用于内联上下文相关的单个字段警告——使用 Note 代替。

## 示例

### 默认横幅

展示默认的 Project Banner 外观和基本结构。

### 错误状态

展示 error 变体用于关键停机或支付阻塞等严重问题。

## 无障碍

- Project Banner 默认渲染普通 aside，不自动添加 alert/status；需要播报时由调用方传入 role 和 aria-live。
- 横幅的行动按钮应有明确的 action 标签，遵循 Title Case Verb + Noun 格式（如 Update Payment Method）。
- 关键业务状态可由调用方显式传入 role="alert" 或 aria-live="assertive"；组件不会根据 variant 自动推导。

## 受控行为

不适用: ProjectBanner 本身不管理 dismiss 状态；可组合 ProjectBannerClose，并在显式传入 onClick 时由调用方完成关闭逻辑。

## 响应式行为

- Project Banner 横跨父容器宽度，但组件本身没有小屏字体或内边距断点。
- 移动端的高度、按钮堆叠与换行由调用方容器负责，组件不会自动重排操作区。

## 主题行为

- 不同严重程度的变体（error、warning、success、gray）在暗色/亮色模式下各有对应的配色方案。
- 背景和边框颜色通过主题变量统一管理，全局修改主题时可一键更新所有横幅样式。

## 实时示例

```tsx
import { ProjectBanner } from "@hustradio/unitary-ui";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";

export function ProjectBannerDefault21B111CBExample() {
  const [enabled, setEnabled] = useState(true);

  return (
    <ProjectBanner
      callToAction={enabled ? { label: "Disable", onClick: () => setEnabled(false) } : undefined}
      icon={<ShieldCheck className="shrink-0" />}
      label={<>Attack Challenge Mode is {enabled ? "enabled" : "disabled"} for this project</>}
    />
  );
}
```

## 成功

```tsx
import { ProjectBanner } from "@hustradio/unitary-ui";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";

export function ProjectBannerSuccessC88A0B90Example() {
  const [enabled, setEnabled] = useState(true);

  return (
    <ProjectBanner
      callToAction={enabled ? { label: "Disable", onClick: () => setEnabled(false) } : undefined}
      icon={<ShieldCheck className="shrink-0" />}
      label={<>Attack Challenge Mode is {enabled ? "enabled" : "disabled"} for this project</>}
      variant="success"
    />
  );
}
```

## 警告

```tsx
import { ProjectBanner } from "@hustradio/unitary-ui";
import { Tooltip } from "@hustradio/unitary-ui";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

export function ProjectBannerWarningE981DDAEExample() {
  const [restored, setRestored] = useState(false);

  return (
    <ProjectBanner
      callToAction={
        restored ? undefined : { label: "Undo Rollback", onClick: () => setRestored(true) }
      }
      icon={<RotateCcw />}
      label={
        restored ? (
          <>Rollback restored</>
        ) : (
          <>
            This project was rolled back by{" "}
            <Tooltip
              className="underline decoration-dashed underline-offset-[5px]"
              text="Yesterday for project marketing-website"
            >
              @johnphamous
            </Tooltip>
          </>
        )
      }
      variant="warning"
    />
  );
}
```

## 错误

```tsx
import { ProjectBanner } from "@hustradio/unitary-ui";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";

export function ProjectBannerError54A0E8C1Example() {
  const [requested, setRequested] = useState(false);

  return (
    <ProjectBanner
      callToAction={
        requested
          ? undefined
          : { label: "Update Payment Method", onClick: () => setRequested(true) }
      }
      icon={<TriangleAlert />}
      label={
        <>
          {requested
            ? "Payment method update requested"
            : "Payment failed, update credit card information before your account is shut down"}
        </>
      }
      variant="error"
    />
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { ProjectBanner, ProjectBannerContent, ProjectBannerClose } from "@hustradio/unitary-ui";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">variant</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ProjectBannerVariant</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">横幅强调样式，决定整条横幅 bg/border/text 三件套：success=blue、warning=amber、error=red；default 视觉即 gray（routine 项目级通知），"gray" 为等价别名。官方按设计不可关闭，ProjectBannerClose 为本地扩展。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 需要解决的跨项目状态用 Project Banner：逾期的账单、进行中的回滚、攻击缓解、阻碍部署的到期试用。
- 绑定单个字段或卡片的内联上下文消息用 Note，瞬态确认用 Toast，确认用 Modal。
- 按严重度匹配变体：严重停机或支付阻断状态用 error、非即时动作的异常状态用 warning、正面临时缓解用 success、常规项目级通知用 gray。
- ProjectBanner 不管理 dismiss 状态。适合关闭时组合 ProjectBannerClose 并由调用方处理 onClick；可忽略消息则移到 Note。
- 一次只显示一个 Project Banner。堆叠竞争的 banner 会淹没最紧急的状态。
- 始终提供解决状态的动作；没有出路的 banner 是死胡同。
- label 是句首大写、点名影响的单句；动作标签是首字母大写 动词 + 名词（Update Payment Method、Review Tokens）。
