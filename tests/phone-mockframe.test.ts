import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("Device react-mockframe contract", () => {
  test("Device uses MockFrame and imports every device CSS bundle (no full mockframe.css)", async () => {
    const src = await read("src/components/ui/device.tsx");
    expect(src).toMatch(/import \{[^}]*\bMockFrame\b[^}]*\} from "react-mockframe"/);
    for (const bundle of ["iphones", "android", "tablets", "laptops"]) {
      expect(src).toMatch(new RegExp(`import "react-mockframe/styles/mockframe-${bundle}\\.css"`));
    }
    // 不引全量 mockframe.css（分包按需）
    expect(src).not.toMatch(/mockframe(?:-iphones|-android|-tablets|-laptops)?\.min\.css/);
  });

  test("registry: iphone-17 content 393×852 bezel 12; devices are symmetric-bezel only", async () => {
    const src = await read("src/lib/device-models.ts");
    expect(src).toMatch(/contentWidth: 393/);
    expect(src).toMatch(/contentHeight: 852/);
    expect(src).toMatch(/bezel: 12/);
    // 首批注册表包含 iPhone 17 / Pixel 10 / Galaxy S25 / iPad Pro
    for (const id of ["iphone-17", "pixel-10", "galaxy-s25", "ipad-pro"]) {
      expect(src).toMatch(new RegExp(`"${id}":`));
    }
    // 未实测的不对称 bezel 设备（iPad Mini / MacBook）不进注册表
    for (const id of ["ipad-mini", "macbook-pro"]) {
      expect(src).not.toMatch(new RegExp(`"${id}":`));
    }
  });

  test("default color is black for iPhone (dark body); zoom/autoFit/animated logic preserved", async () => {
    const src = await read("src/components/ui/device.tsx");
    expect(src).toMatch(/color \?\? def\.colors\[0\]/);
    expect(src).toMatch(/zoom !== undefined\s*\?\s*zoom\s*:/);
    expect(src).toMatch(/Math\.min\(1, containerWidth \/ frameWidth\)/);
    expect(src).toMatch(/animated\s*\?\s*"phone-frame-animated"/);
  });

  test("chrome mask gates iOS-only props; unsupported devices warn in dev", async () => {
    const src = await read("src/components/ui/device.tsx");
    expect(src).toMatch(/def\.chrome\.has\(/);
    expect(src).toMatch(/console\.warn/);
    expect(src).toMatch(/不支持/);
  });

  test("DeviceScreen keeps the device-agnostic screen (h-full w-full overflow-hidden)", async () => {
    const src = await read("src/components/ui/device.tsx");
    expect(src).toMatch(/"h-full w-full overflow-hidden"/);
  });
});
