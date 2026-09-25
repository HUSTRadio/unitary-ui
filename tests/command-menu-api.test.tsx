// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

import {
  CommandMenu,
  CommandMenuDivider,
  CommandMenuGroup,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
} from "@/components/ui/command-menu";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

class ResizeObserverStub implements ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverStub;
HTMLElement.prototype.scrollIntoView = vi.fn();

const cleanups: Array<() => void> = [];

afterEach(() => {
  while (cleanups.length > 0) cleanups.pop()?.();
  document.body.innerHTML = "";
});

function renderMenu(options?: { open?: boolean; callback?: () => void }) {
  const setOpen = vi.fn();
  const callback = options?.callback ?? vi.fn();
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);

  act(() => {
    root.render(
      <CommandMenu open={options?.open ?? true} setOpen={setOpen}>
        <CommandMenuInput placeholder="What do you need?" />
        <CommandMenuList>
          <CommandMenuGroup heading="Suggestions">
            <CommandMenuItem callback={callback}>Figma Import</CommandMenuItem>
            <CommandMenuItem callback={callback} suffix={<span>⌘I</span>}>
              Import Extension
            </CommandMenuItem>
          </CommandMenuGroup>
          <CommandMenuDivider />
          <CommandMenuItem callback={callback}>Manage Extensions</CommandMenuItem>
        </CommandMenuList>
      </CommandMenu>,
    );
  });

  cleanups.push(() => {
    act(() => root.unmount());
    container.remove();
  });

  return { callback, container, setOpen };
}

function keydown(element: Element, key: string) {
  act(() => element.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true })));
}

function setNativeValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
  act(() => {
    setter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

/**
 * Task 10 / B1 Command Menu contract.
 * Source: live https://vercel.com/geist/command-menu DOM/computed styles and keyboard behavior
 * persisted in C:/Users/Leon/geist-audit/phase-e/command-menu/evidence-command-menu.md.
 */
describe("CommandMenu official runtime contract", () => {
  test("uses the official direct open/setOpen API and cmdk combobox semantics", () => {
    renderMenu();

    const dialog = document.querySelector<HTMLElement>("[role='dialog']")!;
    const root = dialog.querySelector<HTMLElement>("[data-testid='cmdk/root']")!;
    const input = root.querySelector<HTMLInputElement>("[cmdk-input]")!;
    const list = root.querySelector<HTMLElement>("[cmdk-list]")!;
    const items = [...root.querySelectorAll<HTMLElement>("[cmdk-item]")];

    expect(dialog.parentElement).toBe(document.body);
    expect(dialog.getAttribute("aria-labelledby")).toBeTruthy();
    expect(dialog.getAttribute("aria-describedby")).toBeTruthy();
    expect(root.hasAttribute("cmdk-root")).toBe(true);
    expect(input.getAttribute("role")).toBe("combobox");
    expect(input.getAttribute("aria-autocomplete")).toBe("list");
    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(list.getAttribute("role")).toBe("listbox");
    expect(items[0].getAttribute("role")).toBe("option");
    expect(items[0].getAttribute("aria-selected")).toBe("true");
    expect(items[0].getAttribute("data-selected")).toBe("true");
    expect(document.activeElement).toBe(input);
  });

  test("arrow keys move aria selection while focus stays in the input", () => {
    renderMenu();
    const input = document.querySelector<HTMLInputElement>("[cmdk-input]")!;
    const items = () => [...document.querySelectorAll<HTMLElement>("[cmdk-item]")];

    keydown(input, "ArrowDown");
    expect(items()[1].getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(input);

    keydown(input, "End");
    expect(items().at(-1)?.getAttribute("aria-selected")).toBe("true");
    keydown(input, "Home");
    expect(items()[0].getAttribute("aria-selected")).toBe("true");
  });

  test("filters items and renders the official empty state", () => {
    renderMenu();
    const input = document.querySelector<HTMLInputElement>("[cmdk-input]")!;

    setNativeValue(input, "Import Extension");
    expect([...document.querySelectorAll("[cmdk-item]")].map((item) => item.textContent)).toEqual([
      "Import Extension⌘I",
    ]);

    setNativeValue(input, "missing command");
    const empty = document.querySelector<HTMLElement>("[cmdk-empty]")!;
    expect(empty.getAttribute("role")).toBe("presentation");
    const status = empty.querySelector<HTMLElement>("[role='status']")!;
    expect(status.getAttribute("aria-live")).toBe("polite");
    expect(status.getAttribute("aria-atomic")).toBe("true");
    expect(status.textContent).toBe('No results found for "missing command".');
    expect(document.activeElement).toBe(input);
    expect(empty.className).toContain("text-center");
    expect(empty.className).not.toContain("text-left");
    expect(empty.className).toContain("text-copy-16");
    expect(empty.className).toContain("text-foreground");
  });

  test("Enter calls the selected item callback and closes the menu", () => {
    const callback = vi.fn();
    const { setOpen } = renderMenu({ callback });
    const input = document.querySelector<HTMLInputElement>("[cmdk-input]")!;

    keydown(input, "Enter");
    expect(callback).toHaveBeenCalledTimes(1);
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  test("renders Esc close affordance and closes the menu", () => {
    const { setOpen } = renderMenu();
    const input = document.querySelector<HTMLInputElement>("[cmdk-input]")!;
    const esc = document.querySelector<HTMLButtonElement>(
      "button[aria-label='Close command menu']",
    )!;

    expect(esc.textContent).toBe("Esc");
    expect(esc.className).toContain("h-5");
    expect(esc.className).toContain("ml-auto");
    expect(esc.className).toContain("px-1");
    expect(esc.querySelector("kbd")).toBeNull();
    keydown(input, "Escape");
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  test("restores focus to the external trigger after Escape closes the controlled menu", async () => {
    function Harness() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>Open commands</button>
          <CommandMenu open={open} setOpen={setOpen}>
            <CommandMenuInput placeholder="What do you need?" />
            <CommandMenuList>
              <CommandMenuItem callback={() => {}}>Figma Import</CommandMenuItem>
            </CommandMenuList>
          </CommandMenu>
        </>
      );
    }

    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    act(() => root.render(<Harness />));
    const trigger = container.querySelector<HTMLButtonElement>("button")!;
    trigger.focus();
    expect(document.activeElement).toBe(trigger);
    act(() => trigger.click());
    const input = document.querySelector<HTMLInputElement>("[cmdk-input]")!;
    expect(document.activeElement).toBe(input);
    keydown(input, "Escape");
    await act(async () => new Promise((resolve) => requestAnimationFrame(() => resolve(undefined))));
    expect(document.activeElement).toBe(trigger);

    act(() => root.unmount());
    container.remove();
  });

  test("group, divider and suffix use the official structures", () => {
    renderMenu();
    const heading = document.querySelector<HTMLElement>("[cmdk-group-heading]")!;
    const group = heading.closest<HTMLElement>("[cmdk-group]")!;
    const divider = document.querySelector<HTMLElement>("[cmdk-separator]")!;
    const suffixItem = [...document.querySelectorAll<HTMLElement>("[cmdk-item]")][1];

    expect(heading.getAttribute("aria-hidden")).toBe("true");
    expect(group.className).toContain("[&_[cmdk-group-heading]]:h-9");
    expect(group.className).toContain("[&_[cmdk-group-heading]]:text-[13px]");
    expect(divider.getAttribute("role")).toBe("separator");
    expect(divider.className).toContain("-ml-2");
    expect(divider.className).toContain("w-[calc(100%+16px)]");
    expect(suffixItem.lastElementChild?.className).toContain("ml-auto");
    expect(suffixItem.lastElementChild?.className).toContain("gap-1");
  });

  test("surface, responsive and motion classes match the official evidence", () => {
    renderMenu();
    const overlay = document.querySelector<HTMLElement>("[data-slot='command-menu-overlay']")!;
    const dialog = document.querySelector<HTMLElement>("[role='dialog']")!;
    const input = document.querySelector<HTMLInputElement>("[cmdk-input]")!;
    const list = document.querySelector<HTMLElement>("[cmdk-list]")!;
    const item = document.querySelector<HTMLElement>("[cmdk-item]")!;

    expect(overlay.className).toContain("bg-background-100");
    expect(overlay.className).toContain("command-menu-overlay");
    // HIG-AUD-009：遮罩与内容同走 modal 带 token（原 z-100 字面量收敛）
    expect(overlay.className).toContain("z-[var(--uni-z-modal)]");
    expect(dialog.className).toContain("z-[var(--uni-z-modal)]");
    expect(dialog.className).toContain("top-[15%]");
    expect(dialog.className).toContain("w-[640px]");
    expect(dialog.className).not.toContain("max-w-[calc(100vw-32px)]");
    expect(dialog.className).toContain("rounded-overlay");
    expect(dialog.className).toContain("command-menu-scale");
    expect(dialog.className).toContain("max-grid-sm:bottom-0");
    expect(dialog.className).toContain("max-grid-sm:left-0");
    expect(dialog.className).toContain("max-grid-sm:top-auto");
    expect(dialog.className).toContain("max-grid-sm:h-[80vh]");
    expect(dialog.className).toContain("max-grid-sm:max-h-[80vh]");
    expect(dialog.className).toContain("max-grid-sm:supports-[height:100dvh]:h-[80dvh]");
    expect(dialog.className).toContain("max-grid-sm:supports-[height:100dvh]:max-h-[80dvh]");
    expect(dialog.className).toContain("max-grid-sm:w-full");
    expect(dialog.className).toContain("max-grid-sm:max-w-full");
    expect(dialog.className).toContain("max-grid-sm:translate-x-0");
    expect(dialog.className).toContain("max-grid-sm:rounded-b-none");
    expect(dialog.className).toContain("max-grid-sm:rounded-t-overlay");
    expect(dialog.className).toContain("max-grid-sm:overflow-auto");
    expect(dialog.className).toContain("command-menu-mobile");
    expect(input.className).toContain("text-base");
    expect(input.className).toContain("sm:text-lg");
    expect(list.className).toContain("max-h-none");
    expect(list.className).toContain("sm:max-h-[436px]");
    expect(item.className).toContain("min-h-10");
    expect(item.className).toContain("sm:min-h-9");
    expect(item.className).toContain("data-[selected=true]:bg-gray-alpha-100");
  });
});
