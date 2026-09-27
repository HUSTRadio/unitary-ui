# Link

> Route: `/components/link`

Navigates to internal or external destinations with platform-aware icon treatment.

[Back to Components](#/components)

# Link

link

Navigates to internal or external destinations with platform-aware icon treatment.

## When to use

- Use for inline navigation inside prose, descriptions, or navigation lists.
- Use supported forge destinations such as GitHub, GitLab, or Gitee when a brand icon helps identify where the link leads.

## When not to use

- Use Button for actions that mutate state; use ButtonLink when navigation needs a button treatment.
- Do not use Link as an icon-only control without a visible label; this component is designed for text links.

## Examples

### Internal, forge, and generic external links

Internal links have no icon; forge links put the brand before the label and omit ExternalLink; other HTTP(S) links keep a generic trailing indicator.

## Accessibility

- Use visible copy that identifies the destination without surrounding context; avoid labels such as Click here.
- External icons are aria-hidden, so the visible label remains the accessible name.
- The component preserves native anchor semantics and the shared keyboard focus-visible ring.

## Controlled behavior

Not applicable: Link is a stateless native-anchor wrapper; href and the browser own navigation.

## Responsive behavior

- Inline-flex keeps the icon and label in one link unit on narrow viewports.
- The surrounding text container owns wrapping; Link adds no fixed width or breakpoint behavior.

## Theme behavior

- Text, underline, and icon colors use semantic tokens and adapt to light and dark themes.
- Forge brands render through a simpleicons mask with currentColor rather than embedding vendor colors.

## Live Demo

[Button documentation](#/components/button)[GitHub repository](https://github.com/HUSTRadio/unitary-ui)[GitLab repository](https://gitlab.com/gitlab-org/gitlab)[MDN Web Docs](https://developer.mozilla.org)

```tsx
import { Link } from "@/components/ui/link";

export function LinkDefault37A8EEC1Example() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
      <Link href="#/components/button">Button documentation</Link>
      <Link href="gh:HUSTRadio/unitary-ui">GitHub repository</Link>
      <Link href="https://gitlab.com/gitlab-org/gitlab">GitLab repository</Link>
      <Link href="https://developer.mozilla.org">MDN Web Docs</Link>
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Link } from "@/components/ui/link";
```

Native props: `ComponentProps<"a">`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">href</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Internal path, HTTP(S) URL, or gh:/github: shorthand.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">iconSide</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"left" | "right"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Overrides icon placement; forge brands default left and generic external indicators default right.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Visible link label.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Link for inline navigation. Use Button or ButtonLink for prominent calls to action.
- Relative paths stay in the current browsing context; HTTP(S) destinations open in a new tab with noreferrer.
- Forge links show their platform brand icon before the label and omit the redundant ExternalLink indicator.
- Generic external destinations keep the ExternalLink indicator after the label.
- Use the gh: or github: shorthand only for GitHub owner/repository destinations.
