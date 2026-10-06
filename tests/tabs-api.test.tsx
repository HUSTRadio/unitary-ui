// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";

import { Tabs, type TabsTab, type TabsVariant } from "../src/components/ui/tabs";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const defaultTabs: TabsTab[] = [
  { title: "Apple", value: "apple" },
  { title: "Orange", value: "orange" },
  { title: "Mango", value: "mango" },
];

function Harness({
  initial = "apple",
  tabs = defaultTabs,
  variant,
  compact,
  disabled,
  ariaLabel,
}: {
  initial?: string;
  tabs?: TabsTab[];
  variant?: TabsVariant;
  compact?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const [selected, setSelected] = React.useState(initial);
  return (
    <Tabs
      selected={selected}
      setSelected={setSelected}
      tabs={tabs}
      variant={variant}
      compact={compact}
      disabled={disabled}
      ariaLabel={ariaLabel}
    />
  );
}

let container: HTMLDivElement;
let root: Root;

function mount(props: React.ComponentProps<typeof Harness>) {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => {
    root.render(<Harness {...props} />);
  });
  return {
    tablist: container.querySelector('[role="tablist"]') as HTMLElement,
    tabs: Array.from(container.querySelectorAll('[role="tab"]')) as HTMLButtonElement[],
    selectedTab: () =>
      container.querySelector('[role="tab"][aria-selected="true"]') as HTMLButtonElement | null,
  };
}

function unmount() {
  act(() => {
    root.unmount();
  });
  container.remove();
}

async function keyDown(target: HTMLElement, key: string) {
  await act(async () => {
    target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
  });
}

afterEach(() => {
  if (container) {
    unmount();
  }
});

describe("Tabs — official DOM/ARIA contract", () => {
  it("renders tablist/tab roles, aria-selected, data-state, and roving tabindex", () => {
    const markup = renderToStaticMarkup(
      <Tabs selected="apple" setSelected={() => {}} tabs={defaultTabs} />,
    );

    expect(markup).toContain('data-slot="tabs"');
    expect(markup).toContain('role="tablist"');
    expect(markup.match(/role="tab"/g)).toHaveLength(3);
    // aria-selected only on the selected tab
    expect(markup.match(/aria-selected="true"/g)).toHaveLength(1);
    expect(markup).toContain('aria-selected="true"');
    // roving tabindex: selected tab focusable, others removed from tab order
    expect(markup.match(/tabindex="0"/g)).toHaveLength(1);
    expect(markup).toContain('tabindex="-1"');
    expect(markup.match(/tabindex="-1"/g)).toHaveLength(2);
    // local data-state markers stay additive
    expect(markup).toContain('data-state="active"');
    expect(markup).toContain('data-state="inactive"');
  });

  it("passes aria-label to the tablist", () => {
    const markup = renderToStaticMarkup(
      <Tabs selected="apple" setSelected={() => {}} tabs={defaultTabs} ariaLabel="Sections" />,
    );
    expect(markup).toContain('aria-label="Sections"');
  });

  it("marks disabled tabs with disabled/aria-disabled and wraps them in a focusable tooltip trigger", () => {
    const tabs: TabsTab[] = [
      { title: "Apple", value: "apple" },
      { title: "Orange", value: "orange" },
      { title: "Mango", value: "mango", disabled: true, tooltip: "Mangos are not allowed" },
    ];
    const markup = renderToStaticMarkup(
      <Tabs selected="apple" setSelected={() => {}} tabs={tabs} />,
    );

    expect(markup).toContain('aria-disabled="true"');
    expect(markup).toContain("disabled");
    // selected tab + tooltip wrapper span both stay focusable (roving tabindex + tabIndex=0 wrapper)
    expect(markup.match(/tabindex="0"/g)).toHaveLength(2);
  });

  it("applies the secondary variant pill styling", () => {
    const markup = renderToStaticMarkup(
      <Tabs selected="github" setSelected={() => {}} tabs={defaultTabs} variant="secondary" />,
    );
    expect(markup).toContain("rounded-md");
    expect(markup).toContain("data-[state=active]:bg-foreground");
  });
});

describe("Tabs — compact variant (owner extension: spacing/height halved)", () => {
  it("halves primary tab gap and vertical padding (24→12 gap, 14→8 pad, 50→38 height)", () => {
    const markup = renderToStaticMarkup(
      <Tabs selected="apple" setSelected={() => {}} tabs={defaultTabs} compact />,
    );
    // tablist 间距收半档，基准 gap-6 不得残留
    expect(markup).toContain("gap-3");
    expect(markup).not.toContain("gap-6");
    // trigger 垂直 pad 14→8（高 50→38），基准 py-3.5 不得残留
    expect(markup).toContain("py-2");
    expect(markup).not.toContain("py-3.5");
    // 字号与选中态保持
    expect(markup).toContain("text-copy-14");
    expect(markup).toContain('data-slot="tabs-indicator"');
    expect(markup).toContain("h-0.5 bg-foreground");
  });

  it("halves secondary tab gap and pill height (8→4 gap, 24→20 pill)", () => {
    const markup = renderToStaticMarkup(
      <Tabs
        selected="apple"
        setSelected={() => {}}
        tabs={defaultTabs}
        variant="secondary"
        compact
      />,
    );
    // tablist 间距收半档，基准 gap-2 不得残留
    expect(markup).toContain("gap-1");
    expect(markup).not.toContain("gap-2");
    // pill 高 24→20，基准 h-6 不得残留
    expect(markup).toContain("h-5");
    expect(markup).not.toContain("h-6");
    // pill 字号保持
    expect(markup).toContain("text-copy-13");
  });

  it("keeps official baseline metrics when compact is off (regression)", () => {
    const markup = renderToStaticMarkup(
      <Tabs selected="apple" setSelected={() => {}} tabs={defaultTabs} />,
    );
    expect(markup).toContain("gap-6");
    expect(markup).toContain("py-3.5");
    const secondary = renderToStaticMarkup(
      <Tabs selected="apple" setSelected={() => {}} tabs={defaultTabs} variant="secondary" />,
    );
    expect(secondary).toContain("gap-2");
    expect(secondary).toContain("h-6");
  });
});

describe("Tabs — keyboard behavior (official auto activation)", () => {
  it("ArrowRight auto-activates the next tab and moves focus with it", async () => {
    const { tablist, tabs, selectedTab } = mount({});

    expect(selectedTab()?.textContent).toBe("Apple");

    await keyDown(tablist, "ArrowRight");

    expect(selectedTab()?.textContent).toBe("Orange");
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(tabs[1]);
  });

  it("ArrowLeft auto-activates the previous tab", async () => {
    const { tablist, tabs, selectedTab } = mount({ initial: "mango" });

    await keyDown(tablist, "ArrowLeft");

    expect(selectedTab()?.textContent).toBe("Orange");
    expect(document.activeElement).toBe(tabs[1]);
  });

  it("wraps around at the last tab on ArrowRight and at the first on ArrowLeft", async () => {
    const { tablist, selectedTab } = mount({ initial: "mango" });

    await keyDown(tablist, "ArrowRight");
    expect(selectedTab()?.textContent).toBe("Apple");

    await keyDown(tablist, "ArrowLeft");
    expect(selectedTab()?.textContent).toBe("Mango");
  });

  it("Home and End auto-activate the first and last enabled tab", async () => {
    const { tablist, selectedTab } = mount({ initial: "orange" });

    await keyDown(tablist, "Home");
    expect(selectedTab()?.textContent).toBe("Apple");

    await keyDown(tablist, "End");
    expect(selectedTab()?.textContent).toBe("Mango");
  });

  it("skips disabled tabs while moving and activating", async () => {
    const tabs: TabsTab[] = [
      { title: "Apple", value: "apple" },
      { title: "Orange", value: "orange", disabled: true },
      { title: "Mango", value: "mango" },
    ];
    const { tablist, selectedTab } = mount({ tabs });

    await keyDown(tablist, "ArrowRight");
    expect(selectedTab()?.textContent).toBe("Mango");

    await keyDown(tablist, "ArrowLeft");
    expect(selectedTab()?.textContent).toBe("Apple");
  });

  it("Enter and Space still activate the focused tab", async () => {
    const { tabs, selectedTab } = mount({});

    // Focus the middle tab without selecting it (native focus -> roving focus tracking only)
    await act(async () => {
      tabs[1].focus();
    });
    expect(selectedTab()?.textContent).toBe("Apple");

    await keyDown(tabs[1], "Enter");
    expect(selectedTab()?.textContent).toBe("Orange");

    await act(async () => {
      tabs[2].focus();
    });
    await keyDown(tabs[2], " ");
    expect(selectedTab()?.textContent).toBe("Mango");
  });

  it("click still activates a tab", async () => {
    const { tabs, selectedTab } = mount({});

    await act(async () => {
      tabs[2].click();
    });

    expect(selectedTab()?.textContent).toBe("Mango");
  });

  it("does not navigate or activate when the whole group is disabled", async () => {
    const { tablist, selectedTab } = mount({ disabled: true });

    await keyDown(tablist, "ArrowRight");
    await keyDown(tablist, "Home");
    await keyDown(tablist, "End");
    await keyDown(tablist, "Enter");

    expect(selectedTab()?.textContent).toBe("Apple");
  });
});
