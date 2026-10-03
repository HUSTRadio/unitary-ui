import { readFile } from "node:fs/promises";

import ts from "typescript";
import { describe, expect, it } from "vitest";

import { COMPONENT_API } from "../docs/site/src/data/component-api";
import {
  COMPONENT_GUIDES_EN,
  COMPONENT_GUIDES_ZH,
} from "../docs/site/src/content/component-guides";
import { COMPONENTS } from "../docs/site/src/data/components";
import { EXAMPLE_SOURCE } from "../docs/site/src/examples/registry";
import { DOCS_ROUTE_GROUPS } from "../docs/site/src/data/docs-routes";

describe("component API registry", () => {
  it("has an API entry for every documented component", () => {
    expect(Object.keys(COMPONENT_API).sort()).toEqual(COMPONENTS.map(({ name }) => name).sort());
  });

  it("does not retain unreachable raw API entries outside the component registry", async () => {
    const file = "docs/site/src/data/component-api.ts";
    const source = ts.createSourceFile(
      file,
      await readFile(file, "utf8"),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );
    const declaration = source.statements
      .filter(ts.isVariableStatement)
      .flatMap((statement) => [...statement.declarationList.declarations])
      .find((entry) => ts.isIdentifier(entry.name) && entry.name.text === "O");
    const initializer = declaration?.initializer;
    const object = initializer && ts.isSatisfiesExpression(initializer) ? initializer.expression : initializer;
    expect(object && ts.isObjectLiteralExpression(object)).toBe(true);

    const rawKeys = (object as ts.ObjectLiteralExpression).properties.flatMap((property) => {
      if (!ts.isPropertyAssignment(property) || !property.name) return [];
      if (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) return [property.name.text];
      return [];
    });
    const documented = new Set(COMPONENTS.map(({ name }) => name));
    expect(rawKeys.filter((name) => !documented.has(name))).toEqual([]);
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
      // HIG-AUD-018：可注入 store
      ["store", "ToastStore"],
      ["createToastStore", "() => ToastStore"],
    ]);

    expect(row("progress", "value")?.type).toBe("number | null");
    expect(row("progress", "value")?.description).toContain("null");
    expect(row("progress", "indeterminate")).toBeUndefined();

    expect(COMPONENT_API.feedback.exports).toEqual(["Feedback", "RatingPill"]);
    expect(row("feedback", "defaultValue")?.type).toBe("RatingValue");
    expect(COMPONENT_API["side-panel"].exports).toEqual([
      "SidePanel", "SidePanelTitle", "SidePanelDescription", "SidePanelClose",
    ]);
    expect(row("feedback", "onSubmit")?.type).toBe(
      "(rating: FeedbackRatingValue | undefined, text: string, metadata?: Record<string, string>, topic?: string) => void",
    );
    expect(row("feedback", "topics")?.type).toBe("readonly string[]");
    expect(row("feedback", "topic")?.type).toBe("string");
    expect(row("feedback", "defaultTopic")?.type).toBe("string");
    expect(row("feedback", "onTopicChange")?.type).toBe("(topic: string) => void");
    expect(row("feedback", "includeTopicInMetadata")?.defaultValue).toBe("false");

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

    expect(COMPONENT_API["context-menu"].exports).toEqual([
      "ContextMenu",
      "ContextMenuTrigger",
      "ContextMenuContent",
      "ContextMenuItem",
      "ContextMenuSeparator",
      "ContextMenuQuickActionsContent",
      "ContextMenuQuickActionsItem",
    ]);
    expect(row("context-menu", "href")?.type).toBe("string");
    expect(row("context-menu", "prefix")?.type).toBe("ReactNode");
    expect(row("context-menu", "suffix")?.type).toBe("ReactNode");

    expect(COMPONENT_API.fieldset.exports).toEqual([
      "Fieldset",
      "FieldsetTitle",
      "FieldsetSubtitle",
      "FieldsetContent",
      "FieldsetFooter",
      "FieldsetFooterStatus",
      "FieldsetFooterActions",
      "FieldsetFooterAction",
      "ErrorText",
      "WarningText",
      "DisabledWall",
    ]);
    expect(row("fieldset", "type")?.type).toBe("FieldsetType");
    expect(row("fieldset", "disabled")?.type).toBe("boolean");
    expect(row("fieldset", "highlight")?.type).toBe("boolean");
    expect(row("fieldset", "legend")).toBeUndefined();

    expect(COMPONENT_API.grid.exports).toEqual([
      "Grid",
      "GridCell",
      "GridCross",
      "GridPage",
      "GridSystem",
    ]);
    expect(row("grid", "height")?.type).toBe("GridHeight");
    expect(row("grid", "hideGuides")?.type).toBe("GridHideGuides");
    expect(row("grid", "span")).toBeUndefined();

    expect(COMPONENT_API.sheet.exports).toEqual([
      "Sheet",
      "SheetTrigger",
      "SheetContent",
      "SheetHeader",
      "SheetTitle",
      "SheetDescription",
      "SheetFooter",
      "SheetClose",
    ]);
    expect(row("sheet", "side")?.defaultValue).toBe('"right"');
    expect(row("sheet", "noOverlay")?.defaultValue).toBe("false");

    expect(COMPONENT_API["bottom-sheet"].exports).toEqual(["BottomSheet"]);
    expect(row("bottom-sheet", "detents")?.defaultValue).toBe("[0.5, 1]");
    expect(row("bottom-sheet", "showIndicator")?.defaultValue).toBe('"automatic"');
    expect(row("bottom-sheet", "open")?.type).toBe("boolean");
    expect(row("bottom-sheet", "onOpenChange")?.type).toBe("(open: boolean) => void");
    expect(row("bottom-sheet", "onDetentChange")?.type).toBe("(index: number) => void");
    // HIG-AUD-018：档位受控
    expect(row("bottom-sheet", "detent")?.type).toBe("number");
    // HIG-AUD-040：面板命名能力（aria-label 回退 / aria-labelledby 关联）
    expect(row("bottom-sheet", "aria-label")?.type).toBe("string");
    expect(row("bottom-sheet", "aria-labelledby")?.type).toBe("string");

    expect(COMPONENT_API["error-boundary"].exports).toEqual(["ErrorBoundary"]);
    expect(row("error-boundary", "children")).toMatchObject({
      type: "ReactNode",
      required: true,
    });
    expect(row("error-boundary", "fallback")?.type).toBe("ReactNode");
    expect(row("error-boundary", "resetKeys")?.type).toBe("unknown[]");
    expect(row("error-boundary", "onError")?.type).toBe(
      "(error: Error, info: React.ErrorInfo) => void",
    );

    expect(COMPONENT_API.device.exports).toEqual(["Device", "DeviceScreen"]);
    expect(row("device", "model")).toMatchObject({
      type: "DeviceModelId",
      required: true,
    });
    expect(row("device", "color")?.type).toBe("DeviceColor<M>");
    expect(row("device", "autoFit")?.defaultValue).toBe("true");
    expect(row("device", "zoom")?.type).toBe("number");
    expect(row("device", "statusBar")?.type).toContain("PhoneStatusBarOptions");
    expect(row("device", "safari")?.type).toContain("PhoneSafariOptions");
    expect("phone" in COMPONENT_API).toBe(false);

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
    // HIG-AUD-018：菜单触发按钮可单独禁用
    expect(row("split-button", "menuButtonDisabled")).toMatchObject({
      type: "boolean",
      defaultValue: "false",
    });
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
    expect(row("table", "frame")).toMatchObject({
      type: '"outline" | "none"',
      defaultValue: '"outline"',
    });
    expect(row("table", "columnDividers")).toMatchObject({
      type: "boolean",
      defaultValue: "false",
    });
    expect(row("table", "headerRow")?.type).toBe("boolean");
    expect(row("table", "headerCol")?.type).toBe("boolean");
    expect(row("table", "striped")).toBeUndefined();
    expect(EXAMPLE_SOURCE.table.Default).toContain('frame="outline"');
    expect(EXAMPLE_SOURCE.table["Full featured table"]).toContain('frame="none"');
    expect(EXAMPLE_SOURCE.table["Full featured table"]).toContain("columnDividers");

    expect(row("textarea", "size")?.defaultValue).toBe('"medium"');
    expect(row("textarea", "error")?.type).toBe("ReactNode");
    expect(row("textarea", "label")?.type).toBe("ReactNode");
    expect(row("textarea", "layout")?.type).toBe("ControlLayout");

    expect(row("theme-switcher", "compact")?.defaultValue).toBe("false");
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
    // HIG-AUD-018：打开状态受控
    expect(row("combobox", "open")?.type).toBe("boolean");
    expect(row("combobox", "onOpenChange")?.type).toBe("(open: boolean) => void");

    expect(row("multi-select", "layout")?.type).toBe("ControlLayout");
    expect(row("multi-select", "checked")?.required).toBe(true);
    expect(row("multi-select", "onChange")?.required).toBe(true);
    expect(row("multi-select", "onSelectOnly")?.required).toBe(true);
    expect(row("multi-select", "onSelectAll")?.required).toBe(true);
    expect(row("multi-select", "count")?.type).toBe("number");
  });

  it("imports every ModalTrigger used by a modal Show Code example", () => {
    for (const [name, source] of Object.entries(EXAMPLE_SOURCE.modal ?? {})) {
      if (!source.includes("<ModalTrigger")) continue;
      expect(source, `modal.${name} uses ModalTrigger without importing it`).toMatch(
        /import\s*\{[^}]*\bModalTrigger\b[^}]*\}\s*from\s*["']@\/components\/ui\/modal["']/s,
      );
    }
  });

  it("keeps Slider track examples compatible with the implemented update paths", () => {
    const slider = EXAMPLE_SOURCE.slider;

    for (const name of ["default", "with-label", "commit-on-release"] as const) {
      expect(slider[name], `slider.${name} must not depend on track onValueChange`).not.toMatch(
        /\bvalue=\{value\}[\s\S]*\bonValueChange=\{setValue\}/,
      );
    }
    expect(slider["commit-on-release"]).toContain("defaultValue={[50]}");
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
    expect(guideText("command-menu")).not.toMatch(
      /默认配置.*绑定 ⌘K 全局快捷键|default configuration, bound to the ⌘K global shortcut|does not expose an external value\/open|不提供外部 value\/open/i,
    );
    expect(guideText("context-card")).not.toMatch(/focus trap|焦点 trap/i);
    expect(guideText("collapse")).not.toMatch(/open prop and onChange callback|open 属性和 onChange 回调/i);
    expect(guideText("file-tree")).not.toMatch(
      /上下方向键|左右方向键|Up\/Down arrows move focus|Left\/Right arrows collapse or expand/i,
    );
    expect(guideText("json-view")).not.toMatch(
      /copy capabilities|copy JSON|复制 JSON|defaultExpandedDepth|controlled expandedKeys, precisely|受控的 expandedKeys 来控制|specific key paths|特定键路径|automatically adjusts indentation|自动调整缩进|container's max height adjusts|容器的最大高度会随着|adjusts all color contrasts|所有颜色的对比度都经过调整/i,
    );
    expect(guideText("keyboard-input")).not.toMatch(
      /Windows\/Linux 上将 ⌘ 自动替换为 Ctrl|Windows\/Linux 上显示 Ctrl|Windows\/Linux renders Ctrl|automatically replaces.*Ctrl|swaps ⌘ for Ctrl|modifier key swapping/i,
    );
    expect(guideText("pagination")).not.toMatch(
      /activePage 属性|total 属性|activePage prop|total prop|mark the current page with isActive|用 isActive 标记当前页|current page highlight background|当前页高亮的背景色|auto-renders the corresponding set of page buttons|自动渲染对应的页码/i,
    );
    expect(guideText("show-more")).not.toMatch(
      /焦点移动到第一个新揭示|焦点转移到第一条新行|aria-live="polite" 通知|move focus to the first newly revealed|aria-live="polite" announcement|显示 12 条更多|Show 12 More|each row adapts|每行内容自适应|minimum tap target|固定的最小尺寸|border color and background can be customized via props|通过 props 自定义边框颜色和背景/i,
    );
    expect(guideText("slider")).not.toMatch(
      /through the onChange callback|通过 onChange 回调|onValueChange for continuous|onValueChange 监听连续|live value next to the track|实时显示当前值|minimum touch-target|最小触控目标|label text auto-sizes|标签文字自动缩小|custom colors can be passed via props|通过 props 自定义滑块颜色/i,
    );
    expect(guideText("table")).not.toMatch(
      /sortKey|sortOrder|border prop|sortable prop|sortable 属性|card-stack layout|卡片堆叠布局/i,
    );
    expect(guideText("tooltip")).not.toMatch(/open state and onChange|open 状态和 onChange|~150ms/i);
    expect(guideText("text-with-copy-button")).not.toMatch(
      /hidden-textarea execCommand fallback|隐藏的 textarea execCommand 降级|small size and tertiary|小型尺寸和 tertiary|automatically.*ellipsis|自动压缩并可能触发省略号|minimum 44px|至少 44px/i,
    );
    expect(guideText("breadcrumbs")).not.toMatch(
      /激活态.*不应是可链接的|active item.*should not be linkable/i,
    );
    expect(guideText("calendar")).not.toMatch(
      /方向键移动、Enter 确认|Arrow keys move.*Enter confirms|选中日期由父组件受控|selected date is controlled by the parent/i,
    );
    expect(guideText("code")).not.toMatch(
      /以内联代码形式|inline code presentation|默认内联代码|Default inline code/i,
    );
    expect(guideText("copy-button")).not.toMatch(/约 1\.5 秒|about 1\.5 seconds/i);
    expect(guideText("empty-state")).not.toMatch(
      /no-results 变体|blank slate.*变体|informational.*变体|no-results variant|blank-slate variant|informational variant/i,
    );
    expect(guideText("entity")).not.toMatch(
      /窄屏下列自动折叠|操作按钮在移动端可能转换|三列的相对宽度.*动态分配|columns automatically collapse|action buttons may become icons|relative column widths dynamically/i,
    );
    expect(guideText("error-card")).not.toMatch(
      /默认的 Error Card 结构.*恢复操作按钮|default Error Card structure.*recovery action button|recovery action button stretches|恢复操作按钮在全宽容器中占满/i,
    );
    expect(guideText("load-more-button")).not.toMatch(
      /覆盖默认加载文案|override the default loading text/i,
    );
    expect(guideText("loading-dots")).not.toMatch(
      /isLoading 状态决定|starts or stops.*loading state|determined by.*isLoading state/i,
    );
    expect(guideText("menu")).not.toMatch(
      /会打开嵌套的子菜单|open nested sub-?menus?/i,
    );
    expect(guideText("pill")).not.toMatch(
      /已激活的 Pill 应通过 aria-pressed|active Pill should carry an aria-pressed|支持水平滚动或自动换行|supports horizontal scrolling or auto-wrapping/i,
    );
    expect(guideText("project-banner")).not.toMatch(
      /带有 alert 或 status 语义|carries alert or status semantics|设计上不可关闭|non-dismissible by design|组件.*自动.*aria-live="assertive"|automatically.*aria-live="assertive"/i,
    );
    expect(guideText("separator")).not.toMatch(
      /默认作为装饰性|Decorative by default/i,
    );
    expect(guideText("skeleton")).not.toMatch(
      /自动缩减为单列|automatically collapse to a single-column/i,
    );
    expect(guideText("switch")).not.toMatch(
      /使用 checked 受控属性|Uses the checked prop for controlled state|onChange 回调同步父级|onChange callback to sync parent/i,
    );
    expect(guideText("tabs")).not.toMatch(
      /selectedIndex|onChange 回调可用于响应标签切换|onChange callback responds to tab switch|自动调整间距和字号|automatically adjust spacing and font size/i,
    );
    expect(guideText("toggle")).not.toMatch(
      /checked 是必填|checked is required/i,
    );
    expect(guideText("video")).not.toMatch(
      /不提供 play\/pause\/seek|does not expose play\/pause\/seek|操作系统\/浏览器的默认控件|OS\/browser default controls/i,
    );
  });

  it("links the common lifecycle conventions and every component page to the registry UI", async () => {
    expect(DOCS_ROUTE_GROUPS.find((group) => group.id === "api")?.items).toEqual([
      expect.objectContaining({ to: "/lifecycle-and-hooks" }),
    ]);
    const source = await readFile("docs/site/src/components/docs-components-page.tsx", "utf8");
    expect(source).toContain("<ComponentApiReference componentName={name} />");
  });
});
