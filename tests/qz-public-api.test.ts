import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const contracts: Record<string, string[]> = {
  "radio.tsx": ["RadioProps", "RadioGroupProps", "RadioGroupItemProps"],
  "relative-time-card.tsx": ["RelativeTimeCardProps"],
  "scroller.tsx": ["ScrollerProps"],
  "search-input.tsx": ["SearchInputProps"],
  "select.tsx": ["SelectProps"],
  "separator.tsx": ["SeparatorProps"],
  "sheet.tsx": [
    "SheetSide",
    "SheetProps",
    "SheetTriggerProps",
    "SheetPortalProps",
    "SheetOverlayProps",
    "SheetContentProps",
    "SheetHeaderProps",
    "SheetTitleProps",
    "SheetDescriptionProps",
    "SheetFooterProps",
    "SheetCloseProps",
  ],
  "show-more.tsx": ["ShowMoreProps"],
  "skeleton.tsx": ["SkeletonProps"],
  "slider.tsx": ["SliderProps"],
  "snippet.tsx": ["SnippetType", "SnippetProps"],
  "spinner.tsx": ["SpinnerProps"],
  "split-button.tsx": [
    "SplitButtonMenuAlignment",
    "SplitButtonProps",
    "SplitButtonMenuItemProps",
  ],
  "status-dot.tsx": ["StatusDotState", "StatusDotProps"],
  "step-point.tsx": ["StepStatus", "StepPointProps"],
  "switch.tsx": ["SwitchSize", "SwitchProps", "SwitchControlProps"],
  "table.tsx": [
    "TableRootProps",
    "TableProps",
    "TableColgroupProps",
    "TableColProps",
    "TableHeaderProps",
    "TableBodyProps",
    "TableFooterProps",
    "TableRowProps",
    "TableHeadProps",
    "TableCellProps",
    "TableCaptionProps",
  ],
  "text-with-copy-button.tsx": ["TextWithCopyButtonProps"],
  "theme-switcher.tsx": ["ThemeSwitcherProps"],
  "toast.tsx": ["ToastKind", "ToastOptions", "UseToastsReturn", "ToastsProps"],
  "toggle.tsx": ["ToggleProps"],
  "tooltip.tsx": ["TooltipPosition", "TooltipBoxAlign", "TooltipType", "TooltipProps"],
  "video.tsx": ["VideoProps"],
};

describe("Q-Z component public type contracts", () => {
  for (const [file, symbols] of Object.entries(contracts)) {
    test(`${file} exports its consumer-facing types`, async () => {
      const source = await readFile(path.join(root, "src/components/ui", file), "utf8");

      for (const symbol of symbols) {
        expect(source).toMatch(new RegExp(`export (?:interface|type) ${symbol}\\b`));
      }
    });
  }
});
