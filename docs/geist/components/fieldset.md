# Fieldset

Groups related form controls inside a bordered card with optional footer actions.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "View documentation" · .cursor-pointer · h:auto · 400 14px/20px · fg:#0072f5
>   "Save Changes" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#ffffff · bg:#171717 · r:6px
> - **Disabled**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **With Long Content**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Decline" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#171717 · bg:#ffffff · r:6px
>   "Accept" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#ffffff · bg:#171717 · r:6px
> - **Multiple Fieldsets**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Update" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#ffffff · bg:#171717 · r:6px
>   "Change Password" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#ffffff · bg:#171717 · r:6px
> - **Without Footer**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Without Title**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **With Error Text**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Verify API Connection" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#ffffff · bg:#171717 · r:6px
> - **With Warning Text**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Cancel" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#171717 · bg:#ffffff · r:6px
>   "Apply Changes" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#ffffff · bg:#171717 · r:6px
> - **With Disabled Wall**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Error Type**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Contact Support" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#171717 · bg:#ffffff · r:6px
>   "Update Payment Method" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#ffffff · bg:#171717 · r:6px
> - **Warning Type**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Remind Me Later" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#171717 · bg:#ffffff · r:6px
>   "Add Payment Method" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#ffffff · bg:#171717 · r:6px
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "View documentation" · .cursor-pointer · h:auto · 400 14px/20px · fg:#52a8ff
>   "Save Changes" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#0a0a0a · bg:#ededed · r:6px
> - **Disabled**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **With Long Content**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Decline" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#ededed · bg:#0a0a0a · r:6px
>   "Accept" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#0a0a0a · bg:#ededed · r:6px
> - **Multiple Fieldsets**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Update" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#0a0a0a · bg:#ededed · r:6px
>   "Change Password" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#0a0a0a · bg:#ededed · r:6px
> - **Without Footer**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Without Title**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **With Error Text**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Verify API Connection" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#0a0a0a · bg:#ededed · r:6px
> - **With Warning Text**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Cancel" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#ededed · bg:#0a0a0a · r:6px
>   "Apply Changes" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#0a0a0a · bg:#ededed · r:6px
> - **With Disabled Wall**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Error Type**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Contact Support" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#ededed · bg:#0a0a0a · r:6px
>   "Update Payment Method" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#0a0a0a · bg:#ededed · r:6px
> - **Warning Type**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Remind Me Later" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#ededed · bg:#0a0a0a · r:6px
>   "Add Payment Method" · .outline-none · h:32px · pad:0px 6px · 500 14px/20px · fg:#0a0a0a · bg:#ededed · r:6px

<!-- GEIST-RENDER-METRICS-END -->

## Default

#### Account Settings

Manage your account preferences and settings

```tsx
import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterActions,
  FieldsetFooterAction,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
  Link,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
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
            <Link href="#" variant="highlight">
              View documentation
            </Link>
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

## Disabled

#### Transfer Project

Move this project to another team or account

```tsx
import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Fieldset>
      <FieldsetContent disabled>
        <FieldsetTitle>Transfer Project</FieldsetTitle>
        <FieldsetSubtitle>Move this project to another team or account</FieldsetSubtitle>
      </FieldsetContent>
      <FieldsetFooter highlight>
        <span className="text-copy-14 text-gray-900">
          You need additional permissions to transfer projects.
        </span>
      </FieldsetFooter>
    </Fieldset>
  );
}
```

## With Long Content

#### Privacy Policy

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam volutpat, nunc vel ultrices sollicitudin, dolor eros volutpat ex, et sagittis sem enim in eros. Curabitur eu consequat neque, non finibus odio. Donec vitae tellus eu mauris feugiat efficitur. Maecenas blandit sit amet tellus vel blandit. Phasellus ultrices vulputate arcu, vel dictum erat facilisis et.

```tsx
import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterActions,
  FieldsetFooterAction,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
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
          <FieldsetFooterAction variant="secondary">Decline</FieldsetFooterAction>
          <FieldsetFooterAction>Accept</FieldsetFooterAction>
        </FieldsetFooterActions>
      </FieldsetFooter>
    </Fieldset>
  );
}
```

## Multiple Fieldsets

#### Personal Information

Update your name and contact details

#### Security

Manage your password and authentication methods

#### API Access

Generate and manage API tokens for programmatic access

```tsx
import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterActions,
  FieldsetFooterAction,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
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
          <span className="text-copy-14">You need a Pro account to access API features.</span>
        </FieldsetFooter>
      </Fieldset>
    </div>
  );
}
```

## Without Footer

#### Account Information

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquam nisl.

```tsx
import {
  Fieldset,
  FieldsetContent,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
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

## Without Title

This fieldset contains only a subtitle with no title. It can be used for informational sections or supplementary content.

```tsx
import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterStatus,
  FieldsetSubtitle,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
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

## With Error Text

#### API Configuration

Configure your API endpoint and authentication

```tsx
import {
  ErrorText,
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterActions,
  FieldsetFooterAction,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
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

## With Warning Text

#### Database Settings

Configure your database connection parameters

```tsx
import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterActions,
  FieldsetFooterAction,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
  WarningText,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
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
          <FieldsetFooterAction variant="secondary">Cancel</FieldsetFooterAction>
          <FieldsetFooterAction>Apply Changes</FieldsetFooterAction>
        </FieldsetFooterActions>
      </FieldsetFooter>
    </Fieldset>
  );
}
```

## With Disabled Wall

#### Advanced Features

Access premium capabilities and tools

This content is behind a disabled wall and not accessible to free users.

It contains advanced configuration options and premium features.

```tsx
import {
  DisabledWall,
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Fieldset>
      <FieldsetContent disabled>
        <FieldsetTitle>Advanced Features</FieldsetTitle>
        <FieldsetSubtitle>Access premium capabilities and tools</FieldsetSubtitle>
        <div className="relative mt-2 p-3 border rounded">
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
        <span className="text-copy-14">Upgrade to a Pro plan to access these features.</span>
      </FieldsetFooter>
    </Fieldset>
  );
}
```

## Error Type

#### Payment Failed

Your payment method was declined. Please update your billing information to continue using the service.

```tsx
import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterActions,
  FieldsetFooterAction,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
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
          <FieldsetFooterAction variant="secondary">Contact Support</FieldsetFooterAction>
          <FieldsetFooterAction>Update Payment Method</FieldsetFooterAction>
        </FieldsetFooterActions>
      </FieldsetFooter>
    </Fieldset>
  );
}
```

## Warning Type

#### Trial Ending Soon

Your trial period will end in 3 days. Add a payment method to continue accessing premium features without interruption.

```tsx
import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterActions,
  FieldsetFooterAction,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
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
          <FieldsetFooterAction variant="secondary">Remind Me Later</FieldsetFooterAction>
          <FieldsetFooterAction>Add Payment Method</FieldsetFooterAction>
        </FieldsetFooterActions>
      </FieldsetFooter>
    </Fieldset>
  );
}
```

Was this helpful?
