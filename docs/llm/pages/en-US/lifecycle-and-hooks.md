# Lifecycle & Hooks

> Route: `/lifecycle-and-hooks`

# Lifecycle & Hooks

The short version: these components have no lifecycle hooks like `componentDidMount` or `componentWillUnmount`. All behavior is exposed through props and callbacks — who owns the state, when it changes, and who gets notified are all decided by the props you pass. This page explains how the three mechanisms work.

## Controlled & uncontrolled

Every stateful component (`Input`, `Select`, `Combobox`, `Switch`, …) supports two modes. The only question is where the state lives:

-   **Controlled:** you own the state. Pass the current value via `value`, `open`, or `checked`, plus the matching `on…Change` callback. Every user interaction fires that callback; if you don't write the new value back to your state, the UI doesn't change — which amounts to rejecting the change.
-   **Uncontrolled:** pass only `defaultValue`, `defaultOpen`, or `defaultChecked` to set the initial value. After that the component keeps its own internal state and won't notify you of changes. Use this when you only care about the starting value.

How to choose: if you need to read or write the value elsewhere, or run logic on change (requests, linking controls), go controlled. If the control just manages itself, uncontrolled is simpler. Pick exactly one mode per state — passing both `value` and `defaultValue` is undefined behavior.

## Callback contracts

-   `on…Change` means “the user or component requests a state change”, not “the state has changed”. In controlled mode you decide whether to accept it: writing the new value back accepts; not writing it back rejects.
-   Intent-named callbacks like `onSelect`, `onConfirm`, and `onCopy` each cover exactly their own intent; timing and arguments are documented on the component's page. None of them work as generic mount/update hooks.
-   **Cancelled-Action Contract:** some click callbacks let you cancel the follow-up action — the component calls your callback first, and calling `event.preventDefault()` cancels it. Currently `CopyButton` and `TextWithCopyButton` honor this (cancelling skips both the copy and its confirmation feedback), implemented through the shared `callWithCancelGuard` helper and locked by contract tests. This contract only applies to components whose click triggers a concrete follow-up action — not to open/close state toggles, which use the cancellation mechanism documented on their own pages.
-   The authoritative callback signatures live in the API reference table on each component's page: official APIs are listed verbatim; framework extensions (e.g. `Checkbox.defaultChecked`) are marked with an “Extension” badge to tell them apart from the official surface.

## Component-specific APIs

A few components ship their own hooks or rely on native events. These are not part of any generic lifecycle, so they are documented on the component's own page — for example [Radio useRadio](#/components/radio), [Toast useToasts](#/components/toast), and the native media events on media components. Look them up on the relevant component page when you use that component.
