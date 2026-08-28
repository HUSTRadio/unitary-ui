# Phone

> Route: `/components/phone`

Frames mobile screenshots inside a realistic phone shell.

[Back to Components](#/components)

# Phone

Phone

Frames mobile screenshots inside a realistic phone shell.

## When to use

- Around mobile screenshots, recordings, and demo images on landing pages, docs, and introduction pages, using Phone as marketing chrome.
- When you need to show readers what a mobile app looks and feels like — the Phone frame provides a realistic mockup effect.

## When not to use

- Don't render live mobile product UI inside the frame; the chrome implies a captured screenshot, not an interactive surface, and misleads users into thinking they can tap.
- If you only need to demonstrate web responsiveness, use the Browser component instead — Browser is better suited for webpage screenshots.

## Examples

### Composition

Showcases the basic composition of the Phone component: a realistic phone shell framing an inner image, including status bar, rounded corners, and bezel decorations.

### Colors

Phone offers multiple color schemes for the outer frame, allowing you to pick a tone that matches your page theme for cohesive design consistency.

### Dynamic Island

Enables the Dynamic Island variant to showcase the latest iPhone's notch feature, ideal for marketing materials targeting modern iOS devices.

## Accessibility

- The Phone chrome is marked as decorative (aria-hidden); accessible naming belongs on the inner screenshot — screen readers will read the alt text of the embedded screenshot.
- Set meaningful alt text on the inner mobile screenshot so screen reader users understand the screenshot's content and purpose.

## Controlled behavior

Not applicable: Phone is a purely presentational chrome component with no internal interactive state or user interaction capability. It provides the visual shell of a phone; all content is determined entirely by the child elements and props passed to it.

## Responsive behavior

- The Phone frame maintains its aspect ratio across viewports, ensuring the phone shape looks consistent regardless of screen size.
- The inner screenshot area scales proportionally with the container, though on wide screens a max-width constraint is typically recommended to avoid excessive stretching.

## Theme behavior

- The Phone frame's color, shadow, and border-radius are drawn from theme tokens, automatically adapting to light and dark mode contrast requirements.
- The Safari Chrome variant's browser UI colors also follow the theme, maintaining a consistent visual style.

## Live Demo

08:00

![Vercel dashboard on iPhone](https://picsum.photos/seed/geist-phone/393/852)

```tsx
import { Phone, PhoneScreen } from "@/components/ui/phone";

<div className="w-full max-w-xs">
  <Phone>
    <PhoneScreen>
      {/* 截图/录屏承担可访问名称 */}
      <img
        src="/dashboard.png"
        alt="Vercel dashboard on iPhone"
        className="h-full w-full object-cover"
      />
    </PhoneScreen>
  </Phone>
</div>;
```

black

white

mist-blue

cosmic-orange

```tsx
import { Phone, PhoneScreen } from "@/components/ui/phone";

<div className="flex flex-wrap gap-6">
  {(["black", "white", "mist-blue", "cosmic-orange"] as const).map((color) => (
    <Phone key={color} color={color} statusBar={false} className="w-[140px]">
      <PhoneScreen>
        <div className="h-full w-full bg-gray-alpha-100" />
      </PhoneScreen>
    </Phone>
  ))}
</div>;
```

08:00

Mobile screenshot

```tsx
import { Phone, PhoneScreen } from "@/components/ui/phone";

<Phone dynamicIsland className="w-[260px]">
  <PhoneScreen>
    <div className="flex h-full items-center justify-center bg-gray-alpha-100" />
  </PhoneScreen>
</Phone>;
```

9:41

Custom status

08:00

Dark appearance

```tsx
import { Phone, PhoneScreen } from "@/components/ui/phone";

<Phone statusBar={{ time: "9:41", battery: 72 }}>
  <PhoneScreen>{/* screenshot */}</PhoneScreen>
</Phone>
<Phone statusBar={{ appearance: "dark" }}>
  <PhoneScreen>{/* screenshot */}</PhoneScreen>
</Phone>
```

08:00

vercel.com/geist↻

![Website shown in the Safari mockup](https://picsum.photos/seed/geist-safari/393/852)

```tsx
import { Phone, PhoneScreen } from "@/components/ui/phone";

const [layout, setLayout] = useState<"compact" | "bottom" | "top">("compact");

<Phone safari={{ layout, url: "vercel.com/geist" }}>
  <PhoneScreen>
    <img
      src="/page.png"
      alt="Website shown in the Safari mockup"
      className="h-full w-full object-cover"
    />
  </PhoneScreen>
</Phone>;
```

08:00

Landscape screenshot

```tsx
import { Phone, PhoneScreen } from "@/components/ui/phone";

<Phone landscape>
  <PhoneScreen>{/* landscape screenshot */}</PhoneScreen>
</Phone>;
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Phone, PhoneScreen } from "@/components/ui/phone";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Screen content.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

Phone is marketing chrome for framing mobile screenshots and recordings — not a mobile-only UI.

## Best Practices

- Use Phone as marketing chrome around mobile screenshots, recordings, and demo images on landing pages and docs.
- Don't render live mobile product UI inside the frame; the chrome implies a captured screen, not an interactive surface.
- Treat the chrome as decorative (aria-hidden); accessible naming belongs on the inner screenshot.
