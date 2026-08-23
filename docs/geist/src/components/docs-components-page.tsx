import * as React from "react";
import { useLocation } from "react-router-dom";
import {
  Accessibility,
  ArrowDownCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChartColumn,
  CircleCheck,
  ChevronLeft,
  ChevronRight,
  CircleArrowUp,
  Clock,
  Copy,
  ExternalLink,
  Flag,
  LayoutGrid,
  List,
  Lock,
  LockOpen,
  MoreHorizontal,
  Rocket,
  RotateCcw,
  Save,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Trash2,
  Triangle,
  TriangleAlert,
  X,
} from "lucide-react";

import {
  Avatar,
  AvatarGroup,
  AvatarWithIcon,
  BitbucketAvatar,
  GitHubAvatar,
  GitLabAvatar,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Banner } from "@/components/ui/banner";
import { Book } from "@/components/ui/book";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Browser } from "@/components/ui/browser";
import { Button, ButtonLink, CustomButton } from "@/components/ui/button";
import { Calendar, CALENDAR_ROW_REV_CLASS } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { ClearableInput } from "@/components/ui/clearable-input";
import { ChoiceboxGroup, ChoiceboxGroupItem } from "@/components/ui/choicebox";
import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
import { Code, InlineCode } from "@/components/ui/code";
import { CodeBlock as CodeBlockComponent } from "@/components/ui/code-block";
import {
  CommandMenu,
  CommandMenuDivider,
  CommandMenuGroup,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
} from "@/components/ui/command-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  ContextCard,
  ContextCardBody,
  ContextCardDescription,
  ContextCardFooter,
  ContextCardHeader,
  ContextCardTitle,
  ContextCardTrigger,
} from "@/components/ui/context-card";
import { CopyButton } from "@/components/ui/copy-button";
import { Description } from "@/components/ui/description";
import { DestructiveActionModal } from "@/components/ui/destructive-action-modal";
import { DotsMenu, DotsMenuItem } from "@/components/ui/dots-menu";
import {
  Menu,
  MenuButton,
  MenuContainer,
  MenuDivider,
  MenuItem,
  MenuItemLocked,
  MenuLink,
  MenuSection,
} from "@/components/ui/menu";
import { EmptyState, EmptyStateIcon } from "@/components/ui/empty-state";
import {
  Entity,
  EntityAction,
  EntityContent,
  EntityDescription,
  EntityMedia,
  EntityTitle,
} from "@/components/ui/entity";
import {
  ErrorCard,
  ErrorCardAction,
  ErrorCardDescription,
  ErrorCardTitle,
} from "@/components/ui/error-card";
import { Error } from "@/components/ui/error";
import { Feedback } from "@/components/ui/feedback";
import { Drawer, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import {
  DisabledWall,
  ErrorText,
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterAction,
  FieldsetFooterActions,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
  WarningText,
} from "@/components/ui/fieldset";
import { FileTree, FileTreeIcon, FileTreeItem, FileTreeLabel } from "@/components/ui/file-tree";
import { Gauge } from "@/components/ui/gauge";
import { Grid, GridCell, GridCross, GridPage, GridSystem } from "@/components/ui/grid";
import { Input } from "@/components/ui/input";
import { JsonView, makeJsonViewHighlightPattern } from "@/components/ui/json-view";
import { Kbd } from "@/components/ui/keyboard-input";
import { Label } from "@/components/ui/label";
import { LoadMoreButton } from "@/components/ui/load-more-button";
import { LoadingDots } from "@/components/ui/loading-dots";
import { MiddleTruncate } from "@/components/ui/middle-truncate";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import {
  MultiSelectContent,
  MultiSelectRoot,
  MultiSelectRow,
  MultiSelectTrigger,
} from "@/components/ui/multi-select";
import { Note, NoteAction, NoteContent, NoteLabel } from "@/components/ui/note";
import { Pagination } from "@/components/ui/pagination";
import { Phone, PhoneScreen } from "@/components/ui/phone";
import { Pill } from "@/components/ui/pill";
import { ProjectBanner } from "@/components/ui/project-banner";
import { Progress } from "@/components/ui/progress";
import { Radio, RadioGroup, RadioGroupItem, useRadio } from "@/components/ui/radio";
import { RelativeTimeCard } from "@/components/ui/relative-time-card";
import { Scroller } from "@/components/ui/scroller";
import { SearchInput } from "@/components/ui/search-input";
import { Switch, SwitchControl } from "@/components/ui/switch";
import { Select, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShowMore } from "@/components/ui/show-more";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Snippet } from "@/components/ui/snippet";
import { Spinner } from "@/components/ui/spinner";
import {
  SplitButton,
  SplitButtonMain,
  SplitButtonMenu,
  SplitButtonMenuItem,
} from "@/components/ui/split-button";
import { StatusDot } from "@/components/ui/status-dot";
import { StepPoint } from "@/components/ui/step-point";
import {
  Table,
  TableBody,
  TableCell,
  TableCol,
  TableColgroup,
  TableFooter,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "@/components/ui/table";
import { Tabs } from "@/components/ui/tabs";
import { TextWithCopyButton } from "@/components/ui/text-with-copy-button";
import { Textarea } from "@/components/ui/textarea";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { Toggle } from "@/components/ui/toggle";
import { useToasts } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";
import { Video } from "@/components/ui/video";

import { COMPONENTS, type ComponentMeta } from "../data/components";
import { ComponentApiReference } from "./docs-api-reference";
import { DEMO_CODE } from "../data/demo-code";
import { demoText, demoTextWithValues } from "../i18n/components-demo";
import { type DocsLanguage, useLanguage } from "../i18n/language";

/**
 * Components 文档页（docs/geist 专用）。
 * 总览模式（/components）：13 元件索引卡片网格。
 * 详情模式（/components/:name）：返回链接 + 实时 demo（直接渲染根元件）+ 代码块（带 Copy 按钮）。
 */

/* ---------- 代码块 ---------- */

/* ---------- Demo 容器 ---------- */

function DemoSection({
  children,
  componentName,
}: {
  children: React.ReactNode;
  componentName?: string;
}) {
  return (
    <div className="mt-6" data-demo-component={componentName} data-demo-mode="live">
      {children}
    </div>
  );
}

/** Presents selected cards from an existing demo in a titled follow-up section. */
function ComponentDemoCards({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div data-demo-component={name} data-demo-mode="states">
      {children}
    </div>
  );
}

function TableDemoCard({ children, code }: { children: React.ReactNode; code: string }) {
  return (
    <div className="mt-6 overflow-hidden rounded-[8px] border border-gray-alpha-400 bg-background-100">
      <div className="w-full overflow-x-auto p-6">{children}</div>
      <DemoShowCode code={code} />
    </div>
  );
}

/** 官方 show code 统一实现：按钮（收起态 rounded-b-lg 作卡片底边；展开态直角，无缝衔接代码区）+ 展开代码（rounded-b-lg + border-t，含行号）。官方实测：按钮 focus 无可见 ring，故不施加 focus-ring。 */
function DemoShowCode({ code }: { code: string }) {
  const { language } = useLanguage();
  const [showCode, setShowCode] = React.useState(false);
  const codeId = React.useId();
  return (
    <>
      <button
        type="button"
        aria-expanded={showCode}
        aria-controls={codeId}
        onClick={() => setShowCode((v) => !v)}
        className={`flex h-12 w-full items-center gap-3 border-t border-gray-400 bg-background-200 px-4 text-left text-copy-14 text-gray-900 transition-colors hover:bg-gray-200 focus:outline-none${showCode ? "" : " rounded-b-[8px]"}`}
      >
        <ChevronRight
          className={`size-4 transition-transform${showCode ? " rotate-90" : ""}`}
          aria-hidden
        />
        {demoText(language, "Show code")}
      </button>
      {showCode ? (
        <div id={codeId} className="overflow-hidden">
          <CodeBlockComponent
            language="tsx"
            className="rounded-none rounded-b-[8px] border-0 border-t border-gray-alpha-400"
          >
            {code}
          </CodeBlockComponent>
        </div>
      ) : null}
    </>
  );
}

function ShowCodeFooter({ code }: { code: string }) {
  return <DemoShowCode code={code} />;
}

/* ---------- 13 元件实时 demo（直接渲染根元件） ---------- */

function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-1">
      <Badge variant="gray">Gray</Badge>
      <Badge variant="blue">Blue</Badge>
      <Badge variant="purple">Purple</Badge>
      <Badge variant="amber">Amber</Badge>
      <Badge variant="red">Red</Badge>
      <Badge variant="green">Green</Badge>
    </div>
  );
}

function AvatarDemo() {
  return (
    <div className="flex items-center gap-4">
      <Avatar src="https://github.com/vercel.png" alt="Vercel" title="Vercel" />
      <Avatar size={24} letter="AL" />
      <Avatar size={48} letter="LG" />
    </div>
  );
}

function PaginationDemo() {
  const demoCode = (id: string) => DEMO_CODE.pagination?.[id] ?? "";
  return (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card="Default"
    >
      <div className="flex w-full overflow-x-auto md:overflow-visible">
        <div className="w-full p-6" data-demo-container="Default">
          <Pagination
            previous={{ title: "Avatar", href: "#/components/avatar" }}
            next={{ title: "Phone", href: "#/components/phone" }}
          />
        </div>
      </div>
      <ShowCodeFooter code={demoCode("Default")} />
    </div>
  );
}

function EmptyStateDemo() {
  const demoCode = (id: string) => DEMO_CODE["empty-state"]?.[id] ?? "";
  const { language } = useLanguage();
  const icon = <EmptyStateIcon icon={<ChartColumn className="size-8" aria-hidden />} />;
  return (
    <div className="w-full max-w-[862px] space-y-6">
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="empty-state-design-framework"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="empty-state-design-framework">
            <EmptyState
              icon={icon}
              title={demoText(language, "Title")}
              description={demoText(language, "A message conveying the state of the product.")}
            />
          </div>
        </div>
        <ShowCodeFooter code={demoCode("empty-state-design-framework")} />
      </div>
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="blank-slate"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="blank-slate">
            <EmptyState
              icon={icon}
              title={demoText(language, "Title")}
              description={demoText(language, "A message conveying the state of the product.")}
            />
          </div>
        </div>
        <ShowCodeFooter code={demoCode("blank-slate")} />
      </div>
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="informational"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="informational">
            <EmptyState
              icon={icon}
              title={demoText(language, "Title")}
              description={demoText(
                language,
                "This should detail the actions you can take on this screen, as well as why it’s valuable.",
              )}
            >
              <Button
                type="default"
                typeName="button"
                className="relative !max-w-full !border-0 !leading-[21px] whitespace-normal"
              >
                {demoText(language, "Primary Action")}
              </Button>
              <a
                href="/"
                className="inline-flex cursor-pointer items-center gap-0.5 text-label-14 text-muted-foreground transition-colors duration-100 no-underline"
              >
                {demoText(language, "Learn more")}
                <ArrowRight className="size-4" aria-hidden />
              </a>
            </EmptyState>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("informational")} />
      </div>
    </div>
  );
}

function ButtonDemo() {
  const demoCode = (id: string) => DEMO_CODE.button?.[id] ?? "";
  const { language } = useLanguage();
  const upload = demoText(language, "Upload");
  const defaultLabel = demoText(language, "Default");
  const secondaryLabel = demoText(language, "Secondary");
  const tertiaryLabel = demoText(language, "Tertiary");
  const errorLabel = demoText(language, "Error");
  const warningLabel = demoText(language, "Warning");

  const arrowUpIcon = <ArrowUp aria-hidden />;
  const arrowLeftIcon = <ArrowLeft aria-hidden />;
  const arrowRightIcon = <ArrowRight aria-hidden />;

  const cardClass =
    "relative mt-4 rounded-[8px] border border-gray-alpha-400 bg-background-100 xl:mt-7";

  return (
    <>
      <div className={cardClass} data-demo-card="sizes">
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="sizes">
            <div className="flex flex-col items-start gap-4 md:flex-row">
              <Button size="small" typeName="button">
                {upload}
              </Button>
              <Button typeName="button">{upload}</Button>
              <Button size="large" typeName="button">
                {upload}
              </Button>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("sizes")} />
      </div>

      <div className={cardClass} data-demo-card="all-types-and-sizes-in-comparison">
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="all-types-and-sizes-in-comparison">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Button size="small" typeName="button">
                  {upload}
                </Button>
                <Button size="small" typeName="button" type="error">
                  {upload}
                </Button>
                <Button size="small" typeName="button" type="warning">
                  {upload}
                </Button>
                <Button size="small" typeName="button" type="secondary">
                  {upload}
                </Button>
                <Button size="small" typeName="button" type="tertiary">
                  {upload}
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Button typeName="button">{upload}</Button>
                <Button typeName="button" type="error">
                  {upload}
                </Button>
                <Button typeName="button" type="warning">
                  {upload}
                </Button>
                <Button typeName="button" type="secondary">
                  {upload}
                </Button>
                <Button typeName="button" type="tertiary">
                  {upload}
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Button size="large" typeName="button">
                  {upload}
                </Button>
                <Button size="large" typeName="button" type="error">
                  {upload}
                </Button>
                <Button size="large" typeName="button" type="warning">
                  {upload}
                </Button>
                <Button size="large" typeName="button" type="secondary">
                  {upload}
                </Button>
                <Button size="large" typeName="button" type="tertiary">
                  {upload}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("all-types-and-sizes-in-comparison")} />
      </div>

      <div className={cardClass} data-demo-card="shapes">
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="shapes">
            <div className="flex flex-col items-start gap-4 md:flex-row">
              <Button aria-label={upload} shape="square" size="tiny" svgOnly typeName="button">
                {arrowUpIcon}
              </Button>
              <Button aria-label={upload} shape="square" size="small" svgOnly typeName="button">
                {arrowUpIcon}
              </Button>
              <Button aria-label={upload} shape="square" svgOnly typeName="button">
                {arrowUpIcon}
              </Button>
              <Button aria-label={upload} shape="square" size="large" svgOnly typeName="button">
                {arrowUpIcon}
              </Button>
              <Button aria-label={upload} shape="circle" size="tiny" svgOnly typeName="button">
                {arrowUpIcon}
              </Button>
              <Button aria-label={upload} shape="circle" size="small" svgOnly typeName="button">
                {arrowUpIcon}
              </Button>
              <Button aria-label={upload} shape="circle" svgOnly typeName="button">
                {arrowUpIcon}
              </Button>
              <Button aria-label={upload} shape="circle" size="large" svgOnly typeName="button">
                {arrowUpIcon}
              </Button>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("shapes")} />
      </div>

      <div className={cardClass} data-demo-card="prefix-and-suffix">
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="prefix-and-suffix">
            <div className="flex flex-col items-start gap-4 md:flex-row">
              <Button typeName="button" prefix={arrowLeftIcon}>
                {upload}
              </Button>
              <Button typeName="button" suffix={arrowRightIcon}>
                {upload}
              </Button>
              <Button typeName="button" prefix={arrowLeftIcon} suffix={arrowRightIcon}>
                {upload}
              </Button>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("prefix-and-suffix")} />
      </div>

      <div className={cardClass} data-demo-card="rounded">
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="rounded">
            <div className="flex flex-col items-start gap-4 md:flex-row">
              <Button shadow shape="rounded" size="small" type="secondary" typeName="button">
                {upload}
              </Button>
              <Button shadow shape="rounded" type="secondary" typeName="button">
                {upload}
              </Button>
              <Button shadow shape="rounded" size="large" type="secondary" typeName="button">
                {upload}
              </Button>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("rounded")} />
      </div>

      <div className={cardClass} data-demo-card="loading">
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="loading">
            <div className="flex flex-col items-start gap-4 md:flex-row">
              <Button size="small" typeName="button" loading>
                {upload}
              </Button>
              <Button typeName="button" loading>
                {upload}
              </Button>
              <Button size="large" typeName="button" loading>
                {upload}
              </Button>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("loading")} />
      </div>

      <div className={cardClass} data-demo-card="disabled">
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="disabled">
            <div className="flex flex-col items-start gap-4 md:flex-row">
              <Button size="small" typeName="button" disabled>
                {upload}
              </Button>
              <Button typeName="button" disabled>
                {upload}
              </Button>
              <Button size="large" typeName="button" disabled>
                {upload}
              </Button>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("disabled")} />
      </div>

      <div className={cardClass} data-demo-card="disabled-variants">
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="disabled-variants">
            <div className="flex flex-col items-start gap-4 md:flex-row">
              <Button typeName="button" disabled>
                {defaultLabel}
              </Button>
              <Button typeName="button" type="secondary" disabled>
                {secondaryLabel}
              </Button>
              <Button typeName="button" type="tertiary" disabled>
                {tertiaryLabel}
              </Button>
              <Button typeName="button" type="error" disabled>
                {errorLabel}
              </Button>
              <Button typeName="button" type="warning" disabled>
                {warningLabel}
              </Button>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("disabled-variants")} />
      </div>

      <div className={cardClass} data-demo-card="link">
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="link">
            <div className="flex flex-col items-start gap-4 md:flex-row">
              <ButtonLink className="w-fit" href="#">
                {demoText(language, "Sign Up")}
              </ButtonLink>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("link")} />
      </div>

      <div className={cardClass} data-demo-card="custom">
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="custom">
            <div className="flex flex-col items-start gap-4 md:flex-row">
              <CustomButton
                active={{
                  foreground: "#fff",
                  background: "var(--blue-700)",
                  border: "var(--blue-700)",
                }}
                hover={{
                  foreground: "#fff",
                  background: "#0B7BFE",
                  border: "var(--blue-700)",
                }}
                normal={{
                  foreground: "#fff",
                  background: "var(--blue-700)",
                  border: "var(--blue-700)",
                }}
                width={160}
              >
                {demoText(language, "Upgrade to Pro")}
              </CustomButton>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("custom")} />
      </div>
    </>
  );
}

function CheckboxDemo() {
  const demoCode = (id: string) => DEMO_CODE.checkbox?.[id] ?? "";
  const { language } = useLanguage();
  return (
    <>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <label className="text-checkbox-label inline-flex cursor-pointer items-start">
              <Checkbox aria-label={demoText(language, "Option 1")} />
              <span className="ml-2 text-foreground">{demoText(language, "Option 1")}</span>
            </label>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("default")} />
      </div>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="disabled"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="disabled">
            <div className="flex flex-col items-stretch justify-start gap-4">
              <label className="text-checkbox-label inline-flex cursor-not-allowed items-start text-disabled-foreground">
                <Checkbox disabled aria-label={demoText(language, "Disabled")} />
                <span className="ml-2">{demoText(language, "Disabled")}</span>
              </label>
              <label className="text-checkbox-label inline-flex cursor-not-allowed items-start text-disabled-foreground">
                <Checkbox
                  checked
                  readOnly
                  disabled
                  aria-label={demoText(language, "Disabled Checked")}
                />
                <span className="ml-2">{demoText(language, "Disabled Checked")}</span>
              </label>
              <label className="text-checkbox-label inline-flex cursor-not-allowed items-start text-disabled-foreground">
                <Checkbox
                  indeterminate
                  disabled
                  aria-label={demoText(language, "Disabled Indeterminate")}
                />
                <span className="ml-2">{demoText(language, "Disabled Indeterminate")}</span>
              </label>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("disabled")} />
      </div>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="indeterminate"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="indeterminate">
            <label className="text-checkbox-label inline-flex cursor-pointer items-start">
              <Checkbox indeterminate aria-label={demoText(language, "Option 1")} />
              <span className="ml-2 text-foreground">{demoText(language, "Option 1")}</span>
            </label>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("indeterminate")} />
      </div>
    </>
  );
}

function MenuDemo() {
  const demoCode = (id: string) => DEMO_CODE.menu?.[id] ?? "";
  const Card = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card={id}
    >
      <div className="w-full p-6" data-demo-container={id}>
        {children}
      </div>
      <ShowCodeFooter code={demoCode(id)} />
    </div>
  );
  return (
    <>
      <Card id="Default">
        <MenuContainer>
          <MenuButton>Actions</MenuButton>
          <Menu width={200}>
            <MenuItem onClick={() => undefined}>One</MenuItem>
            <MenuItem onClick={() => undefined}>Two</MenuItem>
            <MenuItem onClick={() => undefined}>Three</MenuItem>
            <MenuItem href="https://vercel.com">Test for Link</MenuItem>
            <MenuItem onClick={() => undefined} type="error">
              Delete
            </MenuItem>
          </Menu>
        </MenuContainer>
      </Card>

      <Card id="With chevron">
        <MenuContainer>
          <MenuButton showChevron variant="secondary">
            Actions
          </MenuButton>
          <Menu width={200}>
            <MenuItem onClick={() => undefined}>One</MenuItem>
            <MenuItem onClick={() => undefined}>Two</MenuItem>
            <MenuItem onClick={() => undefined}>Three</MenuItem>
            <MenuItem href="https://vercel.com">Test for Link</MenuItem>
            <MenuItem onClick={() => undefined} type="error">
              Delete
            </MenuItem>
          </Menu>
        </MenuContainer>
      </Card>

      <Card id="Disabled items">
        <MenuContainer>
          <MenuButton>Actions</MenuButton>
          <Menu width={200}>
            <MenuItem onClick={() => undefined}>One</MenuItem>
            <MenuItem onClick={() => undefined}>Two</MenuItem>
            <MenuItem disabled onClick={() => undefined}>
              Three
            </MenuItem>
            <MenuItem onClick={() => undefined} type="error">
              Delete
            </MenuItem>
          </Menu>
        </MenuContainer>
      </Card>

      <Card id="Locked items">
        <MenuContainer>
          <MenuButton>Actions</MenuButton>
          <Menu width={200}>
            <MenuItem onClick={() => undefined}>View Details</MenuItem>
            <MenuItem onClick={() => undefined}>Edit</MenuItem>
            <Tooltip className="w-full flex" text="You do not have the permissions to delete.">
              <MenuItemLocked onClick={() => undefined}>Delete</MenuItemLocked>
            </Tooltip>
          </Menu>
        </MenuContainer>
      </Card>

      <Card id="Link items">
        <MenuContainer>
          <MenuButton>Links</MenuButton>
          <Menu width={200}>
            <MenuLink href="/design/menu#custom-trigger">One</MenuLink>
            <MenuLink href="#">Two</MenuLink>
            <MenuLink href="#">Three</MenuLink>
          </Menu>
        </MenuContainer>
      </Card>

      <Card id="Custom trigger">
        <MenuContainer>
          <MenuButton variant="unstyled">
            <Avatar size={30} username="evilrabbit" />
          </MenuButton>
          <Menu width={200}>
            <MenuItem>One</MenuItem>
            <MenuItem>Two</MenuItem>
            <MenuItem>Three</MenuItem>
          </Menu>
        </MenuContainer>
      </Card>

      <Card id="Prefix and suffix">
        <div className="flex flex-row items-stretch justify-start gap-6 flex-initial">
          <MenuContainer>
            <MenuButton aria-label="Menu" shape="square" size="small" svgOnly variant="secondary">
              <MoreHorizontal />
            </MenuButton>
            <Menu>
              <MenuItem prefix={<Accessibility />}>Left</MenuItem>
              <MenuItem prefix={<Accessibility />}>Center</MenuItem>
              <MenuItem prefix={<Accessibility />}>Right</MenuItem>
            </Menu>
          </MenuContainer>
          <MenuContainer>
            <MenuButton aria-label="Menu" shape="square" size="small" svgOnly variant="secondary">
              <MoreHorizontal />
            </MenuButton>
            <Menu>
              <MenuItem suffix={<Accessibility />}>Left</MenuItem>
              <MenuItem suffix={<Accessibility />}>Center</MenuItem>
              <MenuItem suffix={<Accessibility />}>Right</MenuItem>
            </Menu>
          </MenuContainer>
        </div>
      </Card>

      <Card id="Menu position">
        <MenuContainer position="left-start">
          <MenuButton>Left Start</MenuButton>
          <Menu width={200}>
            <MenuItem>One</MenuItem>
            <MenuItem>Two</MenuItem>
          </Menu>
        </MenuContainer>
      </Card>

      <Card id="With section">
        <MenuContainer>
          <MenuButton>Actions</MenuButton>
          <Menu width={200}>
            <MenuSection title="Section">
              <MenuItem onClick={() => undefined}>One</MenuItem>
              <MenuItem onClick={() => undefined}>Two</MenuItem>
            </MenuSection>
            <MenuItem onClick={() => undefined}>Three</MenuItem>
            <MenuItemLocked onClick={() => undefined}>Locked</MenuItemLocked>
            <MenuDivider />
            <MenuItem onClick={() => undefined} type="error">
              Delete
            </MenuItem>
          </Menu>
        </MenuContainer>
      </Card>
    </>
  );
}

function InputDemo() {
  const demoCode = (id: string) => DEMO_CODE.input?.[id] ?? "";
  const { language } = useLanguage();

  const circularGlyph = (
    <svg
      viewBox="0 0 16 16"
      height={14}
      width={14}
      data-slot="geist-icon"
      data-glyph="circular"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.25 10.75v.75h1.5V6.56l1.47 1.47.53.53 1.06-1.06-.53-.53-2.75-2.75a.75.75 0 0 0-1.06 0L4.72 6.97l-.53.53 1.06 1.06.53-.53 1.47-1.47zM14.5 8a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16"
      />
    </svg>
  );

  return (
    <>
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row flex-initial">
              <Input size="small" placeholder={demoText(language, "Small")} />
              <Input placeholder={demoText(language, "Default")} />
              <Input size="large" placeholder={demoText(language, "Large")} />
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("default")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="prefix-and-suffix"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="prefix-and-suffix">
            <div className="flex flex-col items-start justify-start gap-6 flex-initial">
              <Input prefix={circularGlyph} placeholder={demoText(language, "Default")} />
              <Input suffix={circularGlyph} placeholder={demoText(language, "Default")} />
              <Input
                prefix={demoText(language, "https://")}
                suffix={demoText(language, ".com")}
                placeholder={demoText(language, "Default")}
              />
              <Input
                prefix={circularGlyph}
                suffix={circularGlyph}
                prefixStyling={false}
                suffixStyling={false}
                placeholder={demoText(language, "Default")}
              />
              <Input
                prefix={demoText(language, "vercel/")}
                suffix={circularGlyph}
                suffixStyling={false}
                placeholder={demoText(language, "Default")}
              />
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("prefix-and-suffix")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="disabled"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="disabled">
            <div className="flex flex-col items-start justify-start gap-4 flex-initial">
              <Input disabled placeholder={demoText(language, "Disabled with placeholder")} />
              <Input disabled defaultValue={demoText(language, "Disabled with value")} />
              <Input
                disabled
                prefix={circularGlyph}
                placeholder={demoText(language, "Disabled with prefix")}
              />
              <Input
                disabled
                suffix={circularGlyph}
                placeholder={demoText(language, "Disabled with suffix")}
              />
              <Input
                disabled
                prefix={demoText(language, "https://")}
                suffix={demoText(language, ".com")}
                placeholder={demoText(language, "Disabled with prefix and suffix")}
              />
              <Input
                disabled
                prefix={circularGlyph}
                suffix={circularGlyph}
                prefixStyling={false}
                suffixStyling={false}
                placeholder={demoText(language, "Disabled with prefix and suffix")}
              />
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("disabled")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="error"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="error">
            <div className="flex flex-col items-start justify-start gap-8 flex-initial">
              <Input
                size="small"
                error={demoText(language, "An error message.")}
                placeholder={demoText(language, "long-error@gmail.com")}
              />
              <Input
                error={demoText(language, "An error message.")}
                placeholder={demoText(language, "long-error@gmail.com")}
              />
              <Input
                size="large"
                error={demoText(language, "An error message.")}
                placeholder={demoText(language, "long-error@gmail.com")}
              />
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("error")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="label"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="label">
            <div className="flex flex-col items-start justify-start flex-initial">
              <Input
                label={demoText(language, "Label")}
                placeholder={demoText(language, "Label")}
              />
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("label")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="rounded-prefix-and-suffix"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="rounded-prefix-and-suffix">
            <Input
              rounded
              prefix={demoText(language, "www.")}
              suffix={demoText(language, ".com")}
              placeholder={demoText(language, "Label example")}
            />
          </div>
        </div>
        <ShowCodeFooter code={demoCode("rounded-prefix-and-suffix")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="rounded-prefix-and-suffix-without-styling"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div
            className="w-full p-6"
            data-demo-container="rounded-prefix-and-suffix-without-styling"
          >
            <Input
              rounded
              prefix={demoText(language, "www.")}
              suffix={demoText(language, ".com")}
              prefixStyling={false}
              suffixStyling={false}
              placeholder={demoText(language, "Label example")}
            />
          </div>
        </div>
        <ShowCodeFooter code={demoCode("rounded-prefix-and-suffix-without-styling")} />
      </div>
    </>
  );
}

function ModalDemo() {
  const demoCode = (id: string) => DEMO_CODE.modal?.[id] ?? "";
  const { language } = useLanguage();
  const [openDefault, setOpenDefault] = React.useState(false);
  const [openSticky, setOpenSticky] = React.useState(false);
  const [openSingleButton, setOpenSingleButton] = React.useState(false);
  const [openInset, setOpenInset] = React.useState(false);
  const [openDisabledActions, setOpenDisabledActions] = React.useState(false);
  const [openControlFocus, setOpenControlFocus] = React.useState(false);
  const [openFocusInput, setOpenFocusInput] = React.useState(false);
  const [openMobileInputs, setOpenMobileInputs] = React.useState(false);
  const [openComboboxFocus, setOpenComboboxFocus] = React.useState(false);
  const [openToastsFocus, setOpenToastsFocus] = React.useState(false);
  const [memberName, setMemberName] = React.useState("");
  const [memberEmail, setMemberEmail] = React.useState("");
  const [region, setRegion] = React.useState<string | null>(null);
  const submitFocusRef = React.useRef<HTMLButtonElement>(null);
  const inputFocusRef = React.useRef<HTMLInputElement>(null);
  const toasts = useToasts();

  const modalFooter = (
    <footer className="sticky bottom-0 -mx-5 flex shrink-0 justify-between bg-background-200 p-3">
      <Button size="small" typeName="button" type="secondary">
        {demoText(language, "Cancel")}
      </Button>
      <Button size="small" typeName="button" type="default">
        {demoText(language, "Submit")}
      </Button>
    </footer>
  );

  const triggerButton = (onOpenChange: (open: boolean) => void) => (
    <ModalTrigger asChild>
      <Button
        size="small"
        typeName="button"
        type="default"
        className="relative flex max-w-full whitespace-normal leading-[21px]"
        onClick={() => onOpenChange(true)}
      >
        {demoText(language, "Open Modal")}
      </Button>
    </ModalTrigger>
  );

  return (
    <div className="w-full max-w-[862px] space-y-6">
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <Modal open={openDefault} onOpenChange={setOpenDefault}>
              {triggerButton(setOpenDefault)}
              <ModalContent>
                <header className="mb-5">
                  <h3 className="text-heading-20 text-foreground">
                    {demoText(language, "Create Token")}
                  </h3>
                  <div className="mt-2 mb-1 text-copy-14 text-muted-foreground">
                    {demoText(
                      language,
                      "Enter a unique name for your token to differentiate it from other tokens and then select the scope.",
                    )}
                  </div>
                </header>
                <p className="text-copy-14">
                  {demoText(language, "Some content contained within the modal.")}
                </p>
                <div className="h-px w-full" aria-hidden />
                {modalFooter}
              </ModalContent>
            </Modal>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("default")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="sticky"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="sticky">
            <Modal open={openSticky} onOpenChange={setOpenSticky}>
              {triggerButton(setOpenSticky)}
              <ModalContent className="sticky" bodyClassName="pt-0">
                <header className="sticky top-0 z-10 -mx-5 mb-5 flex items-center gap-2.5 bg-background-200 px-5 py-5">
                  <h3 className="text-heading-20 leading-6 text-foreground">
                    {demoText(language, "Create Token")}
                  </h3>
                </header>
                {Array.from({ length: 52 }).map((_, index) => (
                  <p key={index} className="text-copy-14">
                    {demoText(language, "Some content contained within the modal.")}
                  </p>
                ))}
                <div className="h-px w-full" aria-hidden />
                <footer className="sticky bottom-0 -mx-5 flex shrink-0 justify-between bg-background-200 p-3">
                  <Button size="small" typeName="button" type="secondary">
                    {demoText(language, "Cancel")}
                  </Button>
                  <Button
                    size="small"
                    typeName="button"
                    type="secondary"
                    prefix={<ChevronLeft className="size-3.5" aria-hidden />}
                  >
                    {demoText(language, "Previous")}
                  </Button>
                  <Button size="small" typeName="button" type="default">
                    {demoText(language, "Submit")}
                  </Button>
                </footer>
              </ModalContent>
            </Modal>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("sticky")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="single-button"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="single-button">
            <Modal open={openSingleButton} onOpenChange={setOpenSingleButton}>
              {triggerButton(setOpenSingleButton)}
              <ModalContent className="sticky" bodyClassName="pt-0">
                <header className="sticky top-0 z-10 -mx-5 mb-5 flex items-center gap-2.5 bg-background-200 px-5 py-5">
                  <h3 className="text-heading-20 leading-6 text-foreground">
                    {demoText(language, "Create Token")}
                  </h3>
                </header>
                <p className="text-copy-14">
                  {demoText(language, "Some content contained within the modal.")}
                </p>
                <div className="h-px w-full" aria-hidden />
                <footer className="sticky bottom-0 -mx-5 flex shrink-0 justify-between bg-background-200 p-3">
                  <Button size="small" typeName="button" type="secondary">
                    {demoText(language, "Cancel")}
                  </Button>
                </footer>
              </ModalContent>
            </Modal>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("single-button")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="inset"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="inset">
            <Modal open={openInset} onOpenChange={setOpenInset}>
              {triggerButton(setOpenInset)}
              <ModalContent>
                <header className="mb-5">
                  <h3 className="text-heading-20 text-foreground">{demoText(language, "Modal")}</h3>
                  <div className="mt-2 mb-1 text-copy-14 text-muted-foreground">
                    {demoText(language, "This is a modal.")}
                  </div>
                </header>
                <div className="mx-[-20px] border-y border-gray-400 bg-background-200 px-5 py-6">
                  <p className="text-copy-14">{demoText(language, "Content within the inset.")}</p>
                </div>
                <div className="pt-5">
                  <p className="text-copy-14">{demoText(language, "Content outside the inset.")}</p>
                </div>
                <div className="h-px w-full" aria-hidden />
                {modalFooter}
              </ModalContent>
            </Modal>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("inset")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="disabled-actions"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="disabled-actions">
            <Modal open={openDisabledActions} onOpenChange={setOpenDisabledActions}>
              {triggerButton(setOpenDisabledActions)}
              <ModalContent onInteractOutside={() => setOpenDisabledActions(false)}>
                <ModalHeader>
                  <ModalTitle>{demoText(language, "Modal")}</ModalTitle>
                  <ModalDescription>{demoText(language, "This is a modal.")}</ModalDescription>
                </ModalHeader>
                <p className="text-copy-14">
                  {demoText(language, "Some content contained within the modal.")}
                </p>
                <div className="h-px w-full" aria-hidden />
                <ModalFooter>
                  <Button
                    typeName="button"
                    type="secondary"
                    onClick={() => setOpenDisabledActions(false)}
                  >
                    {demoText(language, "Cancel")}
                  </Button>
                  <Button typeName="button" disabled onClick={() => setOpenDisabledActions(false)}>
                    {demoText(language, "Submit")}
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("disabled-actions")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="control-initial-focus"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="control-initial-focus">
            <Modal open={openControlFocus} onOpenChange={setOpenControlFocus}>
              {triggerButton(setOpenControlFocus)}
              <ModalContent
                onInteractOutside={() => setOpenControlFocus(false)}
                onOpenAutoFocus={(event) => {
                  event.preventDefault();
                  submitFocusRef.current?.focus();
                }}
              >
                <ModalHeader>
                  <ModalTitle>Initial Focus</ModalTitle>
                  <ModalDescription>
                    This Modal is set up to programmatically move the focus onto the Submit button,
                    making it possible to promptly continue with the Enter key.
                  </ModalDescription>
                </ModalHeader>
                <div className="h-px w-full" aria-hidden />
                <ModalFooter>
                  <Button
                    typeName="button"
                    type="secondary"
                    onClick={() => setOpenControlFocus(false)}
                  >
                    {demoText(language, "Cancel")}
                  </Button>
                  <Button
                    typeName="button"
                    ref={submitFocusRef}
                    onClick={() => setOpenControlFocus(false)}
                  >
                    {demoText(language, "Submit")}
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("control-initial-focus")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="focus-input-on-open"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="focus-input-on-open">
            <Modal open={openFocusInput} onOpenChange={setOpenFocusInput}>
              {triggerButton(setOpenFocusInput)}
              <ModalContent
                onInteractOutside={() => setOpenFocusInput(false)}
                onOpenAutoFocus={(event) => {
                  event.preventDefault();
                  inputFocusRef.current?.focus();
                }}
              >
                <ModalHeader>
                  <ModalTitle>Invite Member</ModalTitle>
                  <ModalDescription>
                    On both desktop and the mobile bottom sheet, the Name field receives focus when
                    the Modal opens so the user can start typing immediately.
                  </ModalDescription>
                </ModalHeader>
                <div className="flex flex-col gap-3">
                  <Input
                    label="Name"
                    onChange={(e) => setMemberName(e.target.value)}
                    placeholder="Jane Doe"
                    ref={inputFocusRef}
                    value={memberName}
                  />
                </div>
                <div className="h-px w-full" aria-hidden />
                <ModalFooter>
                  <Button
                    typeName="button"
                    type="secondary"
                    onClick={() => setOpenFocusInput(false)}
                  >
                    {demoText(language, "Cancel")}
                  </Button>
                  <Button typeName="button" onClick={() => setOpenFocusInput(false)}>
                    Send Invite
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("focus-input-on-open")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="mobile-sheet-inputs"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="mobile-sheet-inputs">
            <Modal open={openMobileInputs} onOpenChange={setOpenMobileInputs}>
              {triggerButton(setOpenMobileInputs)}
              <ModalContent onInteractOutside={() => setOpenMobileInputs(false)}>
                <ModalHeader>
                  <ModalTitle>Invite Member</ModalTitle>
                  <ModalDescription>
                    On a mobile viewport this opens as a bottom sheet. Verify that both inputs
                    receive focus and accept keyboard input.
                  </ModalDescription>
                </ModalHeader>
                <div className="flex flex-col gap-3">
                  <Input
                    label="Name"
                    onChange={(e) => setMemberName(e.target.value)}
                    placeholder="Jane Doe"
                    value={memberName}
                  />
                  <Input
                    label="Email"
                    onChange={(e) => setMemberEmail(e.target.value)}
                    placeholder="jane@example.com"
                    value={memberEmail}
                  />
                </div>
                <div className="h-px w-full" aria-hidden />
                <ModalFooter>
                  <Button
                    typeName="button"
                    type="secondary"
                    onClick={() => setOpenMobileInputs(false)}
                  >
                    {demoText(language, "Cancel")}
                  </Button>
                  <Button typeName="button" onClick={() => setOpenMobileInputs(false)}>
                    Send Invite
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("mobile-sheet-inputs")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="combobox-focus"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="combobox-focus">
            <Modal open={openComboboxFocus} onOpenChange={setOpenComboboxFocus}>
              {triggerButton(setOpenComboboxFocus)}
              <ModalContent onInteractOutside={() => setOpenComboboxFocus(false)}>
                <ModalHeader>
                  <ModalTitle>Create Database</ModalTitle>
                  <ModalDescription>
                    Choose a region for your database. Reads and writes will take place in this
                    region.
                  </ModalDescription>
                </ModalHeader>
                <div className="mx-[-20px] border-t border-gray-400 bg-background-200 px-5 py-6">
                  <Combobox
                    aria-label="Region"
                    label="Region"
                    onValueChange={setRegion}
                    placeholder="Search regions..."
                    size="small"
                    value={region}
                  >
                    <ComboboxInput />
                    <ComboboxList>
                      {[
                        { value: "iad1", label: "Washington, D.C., USA (East) – iad1" },
                        { value: "sfo1", label: "San Francisco, USA (West) – sfo1" },
                        { value: "lhr1", label: "London, UK (London) – lhr1" },
                        { value: "fra1", label: "Frankfurt, Germany (Central EU) – fra1" },
                        { value: "sin1", label: "Singapore (Southeast Asia) – sin1" },
                      ].map((option) => (
                        <ComboboxOption key={option.value} value={option.value}>
                          {option.label}
                        </ComboboxOption>
                      ))}
                    </ComboboxList>
                  </Combobox>
                </div>
                <div className="h-px w-full" aria-hidden />
                <ModalFooter>
                  <Button
                    typeName="button"
                    type="secondary"
                    onClick={() => setOpenComboboxFocus(false)}
                  >
                    {demoText(language, "Cancel")}
                  </Button>
                  <Button typeName="button" onClick={() => setOpenComboboxFocus(false)}>
                    Create Database
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("combobox-focus")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="toasts-focus-trap"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="toasts-focus-trap">
            <Modal open={openToastsFocus} onOpenChange={setOpenToastsFocus}>
              {triggerButton(setOpenToastsFocus)}
              <ModalContent onInteractOutside={() => setOpenToastsFocus(false)}>
                <ModalHeader>
                  <ModalTitle>Toasts and Focus Trap</ModalTitle>
                  <ModalDescription>
                    The Modal traps focus, so Tab stays within it. Toasts still render above the
                    Modal and remain interactive — trigger one, then click its action. The Modal
                    stays open and focus returns to it.
                  </ModalDescription>
                </ModalHeader>
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() =>
                      toasts.message({
                        text: "Project link copied",
                        action: "Undo",
                        onAction: () => toasts.message({ text: "Copy reverted" }),
                      })
                    }
                    size="small"
                    type="secondary"
                    typeName="button"
                  >
                    {demoText(language, "Show Toast")}
                  </Button>
                </div>
                <div className="h-px w-full" aria-hidden />
                <ModalFooter>
                  <Button typeName="button" onClick={() => setOpenToastsFocus(false)}>
                    Done
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("toasts-focus-trap")} />
      </div>
    </div>
  );
}

function SwitchDemo() {
  const demoCode = (id: string) => DEMO_CODE.switch?.[id] ?? "";
  const { language } = useLanguage();

  return (
    <>
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <div className="flex w-full max-w-md flex-col items-start">
              <Switch name="default">
                <SwitchControl defaultChecked label="Source" value="source" />
                <SwitchControl label="Output" value="output" />
              </Switch>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("default")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="disabled"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="disabled">
            <div className="flex w-full max-w-md flex-col items-start">
              <Switch name="view-mode">
                <SwitchControl defaultChecked disabled label="Source" value="source" />
                <SwitchControl disabled label="Output" value="output" />
              </Switch>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("disabled")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="sizes"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="sizes">
            <div className="flex w-full flex-col lg:flex-row lg:flex-wrap">
              <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
                <Switch name="sizes-small" size="small">
                  <SwitchControl defaultChecked label="Source" value="source" />
                  <SwitchControl label="Output" value="output" />
                </Switch>
              </div>
              <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
                <Switch name="sizes-default">
                  <SwitchControl defaultChecked label="Source" value="source" />
                  <SwitchControl label="Output" value="output" />
                </Switch>
              </div>
              <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
                <Switch name="sizes-large" size="large">
                  <SwitchControl defaultChecked label="Source" value="source" />
                  <SwitchControl label="Output" value="output" />
                </Switch>
              </div>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("sizes")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="full-width"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="full-width">
            <Switch name="full-width" style={{ width: "100%" }}>
              <SwitchControl defaultChecked label="Source" value="source" />
              <SwitchControl label="Output" value="output" />
            </Switch>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("full-width")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="tooltip"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="tooltip">
            <div className="flex w-full max-w-md flex-col items-start">
              <Switch name="view-mode-tooltip">
                <Tooltip text={demoText(language, "View Source")}>
                  <SwitchControl defaultChecked label="Source" size="large" value="source" />
                </Tooltip>
                <Tooltip text={demoText(language, "View Output")}>
                  <SwitchControl label="Output" size="large" value="output" />
                </Tooltip>
              </Switch>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("tooltip")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="icon"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="icon">
            <div className="flex w-full flex-col lg:flex-row lg:flex-wrap">
              <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
                <Switch name="icons-small" size="small">
                  <SwitchControl
                    defaultChecked
                    icon={<LayoutGrid aria-hidden />}
                    label="Source"
                    value="source"
                  />
                  <SwitchControl icon={<List aria-hidden />} label="Output" value="output" />
                </Switch>
              </div>
              <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
                <Switch name="icons-default">
                  <SwitchControl
                    defaultChecked
                    icon={<LayoutGrid aria-hidden />}
                    label="Source"
                    value="source"
                  />
                  <SwitchControl icon={<List aria-hidden />} label="Output" value="output" />
                </Switch>
              </div>
              <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
                <Switch name="icons-large" size="large">
                  <SwitchControl
                    defaultChecked
                    icon={<LayoutGrid aria-hidden />}
                    label="Source"
                    value="source"
                  />
                  <SwitchControl icon={<List aria-hidden />} label="Output" value="output" />
                </Switch>
              </div>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("icon")} />
      </div>
    </>
  );
}

function SelectDemo() {
  const demoCode = (id: string) => DEMO_CODE.select?.[id] ?? "";
  const { language } = useLanguage();

  const circularGlyph = (
    <svg
      viewBox="0 0 16 16"
      height={16}
      width={16}
      data-slot="geist-icon"
      data-glyph="circular"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.25 10.75v.75h1.5V6.56l1.47 1.47.53.53 1.06-1.06-.53-.53-2.75-2.75a.75.75 0 0 0-1.06 0L4.72 6.97l-.53.53 1.06 1.06.53-.53 1.47-1.47zM14.5 8a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16"
      />
    </svg>
  );

  const sizesRowClass =
    "flex relative min-w-px max-w-full flex-col sm:flex-row sm:flex-wrap flex-1";
  const sizesColClass = "flex relative min-w-px max-w-full flex-col items-start flex-1";

  return (
    <>
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="sizes"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="sizes">
            <div className={sizesRowClass}>
              <div className={sizesColClass}>
                <Select size="small" aria-label="Small" placeholder={demoText(language, "Small")}>
                  <SelectItem value="Option 1">{demoText(language, "Option 1")}</SelectItem>
                  <SelectItem value="Option 2">{demoText(language, "Option 2")}</SelectItem>
                  <SelectItem value="Option 3">{demoText(language, "Option 3")}</SelectItem>
                </Select>
              </div>
              <div className={sizesColClass}>
                <Select aria-label="Default" placeholder={demoText(language, "Default")}>
                  <SelectItem value="Option 1">{demoText(language, "Option 1")}</SelectItem>
                  <SelectItem value="Option 2">{demoText(language, "Option 2")}</SelectItem>
                  <SelectItem value="Option 3">{demoText(language, "Option 3")}</SelectItem>
                </Select>
              </div>
              <div className={sizesColClass}>
                <Select size="large" aria-label="Large" placeholder={demoText(language, "Large")}>
                  <SelectItem value="Option 1">{demoText(language, "Option 1")}</SelectItem>
                  <SelectItem value="Option 2">{demoText(language, "Option 2")}</SelectItem>
                  <SelectItem value="Option 3">{demoText(language, "Option 3")}</SelectItem>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("sizes")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="prefix-and-suffix"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="prefix-and-suffix">
            <div className={sizesRowClass}>
              <div className={sizesColClass}>
                <Select
                  size="small"
                  prefix={circularGlyph}
                  suffix={circularGlyph}
                  aria-label="Small"
                  placeholder={demoText(language, "Small")}
                />
              </div>
              <div className={sizesColClass}>
                <Select
                  prefix={circularGlyph}
                  suffix={circularGlyph}
                  aria-label="Default"
                  placeholder={demoText(language, "Default")}
                />
              </div>
              <div className={sizesColClass}>
                <Select
                  size="large"
                  prefix={circularGlyph}
                  suffix={circularGlyph}
                  aria-label="Large"
                  placeholder={demoText(language, "Large")}
                />
              </div>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("prefix-and-suffix")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="disabled"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="disabled">
            <Select
              disabled
              aria-label="Disabled"
              placeholder={demoText(language, "Disabled with placeholder")}
            />
          </div>
        </div>
        <ShowCodeFooter code={demoCode("disabled")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="error"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="error">
            <div className={sizesRowClass}>
              <div className={sizesColClass}>
                <Select
                  size="small"
                  error={demoText(language, "Please select a value.")}
                  aria-label="Small with error"
                  placeholder={demoText(language, "Small")}
                />
              </div>
              <div className={sizesColClass}>
                <Select
                  error={demoText(language, "Please select a value.")}
                  aria-label="Default with error"
                  placeholder={demoText(language, "Default")}
                />
              </div>
              <div className={sizesColClass}>
                <Select
                  size="large"
                  error={demoText(language, "Please select a value.")}
                  aria-label="Large with error"
                  placeholder={demoText(language, "Large")}
                />
              </div>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("error")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="label"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="label">
            <Select
              label={demoText(language, "My label")}
              placeholder={demoText(language, "With label")}
            />
          </div>
        </div>
        <ShowCodeFooter code={demoCode("label")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="with-options"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="with-options">
            <div className="flex flex-col items-start gap-4 md:flex-row">
              <div>
                <Select aria-label="Fruit" placeholder={demoText(language, "Select a fruit")}>
                  <SelectItem value="Apple">{demoText(language, "Apple")}</SelectItem>
                  <SelectItem value="Orange">{demoText(language, "Orange")}</SelectItem>
                  <SelectItem value="Banana">{demoText(language, "Banana")}</SelectItem>
                  <SelectItem value="Grape">{demoText(language, "Grape")}</SelectItem>
                </Select>
              </div>
              <div>
                <Select
                  aria-label="Fruit with default value"
                  defaultValue="Banana"
                  placeholder={demoText(language, "With default value")}
                >
                  <SelectItem value="Apple">{demoText(language, "Apple")}</SelectItem>
                  <SelectItem value="Orange">{demoText(language, "Orange")}</SelectItem>
                  <SelectItem value="Banana">{demoText(language, "Banana")}</SelectItem>
                  <SelectItem value="Grape">{demoText(language, "Grape")}</SelectItem>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("with-options")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="required"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="required">
            <Select
              required
              label={demoText(language, "Required field")}
              placeholder={demoText(language, "Please select an option")}
            >
              <SelectItem value="Option 1">{demoText(language, "Option 1")}</SelectItem>
              <SelectItem value="Option 2">{demoText(language, "Option 2")}</SelectItem>
              <SelectItem value="Option 3">{demoText(language, "Option 3")}</SelectItem>
            </Select>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("required")} />
      </div>
    </>
  );
}

function SeparatorDemo() {
  const demoCode = (id: string) => DEMO_CODE.separator?.[id] ?? "";
  const { language } = useLanguage();

  return (
    <>
      <div
        className="relative mt-6 w-full rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="horizontal"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="horizontal">
            <div className="space-y-4">
              <div>
                <h3 className="text-label-16">{demoText(language, "Section 1")}</h3>
                <p className="text-copy-14 text-gray-900">
                  {demoText(language, "This is the first section of content.")}
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="text-label-16">{demoText(language, "Section 2")}</h3>
                <p className="text-copy-14 text-gray-900">
                  {demoText(language, "This is the second section of content.")}
                </p>
              </div>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("horizontal")} />
      </div>

      <div
        className="relative mt-6 w-full rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="vertical"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="vertical">
            <div className="flex h-8 items-center space-x-4">
              <p className="text-copy-14 text-gray-1000">{demoText(language, "Home")}</p>
              <Separator orientation="vertical" />
              <p className="text-copy-14 text-gray-1000">{demoText(language, "About")}</p>
              <Separator orientation="vertical" />
              <p className="text-copy-14 text-gray-1000">{demoText(language, "Services")}</p>
              <Separator orientation="vertical" />
              <p className="text-copy-14 text-gray-1000">{demoText(language, "Contact")}</p>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("vertical")} />
      </div>

      <div
        className="relative mt-6 w-full rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="orientation-variants"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="orientation-variants">
            <div className="space-y-8">
              <div>
                <h4 className="mb-2 text-label-14">
                  {demoText(language, "Horizontal Separators")}
                </h4>
                <div className="space-y-2">
                  <p className="text-copy-14">{demoText(language, "Content above separator")}</p>
                  <Separator />
                  <p className="text-copy-14">{demoText(language, "Content below separator")}</p>
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-label-14">{demoText(language, "Vertical Separators")}</h4>
                <div className="flex h-6 items-center space-x-2">
                  <span className="text-copy-14">{demoText(language, "Left")}</span>
                  <Separator orientation="vertical" />
                  <span className="text-copy-14">{demoText(language, "Center")}</span>
                  <Separator orientation="vertical" />
                  <span className="text-copy-14">{demoText(language, "Right")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("orientation-variants")} />
      </div>
    </>
  );
}

function SkeletonDemo() {
  const demoCode = (id: string) => DEMO_CODE.skeleton?.[id] ?? "";
  const Card = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card={id}
    >
      <div className="w-full p-6" data-demo-container={id}>
        {children}
      </div>
      <ShowCodeFooter code={demoCode(id)} />
    </div>
  );
  return (
    <>
      <Card id="Default with set width">
        <Skeleton width={160} />
      </Card>
      <Card id="Default with box height">
        <Skeleton boxHeight={42} width={160} />
      </Card>
      <Card id="Wrapping children">
        <div className="flex flex-col items-start justify-start gap-4 flex-initial">
          <Skeleton>
            <Button>Hidden by skeleton</Button>
          </Skeleton>
          <Skeleton show={false}>
            <Button>Not hidden by skeleton</Button>
          </Skeleton>
        </div>
      </Card>
      <Card id="Wrapping children with fixed size">
        <div className="flex flex-col items-start justify-start gap-4 flex-initial">
          <Skeleton height={100} width="100%">
            {null}
          </Skeleton>
          <Skeleton height={100} width="100%">
            <Button>Not hidden by Skeleton</Button>
          </Skeleton>
        </div>
      </Card>
      <Card id="Pill">
        <Skeleton pill width={48} />
      </Card>
      <Card id="Rounded">
        <Skeleton boxHeight={48} height={48} rounded width={48} />
      </Card>
      <Card id="Squared">
        <Skeleton boxHeight={48} height={48} squared width={48} />
      </Card>
      <Card id="No animation">
        <Skeleton animated={false} height={100} width="100%">
          {null}
        </Skeleton>
      </Card>
      <Card id="Button">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-label-14">Without button prop (default):</p>
            <Skeleton height={32} width={120}>
              <Button>Loading...</Button>
            </Skeleton>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-label-14">With button prop (extends animation by 1px):</p>
            <Skeleton button height={32} width={120}>
              <Button>Loading...</Button>
            </Skeleton>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-label-14">Multiple buttons loading:</p>
            <div className="flex gap-3">
              <Skeleton button>
                <Button>Save</Button>
              </Skeleton>
              <Skeleton button>
                <Button type="secondary">Cancel</Button>
              </Skeleton>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
function SpinnerDemo() {
  const sizes = [
    { size: "sm", label: "sm" },
    { size: "md", label: "md" },
    { size: "lg", label: "lg" },
    { size: "xl", label: "xl" },
    { size: "2xl", label: "2xl" },
    { size: "3xl", label: "3xl" },
    { size: "4xl", label: "4xl" },
  ] as const;
  return (
    <div className="flex flex-wrap items-end gap-6">
      {sizes.map((s) => (
        <div key={s.size} className="flex flex-col items-center gap-2">
          <Spinner size={s.size} />
          <span className="text-label-12 text-muted-foreground">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function StepPointDemo() {
  const demoCode = (id: string) => DEMO_CODE["step-point"]?.[id] ?? "";
  return (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card="Default"
    >
      <div className="w-full p-6" data-demo-container="Default">
        <ul className="w-full max-w-xs">
          <StepPoint status="done">Submitted</StepPoint>
          <StepPoint status="active">Under review</StepPoint>
          <StepPoint status="idle">Approved</StepPoint>
        </ul>
      </div>
      <ShowCodeFooter code={demoCode("Default")} />
    </div>
  );
}

function TableDemo() {
  const demoCode = (id: string) => DEMO_CODE["table"]?.[id] ?? "";
  const basicData = [
    { c1: "Value 1.1", c2: "Value 1.2", c3: "Value 1.3" },
    { c1: "Value 2.1", c2: "Value 2.2", c3: "Value 2.3" },
    { c1: "Value 3.1", c2: "Value 3.2", c3: "Value 3.3" },
  ];
  return (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card="Default"
    >
      <div className="w-full p-6" data-demo-container="Default">
        <TableRoot>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Col 1</TableHead>
                <TableHead>Col 2</TableHead>
                <TableHead>Col 3</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {basicData.map((row) => (
                <TableRow key={row.c1}>
                  <TableCell>{row.c1}</TableCell>
                  <TableCell>{row.c2}</TableCell>
                  <TableCell>{row.c3}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableRoot>
      </div>
      <ShowCodeFooter code={demoCode("Default")} />
    </div>
  );
}

function TabsDemo() {
  const demoCode = (id: string) => DEMO_CODE.tabs?.[id] ?? "";
  const [tab, setTab] = React.useState("overview");

  return (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card="Default"
    >
      <div className="w-full p-6" data-demo-container="Default">
        <div className="w-full max-w-xl">
          <Tabs
            tabs={[
              { value: "overview", title: "Overview" },
              { value: "usage", title: "Usage" },
              { value: "api", title: "API" },
            ]}
            selected={tab}
            setSelected={setTab}
            ariaLabel="Component documentation"
          />
          <div className="pt-4 text-copy-14 text-muted-foreground">
            {tab === "overview"
              ? "Building blocks for consistent web experiences."
              : tab === "usage"
                ? "Import Tabs and control the selected value from the parent."
                : "Use the tabs, selected, and setSelected props."}
          </div>
        </div>
      </div>
      <ShowCodeFooter code={demoCode("Default")} />
    </div>
  );
}

function TextareaDemo() {
  const demoCode = (id: string) => DEMO_CODE.textarea?.[id] ?? "";
  const { language } = useLanguage();

  const lorem = demoText(
    language,
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );

  return (
    <>
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <label>
              <Textarea aria-label={demoText(language, "Default")} />
            </label>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("default")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="disabled"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="disabled">
            <label>
              <Textarea disabled aria-label={demoText(language, "Disabled")} />
            </label>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("disabled")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="error"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="error">
            <div className="flex flex-col items-stretch justify-start gap-8 flex-initial">
              <label>
                <Textarea
                  size="small"
                  aria-label={demoText(language, "With error (small)")}
                  error={demoText(language, "There has been an error.")}
                  defaultValue={lorem}
                />
              </label>
              <label>
                <Textarea
                  aria-label={demoText(language, "With error (medium)")}
                  error={demoText(language, "There has been an error.")}
                  defaultValue={lorem}
                />
              </label>
              <label>
                <Textarea
                  size="large"
                  aria-label={demoText(language, "With error (large)")}
                  error={demoText(language, "There has been an error.")}
                  defaultValue={lorem}
                />
              </label>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("error")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="sizes"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="sizes">
            <div className="flex flex-col gap-6">
              <label>
                <Textarea aria-label={demoText(language, "Textarea")} defaultValue={lorem} />
              </label>
              <label>
                <Textarea aria-label={demoText(language, "Textarea")} defaultValue={lorem} />
              </label>
              <label>
                <Textarea
                  size="large"
                  aria-label={demoText(language, "Textarea")}
                  defaultValue={lorem}
                />
              </label>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("sizes")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="read-only"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="read-only">
            <label>
              <Textarea
                readOnly
                aria-label={demoText(language, "Read only")}
                defaultValue={lorem}
              />
            </label>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("read-only")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="rows"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="rows">
            <label>
              <Textarea rows={5} aria-label={demoText(language, "Textarea with fixed rows")} />
            </label>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("rows")} />
      </div>
    </>
  );
}

function ToggleDemo() {
  const demoCode = (id: string) => DEMO_CODE.toggle?.[id] ?? "";
  const { language } = useLanguage();
  const [defaultOff, setDefaultOff] = React.useState(false);
  const [defaultOn, setDefaultOn] = React.useState(true);
  const [customChecked, setCustomChecked] = React.useState(false);
  const [labelChecked, setLabelChecked] = React.useState(false);

  const lockIcon = {
    checked: <Lock className="size-2" aria-hidden />,
    unchecked: <LockOpen className="size-2" aria-hidden />,
  };

  return (
    <>
      <div
        className="relative mt-6 w-full rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <div className="flex flex-col">
              <div>
                <Toggle
                  aria-label={demoText(language, "Enable Firewall")}
                  checked={defaultOff}
                  onChange={() => setDefaultOff(!defaultOff)}
                />
              </div>
              <div>
                <Toggle
                  aria-label={demoText(language, "Enable Firewall")}
                  checked={defaultOn}
                  onChange={() => setDefaultOn(!defaultOn)}
                />
              </div>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("default")} />
      </div>

      <div
        className="relative mt-6 w-full rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="disabled"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="disabled">
            <div className="flex flex-col">
              <div>
                <Toggle
                  aria-label={demoText(language, "Enable Firewall")}
                  checked={false}
                  readOnly
                  disabled
                />
              </div>
              <div>
                <Toggle
                  aria-label={demoText(language, "Enable Firewall")}
                  checked
                  readOnly
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("disabled")} />
      </div>

      <div
        className="relative mt-6 w-full rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="sizes"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="sizes">
            <div className="flex flex-row flex-wrap">
              <div className="flex-1">
                <Toggle
                  aria-label={demoText(language, "Enable Firewall")}
                  checked={false}
                  readOnly
                />
              </div>
              <div className="flex-1">
                <Toggle
                  aria-label={demoText(language, "Enable Firewall")}
                  checked={false}
                  readOnly
                  size="medium"
                />
              </div>
              <div className="flex-1">
                <Toggle
                  aria-label={demoText(language, "Enable Firewall")}
                  checked={false}
                  readOnly
                  size="large"
                />
              </div>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("sizes")} />
      </div>

      <div
        className="relative mt-6 w-full rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="custom-color"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="custom-color">
            <div className="flex flex-col">
              <div>
                <Toggle
                  aria-label={demoText(language, "Enable Firewall")}
                  checked={customChecked}
                  color="amber"
                  icon={lockIcon}
                  onChange={() => setCustomChecked(!customChecked)}
                />
              </div>
              <div>
                <Toggle
                  aria-label={demoText(language, "Enable Firewall")}
                  checked={customChecked}
                  color="red"
                  icon={lockIcon}
                  onChange={() => setCustomChecked(!customChecked)}
                />
              </div>
              <div>
                <Toggle
                  aria-label={demoText(language, "Enable Firewall")}
                  checked={customChecked}
                  color="amber"
                  icon={lockIcon}
                  size="large"
                  onChange={() => setCustomChecked(!customChecked)}
                />
              </div>
              <div>
                <Toggle
                  aria-label={demoText(language, "Enable Firewall")}
                  checked={customChecked}
                  color="red"
                  icon={lockIcon}
                  size="large"
                  onChange={() => setCustomChecked(!customChecked)}
                />
              </div>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("custom-color")} />
      </div>

      <div
        className="relative mt-6 w-full rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="with-label"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="with-label">
            <div className="flex flex-col items-start justify-start gap-4">
              <div className="flex flex-row items-stretch justify-start gap-4">
                <Toggle checked={labelChecked} onChange={() => setLabelChecked(!labelChecked)}>
                  {demoText(language, "Enable Firewall")}
                </Toggle>
                <Toggle
                  checked={labelChecked}
                  direction="rtl"
                  onChange={() => setLabelChecked(!labelChecked)}
                >
                  {demoText(language, "Enable Firewall")}
                </Toggle>
              </div>
              <div className="flex flex-row items-stretch justify-start gap-4">
                <Toggle
                  checked={labelChecked}
                  size="large"
                  onChange={() => setLabelChecked(!labelChecked)}
                >
                  {demoText(language, "Enable Firewall")}
                </Toggle>
                <Toggle
                  checked={labelChecked}
                  direction="rtl"
                  size="large"
                  onChange={() => setLabelChecked(!labelChecked)}
                >
                  {demoText(language, "Enable Firewall")}
                </Toggle>
              </div>
              <div className="flex flex-row items-stretch justify-start gap-4">
                <Toggle
                  checked={labelChecked}
                  icon={lockIcon}
                  onChange={() => setLabelChecked(!labelChecked)}
                >
                  {demoText(language, "Enable Firewall")}
                </Toggle>
                <Toggle
                  checked={labelChecked}
                  direction="rtl"
                  icon={lockIcon}
                  onChange={() => setLabelChecked(!labelChecked)}
                >
                  {demoText(language, "Enable Firewall")}
                </Toggle>
              </div>
              <div className="flex flex-row items-stretch justify-start gap-4">
                <Toggle
                  checked={labelChecked}
                  icon={lockIcon}
                  size="large"
                  onChange={() => setLabelChecked(!labelChecked)}
                >
                  {demoText(language, "Enable Firewall")}
                </Toggle>
                <Toggle
                  checked={labelChecked}
                  direction="rtl"
                  icon={lockIcon}
                  size="large"
                  onChange={() => setLabelChecked(!labelChecked)}
                >
                  {demoText(language, "Enable Firewall")}
                </Toggle>
              </div>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("with-label")} />
      </div>
    </>
  );
}

function TooltipDemo() {
  return (
    <Tooltip text="The Evil Rabbit Jumped over the Fence">
      <Button typeName="button" type="tertiary">
        Hover me
      </Button>
    </Tooltip>
  );
}

function ThemeSwitcherDemo() {
  const demoCode = (id: string) => DEMO_CODE["theme-switcher"]?.[id] ?? "";
  const Card = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card={id}
    >
      <div className="w-full p-6" data-demo-container={id}>
        {children}
      </div>
      <ShowCodeFooter code={demoCode(id)} />
    </div>
  );
  return (
    <>
      <Card id="Default">
        <ThemeSwitcher />
      </Card>
      <Card id="Small">
        <ThemeSwitcher small />
      </Card>
      <Card id="Disabled">
        <ThemeSwitcher disabled />
      </Card>
    </>
  );
}

/** Progress 动态更新演示：Progress 为受控组件，外部更新 value 即驱动进度条（动态更新 API） */
function ProgressDynamicDemo() {
  const { language } = useLanguage();
  const [value, setValue] = React.useState(40);
  const [animated, setAnimated] = React.useState(true);
  return (
    <div className="flex w-full max-w-md flex-col items-start gap-6">
      <Progress
        value={value}
        label={demoTextWithValues(language, "{value}%", { value })}
        labelPosition="right"
        animated={animated}
        aria-label={demoTextWithValues(language, "Dynamic progress {value}%", { value })}
      />
      <div className="flex gap-2">
        <Button type="default" size="small" onClick={() => setValue((v) => Math.min(100, v + 10))}>
          {demoText(language, "Increase")}
        </Button>
        <Button type="secondary" size="small" onClick={() => setValue((v) => Math.max(0, v - 10))}>
          {demoText(language, "Decrease")}
        </Button>
      </div>
      <label className="flex items-center gap-2">
        <Toggle
          checked={animated}
          onChange={() => setAnimated((v) => !v)}
          size="small"
          aria-label={demoText(language, "Animated transition")}
        />
        <span className="text-label-13 text-muted-foreground">
          {demoText(language, "Animated transition")}
        </span>
      </label>
    </div>
  );
}

/** Progress Dynamic colors 交互演示：value 从 0 起步（对照官方 demo 双按钮），跨阈值时填充色实时切换 */
function ProgressDynamicColorsDemo() {
  const { language } = useLanguage();
  const [value, setValue] = React.useState(0);
  return (
    <div className="flex w-full max-w-md flex-col items-start gap-6">
      <Progress
        value={value}
        label={demoTextWithValues(language, "{value}%", { value })}
        labelPosition="right"
        aria-label={demoTextWithValues(language, "Dynamic colors progress {value}%", { value })}
        colors={{
          0: "var(--color-gray-1000)",
          25: "var(--color-destructive)",
          50: "var(--color-warning)",
          75: "#ff0080", /* 官方 --geist-highlight-pink 实测原值（本地 pink 色阶无精确对应，pink-800 #d9216e 色距 53.5） */
          100: "var(--color-progress)",
        }}
      />
      <div className="flex gap-2">
        <Button type="default" size="small" onClick={() => setValue((v) => Math.min(100, v + 10))}>
          {demoText(language, "Increase")}
        </Button>
        <Button type="secondary" size="small" onClick={() => setValue((v) => Math.max(0, v - 10))}>
          {demoText(language, "Decrease")}
        </Button>
      </div>
    </div>
  );
}

function ProgressDemo() {
  const { language } = useLanguage();
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <Progress
          value={30}
          aria-label={demoTextWithValues(language, "Progress {value}%", { value: 30 })}
        />
        <span className="text-copy-13 text-muted-foreground">30%</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <Progress
          value={60}
          aria-label={demoTextWithValues(language, "Progress {value}%", { value: 60 })}
        />
        <span className="text-copy-13 text-muted-foreground">60%</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <Progress
          value={90}
          aria-label={demoTextWithValues(language, "Progress {value}%", { value: 90 })}
        />
        <span className="text-copy-13 text-muted-foreground">90%</span>
      </div>
    </div>
  );
}

function StatusDotDemo() {
  const demoCode = (id: string) => DEMO_CODE["status-dot"]?.[id] ?? "";
  const Card = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card={id}
    >
      <div className="w-full p-6" data-demo-container={id}>
        {children}
      </div>
      <ShowCodeFooter code={demoCode(id)} />
    </div>
  );
  return (
    <>
      <Card id="Default">
        <div className="flex flex-col items-stretch justify-start gap-6 flex-initial">
          <StatusDot state="QUEUED" />
          <StatusDot state="BUILDING" />
          <StatusDot state="ERROR" />
          <StatusDot state="READY" />
          <StatusDot state="CANCELED" />
        </div>
      </Card>
      <Card id="Label">
        <div className="flex flex-col items-stretch justify-start gap-6 flex-initial">
          <StatusDot label state="QUEUED" />
          <StatusDot label state="BUILDING" />
          <StatusDot label state="ERROR" />
          <StatusDot label state="READY" />
          <StatusDot label state="CANCELED" />
        </div>
      </Card>
    </>
  );
}

function ToastDemo() {
  const demoCode = (id: string) => DEMO_CODE.toast?.[id] ?? "";
  const { language } = useLanguage();
  const toasts = useToasts();

  return (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card="Default"
    >
      <div className="w-full p-6" data-demo-container="Default">
        <Button
          typeName="button"
          onClick={() => toasts.message({ text: "The Evil Rabbit jumped over the fence." })}
        >
          {demoText(language, "Show Toast")}
        </Button>
      </div>
      <ShowCodeFooter code={demoCode("Default")} />
    </div>
  );
}

function CopyButtonDemo() {
  const demoCode = (id: string) => DEMO_CODE["copy-button"]?.[id] ?? "";
  return (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card="Default"
    >
      <div className="w-full p-6" data-demo-container="Default">
        <CopyButton textToCopy="lipsum" />
        <span className="text-copy-13 text-muted-foreground">Click to copy “lipsum”</span>
      </div>
      <ShowCodeFooter code={demoCode("Default")} />
    </div>
  );
}

function DrawerDemo() {
  const demoCode = (id: string) => DEMO_CODE.drawer?.[id] ?? "";
  const { language } = useLanguage();
  const [open, setOpen] = React.useState(false);
  const [customOpen, setCustomOpen] = React.useState(false);

  const drawerBody = (
    <div className="flex flex-col items-stretch justify-start gap-2 p-12">
      <DrawerTitle className="text-center">{demoText(language, "A drawer title")}</DrawerTitle>
      <DrawerDescription className="text-center">
        {demoText(language, "Drawer body")}
      </DrawerDescription>
    </div>
  );

  return (
    <div className="w-full max-w-[862px] space-y-6">
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <Button
              type="default"
              className="relative flex max-w-full whitespace-normal leading-[21px]"
              onClick={() => setOpen(true)}
            >
              {demoText(language, "Open")}
            </Button>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("default")} />
        <Drawer show={open} onDismiss={() => setOpen(false)} verticalScroll>
          {drawerBody}
        </Drawer>
      </div>
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="custom-height"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="custom-height">
            <Button
              type="default"
              className="relative flex max-w-full whitespace-normal leading-[21px]"
              onClick={() => setCustomOpen(true)}
            >
              {demoText(language, "Open")}
            </Button>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("custom-height")} />
        <Drawer
          height={200}
          show={customOpen}
          onDismiss={() => setCustomOpen(false)}
          verticalScroll
        >
          {drawerBody}
        </Drawer>
      </div>
    </div>
  );
}

function NoteDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <Note>Changing this region restarts all functions.</Note>
      <Note variant="success">Deployment succeeded.</Note>
      <Note variant="warning">Your plan has a usage limit.</Note>
      <Note variant="error">The API key is invalid.</Note>
    </div>
  );
}

function SheetDemo() {
  const demoCode = (id: string) => DEMO_CODE.sheet?.[id] ?? "";
  const { language } = useLanguage();

  const sheetBody = (title: string, description: string) => (
    <div className="flex flex-col gap-4">
      <SheetHeader className="p-6 text-left">
        <SheetTitle>{demoText(language, title)}</SheetTitle>
        <p className="text-copy-14 text-foreground">{demoText(language, description)}</p>
      </SheetHeader>
      <SheetDescription className="px-6 py-4 text-copy-14">
        {demoText(language, "Sheet body")}
      </SheetDescription>
      <SheetFooter className="p-6 gap-2 flex-row justify-end mt-auto">
        <SheetClose asChild>
          <Button typeName="button" type="secondary">
            {demoText(language, "Close")}
          </Button>
        </SheetClose>
        <Button typeName="button">{demoText(language, "Next")}</Button>
      </SheetFooter>
    </div>
  );

  return (
    <div className="w-full max-w-[862px] space-y-6">
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <Sheet modal>
              <SheetTrigger asChild>
                <Button
                  type="default"
                  className="relative flex max-w-full whitespace-normal leading-[21px]"
                >
                  {demoText(language, "Open Sheet")}
                </Button>
              </SheetTrigger>
              <SheetContent className="m-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] rounded-2xl bg-background-100 p-0 lg:w-[512px] sm:max-w-[auto] flex flex-col">
                {sheetBody("Sheet Title", "Sheet description")}
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("default")} />
      </div>
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="with-side"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="with-side">
            <div className="flex items-center justify-center gap-4">
              <Sheet modal>
                <SheetTrigger asChild>
                  <Button
                    type="default"
                    className="relative flex max-w-full whitespace-normal leading-[21px]"
                  >
                    {demoText(language, "Open top")}
                  </Button>
                </SheetTrigger>
                <SheetContent side="top">
                  {sheetBody("Sheet from top", "This sheet slides in from the top.")}
                </SheetContent>
              </Sheet>
              <Sheet modal>
                <SheetTrigger asChild>
                  <Button
                    type="default"
                    className="relative flex max-w-full whitespace-normal leading-[21px]"
                  >
                    {demoText(language, "Open right")}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  {sheetBody("Sheet from right", "This sheet slides in from the right.")}
                </SheetContent>
              </Sheet>
              <Sheet modal>
                <SheetTrigger asChild>
                  <Button
                    type="default"
                    className="relative flex max-w-full whitespace-normal leading-[21px]"
                  >
                    {demoText(language, "Open bottom")}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom">
                  {sheetBody("Sheet from bottom", "This sheet slides in from the bottom.")}
                </SheetContent>
              </Sheet>
              <Sheet modal>
                <SheetTrigger asChild>
                  <Button
                    type="default"
                    className="relative flex max-w-full whitespace-normal leading-[21px]"
                  >
                    {demoText(language, "Open left")}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  {sheetBody("Sheet from left", "This sheet slides in from the left.")}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("with-side")} />
      </div>
    </div>
  );
}

function SnippetDemo() {
  const demoCode = (id: string) => DEMO_CODE.snippet?.[id] ?? "";
  const [copied, setCopied] = React.useState(false);
  const Card = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card={id}
    >
      <div className="w-full p-6" data-demo-container={id}>
        {children}
      </div>
      <ShowCodeFooter code={demoCode(id)} />
    </div>
  );
  return (
    <>
      <Card id="Default">
        <Snippet text="npm init next-app" width="300px" />
      </Card>
      <Card id="Inverted">
        <Snippet dark text="npm init next-app" width="300px" />
      </Card>
      <Card id="Multi line">
        <Snippet text={["cd project", "now"]} width="100%" />
      </Card>
      <Card id="No prompt">
        <Snippet prompt={false} text="npm init next-app" width="300px" />
      </Card>
      <Card id="Callback">
        <Snippet
          onCopy={() => setCopied(true)}
          text="npm init next-app"
          width="300px"
          copied={copied}
        />
      </Card>
      <Card id="Variants">
        <div className="flex flex-col items-stretch justify-start gap-3 flex-initial">
          <Snippet text="npm init next-app" type="success" width="300px" />
          <Snippet text="npm init next-app" type="error" width="300px" />
          <Snippet text="npm init next-app" type="warning" width="300px" />
        </div>
      </Card>
      <Card id="Controlled Copied State">
        <Snippet
          text="npm init next-app"
          width="300px"
          copied={copied}
          onCopy={() => setCopied((value) => !value)}
        />
      </Card>
    </>
  );
}
function VercelLogo() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="currentColor">
      <path d="m12 1.608 12 20.784H0Z" />
    </svg>
  );
}

function NextLogo() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="currentColor">
      <path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z" />
    </svg>
  );
}

function ReactLogo() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="currentColor">
      <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" />
    </svg>
  );
}

function BookDemo() {
  const demoCode = (id: string) => DEMO_CODE.book?.[id] ?? "";
  const { language } = useLanguage();
  const title = "The user experience of the Frontend Cloud";
  const Section = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <section
      aria-labelledby={`book-${id.replaceAll(" ", "-").toLowerCase()}-heading`}
      data-demo-card={id}
      className="space-y-4 rounded-[8px] border border-gray-alpha-400 bg-background-100 p-6"
    >
      <h3 id={`book-${id.replaceAll(" ", "-").toLowerCase()}-heading`} className="text-heading-20">
        {demoText(language, id)}
      </h3>
      {children}
      <ShowCodeFooter code={demoCode(id)} />
    </section>
  );
  return (
    <div className="w-full space-y-10">
      <Section id="Default">
        <div className="flex min-h-80 items-center justify-center p-8">
          <Book title={title} />
        </div>
      </Section>

      <Section id="Variants">
        <div className="grid min-h-80 place-items-center gap-8 p-8 sm:grid-cols-2">
          <Book title={title} variant="simple" />
          <Book title={title} />
        </div>
      </Section>

      <Section id="Custom color">
        <div className="grid min-h-80 place-items-center gap-8 p-8 sm:grid-cols-2 xl:grid-cols-3">
          <Book color="#9D2127" title="How Vercel improves your website's search engine ranking" />
          <Book
            color="#7DC1C1"
            textColor="white"
            title="Design Engineering at Vercel"
            variant="simple"
          />
          <Book color="#FED954" title={title} />
        </div>
      </Section>

      <Section id="Custom icon">
        <div className="flex min-h-80 flex-wrap items-center justify-center gap-8 p-8">
          <Book icon={<VercelLogo />} title="Vercel Platform Guide" />
          <Book icon={<NextLogo />} title="Next.js Documentation" />
          <Book icon={<ReactLogo />} title="React Documentation" />
        </div>
      </Section>

      <Section id="Custom illustration">
        <div className="flex min-h-80 flex-wrap items-center justify-center gap-8 p-8">
          <Book
            illustration={
              <div
                className="flex h-14 w-9 items-center justify-center rounded-sm bg-[#0070F3]"
                aria-hidden
              />
            }
            title={title}
          />
          <Book
            illustration={
              <div
                className="flex h-14 w-9 items-center justify-center rounded-sm bg-[#f5b047]"
                aria-hidden
              />
            }
            title={title}
            variant="simple"
          />
        </div>
      </Section>

      <Section id="Responsive">
        <div className="flex min-h-80 items-center justify-center p-8">
          <Book title={title} width={{ sm: 150, md: 196 }} />
        </div>
      </Section>

      <Section id="Width">
        <div className="flex min-h-80 flex-wrap items-baseline justify-center gap-8 p-8">
          <Book title={title} width={300} />
          <Book title={title} width={200} />
          <Book title={title} width={150} />
        </div>
      </Section>

      <Section id="Textured">
        <div className="flex min-h-80 flex-wrap items-center justify-center gap-8 p-8">
          <Book color="#7DC1C1" textured title="Design Engineering at Vercel" />
          <Book color="#9D2127" textured title="Design Engineering at Vercel" />
          <Book color="#FED954" textured title="Design Engineering at Vercel" />
        </div>
      </Section>
    </div>
  );
}
function BrowserDemo() {
  const demoCode = (id: string) => DEMO_CODE.browser?.[id] ?? "";
  return (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card="Composition"
    >
      <div className="w-full p-6" data-demo-container="Composition">
        <Browser address="https://vercel.com">
          <div className="flex h-24 items-center justify-center bg-gray-alpha-100 text-copy-14 text-muted-foreground">
            Screenshot or demo content
          </div>
        </Browser>
      </div>
      <ShowCodeFooter code={demoCode("Composition")} />
    </div>
  );
}

type CalendarDemoExample =
  | "default"
  | "horizontal-layout"
  | "sizes"
  | "presets"
  | "compact"
  | "stacked"
  | "presets-default"
  | "min-max"
  | "pinned-timezone";

function CalendarDemo({ example = "default" }: { example?: CalendarDemoExample }) {
  const { language } = useLanguage();
  const triggerLabel = demoText(language, "Select Date Range");
  const periodLabel = demoText(language, "Select Period");
  const comboboxLabel = demoText(language, "Combobox Menu");
  // 官方 presets 语义：{key: {text, start, end}}，选中后写回日历范围并更新 trigger
  const presetTexts = (() => {
    const now = new Date();
    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const endOfDay = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    const subDays = (d: Date, n: number) => new Date(d.getTime() - n * 86_400_000);
    const subMonths = (d: Date, n: number) =>
      new Date(d.getFullYear(), d.getMonth() - n, d.getDate());
    return {
      "last-3-days": {
        text: demoText(language, "Last 3 Days"),
        start: startOfDay(subDays(now, 3)),
        end: endOfDay(now),
      },
      "last-7-days": {
        text: demoText(language, "Last 7 Days"),
        start: startOfDay(subDays(now, 7)),
        end: endOfDay(now),
      },
      "last-14-days": {
        text: demoText(language, "Last 14 Days"),
        start: startOfDay(subDays(now, 14)),
        end: endOfDay(now),
      },
      "last-month": {
        text: demoText(language, "Last Month"),
        start: startOfDay(subMonths(now, 1)),
        end: endOfDay(now),
      },
    };
  })();

  const mediumItems = (
    <>
      <Calendar label={triggerLabel} />
      <Calendar label={triggerLabel} compact comboboxLabel={comboboxLabel} presets={presetTexts} />
      <Calendar
        label={triggerLabel}
        stacked
        comboboxPlaceholder={periodLabel}
        comboboxLabel={comboboxLabel}
        presets={presetTexts}
      />
      <Calendar
        label={triggerLabel}
        showCombobox
        comboboxFirst
        comboboxFull
        className={CALENDAR_ROW_REV_CLASS}
        comboboxPlaceholder={periodLabel}
        comboboxLabel={comboboxLabel}
        presets={presetTexts}
      />
    </>
  );

  const smallItems = (
    <>
      <Calendar label={triggerLabel} size="small" />
      <Calendar
        label={triggerLabel}
        size="small"
        compact
        comboboxLabel={comboboxLabel}
        presets={presetTexts}
      />
      <Calendar
        label={triggerLabel}
        size="small"
        stacked
        comboboxPlaceholder={periodLabel}
        comboboxLabel={comboboxLabel}
        presets={presetTexts}
      />
      <Calendar
        label={triggerLabel}
        size="small"
        showCombobox
        comboboxFirst
        comboboxFull
        className={CALENDAR_ROW_REV_CLASS}
        comboboxPlaceholder={periodLabel}
        comboboxLabel={comboboxLabel}
        presets={presetTexts}
      />
    </>
  );

  const now = new Date();
  const minDate = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
  const maxDate = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());
  const demoCode = (id: string) => DEMO_CODE.calendar?.[id] ?? "";

  return (
    <div className="w-full max-w-[862px] space-y-6">
      {example === "default" ? (
        <div
          className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
          data-demo-card="default"
        >
          <div className="flex w-full overflow-x-auto md:overflow-visible">
            <div className="w-full p-6" data-demo-container="default">
              <div className="flex justify-center py-12">
                <Calendar label={triggerLabel} />
              </div>
            </div>
          </div>
          <ShowCodeFooter code={demoCode("default")} />
        </div>
      ) : null}
      {example === "horizontal-layout" ? (
        <div
          className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
          data-demo-card="horizontal-layout"
        >
          <div className="flex w-full overflow-x-auto md:overflow-visible">
            <div className="w-full p-6" data-demo-container="horizontal-layout">
              <div className="flex justify-center py-12">
                <Calendar label={triggerLabel} horizontalLayout />
              </div>
            </div>
          </div>
          <ShowCodeFooter code={demoCode("horizontal-layout")} />
        </div>
      ) : null}
      {example === "sizes" ? (
        <div
          className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
          data-demo-card="sizes"
        >
          <div className="flex w-full overflow-x-auto md:overflow-visible">
            <div className="w-full p-6" data-demo-container="sizes">
              <div className="py-12 space-y-12">
                <div>
                  <p className="text-copy-14 text-gray-900 mb-4 font-mono">small</p>
                  <div className="flex flex-wrap items-start gap-x-4 gap-y-12">{smallItems}</div>
                </div>
                <div>
                  <p className="text-copy-14 text-gray-900 mb-4 font-mono">default / medium</p>
                  <div className="flex flex-wrap items-start gap-x-4 gap-y-12">{mediumItems}</div>
                </div>
              </div>
            </div>
          </div>
          <ShowCodeFooter code={demoCode("sizes")} />
        </div>
      ) : null}
      {example === "presets" ? (
        <div
          className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
          data-demo-card="presets"
        >
          <div className="flex w-full overflow-x-auto md:overflow-visible">
            <div className="w-full p-6" data-demo-container="presets">
              <div className="flex justify-center py-12">
                <Calendar
                  label={triggerLabel}
                  showCombobox
                  comboboxFirst
                  comboboxFull
                  comboboxWide
                  comboboxLabel={comboboxLabel}
                  comboboxPlaceholder={periodLabel}
                  presets={presetTexts}
                />
              </div>
            </div>
          </div>
          <ShowCodeFooter code={demoCode("presets")} />
        </div>
      ) : null}
      {example === "compact" ? (
        <div
          className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
          data-demo-card="compact"
        >
          <div className="flex w-full overflow-x-auto md:overflow-visible">
            <div className="w-full p-6" data-demo-container="compact">
              <div className="flex justify-center py-12">
                <Calendar
                  label={triggerLabel}
                  compact
                  comboboxLabel={comboboxLabel}
                  presets={presetTexts}
                />
              </div>
            </div>
          </div>
          <ShowCodeFooter code={demoCode("compact")} />
        </div>
      ) : null}
      {example === "stacked" ? (
        <div
          className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
          data-demo-card="stacked"
        >
          <div className="flex w-full overflow-x-auto md:overflow-visible">
            <div className="w-full p-6" data-demo-container="stacked">
              <div className="flex justify-center py-12">
                <Calendar
                  label={triggerLabel}
                  stacked
                  comboboxLabel={comboboxLabel}
                  comboboxPlaceholder={periodLabel}
                  presets={presetTexts}
                />
              </div>
            </div>
          </div>
          <ShowCodeFooter code={demoCode("stacked")} />
        </div>
      ) : null}
      {example === "presets-default" ? (
        <div
          className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
          data-demo-card="presets-default"
        >
          <div className="flex w-full overflow-x-auto md:overflow-visible">
            <div className="w-full p-6" data-demo-container="presets-default">
              <div className="flex justify-center py-12">
                <Calendar
                  label={triggerLabel}
                  stacked
                  comboboxLabel={comboboxLabel}
                  comboboxPlaceholder={periodLabel}
                  presets={presetTexts}
                  presetIndex={2}
                />
              </div>
            </div>
          </div>
          <ShowCodeFooter code={demoCode("presets-default")} />
        </div>
      ) : null}
      {example === "min-max" ? (
        <div
          className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
          data-demo-card="min-max"
        >
          <div className="flex w-full overflow-x-auto md:overflow-visible">
            <div className="w-full p-6" data-demo-container="min-max">
              <div className="flex justify-center py-12">
                <Calendar label={triggerLabel} minValue={minDate} maxValue={maxDate} />
              </div>
            </div>
          </div>
          <ShowCodeFooter code={demoCode("min-max")} />
        </div>
      ) : null}
      {example === "pinned-timezone" ? (
        <div
          className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
          data-demo-card="pinned-timezone"
        >
          <div className="flex w-full overflow-x-auto md:overflow-visible">
            <div className="w-full p-6" data-demo-container="pinned-timezone">
              <div className="flex justify-center py-12">
                <Calendar label={triggerLabel} pinnedTimezone="America/Los_Angeles" />
              </div>
            </div>
          </div>
          <ShowCodeFooter code={demoCode("pinned-timezone")} />
        </div>
      ) : null}
    </div>
  );
}

function ChoiceboxDemo() {
  const demoCode = (id: string) => DEMO_CODE.choicebox?.[id] ?? "";
  const { language } = useLanguage();
  const [plan, setPlan] = React.useState("trial");
  const [features, setFeatures] = React.useState<string[]>([]);
  const [disabledPlan, setDisabledPlan] = React.useState("");
  const [customPlan, setCustomPlan] = React.useState("trial");
  return (
    <div className="w-full max-w-2xl space-y-6">
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="single-select"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="single-select">
            <ChoiceboxGroup
              label={demoText(language, "select a plan")}
              listClassName="flex-row"
              onChange={setPlan}
              type="radio"
              value={plan}
            >
              <ChoiceboxGroupItem
                description={demoText(language, "Free for two weeks")}
                title={demoText(language, "Pro Trial")}
                value="trial"
              />
              <ChoiceboxGroupItem
                description={demoText(language, "Get started now")}
                title="Pro"
                value="pro"
              />
            </ChoiceboxGroup>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("single-select")} />
      </div>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"

        data-demo-card="multi-select"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="multi-select">
            <ChoiceboxGroup
              label={demoText(language, "Select frameworks")}
              listClassName="flex-row"
              onChange={setFeatures}
              type="checkbox"
              value={features}
            >
              <ChoiceboxGroupItem
                description={demoText(language, "Free for two weeks")}
                title={demoText(language, "Pro Trial")}
                value="trial"
              />
              <ChoiceboxGroupItem
                description={demoText(language, "Get started now")}
                title="Pro"
                value="pro"
              />
            </ChoiceboxGroup>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("multi-select")} />
      </div>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"

        data-demo-card="disabled"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="disabled">
            <div className="flex flex-col items-stretch justify-start gap-6">
              <ChoiceboxGroup
                disabled
                showLabel
                label={demoText(language, "Choicebox group disabled")}
                listClassName="flex-row"
                onChange={setDisabledPlan}
                type="radio"
                value={disabledPlan}
              >
                <ChoiceboxGroupItem
                  description={demoText(language, "Free for two weeks")}
                  title={demoText(language, "Pro Trial")}
                  value="trial"
                />
                <ChoiceboxGroupItem
                  description={demoText(language, "Get started now")}
                  title="Pro"
                  value="pro"
                />
              </ChoiceboxGroup>
              <ChoiceboxGroup
                showLabel
                label={demoText(language, "Single input disabled")}
                listClassName="flex-row"
                onChange={setDisabledPlan}
                type="radio"
                value={disabledPlan}
              >
                <ChoiceboxGroupItem
                  disabled
                  description={demoText(language, "Free for two weeks")}
                  title={demoText(language, "Pro Trial")}
                  value="trial"
                />
                <ChoiceboxGroupItem
                  description={demoText(language, "Get started now")}
                  title="Pro"
                  value="pro"
                />
              </ChoiceboxGroup>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("disabled")} />
      </div>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="custom-content"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="custom-content">
            <ChoiceboxGroup
              label={demoText(language, "select a plan")}
              listClassName="flex-row"
              onChange={setCustomPlan}
              type="radio"
              value={customPlan}
            >
              <ChoiceboxGroupItem
                description={demoText(language, "Free for two weeks")}
                title={demoText(language, "Pro Trial")}
                value="trial"
              >
                <div className="flex justify-center p-2">
                  <Badge variant="purple">Trial</Badge>
                </div>
              </ChoiceboxGroupItem>
              <ChoiceboxGroupItem
                description={demoText(language, "Get started now")}
                title="Pro"
                value="pro"
              >
                <div className="flex justify-center p-2">
                  <Badge variant="blue">Pro</Badge>
                </div>
              </ChoiceboxGroupItem>
            </ChoiceboxGroup>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("custom-content")} />
      </div>
    </div>
  );
}

function CommandMenuDemo() {
  const demoCode = (id: string) => DEMO_CODE["command-menu"]?.[id] ?? "";
  const { language } = useLanguage();
  const [openVariant, setOpenVariant] = React.useState<
    "default" | "with-divider" | "with-suffix" | null
  >(null);

  const openDemo = (variant: "default" | "with-divider" | "with-suffix") => {
    setOpenVariant(variant);
  };

  const demoVariants = ["default", "with-divider", "with-suffix"] as const;

  return (
    <div className="w-full max-w-[862px] space-y-6">
      {demoVariants.map((name, index) => (
        <div
          key={name}
          className={`relative rounded-[8px] border border-gray-alpha-400 bg-background-100${index === 0 ? " mt-6" : ""}`}
          data-demo-card={name}
        >
          <div className="flex w-full overflow-x-auto md:overflow-visible">
            <div className="w-full p-6" data-demo-container={name}>
              <Button
                key={name}
                type="default"
                className="relative flex max-w-full whitespace-normal leading-[21px]"
                onClick={() => openDemo(name)}
              >
                {demoText(language, "Open Command Menu")}
              </Button>
            </div>
          </div>
          <ShowCodeFooter code={demoCode(name)} />
        </div>
      ))}
      <CommandMenu
        open={openVariant === "default"}
        setOpen={(open) => setOpenVariant(open ? "default" : null)}
      >
        <CommandMenuInput placeholder={demoText(language, "What do you need?")} />
        <CommandMenuList>
          <CommandMenuGroup heading={demoText(language, "Suggestions")}>
            <CommandMenuItem callback={() => {}}>
              {demoText(language, "Figma Import")}
            </CommandMenuItem>
          </CommandMenuGroup>
          <CommandMenuGroup heading={demoText(language, "Commands")}>
            <CommandMenuItem callback={() => {}}>
              {demoText(language, "Import Extension")}
            </CommandMenuItem>
            <CommandMenuItem callback={() => {}}>
              {demoText(language, "Manage Extensions")}
            </CommandMenuItem>
          </CommandMenuGroup>
          <CommandMenuGroup heading={demoText(language, "Collaboration")}>
            <CommandMenuItem callback={() => {}}>
              {demoText(language, "Flags Explorer")}
            </CommandMenuItem>
          </CommandMenuGroup>
        </CommandMenuList>
      </CommandMenu>
      <CommandMenu
        open={openVariant === "with-divider"}
        setOpen={(open) => setOpenVariant(open ? "with-divider" : null)}
      >
        <CommandMenuInput placeholder={demoText(language, "What do you need?")} />
        <CommandMenuList>
          <CommandMenuItem callback={() => {}}>{demoText(language, "Item 1")}</CommandMenuItem>
          <CommandMenuItem callback={() => {}}>{demoText(language, "Item 2")}</CommandMenuItem>
          <CommandMenuDivider />
          <CommandMenuItem callback={() => {}}>{demoText(language, "Item 3")}</CommandMenuItem>
          <CommandMenuGroup heading={demoText(language, "Group 1")}>
            <CommandMenuItem callback={() => {}}>
              {demoText(language, "Grouped Item 1")}
            </CommandMenuItem>
            <CommandMenuItem callback={() => {}}>
              {demoText(language, "Grouped Item 2")}
            </CommandMenuItem>
          </CommandMenuGroup>
        </CommandMenuList>
      </CommandMenu>
      <CommandMenu
        open={openVariant === "with-suffix"}
        setOpen={(open) => setOpenVariant(open ? "with-suffix" : null)}
      >
        <CommandMenuInput placeholder={demoText(language, "What do you need?")} />
        <CommandMenuList>
          <CommandMenuGroup heading={demoText(language, "Group 1")}>
            <CommandMenuItem callback={() => {}} suffix={<span>{demoText(language, "USA")}</span>}>
              {demoText(language, "United States of America")}
            </CommandMenuItem>
            <CommandMenuItem callback={() => {}} suffix={<span>{demoText(language, "ESP")}</span>}>
              {demoText(language, "Spain")}
            </CommandMenuItem>
            <CommandMenuItem callback={() => {}} suffix={<span>{demoText(language, "FRA")}</span>}>
              {demoText(language, "France")}
            </CommandMenuItem>
          </CommandMenuGroup>
          <CommandMenuGroup heading={demoText(language, "Group 2")}>
            <CommandMenuItem callback={() => {}} suffix={<span>{demoText(language, "AUT")}</span>}>
              {demoText(language, "Austria")}
            </CommandMenuItem>
            <CommandMenuItem callback={() => {}} suffix={<span />}>
              {demoText(language, "Switzerland")}
            </CommandMenuItem>
            <CommandMenuItem callback={() => {}} suffix={<span>{demoText(language, "GER")}</span>}>
              {demoText(language, "Germany")}
            </CommandMenuItem>
          </CommandMenuGroup>
        </CommandMenuList>
      </CommandMenu>
    </div>
  );
}

function GridDemo() {
  return (
    <div className="w-full max-w-2xl space-y-4">
      <GridSystem guideWidth={1} unstable_useContainer>
        <Grid columns={3} rows={2}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <GridCell
              key={n}
              className="flex h-16 items-center justify-center font-mono text-copy-14 text-muted-foreground"
            >
              {n}
            </GridCell>
          ))}
        </Grid>
      </GridSystem>
    </div>
  );
}

function JsonViewDemo() {
  const data = {
    deployment: { id: "dpl_9WjH8QFQySx7", state: "ready" },
    cached: false,
    durationMs: 42,
  };
  return (
    <div className="w-full max-w-md">
      <JsonView data={data} />
    </div>
  );
}

function PhoneDemo() {
  const demoCode = (id: string) => DEMO_CODE.phone?.[id] ?? "";
  const [safariLayout, setSafariLayout] = React.useState<"compact" | "bottom" | "top">("compact");
  return (
    <>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="Composition"
      >
        <div className="w-full p-6" data-demo-container="Composition">
          <Phone>
            <PhoneScreen>
              <img
                src="https://picsum.photos/seed/geist-phone/393/852"
                alt="Vercel dashboard on iPhone"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </PhoneScreen>
          </Phone>
        </div>
        <ShowCodeFooter code={demoCode("Composition")} />
      </div>

      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="Colors"
      >
        <div className="w-full p-6" data-demo-container="Colors">
          <div className="flex flex-wrap items-start justify-center gap-6">
            {(["black", "white", "mist-blue", "cosmic-orange"] as const).map((color) => (
              <div key={color} className="flex flex-col items-center gap-2">
                <Phone color={color} statusBar={false} className="w-[140px]">
                  <PhoneScreen>
                    <div className="h-full w-full bg-gray-alpha-100" />
                  </PhoneScreen>
                </Phone>
                <span className="text-copy-13 text-muted-foreground">{color}</span>
              </div>
            ))}
          </div>
        </div>
        <ShowCodeFooter code={demoCode("Colors")} />
      </div>

      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="Dynamic Island"
      >
        <div className="w-full p-6" data-demo-container="Dynamic Island">
          <Phone dynamicIsland className="w-[260px]">
            <PhoneScreen>
              <div className="flex h-full items-center justify-center bg-gray-alpha-100 text-copy-14 text-muted-foreground">
                Mobile screenshot
              </div>
            </PhoneScreen>
          </Phone>
        </div>
        <ShowCodeFooter code={demoCode("Dynamic Island")} />
      </div>

      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="Status Bar"
      >
        <div className="w-full p-6" data-demo-container="Status Bar">
          <div className="flex flex-wrap items-start justify-center gap-6">
            <Phone statusBar={{ time: "9:41", battery: 72 }}>
              <PhoneScreen>
                <div className="flex h-full items-center justify-center bg-gray-alpha-100 text-copy-14 text-muted-foreground">
                  Custom status
                </div>
              </PhoneScreen>
            </Phone>
            <Phone statusBar={{ appearance: "dark" }}>
              <PhoneScreen>
                <div className="flex h-full items-center justify-center bg-gray-900 text-copy-14 text-gray-1000">
                  Dark appearance
                </div>
              </PhoneScreen>
            </Phone>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("Status Bar")} />
      </div>

      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="Safari Chrome"
      >
        <div className="w-full p-6" data-demo-container="Safari Chrome">
          <div className="mb-4 flex justify-center gap-2">
            {(["compact", "bottom", "top"] as const).map((layout) => (
              <button
                key={layout}
                type="button"
                onClick={() => setSafariLayout(layout)}
                className={
                  "cursor-pointer rounded-[6px] px-3 py-1.5 text-copy-13 " +
                  (safariLayout === layout
                    ? "bg-gray-1000 text-background-100"
                    : "bg-background-200 text-gray-900")
                }
              >
                {layout}
              </button>
            ))}
          </div>
          <Phone safari={{ layout: safariLayout, url: "vercel.com/geist" }}>
            <PhoneScreen>
              <img
                src="https://picsum.photos/seed/geist-safari/393/852"
                alt="Website shown in the Safari mockup"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </PhoneScreen>
          </Phone>
        </div>
        <ShowCodeFooter code={demoCode("Safari Chrome")} />
      </div>

      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="Landscape"
      >
        <div className="w-full p-6" data-demo-container="Landscape">
          <Phone landscape dynamicIsland>
            <PhoneScreen>
              <div className="flex h-full items-center justify-center bg-gray-alpha-100 text-copy-14 text-muted-foreground">
                Landscape screenshot
              </div>
            </PhoneScreen>
          </Phone>
        </div>
        <ShowCodeFooter code={demoCode("Landscape")} />
      </div>
    </>
  );
}

function ProjectBannerDemo() {
  const demoCode = (id: string) => DEMO_CODE["project-banner"]?.[id] ?? "";
  const Card = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card={id}
    >
      <div className="w-full p-6" data-demo-container={id}>
        {children}
      </div>
      <ShowCodeFooter code={demoCode(id)} />
    </div>
  );
  return (
    <>
      <Card id="Default">
        <ProjectBanner
          icon={<ShieldCheck />}
          label="Attack Challenge Mode is enabled for this project"
          callToAction={{ label: "Disable", href: "#" }}
        />
      </Card>
      <Card id="Success">
        <ProjectBanner
          variant="success"
          icon={<ShieldCheck />}
          label="Attack Challenge Mode is enabled for this project"
          callToAction={{ label: "Disable", href: "#" }}
        />
      </Card>
      <Card id="Warning">
        <ProjectBanner
          variant="warning"
          icon={<RotateCcw />}
          label={
            <>
              This project was rolled back by{" "}
              <Tooltip text="Yesterday for project marketing-website">@johnphamous</Tooltip>
            </>
          }
          callToAction={{ label: "Undo Rollback", onClick: () => {} }}
        />
      </Card>
      <Card id="Error">
        <ProjectBanner
          variant="error"
          icon={<TriangleAlert />}
          label="Payment failed, update credit card information before your account is shut down"
          callToAction={{ label: "Add Credit Card", href: "#" }}
        />
      </Card>
    </>
  );
}
function SliderDemo() {
  const demoCode = (id: string) => DEMO_CODE.slider?.[id] ?? "";
  const { language } = useLanguage();
  const [defaultValue, setDefaultValue] = React.useState<number[]>([50]);
  const [labelValue, setLabelValue] = React.useState<number[]>([40]);
  const [rangeValue, setRangeValue] = React.useState<number[]>([50, 75]);
  const [commitValue, setCommitValue] = React.useState<number[]>([50]);
  const [committed, setCommitted] = React.useState<number | null>(null);
  const demos = [
    {
      id: "default",
      content: (
        <form>
          <Slider value={defaultValue} onValueChange={setDefaultValue} aria-label="Value" />
        </form>
      ),
    },
    {
      id: "with-label",
      content: (
        <form>
          <Slider
            label={demoText(language, "Volume")}
            value={labelValue}
            onValueChange={setLabelValue}
          />
        </form>
      ),
    },
    {
      id: "range-with-inputs",
      content: (
        <form>
          <Slider
            showStartInput
            showEndInput
            value={rangeValue}
            onValueChange={setRangeValue}
            aria-label="Range"
          />
        </form>
      ),
    },
    {
      id: "disabled-range-with-inputs",
      content: (
        <form>
          <Slider disabled showStartInput showEndInput value={[50, 75]} aria-label="Range" />
        </form>
      ),
    },
    {
      id: "commit-on-release",
      content: (
        <form>
          <Slider
            label="Drag then release"
            value={commitValue}
            onValueChange={setCommitValue}
            onValueCommitted={(value) => setCommitted(value[0] ?? null)}
          />
          <p className="mt-2 text-copy-13 text-gray-900">
            Last committed: {committed === null ? "—" : committed}
          </p>
        </form>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6">
      {demos.map((demo) => (
        <div key={demo.id} data-demo-card={demo.id}>
          <div data-demo-container={demo.id} className="w-full p-6">
            {demo.content}
          </div>
          <ShowCodeFooter code={demoCode(demo.id)} />
        </div>
      ))}
    </div>
  );
}

function VideoDemo() {
  return (
    <div className="w-full min-w-0 max-w-[600px]">
      <Video height={582} lazy={false} src="/demo.mp4" poster="/demo-poster.png" width={600} />
    </div>
  );
}

const codeBlockExample = `// Usage:
//   enabled by \`--debug-prerender\`
//   route patterns: [id...] or [...id]
//   NODE_OPTIONS='--debug-prerender' node
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}`;

const codeBlockBasic = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}`;

const codeBlockDiff = `module.exports = {
  experimental: {
    appDir: true,
  },
  appDir: true,
}`;

const codeBlockTab =
  "function MyComponent(props) {\n\treturn (\n\t  <div>\n\t\t<h1>Hello, {props.name}!</h1>\n\t\t<p>Good to see you</p>\n\t  </div>\n\t);\n  }";

const codeBlockTabTS =
  "function MyComponent(props: Props) {\n\treturn (\n\t  <div>\n\t\t<h1>Hello, {props.name}!</h1>\n\t\t<p>Good to see you</p>\n\t  </div>\n\t);\n  }";

const codeBlockTabLua =
  "local b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'\nlocal decode_table = ffi.new 'uint8_t[256]'\nfor i = 1, #b64 do\n  decode_table[str_byte(b64, i)] = i - 1 -- Base64 values start from 0\nend\n\nfunction BloomFilter:has(key)\n  local ptr = self.ptr -- uint8_t* pointer to start of base64 string\n  for byte_offset, bit_offset in self:iterator(key) do\n    local sextet = decode_table[ptr[byte_offset]]\n    if band(sextet, lshift(1, bit_offset)) == 0 then\n      return false\n    end\n  end\n  return true\nend";

const codeBlockReferenced = `function MyComponent(props) {
  return (
    <div>
      <h1>Count: {props.count}</h1>
    </div>
  );
}`;

const codeExample = `export function Component(): JSX.Element {
  return <Snippet text="npm init next-app" width="300px" />;
}`;

function CodeDemo() {
  const demoCode = (id: string) => DEMO_CODE.code?.[id] ?? "";
  return (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card="Default"
    >
      <div className="w-full p-6" data-demo-container="Default">
        <p className="text-copy-14 text-muted-foreground">
          Install with <InlineCode>npm i geist</InlineCode> and import the component.
        </p>
        <p className="text-copy-14 text-muted-foreground">
          Use <InlineCode>type="error"</InlineCode> for destructive confirmations.
        </p>
        <Code syntax="javascript">{codeExample}</Code>
      </div>
      <ShowCodeFooter code={demoCode("Default")} />
    </div>
  );
}

function CodeBlockDemo() {
  const demoCode = (id: string) => DEMO_CODE["code-block"]?.[id] ?? "";
  const languageOptions = ["JavaScript", "TypeScript", "Next.js", "Lua"];
  const [switcherLanguage, setSwitcherLanguage] = React.useState("JavaScript");
  const switcher = {
    options: languageOptions,
    value: switcherLanguage,
    onChange: setSwitcherLanguage,
  };
  const switchCode: Record<string, { filename: string; language: string; code: string }> = {
    JavaScript: {
      filename: "language-switcher.jsx",
      language: "jsx",
      code: codeBlockTab,
    },
    TypeScript: {
      filename: "language-switcher.tsx",
      language: "tsx",
      code: codeBlockTabTS,
    },
    "Next.js": {
      filename: "language-switcher.tsx",
      language: "tsx",
      code: codeBlockTabTS,
    },
    Lua: {
      filename: "bloom-filter.lua",
      language: "lua",
      code: codeBlockTabLua,
    },
  };
  const currentSwitch = switchCode[switcherLanguage];

  return (
    <div className="w-full max-w-[862px] space-y-6">
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <CodeBlockComponent aria-label="Hello world" filename="Table.jsx" language="jsx">
              {codeBlockExample}
            </CodeBlockComponent>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("default")} />
      </div>
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="no-filename"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="no-filename">
            <CodeBlockComponent aria-label="Hello world" language="jsx">
              {codeBlockBasic}
            </CodeBlockComponent>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("no-filename")} />
      </div>
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="highlighted-lines"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="highlighted-lines">
            <CodeBlockComponent
              aria-label="Hello world"
              filename="highlighted.jsx"
              language="jsx"
              highlightedLinesNumbers={[1, 4]}
            >
              {codeBlockBasic}
            </CodeBlockComponent>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("highlighted-lines")} />
      </div>
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="added-removed-lines"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="added-removed-lines">
            <CodeBlockComponent
              aria-label="Hello world"
              filename="next.config.js"
              language="jsx"
              addedLinesNumbers={[5]}
              removedLinesNumbers={[2, 3, 4]}
            >
              {codeBlockDiff}
            </CodeBlockComponent>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("added-removed-lines")} />
      </div>
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="referenced-lines"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="referenced-lines">
            <CodeBlockComponent
              aria-label="Hello world"
              language="jsx"
              referencedLinesNumbers={[4]}
            >
              {codeBlockReferenced}
            </CodeBlockComponent>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("referenced-lines")} />
      </div>
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="language-switcher"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="language-switcher">
            <CodeBlockComponent
              aria-label="Hello world"
              filename={currentSwitch.filename}
              language={currentSwitch.language}
              switcher={switcher}
            >
              {currentSwitch.code}
            </CodeBlockComponent>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("language-switcher")} />
      </div>
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="language-switcher-with-tabs"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="language-switcher-with-tabs">
            <CodeBlockComponent
              aria-label="Hello world"
              filename={currentSwitch.filename}
              language={currentSwitch.language}
              tabs={switcher}
            >
              {currentSwitch.code}
            </CodeBlockComponent>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("language-switcher-with-tabs")} />
      </div>
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="hidden-line-numbers"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="hidden-line-numbers">
            <CodeBlockComponent
              aria-label="Hello world"
              filename="hidden-line-numbers.jsx"
              language="jsx"
              hideLineNumbers
            >
              {codeBlockTab}
            </CodeBlockComponent>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("hidden-line-numbers")} />
      </div>
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="open-in-v0"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="open-in-v0">
            <div className="flex flex-col gap-4">
              <CodeBlockComponent
                aria-label="Hello world"
                filename="Table.jsx"
                language="jsx"
                v0="ask"
              >
                {codeBlockBasic}
              </CodeBlockComponent>
              <CodeBlockComponent filename="Table.jsx" language="jsx" v0="build">
                {codeBlockBasic}
              </CodeBlockComponent>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("open-in-v0")} />
      </div>
    </div>
  );
}

function DestructiveActionModalDemo() {
  const demoCode = (id: string) => DEMO_CODE["destructive-action-modal"]?.[id] ?? "";
  const { language } = useLanguage();
  const [openDefault, setOpenDefault] = React.useState(false);
  const [loadingDefault, setLoadingDefault] = React.useState(false);
  const [openReversible, setOpenReversible] = React.useState(false);
  const [openLoading, setOpenLoading] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const Card = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card={id}
    >
      <div className="w-full p-6" data-demo-container={id}>
        {children}
      </div>
      <ShowCodeFooter code={demoCode(id)} />
    </div>
  );
  const handleConfirmDefault = () => {
    setLoadingDefault(true);
    window.setTimeout(() => {
      setLoadingDefault(false);
      setOpenDefault(false);
    }, 1500);
  };
  return (
    <>
      <Card id="Default">
        <Button typeName="button" type="error" onClick={() => setOpenDefault(true)}>
          {demoText(language, "Delete Project")}
        </Button>
        <DestructiveActionModal
          open={openDefault}
          onCancel={() => setOpenDefault(false)}
          onConfirm={handleConfirmDefault}
          title={demoText(language, "Delete Project")}
          description={
            <>
              <span className="font-medium">next-year-boilerplate</span> and all its deployments,
              domains, and environment variables will be permanently deleted.
            </>
          }
          confirmLabel={demoText(language, "Delete Project")}
          verificationPhrase="next-year-boilerplate"
          verificationLabel={demoText(language, "project name")}
          irreversibleDescription="Deleting next-year-boilerplate cannot be undone."
          loading={loadingDefault}
        />
      </Card>

      <Card id="Reversible">
        <Button typeName="button" type="error" onClick={() => setOpenReversible(true)}>
          Disable Vercel Authentication
        </Button>
        <DestructiveActionModal
          open={openReversible}
          onCancel={() => setOpenReversible(false)}
          onConfirm={() => setOpenReversible(false)}
          title="Disable Vercel Authentication"
          description="Anyone will be able to view your deployments without being a member of your team."
          confirmLabel="Disable Vercel Authentication"
          verificationPhrase="disable vercel authentication"
        />
      </Card>

      <Card id="Loading">
        <Button typeName="button" type="error" onClick={() => setOpenLoading(true)}>
          {demoText(language, "Delete Project")}
        </Button>
        <DestructiveActionModal
          open={openLoading}
          onCancel={() => setOpenLoading(false)}
          onConfirm={() => undefined}
          title={demoText(language, "Delete Project")}
          description="my-project and all its deployments will be permanently deleted."
          confirmLabel={demoText(language, "Delete Project")}
          verificationPhrase="my-project"
          verificationLabel={demoText(language, "project name")}
          irreversibleDescription="Deleting my-project cannot be undone."
          loading
        />
      </Card>

      <Card id="With error">
        <Button typeName="button" type="error" onClick={() => setOpenError(true)}>
          {demoText(language, "Delete Project")}
        </Button>
        <DestructiveActionModal
          open={openError}
          onCancel={() => setOpenError(false)}
          onConfirm={() => setOpenError(false)}
          title={demoText(language, "Delete Project")}
          description="my-project and all its deployments will be permanently deleted."
          confirmLabel={demoText(language, "Delete Project")}
          verificationPhrase="my-project"
          verificationLabel={demoText(language, "project name")}
          irreversibleDescription="Deleting my-project cannot be undone."
          error="Couldn’t delete project. Try again."
        />
      </Card>
    </>
  );
}
function FeedbackDemo() {
  const demoCode = (id: string) => DEMO_CODE.feedback?.[id] ?? "";
  const Card = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card={id}
    >
      <div className="w-full p-6" data-demo-container={id}>
        {children}
      </div>
      <ShowCodeFooter code={demoCode(id)} />
    </div>
  );
  return (
    <>
      <Card id="Default">
        <div className="hidden justify-center xl:flex">
          <Feedback label="vercel" dryRun />
        </div>
        <div className="flex justify-center xl:hidden">
          <Note>
            <NoteContent>
              This example is hidden because it is intended for only desktop.
            </NoteContent>
          </Note>
        </div>
      </Card>
      <Card id="Inline">
        <Feedback dryRun label="vercel" type="inline" />
      </Card>
      <Card id="Feedback with Select">
        <div className="hidden justify-center xl:flex">
          <Feedback label="vercel" showTopics dryRun />
        </div>
        <div className="flex justify-center xl:hidden">
          <Note>
            <NoteContent>
              This example is hidden because it is intended for only desktop.
            </NoteContent>
          </Note>
        </div>
      </Card>
      <Card id="Feedback with metadata">
        <div className="hidden justify-center xl:flex">
          <Feedback
            label="vercel"
            dryRun
            metadata={{
              userId: "user_12345",
              location: "post-checkout",
              orderId: "order_123456",
            }}
          />
        </div>
        <div className="flex justify-center xl:hidden">
          <Note>
            <NoteContent>
              This example is hidden because it is intended for only desktop.
            </NoteContent>
          </Note>
        </div>
      </Card>
      <Card id="Rating bar">
        {/* 胶囊 rating bar：点开展开评分、点外收起；选中后胶囊以语义色着色（love 绿 / okay 灰 / not-great 黄 / hate 红） */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Feedback label="vercel" dryRun defaultValue="love" />
          <Feedback label="vercel" dryRun defaultValue="not-great" />
          <Feedback label="vercel" dryRun defaultValue="hate" />
        </div>
      </Card>
      <Card id="Feedback with prefix">
        <Feedback dryRun label="vercel" prefix={<Flag className="size-4" />} />
      </Card>
      <Card id="Feedback with suffix">
        <Feedback dryRun label="vercel" suffix={<Flag className="size-4" />} />
      </Card>
    </>
  );
}
function LoadMoreButtonDemo() {
  const demoCode = (id: string) => DEMO_CODE["load-more-button"]?.[id] ?? "";
  const { language } = useLanguage();
  const Card = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card={id}
    >
      <div className="w-full p-6" data-demo-container={id}>
        {children}
      </div>
      <ShowCodeFooter code={demoCode(id)} />
    </div>
  );
  return (
    <>
      <Card id="Default">
        <LoadMoreButton>{demoText(language, "Load More")}</LoadMoreButton>
      </Card>
      <Card id="Loading">
        <LoadMoreButton loading>{demoText(language, "Loading...")}</LoadMoreButton>
      </Card>
      <Card id="No Gap">
        <LoadMoreButton noGap>{demoText(language, "Load More")}</LoadMoreButton>
      </Card>
      <Card id="No Border Radius">
        <LoadMoreButton noBorderRadius>{demoText(language, "Load More")}</LoadMoreButton>
      </Card>
      <Card id="Custom Text">
        <LoadMoreButton>{demoText(language, "Show More Results")}</LoadMoreButton>
      </Card>
    </>
  );
}
function TextWithCopyButtonDemo() {
  const demoCode = (id: string) => DEMO_CODE["text-with-copy-button"]?.[id] ?? "";
  const Card = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card={id}
    >
      <div className="w-full p-6" data-demo-container={id}>
        {children}
      </div>
      <ShowCodeFooter code={demoCode(id)} />
    </div>
  );
  return (
    <>
      <Card id="Default">
        <TextWithCopyButton
          ellipsis
          successMessage="Copied to clipboard"
          textLabel="Copy"
          textToCopy="lipsum"
        />
      </Card>
      <Card id="With Small and Tertiary">
        <TextWithCopyButton
          ellipsis
          successMessage="Copied hashed digest to clipboard"
          textLabel="Copy config digest"
          textToCopy="edgeConfigData.digest"
        />
      </Card>
    </>
  );
}

function ContextCardDemoCard({
  id,
  code,
  children,
}: {
  id: string;
  code: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="mt-6 w-full max-w-[862px] overflow-hidden rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card={id}
    >
      <div className="flex w-full overflow-x-auto md:overflow-visible">
        <div className="w-full p-6" data-demo-container={id}>
          {children}
        </div>
      </div>
      <DemoShowCode code={code} />
    </div>
  );
}

function ContextCardDemo() {
  const demoCode = (id: string) => DEMO_CODE["context-card"]?.[id] ?? "";
  const { language } = useLanguage();
  const card = (
    <ContextCard>
      <ContextCardHeader>
        <div className="size-8 shrink-0 rounded-full bg-gray-400" aria-hidden />
        <div>
          <ContextCardTitle>Acme Inc.</ContextCardTitle>
          <ContextCardDescription>@acme · San Francisco</ContextCardDescription>
        </div>
      </ContextCardHeader>
      <ContextCardBody>
        <p className="text-copy-13 text-muted-foreground">Last Active: 2h ago</p>
        <p className="text-copy-13 text-muted-foreground">Plan: Pro</p>
      </ContextCardBody>
      <ContextCardFooter>
        <Button type="secondary" typeName="button" size="small">
          {demoText(language, "View Project")}
        </Button>
      </ContextCardFooter>
    </ContextCard>
  );

  const demo = (id: string, code: string, children: React.ReactNode) => (
    <ContextCardDemoCard id={id} code={code}>
      {children}
    </ContextCardDemoCard>
  );

  return (
    <div className="flex w-full flex-col gap-6">
      {demo(
        "default",
        demoCode("default"),
        <div className="flex flex-wrap items-center justify-around gap-6">
          {(["Top", "Bottom", "Left", "Right"] as const).map((label) => (
            <ContextCardTrigger
              key={label}
              content={card}
              side={label.toLowerCase() as "top" | "bottom" | "left" | "right"}
            >
              <span className="text-label-14 text-foreground">{demoText(language, label)}</span>
            </ContextCardTrigger>
          ))}
        </div>,
      )}
      {demo(
        "alignment",
        demoCode("alignment"),
        <div className="flex flex-wrap items-center gap-3">
          {(["Start", "Center", "End"] as const).map((label) => (
            <ContextCardTrigger
              key={label}
              content={card}
              align={label.toLowerCase() as "start" | "center" | "end"}
              render={
                <Button type="default" typeName="button">
                  {demoText(language, label)}
                </Button>
              }
            >
              {null}
            </ContextCardTrigger>
          ))}
        </div>,
      )}
      {demo(
        "render-prop",
        demoCode("render-prop"),
        <div className="flex flex-wrap items-center gap-3">
          <ContextCardTrigger
            content={card}
            render={
              <Button type="default" typeName="button">
                {demoText(language, "Default wrapper")}
              </Button>
            }
          >
            {null}
          </ContextCardTrigger>
          <ContextCardTrigger
            content={card}
            render={
              <a href="#render-prop" className="text-blue-700 underline underline-offset-2">
                {demoText(language, "Rendered as a link")}
              </a>
            }
          >
            {null}
          </ContextCardTrigger>
        </div>,
      )}
    </div>
  );
}

function ContextMenuDemo() {
  const demoCode = (id: string) => DEMO_CODE["context-menu"]?.[id] ?? "";
  const { language } = useLanguage();
  const rightClickHere = demoText(language, "Right click here");
  const itemOne = demoText(language, "Item one");
  const itemTwo = demoText(language, "Item Two");
  const itemThree = demoText(language, "Item Three");
  const itemFour = demoText(language, "Item Four");

  const triggerArea = (
    <div className="w-[300px] rounded-[4px] border border-dashed border-[rgba(0,0,0,0.34)] py-[45px] text-center text-copy-14 text-gray-1000">
      {rightClickHere}
    </div>
  );

  const menuIcon = (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
      data-slot="geist-icon"
      style={{ color: "currentcolor" }}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 10.63h7L8 4.5z"
      />
    </svg>
  );

  return (
    <div className="w-full max-w-[862px]">
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <span>{triggerArea}</span>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-[160px]">
                <ContextMenuItem>{itemOne}</ContextMenuItem>
                <ContextMenuItem>{itemTwo}</ContextMenuItem>
                <ContextMenuItem>{itemThree}</ContextMenuItem>
                <ContextMenuItem>{itemFour}</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("default")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="disabled-items"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="disabled-items">
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <span>{triggerArea}</span>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-[160px]">
                <ContextMenuItem>{itemOne}</ContextMenuItem>
                <ContextMenuItem disabled>{itemTwo}</ContextMenuItem>
                <ContextMenuItem disabled>{itemThree}</ContextMenuItem>
                <ContextMenuItem>{itemFour}</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("disabled-items")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="link-items"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="link-items">
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <span>{triggerArea}</span>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-[160px]">
                <ContextMenuItem href="/">{itemOne}</ContextMenuItem>
                <ContextMenuItem href="/">{itemTwo}</ContextMenuItem>
                <ContextMenuItem href="/">{itemThree}</ContextMenuItem>
                <ContextMenuItem href="/">{itemFour}</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("link-items")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="prefix-and-suffix"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="prefix-and-suffix">
            <div className="flex flex-col items-stretch justify-start gap-6 md:flex-row flex-initial">
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <span>{triggerArea}</span>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-[160px]">
                  <ContextMenuItem href="/" prefix={menuIcon}>
                    {itemOne}
                  </ContextMenuItem>
                  <ContextMenuItem href="/" prefix={menuIcon}>
                    {itemTwo}
                  </ContextMenuItem>
                  <ContextMenuItem href="/" prefix={menuIcon}>
                    {itemThree}
                  </ContextMenuItem>
                  <ContextMenuItem href="/" prefix={menuIcon}>
                    {itemFour}
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <span>{triggerArea}</span>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-[160px]">
                  <ContextMenuItem href="/" suffix={menuIcon}>
                    {itemOne}
                  </ContextMenuItem>
                  <ContextMenuItem href="/" suffix={menuIcon}>
                    {itemTwo}
                  </ContextMenuItem>
                  <ContextMenuItem href="/" suffix={menuIcon}>
                    {itemThree}
                  </ContextMenuItem>
                  <ContextMenuItem href="/" suffix={menuIcon}>
                    {itemFour}
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("prefix-and-suffix")} />
      </div>
    </div>
  );
}

function DotsMenuDemo() {
  const demoCode = (id: string) => DEMO_CODE["dots-menu"]?.[id] ?? "";
  const { language } = useLanguage();
  const items = (
    <>
      <DotsMenuItem>{demoText(language, "View Build Logs")}</DotsMenuItem>
      <DotsMenuItem>{demoText(language, "View Projects")}</DotsMenuItem>
      <DotsMenuItem>{demoText(language, "View Analytics")}</DotsMenuItem>
    </>
  );

  return (
    <div className="w-full max-w-[862px] space-y-6">
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <DotsMenu>{items}</DotsMenu>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("default")} />
      </div>
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="sizes"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="sizes">
            <div className="flex items-start gap-6">
              <DotsMenu iconSize={10}>{items}</DotsMenu>
              <DotsMenu iconSize={12}>{items}</DotsMenu>
              <DotsMenu iconSize={18}>{items}</DotsMenu>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("sizes")} />
      </div>
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="disabled"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="disabled">
            <DotsMenu disabled>{items}</DotsMenu>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("disabled")} />
      </div>
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="disabled-menu-item"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="disabled-menu-item">
            <DotsMenu>
              <DotsMenuItem>{demoText(language, "View Build Logs")}</DotsMenuItem>
              <DotsMenuItem disabled>{demoText(language, "View Projects")}</DotsMenuItem>
              <DotsMenuItem>{demoText(language, "View Analytics")}</DotsMenuItem>
            </DotsMenu>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("disabled-menu-item")} />
      </div>
    </div>
  );
}

function GaugeDemo() {
  return (
    <div className="flex items-center gap-6">
      <Gauge value={50} size="small" />
      <Gauge value={65} size="medium" />
      <Gauge value={80} size="large" />
    </div>
  );
}

function FileTreeDemo() {
  const demoCode = (id: string) => DEMO_CODE["file-tree"]?.[id] ?? "";
  return (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card="Default"
    >
      <div className="w-full p-6" data-demo-container="Default">
        <FileTree>
          <FileTreeItem>
            <FileTreeIcon type="folder-open" />
            <FileTreeLabel>app</FileTreeLabel>
            <FileTreeItem>
              <FileTreeIcon type="file" />
              <FileTreeLabel>main.tsx</FileTreeLabel>
            </FileTreeItem>
            <FileTreeItem>
              <FileTreeIcon type="file" />
              <FileTreeLabel>dashboard.tsx</FileTreeLabel>
            </FileTreeItem>
          </FileTreeItem>
          <FileTreeItem>
            <FileTreeIcon type="folder" />
            <FileTreeLabel>public</FileTreeLabel>
          </FileTreeItem>
        </FileTree>
      </div>
      <ShowCodeFooter code={demoCode("Default")} />
    </div>
  );
}

function ScrollerDemo() {
  return (
    <div className="w-full max-w-2xl">
      <Scroller>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="flex h-24 w-40 shrink-0 items-center justify-center rounded-md bg-gray-alpha-200 text-label-14 text-muted-foreground"
          >
            Item {i}
          </div>
        ))}
      </Scroller>
    </div>
  );
}

function KeyboardInputDemo() {
  const demoCode = (id: string) => DEMO_CODE["keyboard-input"]?.[id] ?? "";
  return (
    <div className="w-full max-w-[862px] space-y-6">
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"

        data-demo-card="modifiers"
      >
        <div
          className="flex h-[74px] w-full overflow-x-auto md:overflow-visible"
          data-demo-surface="modifiers"
        >
          <div className="w-full p-6" data-demo-container="modifiers">
            <Kbd meta />
            <Kbd shift />
            <Kbd alt />
            <Kbd ctrl />
          </div>
        </div>
        <ShowCodeFooter code={demoCode("modifiers")} />
      </div>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"

        data-demo-card="combination"
      >
        <div
          className="flex h-[74px] w-full overflow-x-auto md:overflow-visible"
          data-demo-surface="combination"
        >
          <div className="w-full p-6" data-demo-container="combination">
            <Kbd meta shift />
          </div>
        </div>
        <ShowCodeFooter code={demoCode("combination")} />
      </div>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"

        data-demo-card="small"
      >
        <div
          className="flex h-[72px] w-full overflow-x-auto md:overflow-visible"
          data-demo-surface="small"
        >
          <div className="w-full p-6" data-demo-container="small">
            <Kbd small>/</Kbd>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("small")} />
      </div>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="plain-command"
      >
        <div
          className="flex h-[72px] w-full items-center overflow-x-auto md:overflow-visible"
          data-demo-surface="plain-command"
        >
          <div className="w-full p-6" data-demo-container="plain-command">
            <Kbd plain meta>
              K
            </Kbd>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("plain-command")} />
      </div>
    </div>
  );
}

function BannerDemo() {
  const demoCode = (id: string) => DEMO_CODE.banner?.[id] ?? "";
  return (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card="Default"
    >
      <div className="flex w-full overflow-x-auto md:overflow-visible">
        <div className="w-full p-6" data-demo-container="Default">
          <Banner button={{ href: "#/components", content: "Read more" }}>
            <b>Big News</b> – New components finally available
          </Banner>
        </div>
      </div>
      <ShowCodeFooter code={demoCode("Default")} />
    </div>
  );
}

function BreadcrumbsDemo() {
  const { language } = useLanguage();
  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb type="text">
        <BreadcrumbItem href="#/">{demoText(language, "Home")}</BreadcrumbItem>
        <BreadcrumbItem href="#/components">Components</BreadcrumbItem>
        <BreadcrumbItem active>Breadcrumbs</BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb type="menu">
        <BreadcrumbItem>{demoText(language, "Home")}</BreadcrumbItem>
        <BreadcrumbItem>Components</BreadcrumbItem>
        <BreadcrumbItem active>Breadcrumbs</BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}

function ClearableInputDemo() {
  const demoCode = (id: string) => DEMO_CODE["clearable-input"]?.[id] ?? "";
  const { language } = useLanguage();
  const [defaultValue, setDefaultValue] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [callbackValue, setCallbackValue] = React.useState("");
  const [clearCount, setClearCount] = React.useState(0);

  return (
    <div className="w-full max-w-[862px] space-y-6">
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <ClearableInput
              aria-label={demoText(language, "Demo clearable input")}
              placeholder={demoText(language, "Enter some text…")}
              value={defaultValue}
              onChange={(event) => setDefaultValue(event.target.value)}
            />
          </div>
        </div>
        <ShowCodeFooter code={demoCode("default")} />
      </div>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"

        data-demo-card="with-label"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="with-label">
            <ClearableInput
              label={demoText(language, "Email")}
              placeholder={demoText(language, "Enter your email…")}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </div>
        <ShowCodeFooter code={demoCode("with-label")} />
      </div>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"

        data-demo-card="with-cmdk"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="with-cmdk">
            <ClearableInput
              aria-label={demoText(language, "Search with cmdk")}
              cmdk
              placeholder={demoText(language, "Search…")}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
        <ShowCodeFooter code={demoCode("with-cmdk")} />
      </div>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"

        data-demo-card="disabled"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="disabled">
            <ClearableInput
              aria-label={demoText(language, "Disabled clearable input")}
              disabled
              placeholder={demoText(language, "Enter some text…")}
              value="Some text"
              onChange={() => {}}
            />
          </div>
        </div>
        <ShowCodeFooter code={demoCode("disabled")} />
      </div>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"

        data-demo-card="with-clear-callback"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="with-clear-callback">
            <div className="flex flex-col gap-2">
              <ClearableInput
                aria-label={demoText(language, "Clearable input with callback")}
                placeholder={demoText(language, "Enter some text and clear…")}
                value={callbackValue}
                onChange={(event) => setCallbackValue(event.target.value)}
                onClear={() => setClearCount((count) => count + 1)}
              />
              <p className="text-copy-14 text-gray-900">
                {demoTextWithValues(language, "Cleared {count} times", { count: clearCount })}
              </p>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("with-clear-callback")} />
      </div>
    </div>
  );
}

const COLLAPSE_DIVIDER_CLS = "border-[#eaeaea] dark:border-[#333333]";

function CollapseDemo() {
  const demoCode = (id: string) => DEMO_CODE.collapse?.[id] ?? "";
  const { language } = useLanguage();
  const questionA = demoText(language, "Question A");
  const questionB = demoText(language, "Question B");
  const lorem = demoText(
    language,
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  );
  const duis = demoText(
    language,
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  );
  const renderItem = (title: string, body: string, defaultOpen = false, disabled = false) => (
    <Collapse
      className={`border-b ${COLLAPSE_DIVIDER_CLS}`}
      defaultOpen={defaultOpen}
      disabled={disabled}
    >
      <h3 className="text-[24px] font-semibold text-foreground">
        <CollapseTrigger>{title}</CollapseTrigger>
      </h3>
      <CollapseContent>
        <div className="overflow-hidden text-base leading-[26px]">
          <p className="mb-4 text-copy-16 text-muted-foreground">{body}</p>
        </div>
      </CollapseContent>
    </Collapse>
  );
  return (
    <>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <div className={`border-t ${COLLAPSE_DIVIDER_CLS}`}>
              {renderItem(questionA, lorem)}
              {renderItem(questionB, duis)}
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("default")} />
      </div>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="expanded"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="expanded">
            <div className={`border-t ${COLLAPSE_DIVIDER_CLS}`}>
              {renderItem(questionA, lorem)}
              {renderItem(questionB, duis, true, true)}
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("expanded")} />
      </div>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="multiple"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="multiple">
            <div className={`border-t ${COLLAPSE_DIVIDER_CLS}`}>
              {renderItem(questionA, lorem)}
              {renderItem(questionB, duis)}
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("multiple")} />
      </div>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="small"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="small">
            <Collapse size="small" className={`border-t border-b ${COLLAPSE_DIVIDER_CLS}`}>
              <h3 className="text-[16px] font-medium text-foreground">
                <CollapseTrigger>{questionA}</CollapseTrigger>
              </h3>
              <CollapseContent>
                <div className="overflow-hidden text-base leading-[26px]">
                  <p className="mb-4 text-copy-16 text-muted-foreground">{lorem}</p>
                </div>
              </CollapseContent>
            </Collapse>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("small")} />
      </div>
    </>
  );
}

function ComboboxDemo() {
  const demoCode = (id: string) => DEMO_CODE.combobox?.[id] ?? "";
  const { language } = useLanguage();
  const [controlledValue, setControlledValue] = React.useState("b");
  const [clearableValue, setClearableValue] = React.useState("two");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [sheetLinked] = React.useState<string[]>([]);
  const [sheetSearch] = React.useState("");

  const SHARED_VARS = [
    { key: "CONTENTFUL_MANAGEMENT_APP_INSTALLATION_ID", target: "Preview and Production" },
    { key: "EXTENSION_AUTH_JWT_SECRET", target: "Development" },
    { key: "SCREENSHOT_SECRET_DEPLOYMENT_SUMMARY", target: "failover" },
    { key: "FLAGS_VERCEL_MARKETING", target: "Preview and Production" },
    { key: "FLAGS_VERCEL_MARKETING", target: "Development" },
    { key: "FLAGS_VERCEL_MARKETING", target: "Preview" },
    { key: "DATABASE_URL", target: "Production" },
    { key: "REDIS_URL", target: "Preview and Production" },
    { key: "STRIPE_SECRET_KEY", target: "Production" },
    { key: "STRIPE_WEBHOOK_SECRET", target: "Development" },
    { key: "OPENAI_API_KEY", target: "Preview and Production" },
    { key: "SENTRY_AUTH_TOKEN", target: "Preview" },
    { key: "NEXT_PUBLIC_ANALYTICS_ID", target: "Development" },
    { key: "AWS_ACCESS_KEY_ID", target: "Production" },
    { key: "AWS_SECRET_ACCESS_KEY", target: "Production" },
    { key: "GITHUB_APP_PRIVATE_KEY", target: "Preview and Production" },
  ];
  const searchLabel = demoText(language, "Search");
  const searchPlaceholder = demoText(language, "Search...");
  const countriesPlaceholder = demoText(language, "Search countries…");
  const countryLabel = demoText(language, "Select your country");

  const simpleOptions = [
    { value: "a", label: "One" },
    { value: "b", label: "Two" },
    { value: "c", label: "Three" },
  ];

  const countryOptions = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France" },
    { value: "jp", label: "Japan" },
    { value: "au", label: "Australia" },
    { value: "br", label: "Brazil" },
  ];

  return (
    <div className="w-full max-w-[862px]">
      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="uncontrolled"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="uncontrolled">
            <Combobox aria-label={searchLabel} placeholder={searchPlaceholder}>
              <ComboboxInput />
              <ComboboxList>
                {simpleOptions.map((option) => (
                  <ComboboxOption key={option.value} value={option.value}>
                    {option.label}
                  </ComboboxOption>
                ))}
              </ComboboxList>
            </Combobox>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("uncontrolled")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="controlled"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="controlled">
            <Combobox
              aria-label={searchLabel}
              placeholder={searchPlaceholder}
              value={controlledValue}
              onValueChange={setControlledValue}
            >
              <ComboboxInput />
              <ComboboxList>
                {simpleOptions.map((option) => (
                  <ComboboxOption key={option.value} value={option.value}>
                    {option.label}
                  </ComboboxOption>
                ))}
              </ComboboxList>
            </Combobox>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("controlled")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="disabled"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="disabled">
            <Combobox aria-label={searchLabel} placeholder={searchPlaceholder} disabled>
              <ComboboxInput />
              <ComboboxList>
                {simpleOptions.map((option) => (
                  <ComboboxOption key={option.value} value={option.value}>
                    {option.label}
                  </ComboboxOption>
                ))}
              </ComboboxList>
            </Combobox>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("disabled")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="sizes"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="sizes">
            <div className="flex flex-col md:flex-row items-stretch justify-start gap-4 flex-initial">
              <Combobox
                aria-label={searchLabel}
                placeholder={searchPlaceholder}
                size="small"
                className="w-[235px]"
              >
                <ComboboxInput />
                <ComboboxList>
                  {simpleOptions.map((option) => (
                    <ComboboxOption key={option.value} value={option.value}>
                      {option.label}
                    </ComboboxOption>
                  ))}
                </ComboboxList>
              </Combobox>
              <Combobox
                aria-label={searchLabel}
                placeholder={searchPlaceholder}
                className="w-[235px]"
              >
                <ComboboxInput />
                <ComboboxList>
                  {simpleOptions.map((option) => (
                    <ComboboxOption key={option.value} value={option.value}>
                      {option.label}
                    </ComboboxOption>
                  ))}
                </ComboboxList>
              </Combobox>
              <Combobox
                aria-label={searchLabel}
                placeholder={searchPlaceholder}
                size="large"
                className="w-[257px]"
              >
                <ComboboxInput />
                <ComboboxList>
                  {simpleOptions.map((option) => (
                    <ComboboxOption key={option.value} value={option.value}>
                      {option.label}
                    </ComboboxOption>
                  ))}
                </ComboboxList>
              </Combobox>
            </div>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("sizes")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="with-label"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="with-label">
            <Combobox
              label={countryLabel}
              aria-label={countryLabel}
              placeholder={countriesPlaceholder}
            >
              <ComboboxInput />
              <ComboboxList>
                {countryOptions.map((option) => (
                  <ComboboxOption key={option.value} value={option.value}>
                    {option.label}
                  </ComboboxOption>
                ))}
              </ComboboxList>
            </Combobox>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("with-label")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="clearable"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="clearable">
            <Combobox
              aria-label={searchLabel}
              placeholder={searchPlaceholder}
              value={clearableValue}
              onValueChange={setClearableValue}
            >
              <ComboboxInput />
              <ComboboxList>
                {simpleOptions.map((option) => (
                  <ComboboxOption key={option.value} value={option.value}>
                    {option.label}
                  </ComboboxOption>
                ))}
              </ComboboxList>
            </Combobox>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("clearable")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="errored"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="errored">
            <Combobox aria-label={searchLabel} errored placeholder={searchPlaceholder}>
              <ComboboxInput />
              <ComboboxList>
                {simpleOptions.map((option) => (
                  <ComboboxOption key={option.value} value={option.value}>
                    {option.label}
                  </ComboboxOption>
                ))}
              </ComboboxList>
            </Combobox>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("errored")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="custom-width-input"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="custom-width-input">
            <Combobox aria-label={searchLabel} placeholder={searchPlaceholder} width={256}>
              <ComboboxInput />
              <ComboboxList>
                {simpleOptions.map((option) => (
                  <ComboboxOption key={option.value} value={option.value}>
                    {option.label}
                  </ComboboxOption>
                ))}
              </ComboboxList>
            </Combobox>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("custom-width-input")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="custom-width-list"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="custom-width-list">
            <Combobox aria-label={searchLabel} placeholder={searchPlaceholder} width={256}>
              <ComboboxInput />
              <ComboboxList maxWidth={500}>
                <ComboboxOption value="a">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </ComboboxOption>
                <ComboboxOption value="b">
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                  ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
                  esse cillum dolore eu fugiat nulla pariatur.
                </ComboboxOption>
                <ComboboxOption value="c">
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </ComboboxOption>
              </ComboboxList>
            </Combobox>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("custom-width-list")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="custom-empty-message"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="custom-empty-message">
            <Combobox aria-label={searchLabel} placeholder={searchPlaceholder} width={256}>
              <ComboboxInput />
              <ComboboxList emptyMessage="Nothing to see here..." />
            </Combobox>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("custom-empty-message")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="with-prefix-icons"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="with-prefix-icons">
            <Combobox aria-label={searchLabel} className="w-fit" placeholder={searchPlaceholder}>
              <ComboboxInput />
              <ComboboxList>
                {simpleOptions.map((option) => (
                  <ComboboxOption
                    key={option.value}
                    value={option.value}
                    prefix={<Triangle className="size-4" aria-hidden />}
                  >
                    {option.label}
                  </ComboboxOption>
                ))}
              </ComboboxList>
            </Combobox>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("with-prefix-icons")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="with-suffix-icons"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="with-suffix-icons">
            <Combobox aria-label={searchLabel} className="w-fit" placeholder={searchPlaceholder}>
              <ComboboxInput />
              <ComboboxList>
                {simpleOptions.map((option) => (
                  <ComboboxOption
                    key={option.value}
                    value={option.value}
                    suffix={<Triangle className="size-4" aria-hidden />}
                  >
                    {option.label}
                  </ComboboxOption>
                ))}
              </ComboboxList>
            </Combobox>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("with-suffix-icons")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="used-inside-modal"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="used-inside-modal">
            <Button onClick={() => setModalOpen(true)} size="small" typeName="button">
              Open Modal
            </Button>
            <Modal open={modalOpen} onOpenChange={setModalOpen}>
              <ModalContent onInteractOutside={() => setModalOpen(false)}>
                <ModalHeader>
                  <ModalTitle>Create Token</ModalTitle>
                  <ModalDescription>
                    Enter a unique name for your token to differentiate it from other tokens and
                    then select the scope.
                  </ModalDescription>
                </ModalHeader>
                <div className="mx-[-20px] border-t border-gray-400 bg-background-200 px-5 py-6">
                  <div className="flex flex-col gap-2.5">
                    <Combobox
                      aria-label="Region"
                      label="Region"
                      placeholder={searchPlaceholder}
                      size="small"
                    >
                      <ComboboxInput />
                      <ComboboxList>
                        {simpleOptions.map((option) => (
                          <ComboboxOption key={option.value} value={option.value}>
                            {option.label}
                          </ComboboxOption>
                        ))}
                      </ComboboxList>
                    </Combobox>
                    <p className="text-copy-13 text-gray-900">
                      This is the region where your database reads and writes will take place.
                    </p>
                  </div>
                </div>
                <div className="h-px w-full" aria-hidden />
                <ModalFooter>
                  <Button typeName="button" type="secondary" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button typeName="button" onClick={() => setModalOpen(false)}>
                    Submit
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("used-inside-modal")} />
      </div>

      <div
        className="relative mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="inside-sheet"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="inside-sheet">
            <Sheet modal>
              <SheetTrigger asChild>
                <Button size="small" typeName="button">
                  Link Shared Variable
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="m-3 flex h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] max-w-3xl flex-col overflow-clip rounded-2xl bg-background-100 p-0 lg:w-5/6 sm:max-w-[auto]"
              >
                <div className="flex flex-shrink-0 items-center justify-between pt-3 pl-4 pr-3">
                  <SheetTitle className="text-heading-20">Link Shared Variable</SheetTitle>
                  <SheetClose asChild>
                    <Button
                      aria-label="Close"
                      shape="square"
                      svgOnly
                      type="tertiary"
                      typeName="button"
                    >
                      <X className="size-4" aria-hidden />
                    </Button>
                  </SheetClose>
                </div>
                <p className="px-4 pb-2 text-copy-14 text-gray-900">
                  Changes to shared variables sync automatically across all linked projects.
                </p>
                <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-1">
                  <Combobox
                    aria-label="Search for shared environment variables"
                    placeholder="Search for shared environment variables…"
                    value={sheetSearch}
                  >
                    <ComboboxInput />
                    <ComboboxList>
                      {SHARED_VARS.filter(
                        (v) => !sheetLinked.includes(`${v.key}::${v.target}`),
                      ).map((v) => (
                        <ComboboxOption
                          ignoreDefaultHeight
                          key={`${v.key}::${v.target}`}
                          value={`${v.key}::${v.target}`}
                        >
                          <div className="flex flex-col items-stretch justify-start py-[15px] px-2">
                            <p className="font-mono text-sm font-medium">{v.key}</p>
                            <p className="mt-[3px] text-xs text-gray-900">{v.target}</p>
                          </div>
                        </ComboboxOption>
                      ))}
                    </ComboboxList>
                  </Combobox>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("inside-sheet")} />
      </div>
    </div>
  );
}

function DescriptionDemo() {
  const demoCode = (id: string) => DEMO_CODE.description?.[id] ?? "";
  const { language } = useLanguage();
  const title = demoText(language, "Section Title");
  const content = demoText(language, "Data about this section.");
  const tooltip = demoText(language, "Additional context about what this section refers to.");
  return (
    <>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <Description data-demo-id="default" title={title} content={content} tooltip={tooltip} />
          </div>
        </div>
        <ShowCodeFooter code={demoCode("default")} />
      </div>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="text-right"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="text-right">
            <Description
              data-demo-id="text-right"
              right
              title={title}
              content={content}
              tooltip={tooltip}
            />
          </div>
        </div>
        <ShowCodeFooter code={demoCode("text-right")} />
      </div>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="ellipsis"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="ellipsis">
            <Description
              data-demo-id="ellipsis"
              ellipsis
              title={title}
              content={demoText(
                language,
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed venenatis libero.",
              )}
              tooltip={tooltip}
            />
          </div>
        </div>
        <ShowCodeFooter code={demoCode("ellipsis")} />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Entity demo — 官方 vercel.com/geist/entity 逐 demo 复刻（6 demos）。  */
/* 官方 class 原样保留；官方 CSS 变量缺失时在卡片上以内联变量补齐。      */
/* ------------------------------------------------------------------ */

const ENTITY_DEMO_VARS = {
  "--geist-gap-half": "6px",
  "--geist-form-small-font": "14px",
  "--geist-background": "var(--entity-list-background)",
  "--accents-1": "#fafafa",
  "--accents-2": "var(--entity-list-divider)",
  "--ds-shadow-border": "0 0 0 1px var(--ds-gray-alpha-400)",
  "--ds-gray-200": "var(--gray-200)",
  "--ds-focus-ring": "0 0 0 2px var(--background-100), 0 0 0 4px var(--focus-ring-color)",
} as React.CSSProperties;

const ENTITY_AVATAR_CLS =
  'w-[var(--size)] h-[var(--size)] shrink-0 rounded-full inline-block overflow-hidden leading-0 align-top relative transition-[background] duration-200 ease-in-out after:content-[""] after:w-full after:h-full after:absolute after:inset-0 after:rounded-full after:border after:border-[var(--ds-gray-alpha-400)] data-[mask=false]:rounded-md data-[mask=false]:after:hidden data-[mask=false]:before:hidden data-[resolved=false]:before:content-[""] data-[resolved=false]:before:w-full data-[resolved=false]:before:h-full data-[resolved=false]:before:absolute data-[resolved=false]:before:inset-0 data-[resolved=false]:before:rounded-full data-[resolved=false]:before:bg-gradient-to-r data-[resolved=false]:before:from-[var(--accents-1)] data-[resolved=false]:before:via-[var(--accents-2)] data-[resolved=false]:before:to-[var(--accents-1)] data-[resolved=false]:before:bg-[length:400%_100%] data-[resolved=false]:before:animate-loading [mask-image:radial-gradient(circle,white,black)] [-webkit-mask-image:radial-gradient(circle,white,black)]';

const ENTITY_AVATAR_IMG_CLS = "h-auto max-w-full  w-full h-full relative";

const ENTITY_SKELETON_CLS =
  'block rounded-[5px] after:animate-loading-skeleton relative overflow-hidden after:content-[""] after:absolute after:inset-0 after:right-[-200%] after:bg-gradient-to-r after:from-gray-100 after:via-gray-200 after:to-gray-100 after:bg-[length:50%_100%] after:bg-[position:0_0]';

const ENTITY_UL_CLS =
  "bg-[var(--geist-background)] shadow-[var(--ds-shadow-border),0_4px_6px_rgba(0,0,0,0.04)] rounded-[5px] overflow-hidden list-none m-0 p-0 [&>li:not(:last-child)]:border-b [&>li:not(:last-child)]:border-[color:var(--accents-2)] [&>button:not(:last-child)]:border-b! [&>button:not(:last-child)]:border-[color:var(--accents-2)]";

const ENTITY_DECLINE_BTN_CLS =
  "outline-none m-0 p-0 border-0 align-baseline no-underline group/trigger relative cursor-pointer select-none transform translate-z-0 flex text-[var(--themed-fg,_var(--ds-background-100))] bg-[var(--themed-bg,_var(--ds-gray-1000))] font-medium !px-(--geist-gap-half) max-w-full items-center justify-center transition-[border-color, background,color,transform,box-shadow] duration-[time:150ms] ease-in-out data-[focus]:shadow-[var(--ds-focus-ring)] [&_svg]:shrink-0 disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:text-[var(--ds-gray-700)] disabled:bg-[var(--ds-gray-100)] aria-disabled:text-[var(--ds-gray-700)] aria-disabled:bg-[var(--ds-gray-100)] disabled:![--themed-border:_var(--ds-gray-400)] [--x-padding:6px] [--height:32px] !pl-[var(--x-padding)] !pr-[var(--x-padding)] rounded-md [--themed-bg:_var(--ds-background-100)] shadow-[0_0_0_1px_var(--themed-border,_transparent)] [--themed-hover-bg:_var(--ds-gray-alpha-200)] [--themed-fg:_var(--ds-gray-1000)] [--themed-border:_var(--ds-gray-400)] data-[focus]:shadow-[0_0_0_1px_var(--themed-border,_transparent),0_0_0_2px_var(--ds-background-100),0_0_0_4px_var(--ds-focus-color)] data-[focus]:transition-none text-(length:--geist-form-small-font) [--spinner-size:16px] h-[var(--height)] data-hover:bg-[var(--ds-gray-100)] dark-theme:data-hover:bg-[var(--ds-gray-200)] data-hover:text-[var(--themed-fg)] data-hover:disabled:bg-[var(--ds-gray-100)]";

const ENTITY_CHECKBOX_ROW_CLS =
  "p-4 flex flex-col items-stretch justify-start flex-initial bg-inherit w-full text-left cursor-pointer transition-colors duration-100 ease-in-out hover:bg-[var(--accents-1)]";

const ENTITY_CHECKBOX_VISUAL_CLS =
  "[--checkbox-color:var(--ds-gray-700)] inline-flex items-center justify-center size-4 relative bg-[var(--ds-background-100)] border border-[var(--ds-gray-700)] rounded-sm transition-all duration-200 rotate-[0.000001deg] peer-checked:[&:not(.indeterminate)]:bg-[var(--ds-gray-1000)] peer-checked:[&:not(.indeterminate)]:border-[var(--ds-gray-1000)] peer-disabled:peer-checked:[&:not(.indeterminate)]:bg-[var(--ds-gray-600)] peer-disabled:peer-checked:[&:not(.indeterminate)]:border-[var(--ds-gray-600)] peer-disabled:not-peer-checked:bg-[var(--ds-gray-100)] peer-disabled:not-peer-checked:border-[var(--ds-gray-500)] peer-disabled:[&.indeterminate_svg_line]:stroke-[var(--ds-gray-500)] peer-hover:not-peer-disabled:not-peer-checked:bg-[var(--ds-gray-200)] peer-focus-visible:shadow-[var(--ds-focus-ring)] peer-focus-visible:not-peer-checked:not-peer-disabled:bg-[var(--ds-gray-200)] group [&:not(.indeterminate)_svg_path]:invisible peer-checked:[&:not(.indeterminate)_svg_path]:visible [&:not(.indeterminate)_svg_line]:invisible [&.indeterminate_svg_line]:visible [&.indeterminate_svg_path]:invisible !important [&.inverted_svg_path]:visible";

function EntityDemo() {
  const demoCode = (id: string) => DEMO_CODE.entity?.[id] ?? "";
  const { language } = useLanguage();
  const connected = demoText(language, "Connected 1h ago");
  const lastUsedJustNow = demoText(language, "Last used just now");
  const lastUsed10 = demoText(language, "Last used 10min ago");
  const lastUsed25 = demoText(language, "Last used 25min ago");
  const decline = demoText(language, "Decline");
  const simpleDesc = demoText(language, "This is a simple description");
  const dashedTitle = demoText(language, "Entity with dashed borders");
  const ghDesktop = demoText(language, "GitHub Desktop on MacBook Pro");
  const vsCode = demoText(language, "VS Code on Windows 11");
  const terminalUbuntu = demoText(language, "Terminal on Ubuntu 24.04");

  const memberRows = [
    { title: ghDesktop, desc: lastUsedJustNow },
    { title: vsCode, desc: lastUsed10 },
    { title: terminalUbuntu, desc: lastUsed25 },
  ];

  return (
    <div className="w-full max-w-[862px] space-y-6 [--entity-list-background:var(--background-100)] [--entity-list-divider:#eaeaea] dark:[--entity-list-background:var(--background-200)] dark:[--entity-list-divider:#333333]">
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
        style={ENTITY_DEMO_VARS}
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <Entity>
              <EntityMedia>
                <span
                  className={ENTITY_AVATAR_CLS}
                  role="img"
                  aria-label="Avatar for evilrabbit"
                  data-geist-avatar=""
                  data-mask="true"
                  data-resolved="true"
                  data-version="v1"
                  style={{ "--size": "32px" } as React.CSSProperties}
                >
                  <img
                    src="https://vercel.com/api/www/avatar?s=64&u=evilrabbit"
                    alt="Avatar for evilrabbit"
                    title="Avatar for evilrabbit"
                    loading="eager"
                    width={32}
                    height={32}
                    decoding="sync"
                    data-nimg="1"
                    data-version="v1"
                    className={ENTITY_AVATAR_IMG_CLS}
                    style={{ color: "transparent" }}
                  />
                </span>
              </EntityMedia>
              <EntityContent fill>
                <EntityTitle>Evil Rabbit</EntityTitle>
                <EntityDescription>Glenn Hitchcock (@gln)</EntityDescription>
              </EntityContent>
              <EntityAction>
                <p className="text-copy-14 text-gray-1000">{connected}</p>
              </EntityAction>
            </Entity>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("default")} />
      </div>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"

        data-demo-card="entity-with-skeleton"
        style={ENTITY_DEMO_VARS}
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="entity-with-skeleton">
            <Entity>
              <div className="flex flex-col items-stretch justify-start gap-2 flex-1">
                <span
                  className={ENTITY_SKELETON_CLS}
                  style={{ width: "100%", minHeight: "20px" }}
                />
                <div className="flex flex-row items-center justify-start gap-2 flex-initial">
                  <span
                    className={ENTITY_SKELETON_CLS}
                    style={{ width: "70px", minHeight: "20px" }}
                  />
                  <span
                    className={ENTITY_SKELETON_CLS}
                    style={{ width: "60px", minHeight: "20px" }}
                  />
                  <span
                    className={ENTITY_SKELETON_CLS}
                    style={{ width: "68px", minHeight: "20px" }}
                  />
                </div>
              </div>
            </Entity>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("entity-with-skeleton")} />
      </div>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"

        data-demo-card="entity-with-list"
        style={ENTITY_DEMO_VARS}
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="entity-with-list">
            <ul className={ENTITY_UL_CLS}>
              {memberRows.map((row) => (
                <Entity key={row.title}>
                  <EntityContent>
                    <EntityTitle>{row.title}</EntityTitle>
                    <EntityDescription>{row.desc}</EntityDescription>
                  </EntityContent>
                  <EntityAction>
                    <button
                      type="submit"
                      data-geist-button=""
                      data-prefix="false"
                      data-suffix="false"
                      data-version="v1"
                      className={ENTITY_DECLINE_BTN_CLS}
                    >
                      <span className="truncate inline-block px-1.5">{decline}</span>
                    </button>
                  </EntityAction>
                </Entity>
              ))}
            </ul>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("entity-with-list")} />
      </div>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"

        data-demo-card="entity-with-list-and-checkbox"
        style={ENTITY_DEMO_VARS}
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="entity-with-list-and-checkbox">
            <ul className={ENTITY_UL_CLS}>
              {memberRows.map((row, index) => (
                <button key={row.title} type="submit" className={ENTITY_CHECKBOX_ROW_CLS}>
                  <section className="flex items-center gap-4">
                    <div className="left flex flex-1 items-center gap-4 min-w-0">
                      <label
                        className="text-[13px] inline-flex items-start cursor-pointer"
                        htmlFor={`entity-checkbox-${index}`}
                      >
                        <span className="flex relative items-center p-0.5 -m-0.5">
                          <input
                            id={`entity-checkbox-${index}`}
                            type="checkbox"
                            className="sr-only peer"
                            aria-label={row.title}
                            checked={index === 0}
                            readOnly
                          />
                          <span className={ENTITY_CHECKBOX_VISUAL_CLS}>
                            <svg fill="none" height="16" viewBox="0 0 20 20" width="16">
                              <path
                                className="stroke-[var(--geist-background)]"
                                d="M14 7L8.5 12.5L6 10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                              />
                              <line
                                className="stroke-[var(--checkbox-color)]"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                x1="5"
                                x2="15"
                                y1="10"
                                y2="10"
                              />
                            </svg>
                          </span>
                        </span>
                      </label>
                      <EntityContent>
                        <EntityTitle>{row.title}</EntityTitle>
                        <EntityDescription>{row.desc}</EntityDescription>
                      </EntityContent>
                    </div>
                  </section>
                </button>
              ))}
            </ul>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("entity-with-list-and-checkbox")} />
      </div>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"

        data-demo-card="entity-with-fill"
        style={ENTITY_DEMO_VARS}
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="entity-with-fill">
            <ul className={ENTITY_UL_CLS}>
              <Entity>
                <EntityContent fill>
                  <EntityDescription>{simpleDesc}</EntityDescription>
                </EntityContent>
                <EntityContent>
                  <EntityDescription>{simpleDesc}</EntityDescription>
                </EntityContent>
              </Entity>
            </ul>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("entity-with-fill")} />
      </div>
      <div
        className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"

        data-demo-card="entity-with-column-class-names"
        style={ENTITY_DEMO_VARS}
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="entity-with-column-class-names">
            <ul className={ENTITY_UL_CLS}>
              <Entity
                leftClassName="border border-dashed border-gray-300 rounded-md p-2"
                rightClassName="border border-dashed border-gray-300 rounded-md p-2"
              >
                <EntityMedia>
                  <span
                    className={ENTITY_AVATAR_CLS}
                    role="img"
                    aria-label="Placeholder Avatar"
                    data-geist-avatar=""
                    data-mask="true"
                    data-resolved="false"
                    data-version="v1"
                    style={{ "--size": "50px" } as React.CSSProperties}
                  />
                </EntityMedia>
                <EntityContent>
                  <EntityDescription>{dashedTitle}</EntityDescription>
                </EntityContent>
                <EntityAction>
                  <span className="text-copy-14 text-gray-1000">[some action]</span>
                </EntityAction>
              </Entity>
            </ul>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("entity-with-column-class-names")} />
      </div>
    </div>
  );
}

function ErrorDemo() {
  return <Error>Deployment failed. Review the build logs and try again.</Error>;
}

function ErrorCardDemo() {
  const demoCode = (id: string) => DEMO_CODE["error-card"]?.[id] ?? "";
  return (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card="Default"
    >
      <div className="flex w-full overflow-x-auto md:overflow-visible">
        <div className="w-full p-6" data-demo-container="Default">
          <ErrorCard className="w-full max-w-md" icon={<Trash2 className="size-6" />}>
            <ErrorCardTitle>No Credits Left</ErrorCardTitle>
            <ErrorCardDescription>Add credits to continue deploying projects.</ErrorCardDescription>
            <ErrorCardAction>
              <Button>Add Credits</Button>
            </ErrorCardAction>
          </ErrorCard>
        </div>
      </div>
      <ShowCodeFooter code={demoCode("Default")} />
    </div>
  );
}

function FieldSetDemo() {
  const demoCode = (id: string) => DEMO_CODE.fieldset?.[id] ?? "";
  type Action = { label: string; secondary?: boolean };
  type ExampleProps = {
    demoId?: string;
    title?: string;
    subtitle: string;
    type?: "default" | "error" | "warning";
    disabled?: boolean;
    highlight?: boolean;
    footerStatus?: React.ReactNode;
    actions?: Action[];
    children?: React.ReactNode;
  };

  function Example({
    demoId,
    title,
    subtitle,
    type,
    disabled,
    highlight,
    footerStatus,
    actions,
    children,
  }: ExampleProps) {
    const hasFooter = footerStatus !== undefined || Boolean(actions?.length);
    return (
      <Fieldset data-demo-card={demoId} type={type}>
        <FieldsetContent disabled={disabled}>
          {title && <FieldsetTitle>{title}</FieldsetTitle>}
          <FieldsetSubtitle>{subtitle}</FieldsetSubtitle>
          {children}
        </FieldsetContent>
        {hasFooter && (
          <FieldsetFooter highlight={highlight}>
            {footerStatus !== undefined && (
              <FieldsetFooterStatus>{footerStatus}</FieldsetFooterStatus>
            )}
            {Boolean(actions?.length) && (
              <FieldsetFooterActions>
                {actions?.map((action) => (
                  <FieldsetFooterAction
                    key={action.label}
                    type={action.secondary ? "secondary" : undefined}
                  >
                    {action.label}
                  </FieldsetFooterAction>
                ))}
              </FieldsetFooterActions>
            )}
          </FieldsetFooter>
        )}
        {demoId && <ShowCodeFooter code={demoCode(demoId)} />}
      </Fieldset>
    );
  }

  return (
    <div className="flex w-full max-w-[812px] flex-col gap-6">
      <Example
        demoId="default"
        title="Account Settings"
        subtitle="Manage your account preferences and settings"
        footerStatus={
          <span>
            Need help?{" "}
            <a href="#" className="cursor-pointer text-link hover:underline">
              View documentation
            </a>
          </span>
        }
        actions={[{ label: "Save Changes" }]}
      />
      <Example
        demoId="disabled"
        title="Transfer Project"
        subtitle="Move this project to another team or account"
        disabled
        highlight
        footerStatus="You need additional permissions to transfer projects."
      />
      <Example
        demoId="with-long-content"
        title="Privacy Policy"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam volutpat, nunc vel ultrices sollicitudin, dolor eros volutpat ex, et sagittis sem enim in eros. Curabitur eu consequat neque, non finibus odio. Donec vitae tellus eu mauris feugiat efficitur. Maecenas blandit sit amet tellus vel blandit. Phasellus ultrices vulputate arcu, vel dictum erat facilisis et."
        footerStatus="Last updated: March 10, 2025"
        actions={[{ label: "Decline", secondary: true }, { label: "Accept" }]}
      />
      <div className="flex flex-col gap-6" data-demo-card="multiple-fieldsets">
        <Example
          title="Personal Information"
          subtitle="Update your name and contact details"
          footerStatus="This information will be publicly visible"
          actions={[{ label: "Update" }]}
        />
        <Example
          title="Security"
          subtitle="Manage your password and authentication methods"
          footerStatus="Last password change: 30 days ago"
          actions={[{ label: "Change Password" }]}
        />
        <Example
          title="API Access"
          subtitle="Generate and manage API tokens for programmatic access"
          disabled
          highlight
          footerStatus="You need a Pro account to access API features."
        />
        <ShowCodeFooter code={demoCode("multiple-fieldsets")} />
      </div>
      <Example
        demoId="without-footer"
        title="Account Information"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquam nisl."
      />
      <Example
        demoId="without-title"
        subtitle="This fieldset contains only a subtitle with no title. It can be used for informational sections or supplementary content."
        footerStatus="Information only"
      />
      <Example
        demoId="with-error-text"
        title="API Configuration"
        subtitle="Configure your API endpoint and authentication"
        footerStatus="Last checked: 5 minutes ago"
        actions={[{ label: "Verify API Connection" }]}
      >
        <div className="mt-4">
          <ErrorText>
            API key validation failed. Please check your credentials and try again.
          </ErrorText>
        </div>
      </Example>
      <Example
        demoId="with-warning-text"
        title="Database Settings"
        subtitle="Configure your database connection parameters"
        footerStatus="Current status: Connected"
        actions={[{ label: "Cancel", secondary: true }, { label: "Apply Changes" }]}
      >
        <div className="mt-4">
          <WarningText>
            Changing these settings will require a restart of your application. Make sure to save
            any pending work.
          </WarningText>
        </div>
      </Example>
      <Example
        demoId="with-disabled-wall"
        title="Advanced Features"
        subtitle="Access premium capabilities and tools"
        disabled
        highlight
        footerStatus="Upgrade to a Pro plan to access these features."
      >
        <div className="relative mt-2 rounded-[6px] border border-gray-alpha-400 p-3">
          <p className="text-copy-14">
            This content is behind a disabled wall and not accessible to free users.
          </p>
          <p className="mt-2 text-copy-14">
            It contains advanced configuration options and premium features.
          </p>
          <DisabledWall />
        </div>
      </Example>
      <Example
        demoId="error-type"
        type="error"
        title="Payment Failed"
        subtitle="Your payment method was declined. Please update your billing information to continue using the service."
        footerStatus="Payment failed on February 10, 2026"
        actions={[
          { label: "Contact Support", secondary: true },
          { label: "Update Payment Method" },
        ]}
      />
      <Example
        demoId="warning-type"
        type="warning"
        title="Trial Ending Soon"
        subtitle="Your trial period will end in 3 days. Add a payment method to continue accessing premium features without interruption."
        footerStatus="Trial expires: February 13, 2026"
        actions={[{ label: "Remind Me Later", secondary: true }, { label: "Add Payment Method" }]}
      />
    </div>
  );
}

function LabelDemo() {
  const demoCode = (id: string) => DEMO_CODE.label?.[id] ?? "";
  const { language } = useLanguage();

  return (
    <>
      <div
        className="relative mt-6 w-full rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <Label id="label-default" value={demoText(language, "This is a label")} />
          </div>
        </div>
        <ShowCodeFooter code={demoCode("default")} />
      </div>

      <div
        className="relative mt-6 w-full rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="with-input"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="with-input">
            <Label id="test-input" value={demoText(language, "Email Address")} withInput />
            <Input aria-labelledby="test-input" id="test-input" />
          </div>
        </div>
        <ShowCodeFooter code={demoCode("with-input")} />
      </div>

      <div
        className="relative mt-6 w-full rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="bypass-casing"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="bypass-casing">
            <Label
              bypassCasing
              id="test-input"
              value={demoText(language, "Email address")}
              withInput
            />
            <Input aria-labelledby="test-input" id="test-input" />
          </div>
        </div>
        <ShowCodeFooter code={demoCode("bypass-casing")} />
      </div>
    </>
  );
}

function LoadingDotsDemo() {
  const demoCode = (id: string) => DEMO_CODE["loading-dots"]?.[id] ?? "";
  const { language } = useLanguage();
  const Card = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card={id}
    >
      <div className="w-full p-6" data-demo-container={id}>
        {children}
      </div>
      <ShowCodeFooter code={demoCode(id)} />
    </div>
  );
  return (
    <>
      <Card id="Default">
        <div className="flex flex-col items-start justify-between gap-6 flex-initial">
          <LoadingDots size="sm" />
          <LoadingDots size="md" />
          <LoadingDots size="lg" />
        </div>
      </Card>
      <Card id="With text">
        <LoadingDots size="md">
          <p className="text-copy-14 text-gray-900">{demoText(language, "Loading")}</p>
        </LoadingDots>
      </Card>
    </>
  );
}

function MiddleTruncateDemo() {
  const demoCode = (id: string) => DEMO_CODE["middle-truncate"]?.[id] ?? "";
  return (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card="Examples"
    >
      <div className="w-full p-6" data-demo-container="Examples">
        <div className="w-64 font-mono text-copy-13 text-foreground">
          <MiddleTruncate value="https://example.com/teams/hustradio/projects/unitary-ui/deployments/latest" />
        </div>
      </div>
      <ShowCodeFooter code={demoCode("Examples")} />
    </div>
  );
}

function MultiSelectDemo() {
  const demoCode = (id: string) => DEMO_CODE["multi-select"]?.[id] ?? "";
  const { language } = useLanguage();
  const actionItems = ["Design System", "Components", "Design Tokens"];
  const categories = ["Frameworks", "Libraries", "Development Tools", "Databases"];
  const controlledItems = [
    { id: "analytics", name: "Analytics" },
    { id: "monitoring", name: "Monitoring" },
    { id: "security", name: "Security" },
    { id: "performance", name: "Performance" },
  ];
  const [selectedActions, setSelectedActions] = React.useState(
    () => new Set(["Design System", "Components"]),
  );
  const [selectedCategories, setSelectedCategories] = React.useState(() => new Set(["Frameworks"]));
  const [selectedFeatures, setSelectedFeatures] = React.useState(() => new Set(["analytics"]));

  const toggle = (setter: React.Dispatch<React.SetStateAction<Set<string>>>, name: string) => {
    setter((current) => {
      const next = new Set(current);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const card = (id: string, children: React.ReactNode) => (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card={id}
    >
      <div data-demo-container={id} className="w-full p-6">
        {children}
      </div>
      <ShowCodeFooter code={demoCode(id)} />
    </div>
  );

  return (
    <div className="w-full space-y-6">
      {card(
        "select-actions",
        <div className="flex flex-col items-start gap-4">
          <MultiSelectRoot>
            <MultiSelectTrigger aria-label="Select design system items">
              {demoTextWithValues(language, "{count} selected", { count: selectedActions.size })}
            </MultiSelectTrigger>
            <MultiSelectContent>
              {actionItems.map((name) => (
                <MultiSelectRow
                  key={name}
                  name={name}
                  checked={selectedActions.has(name)}
                  onChange={() => toggle(setSelectedActions, name)}
                  onSelectOnly={() => setSelectedActions(new Set([name]))}
                  onSelectAll={() => setSelectedActions(new Set(actionItems))}
                />
              ))}
            </MultiSelectContent>
          </MultiSelectRoot>
          <p className="text-copy-14 text-foreground">
            Hover over items to see action labels. Different actions appear based on selection
            state.
          </p>
        </div>,
      )}

      {card(
        "keyboard-navigation",
        <div className="flex flex-col items-start gap-4">
          <MultiSelectRoot>
            <MultiSelectTrigger aria-label="Select categories">
              {demoTextWithValues(language, "{count} selected", { count: selectedCategories.size })}
            </MultiSelectTrigger>
            <MultiSelectContent>
              {categories.map((name) => (
                <MultiSelectRow
                  key={name}
                  name={name}
                  checked={selectedCategories.has(name)}
                  onChange={() => toggle(setSelectedCategories, name)}
                  onSelectOnly={() => setSelectedCategories(new Set([name]))}
                  onSelectAll={() => setSelectedCategories(new Set(categories))}
                />
              ))}
            </MultiSelectContent>
          </MultiSelectRoot>
          <p className="text-copy-14 text-foreground">
            Try keyboard navigation: ↑ ↓ for rows, ← → for checkbox/button focus, Tab to cycle
            through all elements
          </p>
        </div>,
      )}

      {card(
        "controlled-state",
        <div className="flex flex-col items-start gap-4">
          <MultiSelectRoot>
            <MultiSelectTrigger aria-label="Select features">
              {selectedFeatures.size === 0
                ? "No features selected"
                : selectedFeatures.size === controlledItems.length
                  ? "All features selected"
                  : `Selected: ${Array.from(selectedFeatures).join(", ")}`}
            </MultiSelectTrigger>
            <MultiSelectContent>
              {controlledItems.map((item) => (
                <MultiSelectRow
                  key={item.id}
                  name={item.name}
                  checked={selectedFeatures.has(item.id)}
                  onChange={() => toggle(setSelectedFeatures, item.id)}
                  onSelectOnly={() => setSelectedFeatures(new Set([item.id]))}
                  onSelectAll={() =>
                    setSelectedFeatures(new Set(controlledItems.map(({ id }) => id)))
                  }
                />
              ))}
            </MultiSelectContent>
          </MultiSelectRoot>
          <p className="text-copy-14 text-foreground">
            <button
              type="button"
              className="cursor-pointer text-link hover:underline focus-ring"
              onClick={() => setSelectedFeatures(new Set())}
            >
              Clear All
            </button>
            ,{" "}
            <button
              type="button"
              className="cursor-pointer text-link hover:underline focus-ring"
              onClick={() => setSelectedFeatures(new Set(["analytics", "monitoring"]))}
            >
              Core Features
            </button>
            ,{" "}
            <button
              type="button"
              className="cursor-pointer text-link hover:underline focus-ring"
              onClick={() => setSelectedFeatures(new Set(["security", "performance"]))}
            >
              Advanced Features
            </button>
          </p>
        </div>,
      )}
    </div>
  );
}

function PillDemo() {
  const demoCode = (id: string) => DEMO_CODE.pill?.[id] ?? "";
  const { language } = useLanguage();
  const [active, setActive] = React.useState("all");
  return (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card="Default"
    >
      <div className="w-full p-6" data-demo-container="Default">
        <div
          className="flex flex-wrap gap-2"
          aria-label={demoText(language, "Deployment status filter")}
        >
          {[
            ["all", "All"],
            ["ready", "Ready"],
            ["error", "Error"],
          ].map(([value, label]) => (
            <Pill
              key={value}
              variant={active === value ? "active" : "default"}
              aria-pressed={active === value}
              onClick={() => setActive(value)}
            >
              {label}
            </Pill>
          ))}
        </div>
      </div>
      <ShowCodeFooter code={demoCode("Default")} />
    </div>
  );
}

function RadioDemo() {
  const demoCode = (id: string) => DEMO_CODE.radio?.[id] ?? "";
  const { language } = useLanguage();

  return (
    <>
      <div
        className="relative mt-6 w-full rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <RadioGroup
              label={demoText(language, "Default Radio Example")}
              defaultValue="option-1"
              name="radio-default"
            >
              <div className="flex flex-col items-stretch justify-start gap-6">
                <RadioGroupItem value="option-1">{demoText(language, "Option 1")}</RadioGroupItem>
                <RadioGroupItem value="option-2">{demoText(language, "Option 2")}</RadioGroupItem>
              </div>
            </RadioGroup>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("default")} />
      </div>

      <div
        className="relative mt-6 w-full rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="radio-disabled"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="radio-disabled">
            <RadioGroup
              label={demoText(language, "Disabled Radio Example")}
              defaultValue="option-1"
              disabled
              name="radio-disabled"
            >
              <div className="flex flex-col items-stretch justify-start gap-6">
                <RadioGroupItem value="option-1">{demoText(language, "Option 1")}</RadioGroupItem>
                <RadioGroupItem value="option-2">{demoText(language, "Option 2")}</RadioGroupItem>
              </div>
            </RadioGroup>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("radio-disabled")} />
      </div>

      <div
        className="relative mt-6 w-full rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="radio-required"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="radio-required">
            <form className="flex flex-col items-start justify-start gap-6">
              <RadioGroup
                label={demoText(language, "Required Radio Example")}
                required
                name="radio-required"
              >
                <div className="flex flex-col items-stretch justify-start gap-4">
                  <RadioGroupItem value="option-1">{demoText(language, "Option 1")}</RadioGroupItem>
                  <RadioGroupItem value="option-2">{demoText(language, "Option 2")}</RadioGroupItem>
                </div>
              </RadioGroup>
              <Button typeName="submit" size="small">
                {demoText(language, "Submit")}
              </Button>
            </form>
          </div>
        </div>
        <ShowCodeFooter code={demoCode("radio-required")} />
      </div>

      <div
        className="relative mt-6 w-full rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="radio-headless"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="radio-headless">
            <RadioHeadlessDemo />
          </div>
        </div>
        <ShowCodeFooter code={demoCode("radio-headless")} />
      </div>

      <div
        className="relative mt-6 w-full rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="radio-standalone"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="radio-standalone">
            <RadioStandaloneDemo />
          </div>
        </div>
        <ShowCodeFooter code={demoCode("radio-standalone")} />
      </div>
    </>
  );
}

function RelativeTimeCardDemo() {
  const demoCode = (id: string) => DEMO_CODE["relative-time-card"]?.[id] ?? "";
  return (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card="Default"
    >
      <div className="flex w-full overflow-x-auto md:overflow-visible">
        <div className="w-full p-6" data-demo-container="Default">
          <RelativeTimeCard date={Date.now() - 5 * 60 * 1000} />
        </div>
      </div>
      <ShowCodeFooter code={demoCode("Default")} />
    </div>
  );
}

function SearchInputDemo() {
  const demoCode = (id: string) => DEMO_CODE["search-input"]?.[id] ?? "";
  const demos = [
    {
      id: "default",
      control: <SearchInput aria-label="Search" placeholder="Enter some text..." />,
    },
    {
      id: "with-cmdk",
      control: <SearchInput aria-label="Search" cmdk placeholder="Enter some text..." />,
    },
    {
      id: "disabled",
      control: <SearchInput aria-label="Search" cmdk disabled placeholder="Enter some text..." />,
    },
    {
      id: "loading",
      control: (
        <SearchInput
          aria-label="Search"
          defaultValue="Project A"
          loading
          placeholder="Enter some text..."
        />
      ),
    },
    {
      id: "custom-prefix",
      control: (
        <SearchInput
          aria-label="Search"
          placeholder="Enter some text..."
          prefix={<Sparkles className="size-4" aria-hidden />}
        />
      ),
    },
  ] as const;

  return (
    <div className="w-full space-y-6">
      {demos.map(({ id, control }) => (
        <div key={id} data-demo-card={id}>
          <div data-demo-container={id} className="w-full p-6">
            {control}
          </div>
          <ShowCodeFooter code={demoCode(id)} />
        </div>
      ))}
    </div>
  );
}

function ShowMoreDemo() {
  const demoCode = (id: string) => DEMO_CODE["show-more"]?.[id] ?? "";
  const [expanded, setExpanded] = React.useState(false);
  const copy =
    "Unitary provides reusable tokens, primitives, and component patterns for building consistent React interfaces in both light and dark themes.";
  const Card = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div
      className="mt-4 xl:mt-7 rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card={id}
    >
      <div className="w-full p-6" data-demo-container={id}>
        {children}
      </div>
      <ShowCodeFooter code={demoCode(id)} />
    </div>
  );
  return (
    <>
      <Card id="Default">
        <div className="flex w-full max-w-lg flex-col items-start gap-3">
          <p id="show-more-content" className="text-copy-14 text-foreground">
            {expanded ? copy : `${copy.slice(0, 88)}…`}
          </p>
          <ShowMore
            expanded={expanded}
            aria-controls="show-more-content"
            onClick={() => setExpanded((value) => !value)}
          />
        </div>
      </Card>
      <Card id="Expanded">
        <ShowMore expanded />
      </Card>
      <Card id="No border">
        <ShowMore noBorder />
      </Card>
    </>
  );
}
function SplitButtonDemo() {
  const { language } = useLanguage();
  return (
    <SplitButton>
      <SplitButtonMain>{demoText(language, "Deploy Project")}</SplitButtonMain>
      <SplitButtonMenu menuLabel={demoText(language, "More deployment actions")}>
        <MenuItem>{demoText(language, "Deploy to Preview")}</MenuItem>
        <MenuItem>{demoText(language, "Deploy to Production")}</MenuItem>
      </SplitButtonMenu>
    </SplitButton>
  );
}

/** 名称 → 实时 demo 渲染器（未命中的分支在调用前已拦截） */
function renderDemo(name: string): React.ReactNode {
  switch (name) {
    case "avatar":
      return <AvatarDemo />;
    case "badge":
      return <BadgeDemo />;
    case "banner":
      return <BannerDemo />;
    case "book":
      return <BookDemo />;
    case "breadcrumbs":
      return <BreadcrumbsDemo />;
    case "browser":
      return <BrowserDemo />;
    case "button":
      return <ButtonDemo />;
    case "calendar":
      return <CalendarDemo />;
    case "checkbox":
      return <CheckboxDemo />;
    case "choicebox":
      return <ChoiceboxDemo />;
    case "clearable-input":
      return <ClearableInputDemo />;
    case "collapse":
      return <CollapseDemo />;
    case "combobox":
      return <ComboboxDemo />;
    case "code":
      return <CodeDemo />;
    case "code-block":
      return <CodeBlockDemo />;
    case "command-menu":
      return <CommandMenuDemo />;
    case "context-card":
      return <ContextCardDemo />;
    case "context-menu":
      return <ContextMenuDemo />;
    case "copy-button":
      return <CopyButtonDemo />;
    case "destructive-action-modal":
      return <DestructiveActionModalDemo />;
    case "description":
      return <DescriptionDemo />;
    case "dots-menu":
      return <DotsMenuDemo />;
    case "menu":
      return <MenuDemo />;
    case "drawer":
      return <DrawerDemo />;
    case "empty-state":
      return <EmptyStateDemo />;
    case "entity":
      return <EntityDemo />;
    case "error":
      return <ErrorDemo />;
    case "error-card":
      return <ErrorCardDemo />;
    case "feedback":
      return <FeedbackDemo />;
    case "fieldset":
      return <FieldSetDemo />;
    case "file-tree":
      return <FileTreeDemo />;
    case "gauge":
      return <GaugeDemo />;
    case "grid":
      return <GridDemo />;
    case "input":
      return <InputDemo />;
    case "json-view":
      return <JsonViewDemo />;
    case "keyboard-input":
      return <KeyboardInputDemo />;
    case "label":
      return <LabelDemo />;
    case "load-more-button":
      return <LoadMoreButtonDemo />;
    case "loading-dots":
      return <LoadingDotsDemo />;
    case "modal":
      return <ModalDemo />;
    case "middle-truncate":
      return <MiddleTruncateDemo />;
    case "multi-select":
      return <MultiSelectDemo />;
    case "note":
      return <NoteDemo />;
    case "pagination":
      return <PaginationDemo />;
    case "phone":
      return <PhoneDemo />;
    case "pill":
      return <PillDemo />;
    case "project-banner":
      return <ProjectBannerDemo />;
    case "progress":
      return <ProgressDemo />;
    case "radio":
      return <RadioDemo />;
    case "relative-time-card":
      return <RelativeTimeCardDemo />;
    case "scroller":
      return <ScrollerDemo />;
    case "search-input":
      return <SearchInputDemo />;
    case "switch":
      return <SwitchDemo />;
    case "select":
      return <SelectDemo />;
    case "sheet":
      return <SheetDemo />;
    case "show-more":
      return <ShowMoreDemo />;
    case "separator":
      return <SeparatorDemo />;
    case "skeleton":
      return <SkeletonDemo />;
    case "slider":
      return <SliderDemo />;
    case "snippet":
      return <SnippetDemo />;
    case "spinner":
      return <SpinnerDemo />;
    case "split-button":
      return <SplitButtonDemo />;
    case "status-dot":
      return <StatusDotDemo />;
    case "step-point":
      return <StepPointDemo />;
    case "table":
      return <TableDemo />;
    case "tabs":
      return <TabsDemo />;
    case "text-with-copy-button":
      return <TextWithCopyButtonDemo />;
    case "textarea":
      return <TextareaDemo />;
    case "toast":
      return <ToastDemo />;
    case "toggle":
      return <ToggleDemo />;
    case "tooltip":
      return <TooltipDemo />;
    case "theme-switcher":
      return <ThemeSwitcherDemo />;
    case "video":
      return <VideoDemo />;
    default:
      return null;
  }
}

/* ---------- 额外分段（Sizes / Variants / States） ---------- */

function ExampleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const { language } = useLanguage();
  return (
    <section className="mt-10">
      <h2 className="text-heading-24 text-foreground">{demoText(language, title)}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Section({
  title,
  children,
  code,
}: {
  title: string;
  children: React.ReactNode;
  code?: string;
}) {
  const { language } = useLanguage();
  return (
    <section className="mt-10">
      <h2 className="text-heading-24 text-foreground">{demoText(language, title)}</h2>
      {code ? (
        <TableDemoCard code={code}>{children}</TableDemoCard>
      ) : (
        <div className="mt-6">{children}</div>
      )}
    </section>
  );
}

/* ---------- 额外分段共享常量与状态组件 ---------- */

const LOREM_IPSUM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

/** 官方 Custom color range 演示的粉色阈值色阶（0→pink-100 … 100→pink-1000，无 40 档） */
const GAUGE_PINK_SCALE = {
  "0": "var(--pink-100)",
  "10": "var(--pink-200)",
  "20": "var(--pink-300)",
  "30": "var(--pink-400)",
  "50": "var(--pink-500)",
  "60": "var(--pink-600)",
  "70": "var(--pink-700)",
  "80": "var(--pink-800)",
  "90": "var(--pink-900)",
  "100": "var(--pink-1000)",
};

function RadioHeadlessDemo() {
  const { language } = useLanguage();
  const [value, setValue] = React.useState("one");
  const { component } = useRadio({ value: "one", disabled: false });
  const { component: component2 } = useRadio({ value: "two", disabled: false });

  return (
    <RadioGroup aria-label={demoText(language, "Options")} onChange={setValue} value={value}>
      <div className="flex w-full min-w-56 flex-col items-stretch justify-start gap-6">
        <label className="flex w-full items-center justify-between leading-6">
          <span className="text-copy-13 leading-6 text-foreground">
            {demoText(language, "Option 1")}
          </span>
          {component}
        </label>
        <label className="flex w-full items-center justify-between leading-6">
          <span className="text-copy-13 leading-6 text-foreground">
            {demoText(language, "Option 2")}
          </span>
          {component2}
        </label>
      </div>
    </RadioGroup>
  );
}

function RadioStandaloneDemo() {
  return (
    <>
      <li className="flex w-full items-center gap-2">
        <span className="text-base leading-6 text-foreground">Option 1</span>
        <Radio aria-label="Option 1" defaultChecked value="one" />
      </li>
    </>
  );
}

function ToggleColorDemo() {
  const { language } = useLanguage();
  const [checked, setChecked] = React.useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row flex-wrap items-center gap-6">
        <Toggle
          aria-label={demoText(language, "Enable Firewall")}
          checked={checked}
          color="amber"
          onChange={() => setChecked(!checked)}
        />
        <Toggle
          aria-label={demoText(language, "Enable Firewall")}
          checked={checked}
          color="red"
          onChange={() => setChecked(!checked)}
        />
      </div>
      <div className="flex flex-row flex-wrap items-center gap-6">
        <Toggle
          aria-label={demoText(language, "Enable Firewall")}
          checked={checked}
          color="amber"
          onChange={() => setChecked(!checked)}
          size="large"
        />
        <Toggle
          aria-label={demoText(language, "Enable Firewall")}
          checked={checked}
          color="red"
          onChange={() => setChecked(!checked)}
          size="large"
        />
      </div>
    </div>
  );
}

function ToggleLabelDemo() {
  const { language } = useLanguage();
  const [checked, setChecked] = React.useState(false);
  const label = demoText(language, "Enable Firewall");

  return (
    <div className="flex flex-col items-start justify-start gap-4">
      <div className="flex flex-row flex-wrap items-center gap-6">
        <Toggle checked={checked} onChange={() => setChecked(!checked)}>
          {label}
        </Toggle>
        <Toggle checked={checked} direction="rtl" onChange={() => setChecked(!checked)}>
          {label}
        </Toggle>
      </div>
      <div className="flex flex-row flex-wrap items-center gap-6">
        <Toggle checked={checked} onChange={() => setChecked(!checked)} size="large">
          {label}
        </Toggle>
        <Toggle
          checked={checked}
          direction="rtl"
          onChange={() => setChecked(!checked)}
          size="large"
        >
          {label}
        </Toggle>
      </div>
    </div>
  );
}

/** Toast 额外演示分段 — 每个分段一个触发按钮（Toasts 视口由 App 根全局挂载） */
function ToastExtraSections() {
  const sectionCode = (title: string) => DEMO_CODE.toast?.[title] ?? "";
  const { language } = useLanguage();
  const toasts = useToasts();

  return (
    <>
      <Section title="Multi-line" code={sectionCode("Multi-line")}>
        <Button
          typeName="button"
          onClick={() =>
            toasts.message({
              text: "The Evil Rabbit jumped over the fence. The Evil Rabbit jumped over the fence. The Evil Rabbit jumped over the fence. The Evil Rabbit jumped over the fence.",
            })
          }
        >
          {demoText(language, "Show Toast")}
        </Button>
      </Section>
      <Section title="With jsx" code={sectionCode("With jsx")}>
        <Button
          typeName="button"
          onClick={() =>
            toasts.message({
              text: (
                <>
                  <span className="text-heading-14">The Evil Rabbit</span> jumped over the fence.
                </>
              ),
              preserve: true,
            })
          }
        >
          {demoText(language, "Show Toast")}
        </Button>
      </Section>
      <Section title="With a link" code={sectionCode("With a link")}>
        <Button
          typeName="button"
          onClick={() =>
            toasts.message({
              text: (
                <>
                  The Evil Rabbit jumped over the fence. The Evil Rabbit jumped over the{" "}
                  <a
                    href="#/components"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
                  >
                    fence again
                  </a>
                  .
                </>
              ),
              preserve: true,
            })
          }
        >
          {demoText(language, "Show Toast")}
        </Button>
      </Section>
      <Section title="Preserve" code={sectionCode("Preserve")}>
        <Button
          typeName="button"
          onClick={() =>
            toasts.message({
              text: "The Evil Rabbit jumped over the fence.",
              preserve: true,
            })
          }
        >
          {demoText(language, "Show Toast")}
        </Button>
      </Section>
      <Section title="Action" code={sectionCode("Action")}>
        <Button
          typeName="button"
          onClick={() =>
            toasts.message({
              text: "The Evil Rabbit jumped over the fence. The Evil Rabbit jumped over the fence again.",
              action: "Undo",
            })
          }
        >
          {demoText(language, "Show Toast")}
        </Button>
      </Section>
      <Section title="Undo" code={sectionCode("Undo")}>
        <Button
          typeName="button"
          onClick={() =>
            toasts.message({
              text: "The Evil Rabbit jumped over the fence. The Evil Rabbit jumped over the fence again.",
              onUndoAction: () => undefined,
            })
          }
        >
          {demoText(language, "Show Toast")}
        </Button>
      </Section>
      <Section title="Success" code={sectionCode("Success")}>
        <Button
          typeName="button"
          onClick={() => toasts.success("The Evil Rabbit jumped over the fence.")}
        >
          {demoText(language, "Show Toast")}
        </Button>
      </Section>
      <Section title="Warning" code={sectionCode("Warning")}>
        <Button
          typeName="button"
          onClick={() => toasts.warning("The Evil Rabbit jumped over the fence.")}
        >
          {demoText(language, "Show Toast")}
        </Button>
      </Section>
      <Section title="Error" code={sectionCode("Error")}>
        <Button
          typeName="button"
          onClick={() => toasts.error("The Evil Rabbit jumped over the fence.")}
        >
          {demoText(language, "Show Toast")}
        </Button>
      </Section>
    </>
  );
}

/** Tabs 额外演示分段 — 官方 5 demo 区块中除 Default 外的 4 个变体 */
function TabsExtraSections() {
  const sectionCode = (title: string) => DEMO_CODE.tabs?.[title] ?? "";
  const [git, setGit] = React.useState("github");
  return (
    <>
      <Section title="Disabled" code={sectionCode("Disabled")}>
        <Tabs
          disabled
          selected="apple"
          setSelected={() => {}}
          tabs={[
            { title: "Apple", value: "apple" },
            { title: "Orange", value: "orange" },
            { title: "Mango", value: "mango" },
          ]}
          ariaLabel="Disabled tabs"
        />
      </Section>
      <Section title="Disable specific tabs" code={sectionCode("Disable specific tabs")}>
        <Tabs
          selected="apple"
          setSelected={() => {}}
          tabs={[
            { title: "Apple", value: "apple" },
            { title: "Orange", value: "orange" },
            { title: "Mango", value: "mango", disabled: true, tooltip: "Mangos are not allowed" },
          ]}
          ariaLabel="Tabs with disabled tab"
        />
      </Section>
      <Section title="With icons" code={sectionCode("With icons")}>
        <Tabs
          selected={git}
          setSelected={setGit}
          tabs={[
            {
              title: "GitHub",
              value: "github",
              icon: <LayoutGrid className="size-4" aria-hidden />,
            },
            { title: "GitLab", value: "gitlab", icon: <List className="size-4" aria-hidden /> },
            {
              title: "Bitbucket",
              value: "bitbucket",
              icon: <Search className="size-4" aria-hidden />,
            },
          ]}
          ariaLabel="Tabs with icons"
        />
      </Section>
      <Section title="Secondary" code={sectionCode("Secondary")}>
        <Tabs
          variant="secondary"
          selected={git}
          setSelected={setGit}
          tabs={[
            { title: "GitHub", value: "github" },
            { title: "GitLab", value: "gitlab" },
            { title: "Bitbucket", value: "bitbucket", disabled: true },
          ]}
          ariaLabel="Secondary tabs"
        />
      </Section>
    </>
  );
}

const VIRTUALIZED_TABLE_ITEMS = [
  { product: "Brake Pads Set", usage: "100 sets", price: "$50 per set", charge: "$5,000.00" },
  { product: "Oil Filters", usage: "200 filters", price: "$10 per filter", charge: "$2,000.00" },
  {
    product: "Car Batteries",
    usage: "50 batteries",
    price: "$100 per battery",
    charge: "$5,000.00",
  },
  { product: "Headlight Bulbs", usage: "300 bulbs", price: "$15 per bulb", charge: "$4,500.00" },
  { product: "Windshield Wipers", usage: "250 pairs", price: "$20 per pair", charge: "$5,000.00" },
  { product: "Spark Plugs", usage: "500 sets", price: "$5 per set", charge: "$2,500.00" },
];

/** Table Virtualized 演示 — 官方 virtualize 语义：默认折叠显示前 9 行，ShowMore 展开全部 */
function VirtualizedTableDemo() {
  const [expanded, setExpanded] = React.useState(false);
  const rows = expanded ? 48 : 9;
  return (
    <div className="relative">
      <TableRoot>
        <Table>
          <TableColgroup>
            <TableCol className="w-[44%]" />
            <TableCol className="w-[22%]" />
            <TableCol className="w-[22%]" />
            <TableCol className="w-[11%]" />
          </TableColgroup>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Charge</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody interactive striped>
            {Array.from({ length: rows }, (_, index) => {
              const item = VIRTUALIZED_TABLE_ITEMS[index % VIRTUALIZED_TABLE_ITEMS.length];
              return (
                <TableRow key={`${item.product}-${index}`}>
                  <TableCell>{item.product}</TableCell>
                  <TableCell>{item.usage}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell className="tabular-nums text-right">{item.charge}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableRoot>
      {!expanded ? (
        <div className="from-background-100 pointer-events-none absolute bottom-0 left-0 h-[30%] w-full rounded bg-linear-to-t to-transparent opacity-80" />
      ) : null}
      <div className="flex justify-center pt-2">
        <ShowMore expanded={expanded} noBorder onClick={() => setExpanded(!expanded)} />
      </div>
    </div>
  );
}

/** 名称 → 额外演示分段（Sizes / Variants / States），未命中的组件返回 null */
function renderExtraSections(name: string, language: DocsLanguage): React.ReactNode {
  const sectionCode = (title: string) => DEMO_CODE[name]?.[title] ?? "";
  switch (name) {
    case "button":
      return (
        <>
          <Section title="Variants" code={sectionCode("Variants")}>
            <div className="flex flex-wrap items-center gap-3">
              <Button typeName="button">{demoText(language, "Default")}</Button>
              <Button typeName="button" type="secondary">
                Secondary
              </Button>
              <Button typeName="button" type="tertiary">
                Outline
              </Button>
              <Button typeName="button" type="tertiary">
                Ghost
              </Button>
              <Button typeName="button" type="error">
                Destructive
              </Button>
            </div>
          </Section>
          <Section title="Prefix and Suffix" code={sectionCode("Prefix and Suffix")}>
            <div className="flex flex-wrap items-center gap-3">
              <Button typeName="button" prefix={<Search aria-hidden />}>
                Search
              </Button>
              <Button typeName="button" type="secondary" prefix={<Copy aria-hidden />}>
                Copy
              </Button>
              <Button typeName="button" type="tertiary" loading>
                Loading
              </Button>
              <Button typeName="button" disabled>
                Disabled
              </Button>
            </div>
          </Section>
          <ExampleSection title="States and Composition">
            <ComponentDemoCards name="button">
              <ButtonDemo />
            </ComponentDemoCards>
          </ExampleSection>
        </>
      );
    case "calendar":
      return (
        <>
          <ExampleSection title="Horizontal Layout">
            <CalendarDemo example="horizontal-layout" />
          </ExampleSection>
          <ExampleSection title="Sizes">
            <CalendarDemo example="sizes" />
          </ExampleSection>
          <ExampleSection title="Presets">
            <CalendarDemo example="presets" />
          </ExampleSection>
          <ExampleSection title="Compact">
            <CalendarDemo example="compact" />
          </ExampleSection>
          <ExampleSection title="Stacked">
            <CalendarDemo example="stacked" />
          </ExampleSection>
          <ExampleSection title="Default Preset">
            <CalendarDemo example="presets-default" />
          </ExampleSection>
          <ExampleSection title="Date Bounds">
            <CalendarDemo example="min-max" />
          </ExampleSection>
          <ExampleSection title="Pinned Timezone">
            <CalendarDemo example="pinned-timezone" />
          </ExampleSection>
        </>
      );
    case "input":
      return (
        <>
          <Section title="States" code={sectionCode("States")}>
            <div className="flex w-full max-w-md flex-col gap-3">
              <Input
                placeholder={demoText(language, "Default")}
                aria-label={demoText(language, "Default")}
              />
              <Input
                placeholder={demoText(language, "Disabled")}
                disabled
                aria-label={demoText(language, "Disabled")}
              />
              <Input
                placeholder={demoText(language, "With value")}
                defaultValue="geist-docs"
                aria-label={demoText(language, "With value")}
              />
            </div>
          </Section>
        </>
      );
    case "select":
      return (
        <>
          <Section title="With Options" code={sectionCode("With Options")}>
            <Select
              className="w-56"
              defaultValue="banana"
              aria-label={demoText(language, "Select fruit")}
            >
              <option value="apple">Apple</option>
              <option value="orange">Orange</option>
              <option value="banana">Banana</option>
              <option value="grape">Grape</option>
            </Select>
          </Section>
        </>
      );
    case "toggle":
      return (
        <>
          <Section title="Disabled" code={sectionCode("Disabled")}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Toggle
                  aria-label={demoText(language, "Enable Firewall")}
                  checked={false}
                  readOnly
                  disabled
                />
                <span className="text-copy-14 text-muted-foreground">Unchecked (disabled)</span>
              </div>
              <div className="flex items-center gap-3">
                <Toggle
                  aria-label={demoText(language, "Enable Firewall")}
                  checked
                  readOnly
                  disabled
                />
                <span className="text-copy-14 text-muted-foreground">Checked (disabled)</span>
              </div>
            </div>
          </Section>
          <Section title="Sizes" code={sectionCode("Sizes")}>
            <div className="flex flex-row flex-wrap items-center gap-6">
              <Toggle aria-label={demoText(language, "Enable Firewall")} checked={false} readOnly />
              <Toggle
                aria-label={demoText(language, "Enable Firewall")}
                checked={false}
                readOnly
                size="medium"
              />
              <Toggle
                aria-label={demoText(language, "Enable Firewall")}
                checked={false}
                readOnly
                size="large"
              />
            </div>
          </Section>
          <Section title="Custom Color" code={sectionCode("Custom Color")}>
            <ToggleColorDemo />
          </Section>
          <Section title="With Label" code={sectionCode("With Label")}>
            <ToggleLabelDemo />
          </Section>
        </>
      );
    case "checkbox":
      return (
        <>
          <Section title="Indeterminate" code={sectionCode("Indeterminate")}>
            <div className="flex flex-col gap-3">
              <label className="flex cursor-pointer items-center gap-2.5">
                <Checkbox indeterminate aria-label={demoText(language, "Indeterminate")} />
                <span className="text-copy-14 text-foreground">
                  Indeterminate (partial selection)
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-2.5">
                <Checkbox checked readOnly aria-label={demoText(language, "Checked")} />
                <span className="text-copy-14 text-muted-foreground">Checked</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2.5">
                <Checkbox aria-label={demoText(language, "Unchecked")} />
                <span className="text-copy-14 text-muted-foreground">Unchecked</span>
              </label>
            </div>
          </Section>
        </>
      );
    case "gauge":
      return (
        <>
          <Section title="Label" code={sectionCode("Label")}>
            <div className="flex flex-row flex-wrap items-stretch justify-start gap-8">
              <Gauge showValue size="tiny" value={80} />
              <Gauge showValue size="small" value={80} />
              <Gauge showValue size="small" value={100} />
              <Gauge showValue size="medium" value={80} />
              <Gauge showValue size="medium" value={100} />
              <Gauge showValue size="large" value={80} />
              <Gauge showValue size="large" value={100} />
            </div>
          </Section>
          <Section title="Default color scale" code={sectionCode("Default color scale")}>
            <div className="flex flex-row flex-wrap items-stretch justify-start gap-8">
              <Gauge size="small" value={14} />
              <Gauge size="small" value={34} />
              <Gauge size="small" value={68} />
            </div>
          </Section>
          <Section title="Custom color range" code={sectionCode("Custom color range")}>
            <div className="flex flex-row flex-wrap items-stretch justify-start gap-2">
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((value) => (
                <Gauge key={value} colors={GAUGE_PINK_SCALE} size="small" value={value} />
              ))}
            </div>
          </Section>
          <Section title="Custom secondary color" code={sectionCode("Custom secondary color")}>
            <div className="flex justify-start">
              <Gauge
                colors={{ primary: "var(--blue-700)", secondary: "var(--blue-300)" }}
                size="medium"
                value={50}
              />
            </div>
          </Section>
          <Section title="Arc priority" code={sectionCode("Arc priority")}>
            <div className="flex justify-start">
              <Gauge
                arcPriority="equal"
                colors={{ primary: "var(--blue-700)", secondary: "var(--red-700)" }}
                showValue
                size="medium"
                value={50}
              />
            </div>
          </Section>
          <Section title="Indeterminate" code={sectionCode("Indeterminate")}>
            <div className="flex flex-row flex-wrap items-stretch justify-start gap-2">
              <Gauge indeterminate size="tiny" value={25} />
              <Gauge indeterminate size="small" value={25} />
              <Gauge indeterminate size="medium" value={25} />
              <Gauge indeterminate size="large" value={25} />
            </div>
          </Section>
        </>
      );
    case "radio":
      return (
        <>
          <Section title="Radio disabled" code={sectionCode("Radio disabled")}>
            <RadioGroup disabled label="Disabled Radio Example" defaultValue="one">
              <div className="flex flex-col items-stretch justify-start gap-6">
                <RadioGroupItem value="one">{demoText(language, "Option 1")}</RadioGroupItem>
                <RadioGroupItem value="two">{demoText(language, "Option 2")}</RadioGroupItem>
              </div>
            </RadioGroup>
          </Section>
          <Section title="Radio required" code={sectionCode("Radio required")}>
            <form className="flex flex-col items-start justify-start gap-6">
              <RadioGroup label="Required Radio Example" required defaultValue="">
                <div className="flex flex-col items-stretch justify-start gap-4">
                  <RadioGroupItem value="one">{demoText(language, "Option 1")}</RadioGroupItem>
                  <RadioGroupItem value="two">{demoText(language, "Option 2")}</RadioGroupItem>
                </div>
              </RadioGroup>
              <Button size="small">{demoText(language, "Submit")}</Button>
            </form>
          </Section>
          <Section title="Radio headless" code={sectionCode("Radio headless")}>
            <RadioHeadlessDemo />
          </Section>
          <Section title="Radio standalone" code={sectionCode("Radio standalone")}>
            <RadioStandaloneDemo />
          </Section>
        </>
      );
    case "switch":
      return (
        <>
          <Section title="Disabled" code={sectionCode("Disabled")}>
            <div className="flex w-full max-w-md flex-col items-start">
              <Switch name="reference-view-mode">
                <SwitchControl defaultChecked disabled label="Source" value="source" />
                <SwitchControl disabled label="Output" value="output" />
              </Switch>
            </div>
          </Section>
          <Section title="Sizes" code={sectionCode("Sizes")}>
            <div className="flex w-full flex-col lg:flex-row lg:flex-wrap">
              <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
                <Switch name="reference-sizes-small" size="small">
                  <SwitchControl defaultChecked label="Source" value="source" />
                  <SwitchControl label="Output" value="output" />
                </Switch>
              </div>
              <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
                <Switch name="reference-sizes-default">
                  <SwitchControl defaultChecked label="Source" value="source" />
                  <SwitchControl label="Output" value="output" />
                </Switch>
              </div>
              <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
                <Switch name="reference-sizes-large" size="large">
                  <SwitchControl defaultChecked label="Source" value="source" />
                  <SwitchControl label="Output" value="output" />
                </Switch>
              </div>
            </div>
          </Section>
          <Section title="Full width" code={sectionCode("Full width")}>
            <Switch name="reference-full-width" style={{ width: "100%" }}>
              <SwitchControl defaultChecked label="Source" value="source" />
              <SwitchControl label="Output" value="output" />
            </Switch>
          </Section>
          <Section title="Tooltip" code={sectionCode("Tooltip")}>
            <div className="flex w-full max-w-md flex-col items-start">
              <Switch name="reference-tooltip">
                <Tooltip text="View Source">
                  <SwitchControl defaultChecked label="Source" size="large" value="source" />
                </Tooltip>
                <Tooltip text="View Output">
                  <SwitchControl label="Output" size="large" value="output" />
                </Tooltip>
              </Switch>
            </div>
          </Section>
          <Section title="Icon" code={sectionCode("Icon")}>
            <div className="flex w-full flex-col lg:flex-row lg:flex-wrap">
              <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
                <Switch name="reference-icons-small" size="small">
                  <SwitchControl
                    defaultChecked
                    icon={<LayoutGrid aria-hidden />}
                    label="Source"
                    value="source"
                  />
                  <SwitchControl icon={<List aria-hidden />} label="Output" value="output" />
                </Switch>
              </div>
              <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
                <Switch name="reference-icons-default">
                  <SwitchControl
                    defaultChecked
                    icon={<LayoutGrid aria-hidden />}
                    label="Source"
                    value="source"
                  />
                  <SwitchControl icon={<List aria-hidden />} label="Output" value="output" />
                </Switch>
              </div>
              <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
                <Switch name="reference-icons-large" size="large">
                  <SwitchControl
                    defaultChecked
                    icon={<LayoutGrid aria-hidden />}
                    label="Source"
                    value="source"
                  />
                  <SwitchControl icon={<List aria-hidden />} label="Output" value="output" />
                </Switch>
              </div>
            </div>
          </Section>
        </>
      );
    case "textarea":
      return (
        <>
          <Section title="Error" code={sectionCode("Error")}>
            <div className="flex w-full max-w-md flex-col gap-8">
              <Textarea
                aria-label="With error (small)"
                defaultValue={LOREM_IPSUM}
                error="There has been an error."
                size="small"
                style={{ minHeight: 100 }}
              />
              <Textarea
                aria-label="With error (medium)"
                defaultValue={LOREM_IPSUM}
                error="There has been an error."
                size="medium"
                style={{ minHeight: 100 }}
              />
              <Textarea
                aria-label="With error (large)"
                defaultValue={LOREM_IPSUM}
                error="There has been an error."
                size="large"
                style={{ minHeight: 100 }}
              />
            </div>
          </Section>
          <Section title="Sizes" code={sectionCode("Sizes")}>
            <div className="flex w-full max-w-md flex-col gap-6">
              <Textarea
                aria-label="Textarea"
                defaultValue={LOREM_IPSUM}
                size="small"
                style={{ minHeight: 100 }}
              />
              <Textarea
                aria-label="Textarea"
                defaultValue={LOREM_IPSUM}
                size="medium"
                style={{ minHeight: 100 }}
              />
              <Textarea
                aria-label="Textarea"
                defaultValue={LOREM_IPSUM}
                size="large"
                style={{ minHeight: 100 }}
              />
            </div>
          </Section>
          <Section title="Read Only" code={sectionCode("Read Only")}>
            <div className="flex w-full max-w-md flex-col">
              <Textarea
                aria-label="Read only"
                defaultValue={LOREM_IPSUM}
                readOnly
                style={{ minHeight: 100 }}
              />
            </div>
          </Section>
          <Section title="Rows" code={sectionCode("Rows")}>
            <div className="flex w-full max-w-md flex-col">
              <Textarea
                aria-label={demoText(language, "Textarea with fixed rows")}
                placeholder={demoText(language, "Textarea with fixed number of rows")}
                rows={5}
              />
            </div>
          </Section>
        </>
      );
    case "tooltip":
      return (
        <>
          <Section title="No delay" code={sectionCode("No delay")}>
            <div className="flex w-full flex-row flex-wrap">
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip delay={false} text="The Evil Rabbit Jumped over the Fence">
                  <span>Top</span>
                </Tooltip>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip
                  delay={false}
                  position="bottom"
                  text="The Evil Rabbit Jumped over the Fence"
                >
                  <span>Bottom</span>
                </Tooltip>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip delay={false} position="left" text="The Evil Rabbit Jumped over the Fence">
                  <span>Left</span>
                </Tooltip>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip
                  delay={false}
                  position="right"
                  text="The Evil Rabbit Jumped over the Fence"
                >
                  <span>Right</span>
                </Tooltip>
              </div>
            </div>
          </Section>
          <Section title="Box align" code={sectionCode("Box align")}>
            <div className="flex w-full flex-row flex-wrap">
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip
                  boxAlign="left"
                  position="bottom"
                  text="The Evil Rabbit Jumped over the Fence"
                >
                  <span>Bottom/Left</span>
                </Tooltip>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip position="bottom" text="The Evil Rabbit Jumped over the Fence">
                  <span>Bottom/Center</span>
                </Tooltip>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip
                  boxAlign="right"
                  position="bottom"
                  text="The Evil Rabbit Jumped over the Fence"
                >
                  <span>Bottom/Right</span>
                </Tooltip>
              </div>
            </div>
            <div className="flex w-full flex-row flex-wrap">
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip
                  boxAlign="left"
                  position="left"
                  text="The Evil Rabbit Jumped over the Fence"
                >
                  <span>Left/Left</span>
                </Tooltip>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip position="left" text="The Evil Rabbit Jumped over the Fence">
                  <span>Left/Center</span>
                </Tooltip>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip
                  boxAlign="right"
                  position="left"
                  text="The Evil Rabbit Jumped over the Fence"
                >
                  <span>Left/Right</span>
                </Tooltip>
              </div>
            </div>
            <div className="flex w-full flex-row flex-wrap">
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip
                  boxAlign="left"
                  position="right"
                  text="The Evil Rabbit Jumped over the Fence"
                >
                  <span>Right/Left</span>
                </Tooltip>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip position="right" text="The Evil Rabbit Jumped over the Fence">
                  <span>Right/Center</span>
                </Tooltip>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip
                  boxAlign="right"
                  position="right"
                  text="The Evil Rabbit Jumped over the Fence"
                >
                  <span>Right/Right</span>
                </Tooltip>
              </div>
            </div>
          </Section>
          <Section title="Custom content" code={sectionCode("Custom content")}>
            <div className="flex w-full flex-row flex-wrap">
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip
                  text={
                    <>
                      The <b>Evil Rabbit</b> Jumped over the <i>Fence</i>.
                    </>
                  }
                >
                  <span>Top</span>
                </Tooltip>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip
                  position="bottom"
                  text={
                    <>
                      The <b>Evil Rabbit</b> Jumped over the <i>Fence</i>.
                    </>
                  }
                >
                  <span>Bottom</span>
                </Tooltip>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip
                  position="left"
                  text={
                    <>
                      The <b>Evil Rabbit</b> Jumped over the <i>Fence</i>.
                    </>
                  }
                >
                  <span>Left</span>
                </Tooltip>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip
                  position="right"
                  text={
                    <>
                      The <b>Evil Rabbit</b> Jumped over the <i>Fence</i>.
                    </>
                  }
                >
                  <span>Right</span>
                </Tooltip>
              </div>
            </div>
          </Section>
          <Section title="Custom type" code={sectionCode("Custom type")}>
            <div className="flex w-full flex-row flex-wrap">
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip text="The Evil Rabbit Jumped over the Fence" type="success">
                  <span>Top</span>
                </Tooltip>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip
                  position="bottom"
                  text="The Evil Rabbit Jumped over the Fence"
                  type="error"
                >
                  <span>Bottom</span>
                </Tooltip>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip
                  position="left"
                  text="The Evil Rabbit Jumped over the Fence"
                  type="warning"
                >
                  <span>Left</span>
                </Tooltip>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip
                  position="right"
                  text="The Evil Rabbit Jumped over the Fence"
                  type="violet"
                >
                  <span>Right</span>
                </Tooltip>
              </div>
            </div>
          </Section>
          <Section title="Components" code={sectionCode("Components")}>
            <div className="flex w-full flex-row flex-wrap">
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip position="bottom" text="The Evil Rabbit Jumped over the Fence">
                  <Button size="small" typeName="button">
                    Bottom
                  </Button>
                </Tooltip>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip position="left" text="The Evil Rabbit Jumped over the Fence">
                  <Badge size="sm">LEFT</Badge>
                </Tooltip>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip position="right" text="The Evil Rabbit Jumped over the Fence">
                  <Spinner />
                </Tooltip>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip
                  text={
                    <>
                      Search
                      <Kbd>/</Kbd>
                    </>
                  }
                >
                  <span>Shortcut</span>
                </Tooltip>
              </div>
            </div>
          </Section>
          <Section title="Other" code={sectionCode("Other")}>
            <div className="flex w-full flex-row flex-wrap">
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip text="The Evil Rabbit Jumped over the Fence" tip={false}>
                  No tip indicator
                </Tooltip>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center py-2">
                <Tooltip
                  center={false}
                  text="The Evil Rabbit Jumped over the Fence multiple times."
                >
                  No center text
                </Tooltip>
              </div>
            </div>
          </Section>
        </>
      );
    case "video":
      return (
        <>
          <Section title="No Loop" code={sectionCode("No Loop")}>
            <div className="w-full min-w-0 max-w-[600px]">
              <Video height={582} lazy={false} loop={false} src="/demo.mp4" width={600} />
            </div>
          </Section>
          <Section title="No Controls" code={sectionCode("No Controls")}>
            <div className="w-full min-w-0 max-w-[600px]">
              <Video controls={false} height={582} lazy={false} src="/demo.mp4" width={600} />
            </div>
          </Section>
        </>
      );
    case "label":
      return (
        <>
          <Section title="With Input" code={sectionCode("With Input")}>
            <div className="flex w-full max-w-sm flex-col">
              <Label id="label-input" value="Email Address" withInput />
              <Input
                aria-labelledby="label-input"
                id="label-input"
                placeholder={demoText(language, "Enter email address...")}
              />
            </div>
          </Section>
          <Section title="Bypass Casing" code={sectionCode("Bypass Casing")}>
            <div className="flex w-full max-w-sm flex-col">
              <Label bypassCasing id="label-input-bypass" value="Email address" withInput />
              <Input
                aria-labelledby="label-input-bypass"
                id="label-input-bypass"
                placeholder={demoText(language, "Enter email address...")}
              />
            </div>
          </Section>
        </>
      );
    case "table":
      return (
        <>
          <Section title="Striped table" code="<Table><TableBody striped>…</TableBody></Table>">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Col 1</TableHead>
                  <TableHead>Col 2</TableHead>
                  <TableHead>Col 3</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody striped>
                <TableRow>
                  <TableCell>Value 1.1</TableCell>
                  <TableCell>Value 1.2</TableCell>
                  <TableCell>Value 1.3</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Value 2.1</TableCell>
                  <TableCell>Value 2.2</TableCell>
                  <TableCell>Value 2.3</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Value 3.1</TableCell>
                  <TableCell>Value 3.2</TableCell>
                  <TableCell>Value 3.3</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>
          <Section title="Bordered table" code="<Table><TableBody bordered>…</TableBody></Table>">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Col 1</TableHead>
                  <TableHead>Col 2</TableHead>
                  <TableHead>Col 3</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody bordered>
                <TableRow>
                  <TableCell>Value 1.1</TableCell>
                  <TableCell>Value 1.2</TableCell>
                  <TableCell>Value 1.3</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Value 2.1</TableCell>
                  <TableCell>Value 2.2</TableCell>
                  <TableCell>Value 2.3</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Value 3.1</TableCell>
                  <TableCell>Value 3.2</TableCell>
                  <TableCell>Value 3.3</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>
          <Section
            title="Interactive table"
            code="<Table><TableBody interactive>…</TableBody></Table>"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Col 1</TableHead>
                  <TableHead>Col 2</TableHead>
                  <TableHead>Col 3</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody interactive>
                <TableRow>
                  <TableCell>Value 1.1</TableCell>
                  <TableCell>Value 1.2</TableCell>
                  <TableCell>Value 1.3</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Value 2.1</TableCell>
                  <TableCell>Value 2.2</TableCell>
                  <TableCell>Value 2.3</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Value 3.1</TableCell>
                  <TableCell>Value 3.2</TableCell>
                  <TableCell>Value 3.3</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>
          <Section title="Full featured table" code="<Table>…full featured rows…</Table>">
            <Table>
              <TableColgroup>
                <TableCol className="w-[44%]" />
                <TableCol className="w-[22%]" />
                <TableCol className="w-[22%]" />
                <TableCol className="w-[11%]" />
              </TableColgroup>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Charge</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody interactive striped>
                <TableRow>
                  <TableCell>Brake Pads Set</TableCell>
                  <TableCell>100 sets</TableCell>
                  <TableCell>$50 per set</TableCell>
                  <TableCell className="tabular-nums text-right">$5,000.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Oil Filters</TableCell>
                  <TableCell>200 filters</TableCell>
                  <TableCell>$10 per filter</TableCell>
                  <TableCell className="tabular-nums text-right">$2,000.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Car Batteries</TableCell>
                  <TableCell>50 batteries</TableCell>
                  <TableCell>$100 per battery</TableCell>
                  <TableCell className="tabular-nums text-right">$5,000.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Headlight Bulbs</TableCell>
                  <TableCell>300 bulbs</TableCell>
                  <TableCell>$15 per bulb</TableCell>
                  <TableCell className="tabular-nums text-right">$4,500.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Windshield Wipers</TableCell>
                  <TableCell>250 pairs</TableCell>
                  <TableCell>$20 per pair</TableCell>
                  <TableCell className="tabular-nums text-right">$5,000.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Spark Plugs</TableCell>
                  <TableCell>500 sets</TableCell>
                  <TableCell>$5 per set</TableCell>
                  <TableCell className="tabular-nums text-right">$2,500.00</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="text-gray-1000 font-medium" colSpan={3}>
                    Subtotal
                  </TableCell>
                  <TableCell className="text-gray-1000 font-medium tabular-nums text-right">
                    $24,000.00
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Section>
          <Section
            title="Virtualized table"
            code="<Table><TableBody interactive striped>…</TableBody></Table>"
          >
            <VirtualizedTableDemo />
          </Section>
        </>
      );
    case "avatar":
      return (
        <>
          <Section title="Group" code={sectionCode("Group")}>
            <div className="flex flex-wrap items-center gap-4">
              <AvatarGroup
                members={[
                  { username: "evilrabbit" },
                  { username: "severinlandolt" },
                  { username: "rauchg" },
                ]}
                size={32}
              />
              <AvatarGroup
                limit={4}
                members={[
                  { username: "christopherkindl" },
                  { username: "rauno" },
                  { username: "shuding" },
                  { username: "skllcrn" },
                  { username: "almonk" },
                ]}
                size={32}
              />
            </div>
          </Section>
          <Section title="Stacking order" code={sectionCode("Stacking order")}>
            <div className="flex flex-wrap items-center gap-4">
              <AvatarGroup
                members={[
                  { username: "evilrabbit" },
                  { username: "severinlandolt" },
                  { username: "rauchg" },
                ]}
                size={32}
              />
              <AvatarGroup
                reverse
                members={[
                  { username: "evilrabbit" },
                  { username: "severinlandolt" },
                  { username: "rauchg" },
                ]}
                size={32}
              />
            </div>
          </Section>
          <Section title="Overlap" code={sectionCode("Overlap")}>
            <div className="flex flex-wrap items-center gap-6">
              <AvatarGroup
                overlap="auto"
                members={[
                  { username: "evilrabbit" },
                  { username: "severinlandolt" },
                  { username: "rauchg" },
                ]}
                size={16}
              />
              <AvatarGroup
                overlap="auto"
                members={[
                  { username: "evilrabbit" },
                  { username: "severinlandolt" },
                  { username: "rauchg" },
                ]}
                size={24}
              />
              <AvatarGroup
                overlap="auto"
                members={[
                  { username: "evilrabbit" },
                  { username: "severinlandolt" },
                  { username: "rauchg" },
                ]}
                size={32}
              />
              <AvatarGroup
                overlap="auto"
                members={[
                  { username: "evilrabbit" },
                  { username: "severinlandolt" },
                  { username: "rauchg" },
                ]}
                size={48}
              />
            </div>
          </Section>
          <Section title="Fixed overlap" code={sectionCode("Fixed overlap")}>
            <div className="flex flex-wrap items-center gap-4">
              <AvatarGroup
                overlap={10}
                members={[
                  { username: "evilrabbit" },
                  { username: "severinlandolt" },
                  { username: "rauchg" },
                ]}
                size={24}
              />
              <AvatarGroup
                overlap={6}
                members={[
                  { username: "evilrabbit" },
                  { username: "severinlandolt" },
                  { username: "rauchg" },
                ]}
                size={24}
              />
              <AvatarGroup
                overlap={0}
                members={[
                  { username: "evilrabbit" },
                  { username: "severinlandolt" },
                  { username: "rauchg" },
                ]}
                size={24}
              />
            </div>
          </Section>
          <Section title="Size" code={sectionCode("Size")}>
            <div className="flex flex-wrap items-center gap-4">
              <Avatar size={24} username="evilrabbit" />
              <Avatar size={32} username="evilrabbit" />
              <Avatar size={48} username="evilrabbit" />
            </div>
          </Section>
          <Section title="Git" code={sectionCode("Git")}>
            <div className="flex flex-wrap items-center gap-4">
              <GitHubAvatar size={32} username="rauchg" />
              <GitLabAvatar size={32} username="severinlandolt" />
              <BitbucketAvatar size={32} username="evilrabbit" />
            </div>
          </Section>
          <Section title="With custom icon" code={sectionCode("With custom icon")}>
            <div className="flex flex-wrap items-center gap-4">
              <AvatarWithIcon
                icon={<ArrowDownCircle className="size-3.5" aria-hidden />}
                size={32}
                iconBackground
              />
              <AvatarWithIcon
                icon={<CircleCheck className="size-3.5" aria-hidden />}
                size={32}
                iconBackground
              />
              <AvatarWithIcon
                icon={<Clock className="size-3.5" aria-hidden />}
                size={32}
                iconBackground
              />
            </div>
          </Section>
          <Section title="Letter" code={sectionCode("Letter")}>
            <div className="flex flex-wrap items-center gap-4">
              <Avatar letter="SL" placeholder size={32} />
              <Avatar letter="EK" placeholder size={32} />
              <Avatar letter="CK" placeholder size={32} />
            </div>
          </Section>
          <Section title="Placeholder" code={sectionCode("Placeholder")}>
            <Avatar placeholder size={90} />
          </Section>
        </>
      );
    case "badge":
      return (
        <>
          <Section title="Variants" code={sectionCode("Variants")}>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="gray">Gray</Badge>
                <Badge variant="gray" contrast="low">
                  Gray Subtle
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="blue">Blue</Badge>
                <Badge variant="blue" contrast="low">
                  Blue Subtle
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="purple">Purple</Badge>
                <Badge variant="purple" contrast="low">
                  Purple Subtle
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="amber">Amber</Badge>
                <Badge variant="amber" contrast="low">
                  Amber Subtle
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="red">Red</Badge>
                <Badge variant="red" contrast="low">
                  Red Subtle
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="pink">Pink</Badge>
                <Badge variant="pink" contrast="low">
                  Pink Subtle
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="green">Green</Badge>
                <Badge variant="green" contrast="low">
                  Green Subtle
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="teal">Teal</Badge>
                <Badge variant="teal" contrast="low">
                  Teal Subtle
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="inverted">Inverted</Badge>
                <Badge variant="trial">Trial</Badge>
                <Badge variant="turbo">Turborepo</Badge>
              </div>
            </div>
          </Section>
          <Section title="Sizes" code={sectionCode("Sizes")}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
              <Badge size="lg">Large</Badge>
            </div>
          </Section>
          <Section title="With icons" code={sectionCode("With icons")}>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge icon={<Shield aria-hidden />} size="lg" variant="gray">
                  Gray
                </Badge>
                <Badge icon={<Shield aria-hidden />} size="md" variant="gray">
                  Gray
                </Badge>
                <Badge icon={<Shield aria-hidden />} size="sm" variant="gray">
                  Gray
                </Badge>
                <Badge icon={<Shield aria-hidden />} size="lg" variant="gray" contrast="low">
                  Gray
                </Badge>
                <Badge icon={<Shield aria-hidden />} size="md" variant="gray" contrast="low">
                  Gray
                </Badge>
                <Badge icon={<Shield aria-hidden />} size="sm" variant="gray" contrast="low">
                  Gray
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge icon={<Shield aria-hidden />} size="lg" variant="blue">
                  Blue
                </Badge>
                <Badge icon={<Shield aria-hidden />} size="md" variant="blue">
                  Blue
                </Badge>
                <Badge icon={<Shield aria-hidden />} size="sm" variant="blue">
                  Blue
                </Badge>
                <Badge icon={<Shield aria-hidden />} size="lg" variant="blue" contrast="low">
                  Blue
                </Badge>
                <Badge icon={<Shield aria-hidden />} size="md" variant="blue" contrast="low">
                  Blue
                </Badge>
                <Badge icon={<Shield aria-hidden />} size="sm" variant="blue" contrast="low">
                  Blue
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge icon={<Shield aria-hidden />} size="lg" variant="green">
                  Green
                </Badge>
                <Badge icon={<Shield aria-hidden />} size="md" variant="green">
                  Green
                </Badge>
                <Badge icon={<Shield aria-hidden />} size="sm" variant="green">
                  Green
                </Badge>
                <Badge icon={<Shield aria-hidden />} size="lg" variant="green" contrast="low">
                  Green
                </Badge>
                <Badge icon={<Shield aria-hidden />} size="md" variant="green" contrast="low">
                  Green
                </Badge>
                <Badge icon={<Shield aria-hidden />} size="sm" variant="green" contrast="low">
                  Green
                </Badge>
              </div>
            </div>
          </Section>
          <Section title="Pill" code={sectionCode("Pill")}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="pill" size="sm">
                  Label
                </Badge>
                <Badge variant="pill" size="md">
                  Label
                </Badge>
                <Badge variant="pill" size="lg">
                  Label
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="pill" size="sm" icon={<Shield aria-hidden />}>
                  Label
                </Badge>
                <Badge variant="pill" size="md" icon={<Shield aria-hidden />}>
                  Label
                </Badge>
                <Badge variant="pill" size="lg" icon={<Shield aria-hidden />}>
                  Label
                </Badge>
              </div>
            </div>
          </Section>
        </>
      );
    case "breadcrumbs":
      return (
        <>
          <Section title="Default" code={sectionCode("Default")}>
            <div className="flex w-full max-w-md flex-col gap-4">
              <Breadcrumb type="text">
                <BreadcrumbItem>{demoText(language, "Home")}</BreadcrumbItem>
                <BreadcrumbItem>{demoText(language, "Dashboard")}</BreadcrumbItem>
                <BreadcrumbItem>{demoText(language, "Overview")}</BreadcrumbItem>
              </Breadcrumb>
              <Breadcrumb type="menu">
                <BreadcrumbItem>{demoText(language, "Home")}</BreadcrumbItem>
                <BreadcrumbItem>{demoText(language, "Dashboard")}</BreadcrumbItem>
                <BreadcrumbItem>{demoText(language, "Overview")}</BreadcrumbItem>
              </Breadcrumb>
            </div>
          </Section>
          <Section title="Active" code={sectionCode("Active")}>
            <Breadcrumb>
              <BreadcrumbItem>{demoText(language, "Home")}</BreadcrumbItem>
              <BreadcrumbItem active>{demoText(language, "Dashboard")}</BreadcrumbItem>
              <BreadcrumbItem>{demoText(language, "Overview")}</BreadcrumbItem>
            </Breadcrumb>
          </Section>
          <Section title="Disabled" code={sectionCode("Disabled")}>
            <Breadcrumb>
              <BreadcrumbItem>{demoText(language, "Home")}</BreadcrumbItem>
              <BreadcrumbItem disabled>{demoText(language, "Dashboard")}</BreadcrumbItem>
              <BreadcrumbItem>{demoText(language, "Overview")}</BreadcrumbItem>
            </Breadcrumb>
          </Section>
        </>
      );
    case "collapse":
      return (
        <>
          <Section title="Default" code={sectionCode("Default")}>
            <div className="flex w-full max-w-md flex-col gap-3">
              <Collapse className="rounded-[8px] border border-gray-alpha-400 p-4">
                <CollapseTrigger className="text-label-14 text-foreground">
                  Question A
                </CollapseTrigger>
                <CollapseContent className="pt-3 text-copy-14 text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </CollapseContent>
              </Collapse>
              <Collapse className="rounded-[8px] border border-gray-alpha-400 p-4">
                <CollapseTrigger className="text-label-14 text-foreground">
                  Question B
                </CollapseTrigger>
                <CollapseContent className="pt-3 text-copy-14 text-muted-foreground">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                  fugiat nulla pariatur.
                </CollapseContent>
              </Collapse>
            </div>
          </Section>
          <Section title="Expanded" code={sectionCode("Expanded")}>
            <div className="flex w-full max-w-md flex-col gap-3">
              <Collapse className="rounded-[8px] border border-gray-alpha-400 p-4">
                <CollapseTrigger className="text-label-14 text-foreground">
                  Question A
                </CollapseTrigger>
                <CollapseContent className="pt-3 text-copy-14 text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </CollapseContent>
              </Collapse>
              <Collapse defaultOpen className="rounded-[8px] border border-gray-alpha-400 p-4">
                <CollapseTrigger className="text-label-14 text-foreground">
                  Question B
                </CollapseTrigger>
                <CollapseContent className="pt-3 text-copy-14 text-muted-foreground">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                  fugiat nulla pariatur.
                </CollapseContent>
              </Collapse>
            </div>
          </Section>
          <Section title="Multiple" code={sectionCode("Multiple")}>
            <div className="flex w-full max-w-md flex-col gap-3">
              <Collapse defaultOpen className="rounded-[8px] border border-gray-alpha-400 p-4">
                <CollapseTrigger className="text-label-14 text-foreground">
                  Question A
                </CollapseTrigger>
                <CollapseContent className="pt-3 text-copy-14 text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </CollapseContent>
              </Collapse>
              <Collapse defaultOpen className="rounded-[8px] border border-gray-alpha-400 p-4">
                <CollapseTrigger className="text-label-14 text-foreground">
                  Question B
                </CollapseTrigger>
                <CollapseContent className="pt-3 text-copy-14 text-muted-foreground">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                  fugiat nulla pariatur.
                </CollapseContent>
              </Collapse>
            </div>
          </Section>
          <Section title="Small" code={sectionCode("Small")}>
            <Collapse className="w-full max-w-sm rounded-[8px] border border-gray-alpha-400 p-3">
              <CollapseTrigger className="text-label-13 text-foreground">
                Question A
              </CollapseTrigger>
              <CollapseContent className="pt-2 text-copy-13 text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </CollapseContent>
            </Collapse>
          </Section>
        </>
      );
    case "json-view":
      return (
        <>
          <Section title="Single line" code={sectionCode("Single line")}>
            <div className="w-full max-w-md">
              <JsonView data={{ foo: "bar" }} defaultExpandDepth={1} />
            </div>
          </Section>
          <Section title="Wrapped" code={sectionCode("Wrapped")}>
            <div className="w-full max-w-md">
              <JsonView
                data={{
                  browserApiUrl:
                    "https://browser-api.vercel.sh/screenshot?url=https%3A%2F%2Fprocore-com-prod-f5vem4o6u-marketing-web-dev.vercel.app&width=1440&height=900&fullPage=true",
                }}
                defaultExpandDepth={1}
              />
            </div>
          </Section>
          <Section title="Collapsed" code={sectionCode("Collapsed")}>
            <div className="w-full max-w-md">
              <JsonView
                data={{
                  trace: {
                    spanId: "span_7Qk9b4",
                    parentId: "span_root",
                    service: "api",
                  },
                  request: {
                    id: "req_00042",
                    path: "/api/projects",
                    method: "GET",
                  },
                  flags: ["enable-logs-json-rendering", "observability-panel"],
                }}
                defaultExpandDepth={0}
              />
            </div>
          </Section>
          <Section title="Highlighted" code={sectionCode("Highlighted")}>
            <div className="w-full max-w-md">
              <JsonView
                data={{
                  level: "error",
                  requestId: "req_00042",
                  deploymentId: "dpl_9WjH8QFQySx7",
                  message: "Deployment request failed",
                  statusCode: 500,
                }}
                defaultExpandDepth={1}
                highlightPattern={makeJsonViewHighlightPattern(["request", "failed"])}
              />
            </div>
          </Section>
        </>
      );
    case "scroller":
      return (
        <>
          <Section title="Vertical" code={sectionCode("Vertical")}>
            <div className="w-full max-w-2xl">
              <Scroller height={220} overflow="y" width="100%">
                <div
                  className="flex flex-col items-stretch justify-start gap-4"
                  style={{ width: 400 }}
                >
                  <div className="h-64 w-64 bg-gray-1000" />
                  <div className="h-64 w-64 bg-gray-1000" />
                </div>
              </Scroller>
            </div>
          </Section>
          <Section title="Horizontal" code={sectionCode("Horizontal")}>
            <div className="w-full max-w-2xl">
              <Scroller height="100%" overflow="x" width="100%">
                <div
                  className="flex flex-row items-stretch justify-start gap-4"
                  style={{ minWidth: "120%" }}
                >
                  <div className="h-64 w-64 bg-gray-1000" />
                  <div className="h-64 w-64 bg-gray-1000" />
                  <div className="h-64 w-64 bg-gray-1000" />
                  <div className="h-64 w-64 bg-gray-1000" />
                </div>
              </Scroller>
            </div>
          </Section>
          <Section title="Free" code={sectionCode("Free")}>
            <div className="w-full max-w-2xl">
              <Scroller height={220} overflow="both" width="100%">
                <div className="grid grid-flow-col grid-rows-2 gap-4">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="h-96 w-96 bg-gray-1000" />
                  ))}
                </div>
              </Scroller>
            </div>
          </Section>
          <Section title="Vertical with buttons" code={sectionCode("Vertical with buttons")}>
            <div className="flex max-w-full flex-col gap-4">
              <Scroller childrenContainerClassName="gap-4" height={220} overflow="y" withButtons>
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="h-60 w-96 shrink-0 bg-gray-1000" />
                ))}
              </Scroller>
            </div>
          </Section>
          <Section title="Horizontal with buttons" code={sectionCode("Horizontal with buttons")}>
            <div className="flex w-full max-w-2xl flex-col gap-4">
              <Scroller
                childrenContainerClassName="gap-4"
                height="100%"
                overflow="x"
                width="100%"
                withButtons
              >
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="h-64 w-96 shrink-0 bg-gray-1000" />
                ))}
              </Scroller>
            </div>
          </Section>
        </>
      );
    case "split-button":
      return (
        <>
          <Section title="Menu Alignment" code={sectionCode("Menu Alignment")}>
            <div className="flex flex-wrap items-start gap-8">
              <SplitButton
                buttonProps={{ type: "default" }}
                menuButtonLabel={demoText(language, "Select save method")}
                menuItems={
                  <>
                    <SplitButtonMenuItem description="Save changes" title="Save" />
                    <SplitButtonMenuItem
                      description="Save changes and create a new production deployment"
                      title="Save + Redeploy"
                    />
                  </>
                }
                menuProps={{ width: 264 }}
              >
                Save (bottom-start)
              </SplitButton>
              <SplitButton
                buttonProps={{ type: "secondary" }}
                menuAlignment="bottom-end"
                menuButtonLabel={demoText(language, "Select save method")}
                menuItems={
                  <>
                    <SplitButtonMenuItem description="Save changes" title="Save" />
                    <SplitButtonMenuItem
                      description="Save changes and create a new production deployment"
                      title="Save + Redeploy"
                    />
                  </>
                }
                menuProps={{ width: 264 }}
              >
                Save (bottom-end)
              </SplitButton>
            </div>
          </Section>
          <Section title="Icon" code={sectionCode("Icon")}>
            <SplitButton
              buttonProps={{ size: "small", type: "secondary" }}
              menuButtonLabel="Copy page"
              menuItems={[
                <SplitButtonMenuItem
                  key="v0"
                  description="Open this page in v0"
                  menuItemProps={{ className: "w-[200px]" }}
                  title="Open in v0"
                  icon={<Rocket className="size-4" aria-hidden />}
                />,
                <SplitButtonMenuItem
                  key="chatgpt"
                  description="Open this page in ChatGPT"
                  menuItemProps={{ className: "w-[200px]" }}
                  title="Open in ChatGPT"
                  icon={<ExternalLink className="size-4" aria-hidden />}
                />,
              ]}
              menuProps={{ width: 240 }}
            >
              Copy page
            </SplitButton>
          </Section>
          <Section title="Title with Icon" code={sectionCode("Title with Icon")}>
            <div className="flex w-full flex-col gap-8">
              {(["default", "secondary"] as const).map((variant) => (
                <div key={variant} className="flex flex-row gap-1">
                  {(["small", "medium", "large"] as const).map((size) => (
                    <SplitButton
                      key={`${variant}-${size}`}
                      buttonProps={{ size, type: variant }}
                      menuButtonLabel="Select save method"
                      menuItems={
                        <>
                          <SplitButtonMenuItem
                            description="Save changes"
                            title={
                              <span className="flex items-center gap-2">
                                <Save className="size-4" aria-hidden /> Save
                              </span>
                            }
                          />
                          <SplitButtonMenuItem
                            description="Save changes and create a new production deployment"
                            title={
                              <span className="flex items-center gap-2">
                                <CircleArrowUp className="size-4" aria-hidden /> Save + Redeploy
                              </span>
                            }
                          />
                        </>
                      }
                      menuProps={{ width: 264 }}
                    >
                      Save
                    </SplitButton>
                  ))}
                </div>
              ))}
            </div>
          </Section>
        </>
      );
    case "toast":
      return <ToastExtraSections />;
    case "progress":
      return (
        <>
          <Section title="Custom max" code={sectionCode("Custom max")}>
            <div className="w-full max-w-md">
              <Progress value={30} max={40} aria-label="Progress 30 of 40" />
            </div>
          </Section>
          <Section title="Dynamic" code={sectionCode("Dynamic")}>
            <ProgressDynamicDemo />
          </Section>
          <Section title="Dynamic colors" code={sectionCode("Dynamic colors")}>
            <ProgressDynamicColorsDemo />
          </Section>
          <Section title="Themed" code={sectionCode("Themed")}>
            <div className="flex w-full max-w-md flex-col gap-6">
              <Progress type="success" value={100} aria-label="Success progress" />
              <Progress type="error" value={10} aria-label="Error progress" />
              <Progress type="warning" value={40} aria-label="Warning progress" />
              <Progress type="secondary" value={70} aria-label="Secondary progress" />
            </div>
          </Section>
          <Section title="With Stops" code={sectionCode("With Stops")}>
            <div className="w-full max-w-md">
              <Progress
                value={30}
                type="success"
                aria-label="Progress with stops"
                stops={[
                  { value: 10, tooltip: "10%", ariaLabel: "Build complete" },
                  { value: 20, tooltip: "20%", ariaLabel: "Lint complete" },
                  { value: 30, tooltip: "30%", ariaLabel: "Unit tests complete" },
                  { value: 40, tooltip: "40%", ariaLabel: "Integration tests complete" },
                  { value: 50, tooltip: "50%", ariaLabel: "Deploy ready" },
                ]}
              />
            </div>
          </Section>
          <Section title="Widths" code={sectionCode("Widths")}>
            <div className="flex w-full max-w-md flex-col gap-6">
              <Progress value={60} width={100} aria-label="Progress width 100" />
              <Progress value={60} width={200} aria-label="Progress width 200" />
              <Progress value={60} width={300} aria-label="Progress width 300" />
              <Progress value={60} width="50%" aria-label="Progress width 50%" />
              <Progress value={60} width="100%" aria-label="Progress full width" />
            </div>
          </Section>
          <Section title="Heights" code={sectionCode("Heights")}>
            <div className="flex w-full max-w-md flex-col gap-6">
              <Progress value={60} height={4} aria-label="Progress height 4" />
              <Progress value={60} height={10} aria-label="Progress height 10" />
              <Progress value={60} height={50} aria-label="Progress height 50" />
              <Progress value={60} height={200} aria-label="Progress height 200" />
            </div>
          </Section>
          <Section title="Label Positions" code={sectionCode("Label Positions")}>
            <div className="flex w-full max-w-md flex-col gap-8">
              <Progress value={45} label="left" labelPosition="left" aria-label="Label left" />
              <Progress value={45} label="right" labelPosition="right" aria-label="Label right" />
              <Progress
                value={45}
                label="top-left"
                labelPosition="top-left"
                aria-label="Label top left"
              />
              <Progress
                value={45}
                label="top-center"
                labelPosition="top-center"
                aria-label="Label top center"
              />
              <Progress
                value={45}
                label="top-right"
                labelPosition="top-right"
                aria-label="Label top right"
              />
              <Progress
                value={45}
                label="bottom-left"
                labelPosition="bottom-left"
                aria-label="Label bottom left"
              />
              <Progress
                value={45}
                label="bottom-center"
                labelPosition="bottom-center"
                aria-label="Label bottom center"
              />
              <Progress
                value={45}
                label="bottom-right"
                labelPosition="bottom-right"
                aria-label="Label bottom right"
              />
            </div>
          </Section>
        </>
      );
    case "spinner":
      return (
        <>
          <Section title="Colors" code={sectionCode("Colors")}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="w-24 text-copy-14 text-muted-foreground">Default:</span>
                <Spinner />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-24 text-copy-14 text-muted-foreground">Red:</span>
                <Spinner className="text-red-700" />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-24 text-copy-14 text-muted-foreground">Green:</span>
                <Spinner className="text-green-700" />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-24 text-copy-14 text-muted-foreground">Blue:</span>
                <Spinner className="text-blue-700" />
              </div>
            </div>
          </Section>
        </>
      );
    case "tabs":
      return <TabsExtraSections />;
    case "error":
      return (
        <>
          <Section title="Custom label" code={sectionCode("Custom label")}>
            <Error label="Email Error">This email address is already in use.</Error>
          </Section>
          <Section title="No label" code={sectionCode("No label")}>
            <Error label={false}>This email address is already in use.</Error>
          </Section>
          <Section title="Sizes" code={sectionCode("Sizes")}>
            <div className="flex w-full flex-col items-stretch gap-6">
              <Error size="small">This email is in use.</Error>
              <Error>This email is in use.</Error>
              <Error size="large">This email is in use.</Error>
            </div>
          </Section>
          <Section title="With an error property" code={sectionCode("With an error property")}>
            <Error
              error={{
                message: "The request failed.",
                action: "Contact Us",
                link: "https://vercel.com/contact",
              }}
            />
          </Section>
        </>
      );
    case "note":
      return (
        <>
          <Section title="Sizes" code={sectionCode("Sizes")}>
            <div className="flex w-full flex-col gap-3">
              <Note size="small">
                <NoteContent>A small note.</NoteContent>
              </Note>
              <Note>
                <NoteContent>A medium note.</NoteContent>
              </Note>
            </div>
          </Section>
          <Section title="Action" code={sectionCode("Action")}>
            <div className="flex w-full flex-col gap-3">
              <Note>
                <NoteContent>This note details some information.</NoteContent>
                <NoteAction>
                  <Button typeName="button" size="small">
                    Upgrade
                  </Button>
                </NoteAction>
              </Note>
              <Note>
                <NoteContent>
                  This note details a large amount information that could potentially wrap into two
                  or more lines.
                </NoteContent>
                <NoteAction>
                  <Button typeName="button" size="small">
                    Upgrade
                  </Button>
                </NoteAction>
              </Note>
            </div>
          </Section>
          <Section title="Secondary" code={sectionCode("Secondary")}>
            <div className="flex w-full flex-col gap-3">
              <Note variant="secondary">
                <NoteContent>This note details some secondary information.</NoteContent>
              </Note>
            </div>
          </Section>
          <Section title="Violet" code={sectionCode("Violet")}>
            <Note variant="violet">
              <NoteContent>This note details some violet information.</NoteContent>
            </Note>
          </Section>
          <Section title="Cyan" code={sectionCode("Cyan")}>
            <Note variant="cyan">
              <NoteContent>This note details some cyan information.</NoteContent>
            </Note>
          </Section>
          <Section title="Disabled" code={sectionCode("Disabled")}>
            <div className="flex w-full flex-col gap-3">
              <Note disabled fill variant="warning">
                <NoteContent>This note details a warning.</NoteContent>
                <NoteAction>
                  <Button typeName="button" size="small">
                    Upgrade
                  </Button>
                </NoteAction>
              </Note>
            </div>
          </Section>
          <Section title="Label" code={sectionCode("Label")}>
            <Note>
              <NoteContent>
                <NoteLabel>Region Change:</NoteLabel>Changing this region restarts all functions.
              </NoteContent>
            </Note>
          </Section>
          <Section title="Custom icon" code={sectionCode("Custom icon")}>
            <div className="flex w-full flex-col gap-3">
              <Note icon={<Sparkles className="size-4" aria-hidden />}>
                <NoteContent>A custom icon replaces the variant&apos;s default.</NoteContent>
              </Note>
              <Note icon={null}>
                <NoteContent>Pass a null icon to render no icon at all.</NoteContent>
              </Note>
            </div>
          </Section>
        </>
      );
    case "grid":
      return (
        <>
          <Section title="Grid" code={sectionCode("Grid")}>
            <GridSystem debug guideWidth={1} unstable_useContainer>
              <Grid columns={5} height="preserve-aspect-ratio" rows={2} />
            </GridSystem>
          </Section>
          <Section title="Basic grid" code={sectionCode("Basic grid")}>
            <GridSystem guideWidth={1} unstable_useContainer>
              <Grid columns={3} rows={2}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <GridCell key={n}>{n}</GridCell>
                ))}
              </Grid>
            </GridSystem>
          </Section>
          <Section title="Solid cells" code={sectionCode("Solid cells")}>
            <GridSystem guideWidth={1} unstable_useContainer>
              <Grid columns={3} rows={2}>
                <GridCell column="1/3" row="1" solid>
                  1 + 2
                </GridCell>
                <GridCell>3</GridCell>
                <GridCell>4</GridCell>
                <GridCell column="2/4" row="2" solid>
                  5 + 6
                </GridCell>
              </Grid>
            </GridSystem>
          </Section>
          <Section title="Responsive grid" code={sectionCode("Responsive grid")}>
            <GridSystem unstable_useContainer>
              <Grid columns={{ sm: 1, md: 2, lg: 3 }} rows={{ sm: 6, md: 3, lg: 2 }}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <GridCell key={n}>{n}</GridCell>
                ))}
              </Grid>
            </GridSystem>
          </Section>
          <Section
            title="Responsive guide clipping"
            code={sectionCode("Responsive guide clipping")}
          >
            <GridSystem unstable_useContainer>
              <Grid columns={{ sm: 1, md: 2, lg: 3 }} rows={{ sm: 6, md: 3, lg: 2 }}>
                <GridCell column={{ sm: "1", md: "1/3" }} row={{ sm: "1/3", md: 1 }} solid>
                  1 + 2
                </GridCell>
                <GridCell>3</GridCell>
                <GridCell>4</GridCell>
                <GridCell
                  column={{ sm: 1, md: "1/3", lg: "2/4" }}
                  row={{ sm: "5/7", md: 3, lg: 2 }}
                  solid
                >
                  5 + 6
                </GridCell>
              </Grid>
            </GridSystem>
          </Section>
          <Section title="Hidden row guides" code={sectionCode("Hidden row guides")}>
            <GridSystem unstable_useContainer>
              <Grid columns={12} height="preserve-aspect-ratio" hideGuides="row" rows={3} />
            </GridSystem>
          </Section>
          <Section title="Hidden column guides" code={sectionCode("Hidden column guides")}>
            <GridSystem unstable_useContainer>
              <Grid columns={12} height="preserve-aspect-ratio" hideGuides="column" rows={3} />
            </GridSystem>
          </Section>
          <Section title="Overlaying cells" code={sectionCode("Overlaying cells")}>
            <GridSystem unstable_useContainer>
              <Grid columns={12} rows={3}>
                <GridCell column="1/3" row="1/3" solid>
                  1
                </GridCell>
                <GridCell column="2/4" row="2/4">
                  2
                </GridCell>
                <GridCell column="3/10" row="2/4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at felis
                </GridCell>
                <GridCell column="7/12" row="1/-1" solid>
                  3
                </GridCell>
                <GridCell column="11/13" row="1/3" solid>
                  4
                </GridCell>
              </Grid>
            </GridSystem>
          </Section>
          <Section title="Specific guide clipping" code={sectionCode("Specific guide clipping")}>
            <GridSystem guideWidth={1} unstable_useContainer>
              <Grid columns={3} rows={4}>
                <GridCell column="1/2" row="1/3" solid>
                  1
                </GridCell>
                <GridCell column="3/4" row="1/2" solid>
                  2
                </GridCell>
                <GridCell column="2/3" row="2/4">
                  3
                </GridCell>
                <GridCell column="1/2" row="4/5" solid>
                  4
                </GridCell>
                <GridCell column="3/4" row="3/5" solid>
                  5
                </GridCell>
              </Grid>
            </GridSystem>
          </Section>
          <Section title="Grid with cross" code={sectionCode("Grid with cross")}>
            <GridSystem guideWidth={1} unstable_useContainer>
              <Grid columns={3} rows={2}>
                <GridCross column={1} row={1} />
                <GridCross column={4} row={1} />
                <GridCross column={4} row={3} />
                <GridCross column={1} row={3} />
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <GridCell key={n}>{n}</GridCell>
                ))}
              </Grid>
            </GridSystem>
          </Section>
          <Section title="Dashed grid with cross" code={sectionCode("Dashed grid with cross")}>
            <GridSystem dashedGuides guideWidth={1} unstable_useContainer>
              <Grid columns={1} rows={1}>
                <GridCross column={1} row={1} />
                <GridCross column={2} row={2} />
                <GridCross column={2} row={1} />
                <GridCross column={1} row={2} />
                <GridCell>Content here</GridCell>
              </Grid>
            </GridSystem>
          </Section>
          <Section
            title="Dashed grid with grid page"
            code={sectionCode("Dashed grid with grid page")}
          >
            <GridPage>
              <GridSystem dashedGuides guideWidth={1}>
                <Grid columns={1} rows={1}>
                  <GridCross column={1} row={1} />
                  <GridCross column={2} row={2} />
                  <GridCross column={2} row={1} />
                  <GridCross column={1} row={2} />
                  <GridCell>Content here</GridCell>
                </Grid>
              </GridSystem>
            </GridPage>
          </Section>
        </>
      );
    default:
      return null;
  }
}

/* ---------- 总览模式 ---------- */

function ComponentsOverview() {
  const { language } = useLanguage();
  return (
    <div>
      <h1 className="text-heading-24 sm:text-heading-40 text-foreground">
        {demoText(language, "Components")}
      </h1>
      <p className="mt-3 max-w-xl text-copy-20 text-muted-foreground">
        {demoText(language, "Building blocks for React applications.")}
      </p>

      <div className="mt-10 grid grid-cols-1 border-t border-l border-border sm:grid-cols-2 xl:grid-cols-3">
        {COMPONENTS.map((component) => (
          <a
            key={component.name}
            href={`#/components/${component.name}`}
            className="group block border-b border-r border-border p-6 transition-colors hover:bg-gray-alpha-100"
          >
            <p className="font-mono text-label-12 text-muted-foreground">{component.official}</p>
            <h3 className="mt-1 flex flex-wrap items-center gap-1.5 text-label-16 font-medium text-foreground">
              {language === "zh-CN" ? (component.labelZh ?? component.label) : component.label}
              {component.mobileOnly && (
                <Badge size="sm" variant="gray">
                  {demoText(language, "Mobile only")}
                </Badge>
              )}
            </h3>
            <p className="mt-1 text-copy-13 text-muted-foreground">
              {language === "zh-CN"
                ? (component.descriptionZh ?? component.description)
                : component.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ---------- 详情模式 ---------- */

function ComponentDetail({ name }: { name: string }) {
  const { language } = useLanguage();
  const meta: ComponentMeta | undefined = COMPONENTS.find((component) => component.name === name);

  if (!meta) {
    return (
      <div>
        <BackLink />
        <h1 className="text-heading-24 sm:text-heading-40 text-foreground">
          {demoText(language, "Component not found")}
        </h1>
        <p className="mt-3 max-w-xl text-copy-20 text-muted-foreground">
          {demoTextWithValues(language, "No component named {name} was found.", { name })}
        </p>
      </div>
    );
  }

  return (
    <div>
      <BackLink />
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h1 className="text-heading-24 sm:text-heading-40 text-foreground">
          {language === "zh-CN" ? (meta.labelZh ?? meta.label) : meta.label}
        </h1>
        <span className="rounded-full border border-gray-alpha-400 px-2 py-0.5 font-mono text-label-12 text-muted-foreground">
          {meta.official}
        </span>
        {meta.mobileOnly && (
          <Badge size="sm" variant="gray">
            {demoText(language, "Mobile only")}
          </Badge>
        )}
      </div>
      <p className="mt-3 max-w-xl text-copy-20 text-muted-foreground">
        {language === "zh-CN" ? (meta.descriptionZh ?? meta.description) : meta.description}
      </p>

      <section className="mt-10">
        <h2 className="text-heading-24 text-foreground">{demoText(language, "Live Demo")}</h2>
        <DemoSection componentName={name}>{renderDemo(name)}</DemoSection>
      </section>

      {renderExtraSections(name, language)}

      <ComponentApiReference componentName={name} />

      {meta.bestPractices && meta.bestPractices.length > 0 && (
        <section className="mt-12">
          <h2 className="text-heading-24 text-foreground">
            {demoText(language, "Best Practices")}
          </h2>
          <ul className="mt-6 space-y-3">
            {(language === "zh-CN"
              ? (meta.bestPracticesZh ?? meta.bestPractices)
              : meta.bestPractices
            ).map((bp, i) => (
              <li key={i} className="flex gap-3 text-copy-14 text-muted-foreground">
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground"
                  aria-hidden
                />
                {bp}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function BackLink() {
  const { language } = useLanguage();
  return (
    <a
      href="#/components"
      className="inline-flex items-center gap-1.5 text-copy-14 text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-4" aria-hidden />
      {demoText(language, "Back to Components")}
    </a>
  );
}

/* ---------- 页面入口 ---------- */

/**
 * 路由分发：/components → 总览；/components/:name → 详情。
 * App.tsx 的 PAGE_COMPONENTS 按前缀命中本组件，路径在此解析。
 */
export function ComponentsPage() {
  const { pathname } = useLocation();
  const match = pathname.match(/^\/components\/([^/]+)$/);
  const name = match?.[1];

  if (name) {
    return <ComponentDetail name={name} />;
  }
  return <ComponentsOverview />;
}
