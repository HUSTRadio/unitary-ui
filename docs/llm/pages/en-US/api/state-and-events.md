# State & Events

> Route: `/api/state-and-events`

# State & Events

Components expose state control through props and callbacks, without general lifecycle APIs such as `componentDidMount` or `componentWillUnmount`. This page explains how to manage state, receive changes, and cancel actions.

## Controlled & uncontrolled

Components that support both controlled and uncontrolled modes, such as `Input`, `Select`, `Combobox`, `Switch`, can store state in the parent or in the component itself:

- **Controlled:** the parent stores state and passes the current value through `value`, `open`, or `checked`, plus the matching `on…Change` callback. Update the parent’s state with the new value to update the UI.
- **Uncontrolled:** use `defaultValue`, `defaultOpen`, or `defaultChecked` to set the initial value, then let the component update its own state. Check its API for available change callbacks.

Use controlled mode to synchronize other controls or update state externally. Use uncontrolled mode when you only need an initial value. Do not pass both `value` and `defaultValue` for the same state. Check each component’s API for supported props.

## Callbacks and cancellation

- `on…Change` reports a state change request. In controlled mode, the parent decides whether to update state.
- Callbacks such as `onSelect`, `onConfirm`, and `onCopy` handle selection, confirmation, and copying. Their timing and arguments are listed in each component’s API.
- **Cancel an action:** some components call your click callback before acting. Calling `event.preventDefault()` cancels it. Currently `CopyButton` and `TextWithCopyButton` support this: cancellation skips copying and feedback. Check other components’ APIs for their cancellation behavior.
- Each component’s API table lists its props and callback signatures. Props added by this library, such as `Checkbox.defaultChecked`, have an “Extension” badge.

## Component hooks and events

See the relevant component page for its hooks and events, such as [Radio useRadio](#/components/radio), [Toast useToasts](#/components/toast), and Video’s native playback events.

## Draft persistence

useDraft(options) keeps a form draft in one namespaced, versioned storage key (`unitary-draft/v<version>/<key>`). It writes only while the current value differs from the baseline and deletes the record once the value returns to it, so an untouched form leaves nothing behind.

- Without a `key` the hook never touches storage; `storage` set to `null` or unavailable (server rendering, private mode) degrades to plain state.
- Server rendering returns `initial`; `isHydrated` only becomes true after client restore, and the default value is never written back beforehand.
- `reset()` returns to the baseline and removes stale versions of its own namespace without touching other namespaces or unrelated keys.
- Corrupt JSON, stale versions, quota failures and disabled storage only affect persistence and never throw at the caller; `serialize` / `deserialize` can replace the wire format.

## Task data adapters

usePolling and useEventStream only decide how data arrives: the first polls on an interval, the second subscribes to an event stream. Neither caches, shares state or offers a general async store — each instance owns one subscription.

- Failures share `nextBackoffDelay(attempt, options)` exponential backoff (1s start, 2x growth, 30s cap), so both adapters take the same options.
- `usePolling` keeps a single request in flight, never stacking a second one, and stops scheduling once `isDone(value)` reports a terminal value.
- Unmount, `stop()`, `close()` and option changes all clear timers and abort or close the current connection, leaving no subscription behind.
- `useEventStream` closes the old connection after `error` and reconnects with backoff; a parse failure only reports `onError` and keeps the connection.
- Both accept `enabled` to suspend conditionally, and `fetcher` must honour the AbortSignal it receives.
