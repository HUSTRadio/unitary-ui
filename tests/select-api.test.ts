import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("Select composite API contract (v2 Radix popup)", () => {
  test("error text is 13px/20px with the shared FieldError layer and inline-error token", async () => {
    const src = await read("src/components/ui/select.tsx");
    // Error message must NOT use the --danger token color (#e5484d via text-danger)
    expect(src).not.toMatch(/text-danger/);
    // Error rendering delegates to the shared base layer
    expect(src).toMatch(/import \{ FieldError, FIELD_ERROR_RING \} from "\.\/field-error"/);
    const shared = await read("src/components/ui/field-error.tsx");
    expect(shared).toMatch(/text-error-foreground/);
    // 13px font with 20px line-height (leading-5 overrides text-copy-13's 18px)
    expect(shared).toMatch(/text-copy-13 leading-5/);
  });

  test("large size error text is 16px/24px", async () => {
    const shared = await read("src/components/ui/field-error.tsx");
    expect(shared).toMatch(/large && "text-base leading-6"/);
    const src = await read("src/components/ui/select.tsx");
    expect(src).toMatch(/large=\{size === "large"\}/);
  });

  test("composite API: no native <option>/<optgroup>/onChange, exports Group/Separator/Item", async () => {
    const src = await read("src/components/ui/select.tsx");
    // Native select children are rejected — Radix composites only
    expect(src).not.toMatch(/<option/);
    expect(src).not.toMatch(/\bonChange\b/);
    expect(src).toMatch(/SelectPrimitive\.Group/);
    expect(src).toMatch(/SelectPrimitive\.Separator/);
    expect(src).toMatch(/SelectPrimitive\.Item/);
  });

  test("popup uses Geist menu material, 36px items, 2px viewport gaps, hidden form select", async () => {
    const src = await read("src/components/ui/select.tsx");
    expect(src).toMatch(/material-menu/);
    expect(src).toMatch(/h-9 cursor-pointer select-none items-center rounded-overlay-item/);
    expect(src).toMatch(/flex flex-col gap-0\.5/);
    // Hidden native select keeps FormData / required / name semantics
    expect(src).toMatch(/unstable_BubbleInput/);
    // Portal + popper positioning
    expect(src).toMatch(/SelectPrimitive\.Portal/);
    expect(src).toMatch(/position="popper"/);
  });

  test("checked item uses a right-side check and semibold text without persistent background", async () => {
    const src = await read("src/components/ui/select.tsx");
    expect(src).toMatch(/import \{ Check, ChevronDown \} from "lucide-react"/);
    expect(src).toMatch(/SelectPrimitive\.ItemIndicator/);
    expect(src).toMatch(/absolute right-2/);
    expect(src).toMatch(/data-\[state=checked\]:font-semibold/);
    expect(src).not.toMatch(/data-\[state=checked\]:bg-gray-alpha-100/);
  });

  test("label renders mb-2 on inner text div (8px gap)", async () => {
    const src = await read("src/components/ui/select.tsx");
    expect(src).toContain(
      '<div\n              id={labelId}\n              data-slot="select-label"\n              className="mb-2 block max-w-full cursor-text text-[13px] text-gray-900 capitalize"\n            >',
    );
  });

  test("SelectProps explicitly declares className (forwarded to trigger)", async () => {
    const src = await read("src/components/ui/select.tsx");
    expect(src).toMatch(/className\?: string/);
  });
});
