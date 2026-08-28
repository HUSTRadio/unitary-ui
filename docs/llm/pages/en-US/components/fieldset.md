# Fieldset

> Route: `/components/fieldset`

Groups related form controls into a single semantic unit.

[Back to Components](#/components)

# Fieldset

Fieldset

Groups related form controls into a single semantic unit.

## When to use

- When you need to group a set of related form controls into a single semantic unit with a title, supporting description, and optional footer area.
- To organize functional groups on settings pages, such as notification settings, security settings, each in its own Fieldset.
- When the entire configuration surface carries a unified semantic state (type=error or type=warning) to communicate system-level issues.

## When not to use

- Don't use Fieldset for non-form content blocks — its semantic purpose is specifically for grouping related form controls.
- Don't mix too many unrelated options in a single Fieldset — each group should maintain topical coherence; consider splitting beyond 6–8 items.
- Don't hand-build extra card shells around Fieldset — use the standard FieldsetContent and FieldsetFooterActions sub-components.

## Examples

### Default fieldset

Displays the basic Fieldset structure with a title, body content area, and optional footer section.

### With error text

Demonstrates adding an ErrorText inline message to highlight specific configuration problems within the Fieldset.

### Disabled state

Shows setting the entire fieldset and its internal controls to a non-editable disabled state, with an explanatory footer remaining readable.

### Disabled wall effect

Demonstrates using DisabledWall to cover the entire content area while keeping the footer explanation interactable — an advanced disabled pattern.

## Accessibility

- The Fieldset legend (title) is automatically announced by screen readers before each associated form control, establishing ownership context.
- Disabled Fieldset internals remain in the DOM marked with aria-disabled to preserve tab order and reading sequence.
- Fieldsets with error or warning types should include an accessible live region near the title to announce the semantic state.

## Controlled behavior

- The entire group of child controls can be enabled/disabled together via a disabled prop, simplifying batch management.
- The type prop (error/warning) is controlled externally to convey the semantic state of the entire configuration surface.
- Sub-components FieldsetContent and FieldsetFooterActions accept their own controlled props for customized behavior.

## Responsive behavior

- Internal form controls stack vertically on narrow screens and switch to horizontal layouts on wider viewports for better space utilization.
- Title text may reduce font size or allow wrapping on narrow screens, preserving title legibility at smaller breakpoints.

## Theme behavior

- Fieldset borders, dividers, and title accent colors follow application theme variables, adapting automatically between dark and light modes.
- Disabled-state grays and transparency effects are sourced from CSS variable tokens, ensuring visual consistency across themes.

## Live Demo

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
</Fieldset>;
```

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
</Fieldset>;
```

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

<Fieldset>
  <FieldsetContent>
    <FieldsetTitle>Privacy Policy</FieldsetTitle>
    <FieldsetSubtitle>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam volutpat, nunc vel ultrices
      sollicitudin, dolor eros volutpat ex, et sagittis sem enim in eros. Curabitur eu consequat
      neque, non finibus odio. Donec vitae tellus eu mauris feugiat efficitur. Maecenas blandit sit
      amet tellus vel blandit. Phasellus ultrices vulputate arcu, vel dictum erat facilisis et.
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
</Fieldset>;
```

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
      <FieldsetSubtitle>Generate and manage API tokens for programmatic access</FieldsetSubtitle>
    </FieldsetContent>
    <FieldsetFooter highlight>
      <FieldsetFooterStatus>
        <span>You need a Pro account to access API features.</span>
      </FieldsetFooterStatus>
    </FieldsetFooter>
  </Fieldset>
</div>;
```

#### Account Information

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquam nisl.

```tsx
import {
  Fieldset,
  FieldsetContent,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@/components/ui/fieldset";

<Fieldset>
  <FieldsetContent>
    <FieldsetTitle>Account Information</FieldsetTitle>
    <FieldsetSubtitle>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam
      ultricies, nisl nisl aliquam nisl.
    </FieldsetSubtitle>
  </FieldsetContent>
</Fieldset>;
```

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
</Fieldset>;
```

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

<Fieldset>
  <FieldsetContent>
    <FieldsetTitle>API Configuration</FieldsetTitle>
    <FieldsetSubtitle>Configure your API endpoint and authentication</FieldsetSubtitle>
    <div className="mt-4">
      <ErrorText>API key validation failed. Please check your credentials and try again.</ErrorText>
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
</Fieldset>;
```

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

<Fieldset>
  <FieldsetContent>
    <FieldsetTitle>Database Settings</FieldsetTitle>
    <FieldsetSubtitle>Configure your database connection parameters</FieldsetSubtitle>
    <div className="mt-4">
      <WarningText>
        Changing these settings will require a restart of your application. Make sure to save any
        pending work.
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
</Fieldset>;
```

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
</Fieldset>;
```

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

<Fieldset type="error">
  <FieldsetContent>
    <FieldsetTitle>Payment Failed</FieldsetTitle>
    <FieldsetSubtitle>
      Your payment method was declined. Please update your billing information to continue using the
      service.
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
</Fieldset>;
```

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
</Fieldset>;
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import {
  Fieldset,
  FieldsetTitle,
  FieldsetSubtitle,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterStatus,
  FieldsetFooterAction,
} from "@/components/ui/fieldset";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">legend</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Accessible group label.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Fieldset for one settings surface with a title, supporting copy, and optional footer status/actions.
- Put body content in FieldsetContent and actions in FieldsetFooterActions; don't hand-build an extra card or footer shell.
- Use disabled content or DisabledWall for unavailable sections while keeping the explanatory footer readable.
- Use type=error or type=warning only when the whole surface carries that semantic state; use ErrorText or WarningText for inline messages.
