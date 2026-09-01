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
    expect(row("avatar", "members")).toMatchObject({
      type: "AvatarGroupMember[]",
      required: true,
    });
    expect(row("avatar", "limit")?.type).toBe("number");
    expect(row("avatar", "overlap")?.defaultValue).toBe('"auto"');
    expect(row("avatar", "reverse")?.defaultValue).toBe("false");
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

    expect(row("choicebox", "label")?.required).toBe(true);
    expect(row("choicebox", "type")?.type).toBe('"radio" | "checkbox"');
    expect(row("choicebox", "onChange")?.required).toBe(true);
    expect(row("choicebox", "title")?.required).toBe(true);
    expect(row("choicebox", "description")?.required).toBe(true);

    expect(row("split-button", "buttonProps")?.type).toBe("ButtonProps");
    expect(row("split-button", "menuAlignment")?.defaultValue).toBe('"bottom-start"');
    expect(row("split-button", "menuItems")?.type).toBe("ReactNode");
    expect(row("split-button", "onClick")).toBeUndefined();
    expect(row("split-button", "menu")).toBeUndefined();

    expect(row("status-dot", "state")).toMatchObject({
      type: "StatusDotState",
      defaultValue: '"QUEUED"',
    });
    expect(row("status-dot", "state")?.required).toBeUndefined();
    expect(row("status-dot", "label")?.type).toBe("boolean");
    expect(row("status-dot", "titlePrefix")?.type).toBe("string");

    expect(row("step-point", "status")?.required).toBe(true);
    expect(row("step-point", "status")?.defaultValue).toBeUndefined();
    expect(row("step-point", "children")?.required).toBe(true);

    expect(COMPONENT_API.table.exports).toEqual([
      "TableRoot",
      "Table",
      "TableColgroup",
      "TableCol",
      "TableHeader",
      "TableBody",
      "TableFooter",
      "TableRow",
      "TableHead",
      "TableCell",
      "TableCaption",
    ]);
    expect(row("table", "rowHeight")?.type).toBe('number | "auto"');
    expect(row("table", "colWidth")?.type).toBe('"auto" | "fit"');
    expect(row("table", "colorScheme")?.type).toBe("TableColorScheme");
    expect(row("table", "headerRow")?.type).toBe("boolean");
    expect(row("table", "headerCol")?.type).toBe("boolean");
    expect(row("table", "striped")).toBeUndefined();

    expect(row("textarea", "size")?.defaultValue).toBe('"medium"');
    expect(row("textarea", "error")?.type).toBe("ReactNode");
    expect(row("textarea", "label")?.type).toBe("ReactNode");
    expect(row("textarea", "layout")?.type).toBe("ControlLayout");

    expect(row("theme-switcher", "small")?.defaultValue).toBe("false");
    expect(row("theme-switcher", "disabled")?.defaultValue).toBe("false");
    expect(row("theme-switcher", "theme")).toBeUndefined();
    expect(row("theme-switcher", "onThemeChange")).toBeUndefined();

    expect(row("description", "title")).toMatchObject({ type: "string", required: true });
    expect(row("description", "content")).toMatchObject({
      type: "ReactNode",
      required: true,
    });
    expect(row("description", "tooltip")?.type).toBe("string");
    expect(row("description", "right")?.type).toBe("boolean");
    expect(row("description", "ellipsis")?.type).toBe("boolean");
    expect(row("description", "children")).toBeUndefined();

    expect(row("clearable-input", "label")?.type).toBe("string");
    expect(row("clearable-input", "cmdk")?.defaultValue).toBe("false");
    expect(row("clearable-input", "layout")?.type).toBe("ControlLayout");

    expect(row("combobox", "value")?.type).toBe("string | null");
    expect(row("combobox", "defaultValue")?.type).toBe("string");
    expect(row("combobox", "size")?.type).toBe('"small" | "medium" | "large"');
    expect(row("combobox", "clearable")?.defaultValue).toBe("false");
    expect(row("combobox", "errored")?.defaultValue).toBe("false");
    expect(row("combobox", "layout")?.type).toBe("ControlLayout");
    expect(row("combobox", "maxWidth")?.type).toBe("number");
    expect(row("combobox", "emptyMessage")?.type).toBe("string");
    expect(row("combobox", "ignoreDefaultHeight")?.type).toBe("boolean");

    expect(row("multi-select", "layout")?.type).toBe("ControlLayout");
    expect(row("multi-select", "checked")?.required).toBe(true);
    expect(row("multi-select", "onChange")?.required).toBe(true);
    expect(row("multi-select", "onSelectOnly")?.required).toBe(true);
    expect(row("multi-select", "onSelectAll")?.required).toBe(true);
    expect(row("multi-select", "count")?.type).toBe("number");
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

  it("does not claim unsupported component-guide behavior", () => {
    const guideText = (slug: string) =>
      JSON.stringify({
        metadata: COMPONENTS.find(({ name }) => name === slug),
        zh: COMPONENT_GUIDES_ZH[slug],
        en: COMPONENT_GUIDES_EN[slug],
      });

    expect(guideText("avatar")).not.toMatch(
      /sm、default、lg|sm, default, and lg|最多显示四个|at most four|用户名哈希|hash of the username/i,
    );
    expect(guideText("banner")).not.toMatch(
      /open\/collapsed|carries alert or status semantics|语义相当于 alert 或 status|dismissable Banner|可关闭的 Banner|semantic Banner types|语义类型的 Banner/i,
    );
    expect(guideText("gauge")).not.toMatch(
      /外圈覆盖内圈|outer arc overlaying the inner|automatically adapts width|自动适配宽度|supports custom gradients|支持自定义渐变/i,
    );
    expect(guideText("modal")).not.toMatch(
      /via the inset prop|通过 inset prop|bottom sheet behavior|底面板行为|virtual keyboard.*obscure|虚拟键盘遮挡/i,
    );
    expect(guideText("relative-time-card")).not.toMatch(
      /expose.*via aria-label|通过 aria-label 属性暴露|aria-live="polite"|internally handles incremental time updates|内部自动处理时间增量更新/i,
    );
    expect(guideText("clearable-input")).not.toMatch(
      /clearIconOnClick|width prop|contrast thresholds|对比度阈值/i,
    );
    expect(guideText("combobox")).not.toMatch(
      /sm、default、lg|sm, default, lg|value\/query props|external value and query props|typeahead support|类型 ahead|auto-positions based on window bounds|根据窗口边界自动定位|red border and error message|红色边框和错误提示/i,
    );
    expect(guideText("multi-select")).not.toMatch(
      /filterable list|可过滤的多选列表|可筛选列表|aggregated summary|聚合摘要|value（已选数组）和 onChange|value \(selected array\) and onChange|via value and onChange|通过 value\/onChange|defaultSelected/i,
    );
  });

  it("links the common lifecycle conventions and every component page to the registry UI", async () => {
    expect(DOCS_ROUTE_GROUPS.find((group) => group.id === "api")?.items).toEqual([
      expect.objectContaining({ to: "/lifecycle-and-hooks" }),
    ]);
    const source = await readFile("docs/geist/src/components/docs-components-page.tsx", "utf8");
    expect(source).toContain("<ComponentApiReference componentName={name} />");
  });
});
