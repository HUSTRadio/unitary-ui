Geist Pixel now available

# Geist.

## Description

At Vercel, we've developed Geist, a typeface specifically designed for developers and designers. We began by creating a monospace version that prioritized readability and seamlessly integrated into coding environments.

After perfecting the monospace variant, we expanded Geist into a Sans and Pixel version, adding versatility to its capabilities.

Geist embodies our design principles of simplicity, minimalism, and speed, drawing inspiration from the renowned Swiss design movement.

With precision, clarity, and functionality at its core, Geist enhances the visual experience of developers and designers, empowering them to effectively communicate their ideas.

## Interactive glyph inspector

## Interactive font playground

## How to install

### Install via NPM (Recommended)

Best for Next.js projects. Includes full glyph set and font-feature-settings support.

```
▲ ~npm i geist
```

Get the latest Node.js and npm.

### Use with Next.js

```
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { GeistPixelSquare, GeistPixelGrid, GeistPixelCircle, GeistPixelTriangle, GeistPixelLine } from 'geist/font/pixel';
```

Include this code in app/layout.js. View the README for full instructions.

### Features by installation method

| Feature                  | NPM      | Google Fonts | .zip Download |
| ------------------------ | -------- | ------------ | ------------- |
| font-feature-settings    | Yes      | No           | Yes           |
| Easy Next.js integration | Yes      | Yes          | Manual        |
| Full glyph support       | Full set | Partial      | Full set      |
| Automatic updates        | Via npm  | Via Google   | Manual        |
| Customization            | Full     | Limited      | Full          |

### Use from Google Fonts

Quick setup for web projects. Does not include full glyph set or font-feature-settings support for Geist Sans, Geist Mono, or Geist Pixel.

### Use with Next.js

```
import { Geist, Geist_Mono, Geist_Pixel } from 'next/font/google'
```

Include this next/font/google code in app/layout.js. View the Next.js docs for full instructions.

### Use the five pixel variants

On Google Fonts, the five pixel shapes ship as one variable family selected through the ELSH axis. Keep the axis when importing the font, then map each stop to a utility.

```tsx
// app/fonts.ts
import { Geist_Pixel } from "next/font/google";

export const geistPixel = Geist_Pixel({
  subsets: ["latin"],
  axes: ["ELSH"], // keep the shape axis variable
  variable: "--font-geist-pixel",
  display: "swap",
});
```

```css
/* globals.css with Tailwind CSS */
@utility font-pixel-square {
  font-family: var(--font-geist-pixel);
  font-variation-settings: "ELSH" 1;
}
@utility font-pixel-circle {
  font-family: var(--font-geist-pixel);
  font-variation-settings: "ELSH" 20;
}
@utility font-pixel-grid {
  font-family: var(--font-geist-pixel);
  font-variation-settings: "ELSH" 40;
}
@utility font-pixel-triangle {
  font-family: var(--font-geist-pixel);
  font-variation-settings: "ELSH" 60;
}
@utility font-pixel-line {
  font-family: var(--font-geist-pixel);
  font-variation-settings: "ELSH" 80;
}
```

Apply font-pixel-square, font-pixel-grid, and the other utilities to switch between shapes.

### Get the .zip

Manually download otf, woff2 and variable font files. Includes full glyph set and font-feature-settings support.

Licensed under OFL. Use it on your sites and projects. Read the license.
