// @vitest-environment jsdom
import { readFile } from "node:fs/promises";
import path from "node:path";
import { act } from "react";
import { createRoot } from "react-dom/client";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Menu, MenuContainer } from "../src/components/ui/menu";
import {
  SplitButton,
  SplitButtonMain,
  SplitButtonMenu,
  SplitButtonMenuItem,
} from "../src/components/ui/split-button";

// React 19 requires the act environment flag inside jsdom
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const read = (relativePath: string) => readFile(path.join(process.cwd(), relativePath), "utf8");

async function renderIntoDocument(node: React.ReactNode): Promise<void> {
  // fresh DOM per render (portals land in document.body, so clear leftovers)
  document.body.innerHTML = "";
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = createRoot(host);
  await act(async () => {
    root.render(node);
  });
}

describe("SplitButton official props API contract (G11-SPLIT-01)", () => {
  it("exports SplitButton + SplitButtonMenuItem and keeps legacy compound exports", async () => {
    const src = await read("src/components/ui/split-button.tsx");
    expect(src).toMatch(/export\s*\{[^}]*SplitButton\b[^}]*\}/);
    expect(src).toMatch(/export\s*\{[^}]*SplitButtonMenuItem\b[^}]*\}/);
    // backward compat: compound API exports preserved
    expect(src).toMatch(/export\s*\{[^}]*SplitButtonMain\b[^}]*\}/);
    expect(src).toMatch(/export\s*\{[^}]*SplitButtonMenu\b[^}]*\}/);
  });

  it("accepts the official props: buttonProps, menuButtonLabel, menuItems, menuAlignment, menuProps", async () => {
    const src = await read("src/components/ui/split-button.tsx");
    expect(src).toContain("buttonProps");
    expect(src).toContain("menuButtonLabel");
    expect(src).toContain("menuItems");
    expect(src).toContain("menuAlignment");
    expect(src).toContain("menuProps");
    // default alignment is bottom-start; bottom-end supported
    expect(src).toMatch(/menuAlignment\s*=\s*["']bottom-start["']/);
    expect(src).toContain('"bottom-end"');
    // buttonProps is typed as the local ButtonProps
    expect(src).toMatch(/buttonProps\??:\s*ButtonProps/);
    // menuProps forwards to the Menu primitive (width passthrough)
    expect(src).toMatch(/menuProps\??:\s*React\.ComponentProps<typeof Menu>/);
  });

  it("renders the primary button from buttonProps + children label and the aria-labeled trigger", () => {
    const markup = renderToStaticMarkup(
      React.createElement(
        SplitButton,
        {
          buttonProps: { size: "small", type: "secondary", onClick: () => {} },
          menuButtonLabel: "Select save method",
          menuItems: React.createElement(SplitButtonMenuItem, {
            title: "Save",
            description: "Save changes",
          }),
        },
        "Save",
      ),
    );

    expect(markup).toContain('data-slot="split-button"');
    expect(markup).toContain('data-slot="split-button-main"');
    expect(markup).toContain('data-slot="split-button-menu"');
    // children = primary button label
    expect(markup).toContain(">Save</");
    // buttonProps size/variant applied to the primary button
    expect(markup).toContain('data-size="small"');
    expect(markup).toContain('data-type="secondary"');
    // trigger carries menuButtonLabel as aria-label
    expect(markup).toContain('aria-label="Select save method"');
    // joined group geometry: left corners on primary, right corners on trigger
    expect(markup).toContain("rounded-r-none");
    expect(markup).toContain("rounded-l-none");
  });
});

describe("SplitButton menu alignment under the primary button (G11-SPLIT-02)", () => {
  it("anchors bottom-start under the primary button by offsetting the trigger width", async () => {
    const src = await read("src/components/ui/split-button.tsx");
    // the open menu is shifted left by the measured trigger width so its left
    // edge lands on the primary button's left edge (official default alignment)
    expect(src).toContain("alignOffset");
    expect(src).toMatch(/useElementWidth\(triggerRef\)/);
    expect(src).toMatch(
      /alignOffset\s*=\s*menuAlignment === ["']bottom-end["'] \? 0 : -triggerWidth/,
    );
    // bottom-end keeps the menu flush to the group's right edge (no offset)
    expect(src).toMatch(/menuAlignment === ["']bottom-end["'] \? 0 : -triggerWidth/);
  });

  it("passes menuAlignment through to the Menu position context", async () => {
    const src = await read("src/components/ui/split-button.tsx");
    expect(src).toMatch(/<MenuContainer position=\{menuAlignment\}>/);
  });
});

describe("SplitButtonMenuItem title + description + icon (G11-SPLIT-04)", () => {
  it("exposes title, description, icon and menuItemProps", async () => {
    const src = await read("src/components/ui/split-button.tsx");
    expect(src).toContain("SplitButtonMenuItemProps");
    expect(src).toMatch(/title\??:\s*React\.ReactNode/);
    expect(src).toMatch(/description\??:\s*React\.ReactNode/);
    expect(src).toMatch(/icon\??:\s*React\.ReactNode/);
    expect(src).toMatch(/menuItemProps\??:/);
  });

  it("renders a two-line row: title + muted description + optional icon", async () => {
    await renderIntoDocument(
      React.createElement(
        MenuContainer,
        { open: true, onOpenChange: () => {} },
        React.createElement(
          Menu,
          null,
          React.createElement(SplitButtonMenuItem, {
            title: "Save",
            description: "Save changes",
            icon: React.createElement("svg"),
            menuItemProps: { className: "w-[200px]" },
          }),
        ),
      ),
    );

    const item = document.body.querySelector('[data-slot="menu-item"]');
    expect(item).not.toBeNull();
    // title + description both render
    expect(item?.textContent).toContain("Save");
    expect(item?.textContent).toContain("Save changes");
    // optional icon renders
    expect(item?.querySelector("svg")).not.toBeNull();
    // description line is muted small text
    expect(item?.innerHTML).toContain("text-label-12");
    expect(item?.innerHTML).toContain("text-muted-foreground");
    // menuItemProps forward through to the menu item
    expect(item?.className).toContain("w-[200px]");
  });

  it("renders title-only items when description is omitted", async () => {
    await renderIntoDocument(
      React.createElement(
        MenuContainer,
        { open: true, onOpenChange: () => {} },
        React.createElement(
          Menu,
          null,
          React.createElement(SplitButtonMenuItem, { title: "Deploy to Production" }),
        ),
      ),
    );

    const item = document.body.querySelector('[data-slot="menu-item"]');
    expect(item).not.toBeNull();
    expect(item?.textContent).toContain("Deploy to Production");
    expect(item?.innerHTML).not.toContain("text-muted-foreground");
  });
});

describe("SplitButton backward compatibility with compound API", () => {
  it("still renders the legacy compound composition", () => {
    const markup = renderToStaticMarkup(
      React.createElement(
        SplitButton,
        null,
        React.createElement(SplitButtonMain, null, "Deploy Project"),
        React.createElement(
          SplitButtonMenu,
          { menuLabel: "More deployment actions" },
          React.createElement("span", null, "Deploy to Preview"),
        ),
      ),
    );

    expect(markup).toContain('data-slot="split-button"');
    expect(markup).toContain('data-slot="split-button-main"');
    expect(markup).toContain('data-slot="split-button-menu"');
    expect(markup).toContain("Deploy Project");
    expect(markup).toContain('aria-label="More deployment actions"');
  });
});
