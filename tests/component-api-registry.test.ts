import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import { COMPONENT_API } from "../docs/geist/src/data/component-api";
import {
  COMPONENT_GUIDES_EN,
  COMPONENT_GUIDES_ZH,
} from "../docs/geist/src/content/component-guides";
import { COMPONENTS } from "../docs/geist/src/data/components";
import { DEMO_CODE } from "../docs/geist/src/data/demo-code";
import { DOCS_ROUTE_GROUPS } from "../docs/geist/src/data/docs-routes";

describe("component API registry", () => {
  it("has an API entry for every documented component", () => {
    expect(Object.keys(COMPONENT_API).sort()).toEqual(COMPONENTS.map(({ name }) => name).sort());
  });

  it("keeps every entry useful to a consumer", () => {
    for (const [name, api] of Object.entries(COMPONENT_API)) {
      expect(api.exports.length, `${name} needs at least one public export`).toBeGreaterThan(0);
      expect(
        api.exports.every((entry) => entry.trim().length > 0),
        `${name} exports blank API text`,
      ).toBe(true);
    }
  });

  it("matches the real public contracts for representative components", () => {
    const row = (component: keyof typeof COMPONENT_API, name: string) =>
      COMPONENT_API[component].rows.find((entry) => entry.name === name);

    expect(row("button", "type")).toMatchObject({
      type: '"default" | "secondary" | "tertiary" | "error" | "warning"',
      defaultValue: '"default"',
    });
    expect(row("button", "typeName")?.defaultValue).toBe('"submit"');
    expect(row("button", "loading")?.description).toMatch(/disabl/i);

    expect(COMPONENT_API.toast.rows.map(({ name, type }) => [name, type])).toEqual([
      ["message", "(options: ToastOptions) => number"],
      ["success", "(text: ReactNode) => number"],
      ["warning", "(text: ReactNode) => number"],
      ["error", "(text: ReactNode) => number"],
      ["dismiss", "(id: number) => void"],
    ]);

    expect(row("progress", "value")?.type).toBe("number | null");
    expect(row("progress", "value")?.description).toContain("null");
    expect(row("progress", "indeterminate")).toBeUndefined();

    expect(COMPONENT_API.feedback.exports).toEqual(["Feedback"]);
    expect(row("feedback", "onSubmit")?.type).toBe(
      "(rating: FeedbackRatingValue | undefined, text: string, metadata?: Record<string, string>) => void",
    );

    expect(COMPONENT_API.select.exports).toEqual([
      "Select",
      "SelectItem",
      "SelectGroup",
      "SelectSeparator",
    ]);
    expect(row("select", "aria-label")?.type).toBe("string");
    expect(row("select", "aria-labelledby")?.type).toBe("string");
    expect(row("input", "prefixStyling")?.defaultValue).toBe("true");
    expect(row("input", "suffixStyling")?.defaultValue).toBe("true");

    expect(row("browser", "address")?.type).toBe("string");
    expect(row("browser", "url")).toBeUndefined();
    expect(row("code-block", "children")?.type).toBe("string");
    expect(row("code-block", "code")).toBeUndefined();
    expect(row("command-menu", "setOpen")?.type).toBe("(open: boolean) => void");
    expect(row("command-menu", "onOpenChange")).toBeUndefined();

    expect(row("badge", "variant")?.defaultValue).toBe('"gray"');
    expect(row("badge", "type")).toBeUndefined();
    expect(row("dots-menu", "position")?.type).toBe("MenuPosition");
    expect(row("dots-menu", "align")).toBeUndefined();
    expect(row("error", "children")?.type).toBe("ReactNode");
    expect(row("error", "message")).toBeUndefined();
    expect(row("gauge", "max")).toBeUndefined();
    expect(row("json-view", "data")?.required).toBe(true);
    expect(row("json-view", "value")).toBeUndefined();
    expect(row("json-view", "collapsed")).toBeUndefined();
    expect(row("label", "id")?.required).toBe(true);
    expect(row("label", "value")?.required).toBe(true);
    expect(row("label", "htmlFor")).toBeUndefined();
    expect(row("middle-truncate", "value")?.required).toBe(true);
    expect(row("middle-truncate", "text")).toBeUndefined();
    expect(row("note", "variant")?.type).toBe("NoteVariant");
    expect(row("note", "type")).toBeUndefined();
    expect(row("pagination", "previous")?.type).toBe("PaginationRailLink");
    expect(row("pagination", "next")?.type).toBe("PaginationRailLink");
    expect(row("pagination", "page")).toBeUndefined();
    expect(row("pagination", "onPageChange")).toBeUndefined();
    expect(row("radio", "onChange")?.type).toBe("(value: string) => void");
    expect(row("radio", "onValueChange")).toBeUndefined();
    expect(row("relative-time-card", "date")?.type).toBe("number");
    expect(row("relative-time-card", "date")?.required).toBe(true);
    expect(row("scroller", "overflow")?.defaultValue).toBe('"x"');
    expect(row("scroller", "orientation")).toBeUndefined();
    expect(row("search-input", "onChange")?.type).toBe(
      "React.ChangeEventHandler<HTMLInputElement>",
    );
    expect(row("search-input", "onValueChange")).toBeUndefined();

    expect(COMPONENT_API.modal.exports).toEqual([
      "Modal",
      "ModalTrigger",
      "ModalPortal",
      "ModalOverlay",
      "ModalContent",
      "ModalHeader",
      "ModalTitle",
      "ModalDescription",
      "ModalFooter",
      "ModalClose",
    ]);
    expect(row("modal", "showCloseButton")?.type).toBe("boolean");
    expect(row("modal", "bodyClassName")?.type).toBe("string");

    expect(COMPONENT_API.avatar.exports).toEqual([
      "Avatar",
      "AvatarGroup",
      "AvatarWithIcon",
      "GitHubAvatar",
      "GitLabAvatar",
      "BitbucketAvatar",
    ]);
    expect(row("avatar", "size")?.type).toBe("number");
    expect(row("avatar", "fallback")).toBeUndefined();
    expect(row("destructive-action-modal", "title")?.required).toBe(true);
    expect(row("destructive-action-modal", "confirmLabel")?.required).toBe(true);
    expect(row("destructive-action-modal", "verificationPhrase")?.required).toBe(true);
    expect(row("destructive-action-modal", "onConfirm")?.type).toBe("() => void");
    expect(row("file-tree", "open")?.type).toBe("boolean");
    expect(row("file-tree", "defaultOpen")?.type).toBe("boolean");
    expect(row("file-tree", "onOpenChange")?.type).toBe("(open: boolean) => void");
    expect(row("file-tree", "href")?.type).toBe("string");
    expect(row("show-more", "expanded")?.type).toBe("boolean");
    expect(row("show-more", "noBorder")?.type).toBe("boolean");
    expect(row("show-more", "children")).toBeUndefined();
    expect(row("snippet", "text")?.type).toBe("string | string[]");
    expect(row("snippet", "onCopy")?.type).toBe("() => void");
    expect(row("snippet", "onCopyError")).toBeUndefined();
    expect(row("spinner", "size")?.type).toBe(
      '"sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl"',
    );
    expect(row("tooltip", "text")?.required).toBe(true);
    expect(row("tooltip", "content")).toBeUndefined();
    expect(row("tooltip", "delay")?.type).toBe("boolean | number");
    expect(row("tooltip", "delayDuration")).toBeUndefined();
  });

  it("imports every ModalTrigger used by a modal Show Code example", () => {
    for (const [name, source] of Object.entries(DEMO_CODE.modal ?? {})) {
      if (!source.includes("<ModalTrigger")) continue;
      expect(source, `modal.${name} uses ModalTrigger without importing it`).toMatch(
        /import\s*\{[^}]*\bModalTrigger\b[^}]*\}\s*from\s*["']@\/components\/ui\/modal["']/s,
      );
    }
  });

  it("does not claim unsupported Button focus or runtime validation behavior", () => {
    const buttonMetadata = COMPONENTS.find(({ name }) => name === "button");
    const text = JSON.stringify({
      metadata: buttonMetadata,
      zh: COMPONENT_GUIDES_ZH.button,
      en: COMPONENT_GUIDES_EN.button,
    });

    expect(text).not.toMatch(/stays focusable|keeps the button focusable|保持按钮可聚焦/i);
    expect(text).not.toMatch(/validator throws|校验器会报错/i);
  });

  it("links the common lifecycle conventions and every component page to the registry UI", async () => {
    expect(DOCS_ROUTE_GROUPS.find((group) => group.id === "api")?.items).toEqual([
      expect.objectContaining({ to: "/lifecycle-and-hooks" }),
    ]);
    const source = await readFile("docs/geist/src/components/docs-components-page.tsx", "utf8");
    expect(source).toContain("<ComponentApiReference componentName={name} />");
  });
});
