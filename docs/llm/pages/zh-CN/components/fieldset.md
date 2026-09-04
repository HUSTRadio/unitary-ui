# 字段集

> Route: `/components/fieldset`

将相关表单控件组合成一个语义单元。

[返回组件](#/components)

# 字段集

Fieldset

将相关表单控件组合成一个语义单元。

## 何时使用

- 当需要将一组相关的表单控件归并为一个带有标题、支持文案和可选页脚的语义单元时使用。
- 在设置页面中组织功能分组，如通知设置、安全设置等，每组使用独立的 Fieldset。
- 当整个配置区块需要有统一的状态语义（如 type=error 或 type=warning）来传达整体级别的问题。

## 何时不应使用

- 不要用 Fieldset 来构建非表单类的内容区块——它的语义是为表单控件分组设计的。
- 不要在一个 Fieldset 中混入过多不相干的选项——每组应保持话题的一致性，超过 6-8 项应考虑分组。
- 不要用手动构建的额外卡片外壳替代 FieldsetContent 和 FieldsetFooterActions 的标准子组件。

## 示例

### 默认字段集

展示默认样式的 Fieldset 基本结构：标题、正文内容和可选的页脚区域。

### 带错误文本

演示在 Fieldset 中添加 ErrorText 行内错误消息的用法，标注配置中的具体问题。

### 禁用状态

展示将整个字段集及其内部控件设置为不可编辑的状态，配合解释性页脚保持可读性。

### 禁用墙效果

演示使用 DisabledWall 覆盖整个内容区域但仍保留页脚说明可读写的高级禁用方案。

## 无障碍

- Fieldset 的 legend（标题）会被屏幕阅读器在每个所属表单控件上自动朗读，帮助建立控件归属关系。
- 禁用的 Fieldset 内部控件虽然不可操作，但应保持在 DOM 中并使用 aria-disabled 标记以保持顺序。
- 错误和警告类型的 Fieldset 应在标题附近添加醒目的无障碍提示，如 aria-live 区域。

## 受控行为

- Fieldset 可以通过 disabled 属性整体控制所有内部子控件的启用/禁用状态，简化批量管理。
- type 属性（error/warning）由调用方控制，用于传达整个配置区块的语义状态。
- 内部的 FieldsetContent 和 FieldsetFooterActions 子组件接受各自的受控 props 来自定义行为。

## 响应式行为

- Fieldset 内部表单控件在窄屏上垂直堆叠排列，在大屏上使用横向布局提升空间利用率。
- 标题文本在窄屏上可能缩减字号或允许换行，确保小视口下标题的可读性不被破坏。

## 主题行为

- Fieldset 的边框、分割线和标题强调色跟随应用的主题变量，在暗色/亮色模式下自动适配。
- 禁用状态的灰色调和半透明效果通过 CSS 变量从主题令牌获取，确保跨主题的视觉一致性。

## 实时示例

#### Account Settings

Manage your account preferences and settings

Need help? [View documentation](#)

```tsx
import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterAction,
  FieldsetFooterActions,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@/components/ui/fieldset";

export function FieldsetDefault37A8EEC1Example() {
  return (
    <Fieldset>
      <FieldsetContent>
        <FieldsetTitle>Account Settings</FieldsetTitle>
        <FieldsetSubtitle>Manage your account preferences and settings</FieldsetSubtitle>
      </FieldsetContent>
      <FieldsetFooter>
        <FieldsetFooterStatus>
          <span>
            Need help?{" "}
            <a href="#" className="cursor-pointer text-link hover:underline">
              View documentation
            </a>
          </span>
        </FieldsetFooterStatus>
        <FieldsetFooterActions>
          <FieldsetFooterAction>Save Changes</FieldsetFooterAction>
        </FieldsetFooterActions>
      </FieldsetFooter>
    </Fieldset>
  );
}
```

## disabled

#### Transfer Project

Move this project to another team or account

You need additional permissions to transfer projects.

```tsx
import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@/components/ui/fieldset";

export function FieldsetDisabled17EB3C01Example() {
  return (
    <Fieldset>
      <FieldsetContent disabled>
        <FieldsetTitle>Transfer Project</FieldsetTitle>
        <FieldsetSubtitle>Move this project to another team or account</FieldsetSubtitle>
      </FieldsetContent>
      <FieldsetFooter highlight>
        <FieldsetFooterStatus>
          <span>You need additional permissions to transfer projects.</span>
        </FieldsetFooterStatus>
      </FieldsetFooter>
    </Fieldset>
  );
}
```

## with-long-content

#### Privacy Policy

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam volutpat, nunc vel ultrices sollicitudin, dolor eros volutpat ex, et sagittis sem enim in eros. Curabitur eu consequat neque, non finibus odio. Donec vitae tellus eu mauris feugiat efficitur. Maecenas blandit sit amet tellus vel blandit. Phasellus ultrices vulputate arcu, vel dictum erat facilisis et.

Last updated: March 10, 2025

```tsx
import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterAction,
  FieldsetFooterActions,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@/components/ui/fieldset";

export function FieldsetWithLongContent39C2ED17Example() {
  return (
    <Fieldset>
      <FieldsetContent>
        <FieldsetTitle>Privacy Policy</FieldsetTitle>
        <FieldsetSubtitle>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam volutpat, nunc vel
          ultrices sollicitudin, dolor eros volutpat ex, et sagittis sem enim in eros. Curabitur eu
          consequat neque, non finibus odio. Donec vitae tellus eu mauris feugiat efficitur.
          Maecenas blandit sit amet tellus vel blandit. Phasellus ultrices vulputate arcu, vel
          dictum erat facilisis et.
        </FieldsetSubtitle>
      </FieldsetContent>
      <FieldsetFooter>
        <FieldsetFooterStatus>
          <span>Last updated: March 10, 2025</span>
        </FieldsetFooterStatus>
        <FieldsetFooterActions>
          <FieldsetFooterAction type="secondary">Decline</FieldsetFooterAction>
          <FieldsetFooterAction>Accept</FieldsetFooterAction>
        </FieldsetFooterActions>
      </FieldsetFooter>
    </Fieldset>
  );
}
```

## multiple-fieldsets

#### Personal Information

Update your name and contact details

This information will be publicly visible

#### Security

Manage your password and authentication methods

Last password change: 30 days ago

#### API Access

Generate and manage API tokens for programmatic access

You need a Pro account to access API features.

```tsx
import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterAction,
  FieldsetFooterActions,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@/components/ui/fieldset";

export function FieldsetMultipleFieldsets9DD2DFF4Example() {
  return (
    <div className="flex flex-col gap-6">
      <Fieldset>
        <FieldsetContent>
          <FieldsetTitle>Personal Information</FieldsetTitle>
          <FieldsetSubtitle>Update your name and contact details</FieldsetSubtitle>
        </FieldsetContent>
        <FieldsetFooter>
          <FieldsetFooterStatus>
            <span>This information will be publicly visible</span>
          </FieldsetFooterStatus>
          <FieldsetFooterActions>
            <FieldsetFooterAction>Update</FieldsetFooterAction>
          </FieldsetFooterActions>
        </FieldsetFooter>
      </Fieldset>

      <Fieldset>
        <FieldsetContent>
          <FieldsetTitle>Security</FieldsetTitle>
          <FieldsetSubtitle>Manage your password and authentication methods</FieldsetSubtitle>
        </FieldsetContent>
        <FieldsetFooter>
          <FieldsetFooterStatus>
            <span>Last password change: 30 days ago</span>
          </FieldsetFooterStatus>
          <FieldsetFooterActions>
            <FieldsetFooterAction>Change Password</FieldsetFooterAction>
          </FieldsetFooterActions>
        </FieldsetFooter>
      </Fieldset>

      <Fieldset>
        <FieldsetContent disabled>
          <FieldsetTitle>API Access</FieldsetTitle>
          <FieldsetSubtitle>
            Generate and manage API tokens for programmatic access
          </FieldsetSubtitle>
        </FieldsetContent>
        <FieldsetFooter highlight>
          <FieldsetFooterStatus>
            <span>You need a Pro account to access API features.</span>
          </FieldsetFooterStatus>
        </FieldsetFooter>
      </Fieldset>
    </div>
  );
}
```

## without-footer

#### Account Information

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquam nisl.

```tsx
import {
  Fieldset,
  FieldsetContent,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@/components/ui/fieldset";

export function FieldsetWithoutFooterED163245Example() {
  return (
    <Fieldset>
      <FieldsetContent>
        <FieldsetTitle>Account Information</FieldsetTitle>
        <FieldsetSubtitle>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam
          ultricies, nisl nisl aliquam nisl.
        </FieldsetSubtitle>
      </FieldsetContent>
    </Fieldset>
  );
}
```

## without-title

This fieldset contains only a subtitle with no title. It can be used for informational sections or supplementary content.

Information only

```tsx
import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterStatus,
  FieldsetSubtitle,
} from "@/components/ui/fieldset";

export function FieldsetWithoutTitle2B0715C3Example() {
  return (
    <Fieldset>
      <FieldsetContent>
        <FieldsetSubtitle>
          This fieldset contains only a subtitle with no title. It can be used for informational
          sections or supplementary content.
        </FieldsetSubtitle>
      </FieldsetContent>
      <FieldsetFooter>
        <FieldsetFooterStatus>
          <span>Information only</span>
        </FieldsetFooterStatus>
      </FieldsetFooter>
    </Fieldset>
  );
}
```

## with-error-text

#### API Configuration

Configure your API endpoint and authentication

API key validation failed. Please check your credentials and try again.

Last checked: 5 minutes ago

```tsx
import {
  ErrorText,
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterAction,
  FieldsetFooterActions,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@/components/ui/fieldset";

export function FieldsetWithErrorTextB52BED15Example() {
  return (
    <Fieldset>
      <FieldsetContent>
        <FieldsetTitle>API Configuration</FieldsetTitle>
        <FieldsetSubtitle>Configure your API endpoint and authentication</FieldsetSubtitle>
        <div className="mt-4">
          <ErrorText>
            API key validation failed. Please check your credentials and try again.
          </ErrorText>
        </div>
      </FieldsetContent>
      <FieldsetFooter>
        <FieldsetFooterStatus>
          <span>Last checked: 5 minutes ago</span>
        </FieldsetFooterStatus>
        <FieldsetFooterActions>
          <FieldsetFooterAction>Verify API Connection</FieldsetFooterAction>
        </FieldsetFooterActions>
      </FieldsetFooter>
    </Fieldset>
  );
}
```

## with-warning-text

#### Database Settings

Configure your database connection parameters

Changing these settings will require a restart of your application. Make sure to save any pending work.

Current status: Connected

```tsx
import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterAction,
  FieldsetFooterActions,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
  WarningText,
} from "@/components/ui/fieldset";

export function FieldsetWithWarningText16633F67Example() {
  return (
    <Fieldset>
      <FieldsetContent>
        <FieldsetTitle>Database Settings</FieldsetTitle>
        <FieldsetSubtitle>Configure your database connection parameters</FieldsetSubtitle>
        <div className="mt-4">
          <WarningText>
            Changing these settings will require a restart of your application. Make sure to save
            any pending work.
          </WarningText>
        </div>
      </FieldsetContent>
      <FieldsetFooter>
        <FieldsetFooterStatus>
          <span>Current status: Connected</span>
        </FieldsetFooterStatus>
        <FieldsetFooterActions>
          <FieldsetFooterAction type="secondary">Cancel</FieldsetFooterAction>
          <FieldsetFooterAction>Apply Changes</FieldsetFooterAction>
        </FieldsetFooterActions>
      </FieldsetFooter>
    </Fieldset>
  );
}
```

## with-disabled-wall

#### Advanced Features

Access premium capabilities and tools

This content is behind a disabled wall and not accessible to free users.

It contains advanced configuration options and premium features.

Upgrade to a Pro plan to access these features.

```tsx
import {
  DisabledWall,
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@/components/ui/fieldset";

export function FieldsetWithDisabledWallB242E994Example() {
  return (
    <Fieldset>
      <FieldsetContent disabled>
        <FieldsetTitle>Advanced Features</FieldsetTitle>
        <FieldsetSubtitle>Access premium capabilities and tools</FieldsetSubtitle>
        <div className="relative mt-2 rounded-[6px] border border-gray-alpha-400 p-3">
          <p className="text-copy-14">
            This content is behind a disabled wall and not accessible to free users.
          </p>
          <p className="mt-2 text-copy-14">
            It contains advanced configuration options and premium features.
          </p>
          <DisabledWall />
        </div>
      </FieldsetContent>
      <FieldsetFooter highlight>
        <FieldsetFooterStatus>
          <span>Upgrade to a Pro plan to access these features.</span>
        </FieldsetFooterStatus>
      </FieldsetFooter>
    </Fieldset>
  );
}
```

## error-type

#### Payment Failed

Your payment method was declined. Please update your billing information to continue using the service.

Payment failed on February 10, 2026

```tsx
import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterAction,
  FieldsetFooterActions,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@/components/ui/fieldset";

export function FieldsetErrorType96E58B0DExample() {
  return (
    <Fieldset type="error">
      <FieldsetContent>
        <FieldsetTitle>Payment Failed</FieldsetTitle>
        <FieldsetSubtitle>
          Your payment method was declined. Please update your billing information to continue using
          the service.
        </FieldsetSubtitle>
      </FieldsetContent>
      <FieldsetFooter>
        <FieldsetFooterStatus>
          <span>Payment failed on February 10, 2026</span>
        </FieldsetFooterStatus>
        <FieldsetFooterActions>
          <FieldsetFooterAction type="secondary">Contact Support</FieldsetFooterAction>
          <FieldsetFooterAction>Update Payment Method</FieldsetFooterAction>
        </FieldsetFooterActions>
      </FieldsetFooter>
    </Fieldset>
  );
}
```

## warning-type

#### Trial Ending Soon

Your trial period will end in 3 days. Add a payment method to continue accessing premium features without interruption.

Trial expires: February 13, 2026

```tsx
import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterAction,
  FieldsetFooterActions,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@/components/ui/fieldset";

export function FieldsetWarningType82942353Example() {
  return (
    <Fieldset type="warning">
      <FieldsetContent>
        <FieldsetTitle>Trial Ending Soon</FieldsetTitle>
        <FieldsetSubtitle>
          Your trial period will end in 3 days. Add a payment method to continue accessing premium
          features without interruption.
        </FieldsetSubtitle>
      </FieldsetContent>
      <FieldsetFooter>
        <FieldsetFooterStatus>
          <span>Trial expires: February 13, 2026</span>
        </FieldsetFooterStatus>
        <FieldsetFooterActions>
          <FieldsetFooterAction type="secondary">Remind Me Later</FieldsetFooterAction>
          <FieldsetFooterAction>Add Payment Method</FieldsetFooterAction>
        </FieldsetFooterActions>
      </FieldsetFooter>
    </Fieldset>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import {
  Fieldset,
  FieldsetTitle,
  FieldsetSubtitle,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterStatus,
  FieldsetFooterActions,
  FieldsetFooterAction,
  ErrorText,
  WarningText,
  DisabledWall,
} from "@/components/ui/fieldset";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">type</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">FieldsetType</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">卡片边框与页脚的视觉语气。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">在 FieldsetContent 中渲染的可选标题。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">subtitle</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">渲染在标题下方的可选副标题。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">disabled</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">通过交互遮罩禁用 FieldsetContent 内容区。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">highlight</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">为 FieldsetFooter 应用高亮背景。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>

## 最佳实践

- 带标题、辅助文案和可选页脚状态/动作的单个设置界面用 Fieldset。
- 正文放 FieldsetContent、动作放 FieldsetFooterActions；不要手搭额外的卡片或页脚壳。
- 不可用区块用 disabled content 或 DisabledWall，同时保持说明性页脚可读。
- 仅当整个表面携带该语义状态时才用 type=error 或 type=warning；内联消息用 ErrorText 或 WarningText。
