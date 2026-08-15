import * as React from "react";
import { useLocation } from "react-router-dom";
import {
  ArrowDownCircle,
  ArrowLeft,
  ArrowRight,
  ChartColumn,
  CircleCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  CopyCheck,
  Edit,
  ExternalLink,
  LayoutGrid,
  List,
  Lock,
  LockOpen,
  Rocket,
  Search,
  Shield,
  Sparkles,
  Trash2,
  Upload,
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
import { Button } from "@/components/ui/button";
import {
  Calendar,
  calendarColClass,
  CALENDAR_ROW_CLASS,
  CALENDAR_ROW_REV_CLASS,
  TRIGGER_ROW_EXTRA_CLASS,
} from "@/components/ui/calendar";
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
import { CopyButton } from "@/components/ui/copy-button";
import { Description } from "@/components/ui/description";
import { DestructiveActionModal } from "@/components/ui/destructive-action-modal";
import { DotsMenu, DotsMenuItem } from "@/components/ui/dots-menu";
import { Menu, MenuButton, MenuContainer, MenuDivider, MenuItem } from "@/components/ui/menu";
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
import { Drawer } from "@/components/ui/drawer";
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
import { Grid, GridItem } from "@/components/ui/grid";
import { Input } from "@/components/ui/input";
import { JsonView, makeJsonViewHighlightPattern } from "@/components/ui/json-view";
import { Kbd } from "@/components/ui/keyboard-input";
import { Label } from "@/components/ui/label";
import { LoadMoreButton } from "@/components/ui/load-more-button";
import { LoadingDots } from "@/components/ui/loading-dots";
import { MiddleTruncate } from "@/components/ui/middle-truncate";
import {
  Modal,
  ModalClose,
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
import { Note } from "@/components/ui/note";
import { Pagination } from "@/components/ui/pagination";
import { Phone, PhoneScreen } from "@/components/ui/phone";
import { Pill } from "@/components/ui/pill";
import {
  ProjectBanner,
  ProjectBannerClose,
  ProjectBannerContent,
} from "@/components/ui/project-banner";
import { Progress } from "@/components/ui/progress";
import { Radio, RadioGroup, RadioGroupItem, useRadio } from "@/components/ui/radio";
import { RelativeTimeCard } from "@/components/ui/relative-time-card";
import { Scroller } from "@/components/ui/scroller";
import { SearchInput } from "@/components/ui/search-input";
import { Switch, SwitchControl } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
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
  TableRow,
} from "@/components/ui/table";
import { Tabs } from "@/components/ui/tabs";
import { TextWithCopyButton } from "@/components/ui/text-with-copy-button";
import { Textarea } from "@/components/ui/textarea";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { Toggle } from "@/components/ui/toggle";
import { Toasts, useToasts } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";
import { Video } from "@/components/ui/video";

import { COMPONENTS, type ComponentMeta } from "../data/components";
import { demoText, demoTextWithValues } from "../i18n/components-demo";
import { type DocsLanguage, useLanguage } from "../i18n/language";

/**
 * Components 文档页（docs/geist 专用）。
 * 总览模式（/components）：13 元件索引卡片网格。
 * 详情模式（/components/:name）：返回链接 + 实时 demo（直接渲染根元件）+ 代码块（带 Copy 按钮）。
 */

/* ---------- Copy 按钮（复用 Introduction 页终端行模式） ---------- */

function CodeCopyButton({ text }: { text: string }) {
  const { language } = useLanguage();
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // 降级：隐藏 textarea + execCommand（无 clipboard 权限的环境仍可复制并给出反馈）
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1500);
  };

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <Button
      typeName="button"
      type="tertiary"
      svgOnly
      size="small"
      aria-label={copied ? demoText(language, "Copied") : demoText(language, "Copy code")}
      onClick={handleCopy}
      className="shrink-0"
    >
      {copied ? (
        <CopyCheck className="size-3.5 text-foreground" aria-hidden />
      ) : (
        <Copy className="size-3.5 text-muted-foreground" aria-hidden />
      )}
    </Button>
  );
}

/* ---------- 代码块 ---------- */

function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-gray-alpha-400 bg-background">
      <div className="flex items-center justify-between border-b border-[#eaeaea] py-1 pr-1 pl-3">
        <span className="text-label-12-mono text-muted-foreground">{label}</span>
        <CodeCopyButton text={code} />
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-copy-13 leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ---------- Demo 容器 ---------- */

function DemoSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 flex min-h-28 flex-wrap items-center gap-x-6 gap-y-4 rounded-[8px] border border-gray-alpha-400 bg-background p-6">
      {children}
    </div>
  );
}

function TableDemoCard({ children, code }: { children: React.ReactNode; code: string }) {
  const { language } = useLanguage();
  const [showCode, setShowCode] = React.useState(false);
  const codeId = React.useId();

  return (
    <div className="mt-6 overflow-hidden rounded-[8px] border border-gray-alpha-400 bg-background-100">
      <div className="w-full overflow-x-auto p-6">{children}</div>
      <button
        type="button"
        aria-expanded={showCode}
        aria-controls={codeId}
        onClick={() => setShowCode((value) => !value)}
        className="flex h-12 w-full items-center gap-2 border-t border-[#eaeaea] bg-background-200 px-6 text-left text-copy-14 text-foreground transition-colors hover:bg-gray-200 focus-ring"
      >
        <ChevronRight
          className={`size-4 transition-transform${showCode ? " rotate-90" : ""}`}
          aria-hidden
        />
        {demoText(language, "Show code")}
      </button>
      {showCode ? (
        <pre
          id={codeId}
          className="overflow-x-auto border-t border-[#eaeaea] bg-background p-6 font-mono text-copy-13 leading-relaxed text-foreground"
        >
          <code>{code}</code>
        </pre>
      ) : null}
    </div>
  );
}

/* ---------- 13 元件实时 demo（直接渲染根元件） ---------- */

function BadgeDemo() {
  return (
    <>
      <Badge variant="gray">Gray</Badge>
      <Badge variant="blue">Blue</Badge>
      <Badge variant="purple">Purple</Badge>
      <Badge variant="amber">Amber</Badge>
      <Badge variant="red">Red</Badge>
      <Badge variant="green">Green</Badge>
    </>
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
  return (
    <Pagination
      previous={{ title: "Avatar", href: "#/components/avatar" }}
      next={{ title: "Phone", href: "#/components/phone" }}
    />
  );
}

function EmptyStateDemo() {
  const { language } = useLanguage();
  const icon = <EmptyStateIcon icon={<ChartColumn className="size-8" aria-hidden />} />;
  return (
    <div className="w-full max-w-[862px] space-y-6">
      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
      </div>
      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
      </div>
      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
                type="secondary"
                typeName="button"
                className="relative !max-w-full !border-0 !leading-[21px] whitespace-normal shadow-[0_0_0_1px_var(--gray-400)]"
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
      </div>
    </div>
  );
}

function ButtonDemo() {
  const { language } = useLanguage();
  const upload = demoText(language, "Upload");
  const defaultLabel = demoText(language, "Default");
  const secondaryLabel = demoText(language, "Secondary");
  const tertiaryLabel = demoText(language, "Tertiary");
  const errorLabel = demoText(language, "Error");
  const warningLabel = demoText(language, "Warning");

  const footerBar = (
    <div className="bg-background-200 relative flex items-center rounded-b-lg border-t border-gray-400">
      <div className="border-b-lg w-full" data-state="closed">
        <button
          type="button"
          aria-expanded={false}
          data-state="closed"
          className="bg-background-200 focus-visible:shadow-focus-ring flex h-[48px] w-full cursor-pointer items-center gap-3 rounded-b-lg px-4 text-left font-sans text-sm text-gray-900 focus:outline-none"
        >
          <div className="-rotate-90">
            <ChevronRight className="size-4" aria-hidden />
          </div>
          {demoText(language, "Show code")}
        </button>
        <div data-state="closed" hidden />
      </div>
    </div>
  );

  const uploadIcon = <Upload aria-hidden />;

  return (
    <>
      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="all-types-and-sizes-in-comparison"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div
            className="w-full min-w-full p-6"
            data-demo-container="all-types-and-sizes-in-comparison"
          >
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
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="prefix-and-suffix"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="prefix-and-suffix">
            <div className="flex flex-col items-start gap-4 md:flex-row">
              <Button typeName="button" prefix={uploadIcon}>
                {upload}
              </Button>
              <Button typeName="button" suffix={uploadIcon}>
                {upload}
              </Button>
              <Button typeName="button" prefix={uploadIcon} suffix={uploadIcon}>
                {upload}
              </Button>
            </div>
          </div>
        </div>
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="loading"
      >
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
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="disabled"
      >
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
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="disabled-variants"
      >
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
        {footerBar}
      </div>
    </>
  );
}

function CheckboxDemo() {
  const { language } = useLanguage();
  return (
    <>
      <div
        className="mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
      </div>
      <div
        className="mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
                <Checkbox checked disabled aria-label={demoText(language, "Disabled Checked")} />
                <span className="ml-2">{demoText(language, "Disabled Checked")}</span>
              </label>
              <label className="text-checkbox-label inline-flex cursor-not-allowed items-start text-disabled-foreground">
                <Checkbox
                  checked="indeterminate"
                  disabled
                  aria-label={demoText(language, "Disabled Indeterminate")}
                />
                <span className="ml-2">{demoText(language, "Disabled Indeterminate")}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div
        className="mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="indeterminate"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="indeterminate">
            <label className="text-checkbox-label inline-flex cursor-pointer items-start">
              <Checkbox checked="indeterminate" aria-label={demoText(language, "Option 1")} />
              <span className="ml-2 text-foreground">{demoText(language, "Option 1")}</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

function MenuDemo() {
  const { language } = useLanguage();
  return (
    <MenuContainer>
      <MenuButton>Actions</MenuButton>
      <Menu width={200}>
        <MenuItem prefix={<Edit aria-hidden />}>{demoText(language, "Edit Project")}</MenuItem>
        <MenuItem prefix={<Copy aria-hidden />}>{demoText(language, "Duplicate Project")}</MenuItem>
        <MenuDivider />
        <MenuItem type="error" prefix={<Trash2 aria-hidden />}>
          Delete Project
        </MenuItem>
      </Menu>
    </MenuContainer>
  );
}

function InputDemo() {
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

  const footerBar = (
    <div className="bg-background-200 relative flex items-center rounded-b-lg border-t border-gray-400">
      <div className="border-b-lg w-full" data-state="closed">
        <button
          type="button"
          aria-expanded={false}
          data-state="closed"
          className="bg-background-200 focus-visible:shadow-focus-ring flex h-[48px] w-full cursor-pointer items-center gap-3 rounded-b-lg px-4 text-left font-sans text-sm text-gray-900 focus:outline-none"
        >
          <div className="-rotate-90">
            <ChevronRight className="size-4" aria-hidden />
          </div>
          {demoText(language, "Show code")}
        </button>
        <div data-state="closed" hidden />
      </div>
    </div>
  );

  return (
    <>
      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row flex-initial">
              <Input
                size="small"
                className="text-black"
                placeholder={demoText(language, "Small")}
              />
              <Input className="text-black" placeholder={demoText(language, "Default")} />
              <Input
                size="large"
                className="text-black"
                placeholder={demoText(language, "Large")}
              />
            </div>
          </div>
        </div>
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="error"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="error">
            <div className="flex flex-col items-start justify-start gap-8 flex-initial">
              <Input
                size="small"
                className="text-black"
                error={demoText(language, "An error message.")}
                placeholder={demoText(language, "long-error@gmail.com")}
              />
              <Input
                className="text-black"
                error={demoText(language, "An error message.")}
                placeholder={demoText(language, "long-error@gmail.com")}
              />
              <Input
                size="large"
                className="text-black"
                error={demoText(language, "An error message.")}
                placeholder={demoText(language, "long-error@gmail.com")}
              />
            </div>
          </div>
        </div>
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="label"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="label">
            <div className="flex flex-col items-start justify-start flex-initial">
              <Input
                className="text-black"
                label={demoText(language, "Label")}
                placeholder={demoText(language, "Label")}
              />
            </div>
          </div>
        </div>
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>
    </>
  );
}

function ModalDemo() {
  const { language } = useLanguage();
  const [openDefault, setOpenDefault] = React.useState(false);
  const [openSticky, setOpenSticky] = React.useState(false);
  const [openSingleButton, setOpenSingleButton] = React.useState(false);
  const [openInset, setOpenInset] = React.useState(false);

  const footerBar = (
    <div className="bg-background-200 relative flex items-center rounded-b-lg border-t border-gray-400">
      <div className="border-b-lg w-full" data-state="closed">
        <button
          type="button"
          aria-expanded={false}
          data-state="closed"
          className="bg-background-200 focus-visible:shadow-focus-ring flex h-[48px] w-full cursor-pointer items-center gap-3 rounded-b-lg px-4 text-left font-sans text-sm text-gray-900 focus:outline-none"
        >
          <div className="-rotate-90">
            <ChevronRight className="size-4" aria-hidden />
          </div>
          {demoText(language, "Show code")}
        </button>
        <div data-state="closed" hidden />
      </div>
    </div>
  );

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
    <div className="w-full max-w-[862px]">
      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>

      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>

      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>

      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>
    </div>
  );
}

function SwitchDemo() {
  const { language } = useLanguage();

  const footerBar = (
    <div className="bg-background-200 relative flex items-center rounded-b-lg border-t border-gray-400">
      <div className="border-b-lg w-full" data-state="closed">
        <button
          type="button"
          aria-expanded={false}
          data-state="closed"
          className="bg-background-200 focus-visible:shadow-focus-ring flex h-[48px] w-full cursor-pointer items-center gap-3 rounded-b-lg px-4 text-left font-sans text-sm text-gray-900 focus:outline-none"
        >
          <div className="-rotate-90">
            <ChevronRight className="size-4" aria-hidden />
          </div>
          {demoText(language, "Show code")}
        </button>
        <div data-state="closed" hidden />
      </div>
    </div>
  );

  return (
    <>
      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>
    </>
  );
}

function SelectDemo() {
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

  const footerBar = (
    <div className="bg-background-200 relative flex items-center rounded-b-lg border-t border-gray-400">
      <div className="border-b-lg w-full" data-state="closed">
        <button
          type="button"
          aria-expanded={false}
          data-state="closed"
          className="bg-background-200 focus-visible:shadow-focus-ring flex h-[48px] w-full cursor-pointer items-center gap-3 rounded-b-lg px-4 text-left font-sans text-sm text-gray-900 focus:outline-none"
        >
          <div className="-rotate-90">
            <ChevronRight className="size-4" aria-hidden />
          </div>
          {demoText(language, "Show code")}
        </button>
        <div data-state="closed" hidden />
      </div>
    </div>
  );

  const sizesRowClass =
    "flex relative min-w-px max-w-full flex-col sm:flex-row sm:flex-wrap flex-1";
  const sizesColClass = "flex relative min-w-px max-w-full flex-col items-start flex-1";

  return (
    <>
      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="sizes"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="sizes">
            <div className={sizesRowClass}>
              <div className={sizesColClass}>
                <Select size="small" aria-label="Small" placeholder={demoText(language, "Small")}>
                  <option>{demoText(language, "Option 1")}</option>
                  <option>{demoText(language, "Option 2")}</option>
                  <option>{demoText(language, "Option 3")}</option>
                </Select>
              </div>
              <div className={sizesColClass}>
                <Select aria-label="Default" placeholder={demoText(language, "Default")}>
                  <option>{demoText(language, "Option 1")}</option>
                  <option>{demoText(language, "Option 2")}</option>
                  <option>{demoText(language, "Option 3")}</option>
                </Select>
              </div>
              <div className={sizesColClass}>
                <Select size="large" aria-label="Large" placeholder={demoText(language, "Large")}>
                  <option>{demoText(language, "Option 1")}</option>
                  <option>{demoText(language, "Option 2")}</option>
                  <option>{demoText(language, "Option 3")}</option>
                </Select>
              </div>
            </div>
          </div>
        </div>
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="with-options"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="with-options">
            <div className="flex flex-col items-start gap-4 md:flex-row">
              <div>
                <Select aria-label="Fruit" placeholder={demoText(language, "Select a fruit")}>
                  <option>{demoText(language, "Apple")}</option>
                  <option>{demoText(language, "Orange")}</option>
                  <option>{demoText(language, "Banana")}</option>
                  <option>{demoText(language, "Grape")}</option>
                </Select>
              </div>
              <div>
                <Select
                  aria-label="Fruit with default value"
                  defaultValue="Banana"
                  placeholder={demoText(language, "With default value")}
                >
                  <option>{demoText(language, "Apple")}</option>
                  <option>{demoText(language, "Orange")}</option>
                  <option>{demoText(language, "Banana")}</option>
                  <option>{demoText(language, "Grape")}</option>
                </Select>
              </div>
            </div>
          </div>
        </div>
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="required"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="required">
            <Select
              required
              label={demoText(language, "Required field")}
              placeholder={demoText(language, "Please select an option")}
            >
              <option>{demoText(language, "Option 1")}</option>
              <option>{demoText(language, "Option 2")}</option>
              <option>{demoText(language, "Option 3")}</option>
            </Select>
          </div>
        </div>
        {footerBar}
      </div>
    </>
  );
}

function SeparatorDemo() {
  const { language } = useLanguage();

  const footerBar = (
    <div className="bg-background-200 relative flex items-center rounded-b-lg border-t border-gray-400">
      <div className="border-b-lg w-full" data-state="closed">
        <button
          type="button"
          aria-expanded={false}
          data-state="closed"
          className="bg-background-200 focus-visible:shadow-focus-ring flex h-[48px] w-full cursor-pointer items-center gap-3 rounded-b-lg px-4 text-left font-sans text-sm text-gray-900 focus:outline-none"
        >
          <div className="-rotate-90">
            <ChevronRight className="size-4" aria-hidden />
          </div>
          {demoText(language, "Show code")}
        </button>
        <div data-state="closed" hidden />
      </div>
    </div>
  );

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
        {footerBar}
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
        {footerBar}
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
        {footerBar}
      </div>
    </>
  );
}

function SkeletonDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      {/* 卡片骨架 */}
      <div className="flex w-full max-w-sm flex-col gap-3 rounded-lg border border-gray-alpha-400 p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      {/* 文本骨架 */}
      <div className="flex w-full max-w-sm flex-col gap-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      {/* 圆形骨架 */}
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-full" />
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="size-20 rounded-full" />
      </div>
    </div>
  );
}

function SpinnerDemo() {
  return (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="small" />
        <span className="text-label-12 text-muted-foreground">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="md" />
        <span className="text-label-12 text-muted-foreground">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="large" />
        <span className="text-label-12 text-muted-foreground">lg</span>
      </div>
    </div>
  );
}

function StepPointDemo() {
  return (
    <ul className="w-full max-w-xs">
      <StepPoint status="done">Submitted</StepPoint>
      <StepPoint status="active">Under review</StepPoint>
      <StepPoint status="idle">Approved</StepPoint>
    </ul>
  );
}

function TableDemo() {
  const basicData = [
    { c1: "Value 1.1", c2: "Value 1.2", c3: "Value 1.3" },
    { c1: "Value 2.1", c2: "Value 2.2", c3: "Value 2.3" },
    { c1: "Value 3.1", c2: "Value 3.2", c3: "Value 3.3" },
  ];
  return (
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
  );
}

function TabsDemo() {
  const [tab, setTab] = React.useState("overview");

  return (
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
  );
}

function TextareaDemo() {
  const { language } = useLanguage();

  const footerBar = (
    <div className="bg-background-200 relative flex items-center rounded-b-lg border-t border-gray-400">
      <div className="border-b-lg w-full" data-state="closed">
        <button
          type="button"
          aria-expanded={false}
          data-state="closed"
          className="bg-background-200 focus-visible:shadow-focus-ring flex h-[48px] w-full cursor-pointer items-center gap-3 rounded-b-lg px-4 text-left font-sans text-sm text-gray-900 focus:outline-none"
        >
          <div className="-rotate-90">
            <ChevronRight className="size-4" aria-hidden />
          </div>
          {demoText(language, "Show code")}
        </button>
        <div data-state="closed" hidden />
      </div>
    </div>
  );

  const lorem = demoText(
    language,
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );

  return (
    <>
      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <label>
              <Textarea className="text-black" aria-label={demoText(language, "Default")} />
            </label>
          </div>
        </div>
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="disabled"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="disabled">
            <label>
              <Textarea disabled aria-label={demoText(language, "Disabled")} />
            </label>
          </div>
        </div>
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="error"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="error">
            <div className="flex flex-col items-stretch justify-start gap-8 flex-initial">
              <label>
                <Textarea
                  size="small"
                  className="text-black"
                  aria-label={demoText(language, "With error (small)")}
                  error={demoText(language, "There has been an error.")}
                  defaultValue={lorem}
                />
              </label>
              <label>
                <Textarea
                  className="text-black"
                  aria-label={demoText(language, "With error (medium)")}
                  error={demoText(language, "There has been an error.")}
                  defaultValue={lorem}
                />
              </label>
              <label>
                <Textarea
                  size="large"
                  className="text-black"
                  aria-label={demoText(language, "With error (large)")}
                  error={demoText(language, "There has been an error.")}
                  defaultValue={lorem}
                />
              </label>
            </div>
          </div>
        </div>
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="sizes"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="sizes">
            <div className="flex flex-col gap-6">
              <label>
                <Textarea
                  className="text-black"
                  aria-label={demoText(language, "Textarea")}
                  defaultValue={lorem}
                />
              </label>
              <label>
                <Textarea
                  className="text-black"
                  aria-label={demoText(language, "Textarea")}
                  defaultValue={lorem}
                />
              </label>
              <label>
                <Textarea
                  size="large"
                  className="text-black"
                  aria-label={demoText(language, "Textarea")}
                  defaultValue={lorem}
                />
              </label>
            </div>
          </div>
        </div>
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="read-only"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="read-only">
            <label>
              <Textarea
                className="text-black"
                readOnly
                aria-label={demoText(language, "Read only")}
                defaultValue={lorem}
              />
            </label>
          </div>
        </div>
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="rows"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="rows">
            <label>
              <Textarea
                className="text-black"
                rows={5}
                aria-label={demoText(language, "Textarea with fixed rows")}
              />
            </label>
          </div>
        </div>
        {footerBar}
      </div>
    </>
  );
}

function ToggleDemo() {
  const { language } = useLanguage();
  const [defaultOff, setDefaultOff] = React.useState(false);
  const [defaultOn, setDefaultOn] = React.useState(true);
  const [customChecked, setCustomChecked] = React.useState(false);
  const [labelChecked, setLabelChecked] = React.useState(false);

  const lockIcon = {
    checked: <Lock className="size-2" aria-hidden />,
    unchecked: <LockOpen className="size-2" aria-hidden />,
  };

  const footerBar = (
    <div className="bg-background-200 relative flex items-center rounded-b-lg border-t border-gray-400">
      <div className="border-b-lg w-full" data-state="closed">
        <button
          type="button"
          aria-expanded={false}
          data-state="closed"
          className="bg-background-200 focus-visible:shadow-focus-ring flex h-[48px] w-full cursor-pointer items-center gap-3 rounded-b-lg px-4 text-left font-sans text-sm text-gray-900 focus:outline-none"
        >
          <div className="-rotate-90">
            <ChevronRight className="size-4" aria-hidden />
          </div>
          {demoText(language, "Show code")}
        </button>
        <div data-state="closed" hidden />
      </div>
    </div>
  );

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
                  onCheckedChange={setDefaultOff}
                />
              </div>
              <div>
                <Toggle
                  aria-label={demoText(language, "Enable Firewall")}
                  checked={defaultOn}
                  onCheckedChange={setDefaultOn}
                />
              </div>
            </div>
          </div>
        </div>
        {footerBar}
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
                  disabled
                />
              </div>
              <div>
                <Toggle aria-label={demoText(language, "Enable Firewall")} checked disabled />
              </div>
            </div>
          </div>
        </div>
        {footerBar}
      </div>

      <div
        className="relative mt-6 w-full rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="sizes"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="sizes">
            <div className="flex flex-row flex-wrap">
              <div className="flex-1">
                <Toggle aria-label={demoText(language, "Enable Firewall")} checked={false} />
              </div>
              <div className="flex-1">
                <Toggle
                  aria-label={demoText(language, "Enable Firewall")}
                  checked={false}
                  size="medium"
                />
              </div>
              <div className="flex-1">
                <Toggle
                  aria-label={demoText(language, "Enable Firewall")}
                  checked={false}
                  size="large"
                />
              </div>
            </div>
          </div>
        </div>
        {footerBar}
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
                  onCheckedChange={setCustomChecked}
                />
              </div>
              <div>
                <Toggle
                  aria-label={demoText(language, "Enable Firewall")}
                  checked={customChecked}
                  color="red"
                  icon={lockIcon}
                  onCheckedChange={setCustomChecked}
                />
              </div>
              <div>
                <Toggle
                  aria-label={demoText(language, "Enable Firewall")}
                  checked={customChecked}
                  color="amber"
                  icon={lockIcon}
                  size="large"
                  onCheckedChange={setCustomChecked}
                />
              </div>
              <div>
                <Toggle
                  aria-label={demoText(language, "Enable Firewall")}
                  checked={customChecked}
                  color="red"
                  icon={lockIcon}
                  size="large"
                  onCheckedChange={setCustomChecked}
                />
              </div>
            </div>
          </div>
        </div>
        {footerBar}
      </div>

      <div
        className="relative mt-6 w-full rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="with-label"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="with-label">
            <div className="flex flex-col items-start justify-start gap-4">
              <div className="flex flex-row items-stretch justify-start gap-4">
                <Toggle checked={labelChecked} onCheckedChange={setLabelChecked}>
                  {demoText(language, "Enable Firewall")}
                </Toggle>
                <Toggle checked={labelChecked} direction="rtl" onCheckedChange={setLabelChecked}>
                  {demoText(language, "Enable Firewall")}
                </Toggle>
              </div>
              <div className="flex flex-row items-stretch justify-start gap-4">
                <Toggle checked={labelChecked} size="large" onCheckedChange={setLabelChecked}>
                  {demoText(language, "Enable Firewall")}
                </Toggle>
                <Toggle
                  checked={labelChecked}
                  direction="rtl"
                  size="large"
                  onCheckedChange={setLabelChecked}
                >
                  {demoText(language, "Enable Firewall")}
                </Toggle>
              </div>
              <div className="flex flex-row items-stretch justify-start gap-4">
                <Toggle checked={labelChecked} icon={lockIcon} onCheckedChange={setLabelChecked}>
                  {demoText(language, "Enable Firewall")}
                </Toggle>
                <Toggle
                  checked={labelChecked}
                  direction="rtl"
                  icon={lockIcon}
                  onCheckedChange={setLabelChecked}
                >
                  {demoText(language, "Enable Firewall")}
                </Toggle>
              </div>
              <div className="flex flex-row items-stretch justify-start gap-4">
                <Toggle
                  checked={labelChecked}
                  icon={lockIcon}
                  size="large"
                  onCheckedChange={setLabelChecked}
                >
                  {demoText(language, "Enable Firewall")}
                </Toggle>
                <Toggle
                  checked={labelChecked}
                  direction="rtl"
                  icon={lockIcon}
                  size="large"
                  onCheckedChange={setLabelChecked}
                >
                  {demoText(language, "Enable Firewall")}
                </Toggle>
              </div>
            </div>
          </div>
        </div>
        {footerBar}
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
  return (
    <div className="flex items-center gap-2">
      <ThemeSwitcher />
      <span className="text-copy-14 text-muted-foreground">Light / System / Dark</span>
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
  return (
    <div className="flex flex-wrap items-center justify-center gap-5">
      <StatusDot state="QUEUED" label />
      <StatusDot state="BUILDING" label />
      <StatusDot state="READY" label />
      <StatusDot state="ERROR" label />
      <StatusDot state="CANCELED" label />
    </div>
  );
}

function ToastDemo() {
  const { language } = useLanguage();
  const toasts = useToasts();

  return (
    <>
      <Button
        typeName="button"
        onClick={() => toasts.message({ text: demoText(language, "Project deleted") })}
      >
        {demoText(language, "Show Toast")}
      </Button>
      <Toasts />
    </>
  );
}

function CopyButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <CopyButton textToCopy="lipsum" />
      <span className="text-copy-13 text-muted-foreground">Click to copy “lipsum”</span>
    </div>
  );
}

function DrawerDemo() {
  const { language } = useLanguage();
  const [open, setOpen] = React.useState(false);
  const [customOpen, setCustomOpen] = React.useState(false);

  const drawerBody = (
    <div className="flex flex-col items-stretch justify-start gap-2 p-12">
      <p className="text-center text-[18px] font-semibold leading-[24px]">
        {demoText(language, "A drawer title")}
      </p>
      <p className="text-center text-copy-14">{demoText(language, "Drawer body")}</p>
    </div>
  );

  const footerBar = (
    <div className="bg-background-200 relative flex items-center rounded-b-lg border-t border-gray-400">
      <div className="border-b-lg w-full" data-state="closed">
        <button
          type="button"
          aria-expanded={false}
          data-state="closed"
          className="bg-background-200 focus-visible:shadow-focus-ring flex h-[48px] w-full cursor-pointer items-center gap-3 rounded-b-lg px-4 text-left font-sans text-sm text-gray-900 focus:outline-none"
        >
          <div className="-rotate-90">
            <ChevronRight className="size-4" aria-hidden />
          </div>
          {demoText(language, "Show code")}
        </button>
        <div data-state="closed" hidden />
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[862px] space-y-6">
      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
        <Drawer show={open} onDismiss={() => setOpen(false)} verticalScroll>
          {drawerBody}
        </Drawer>
      </div>
      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
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
  const { language } = useLanguage();
  const [open, setOpen] = React.useState(false);
  const [topOpen, setTopOpen] = React.useState(false);
  const [rightOpen, setRightOpen] = React.useState(false);
  const [bottomOpen, setBottomOpen] = React.useState(false);
  const [leftOpen, setLeftOpen] = React.useState(false);

  const footerBar = (
    <div className="bg-background-200 relative flex items-center rounded-b-lg border-t border-gray-400">
      <div className="border-b-lg w-full" data-state="closed">
        <button
          type="button"
          aria-expanded={false}
          data-state="closed"
          className="bg-background-200 focus-visible:shadow-focus-ring flex h-[48px] w-full cursor-pointer items-center gap-3 rounded-b-lg px-4 text-left font-sans text-sm text-gray-900 focus:outline-none"
        >
          <div className="-rotate-90">
            <ChevronRight className="size-4" aria-hidden />
          </div>
          {demoText(language, "Show code")}
        </button>
        <div data-state="closed" hidden />
      </div>
    </div>
  );

  const sheetBody = (title: string, description: string) => (
    <div className="flex flex-col gap-4">
      <SheetHeader className="p-6">
        <SheetTitle>{demoText(language, title)}</SheetTitle>
        <SheetDescription>{demoText(language, description)}</SheetDescription>
      </SheetHeader>
      <p className="px-6 py-4 text-copy-14 text-muted-foreground">
        {demoText(language, "Sheet body")}
      </p>
      <SheetFooter className="p-6">
        <SheetClose asChild>
          <Button typeName="button" type="secondary">
            {demoText(language, "Close")}
          </Button>
        </SheetClose>
      </SheetFooter>
    </div>
  );

  return (
    <div className="w-full max-w-[862px] space-y-6">
      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  type="default"
                  className="relative flex max-w-full whitespace-normal leading-[21px]"
                >
                  {demoText(language, "Open Sheet")}
                </Button>
              </SheetTrigger>
              <SheetContent>{sheetBody("Sheet Title", "Sheet description")}</SheetContent>
            </Sheet>
          </div>
        </div>
        {footerBar}
      </div>
      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="with-side"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="with-side">
            <div className="flex items-center justify-center gap-4">
              <Sheet open={topOpen} onOpenChange={setTopOpen}>
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
              <Sheet open={rightOpen} onOpenChange={setRightOpen}>
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
              <Sheet open={bottomOpen} onOpenChange={setBottomOpen}>
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
              <Sheet open={leftOpen} onOpenChange={setLeftOpen}>
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
        {footerBar}
      </div>
    </div>
  );
}

function SnippetDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <Snippet text="npm i geist" />
      <Snippet text="vercel link" />
    </div>
  );
}

function BookDemo() {
  const { language } = useLanguage();
  const title = "The user experience of the Frontend Cloud";

  return (
    <div className="w-full space-y-10">
      <section aria-labelledby="book-default-heading" className="space-y-4">
        <h3 id="book-default-heading" className="text-heading-20">
          {demoText(language, "Default")}
        </h3>
        <div className="flex min-h-80 items-center justify-center rounded-md border border-gray-alpha-400 p-8">
          <Book title={title} />
        </div>
      </section>

      <section aria-labelledby="book-variants-heading" className="space-y-4">
        <h3 id="book-variants-heading" className="text-heading-20">
          {demoText(language, "Variants")}
        </h3>
        <div className="grid min-h-80 place-items-center gap-8 rounded-md border border-gray-alpha-400 p-8 sm:grid-cols-2">
          <Book title={title} variant="simple" />
          <Book title={title} />
        </div>
      </section>

      <section aria-labelledby="book-colors-heading" className="space-y-4">
        <h3 id="book-colors-heading" className="text-heading-20">
          {demoText(language, "Custom color")}
        </h3>
        <div className="grid min-h-80 place-items-center gap-8 rounded-md border border-gray-alpha-400 p-8 sm:grid-cols-2 xl:grid-cols-3">
          <Book color="#9D2127" title="How Vercel improves your website's search engine ranking" />
          <Book
            color="#7DC1C1"
            textColor="white"
            title="Design Engineering at Vercel"
            variant="simple"
          />
          <Book color="#FED954" title={title} />
        </div>
      </section>

      <section aria-labelledby="book-responsive-heading" className="space-y-4">
        <h3 id="book-responsive-heading" className="text-heading-20">
          {demoText(language, "Responsive and textured")}
        </h3>
        <div className="flex min-h-80 items-center justify-center rounded-md border border-gray-alpha-400 p-8">
          <Book
            color="#7DC1C1"
            textured
            title="Design Engineering at Vercel"
            variant="simple"
            width={{ sm: 150, md: 196 }}
          />
        </div>
      </section>
    </div>
  );
}

function BrowserDemo() {
  return (
    <div className="w-full max-w-2xl">
      <Browser address="https://vercel.com">
        <div className="flex h-24 items-center justify-center bg-gray-alpha-100 text-copy-14 text-muted-foreground">
          Screenshot or demo content
        </div>
      </Browser>
    </div>
  );
}

function CalendarDemo() {
  const { language } = useLanguage();
  const triggerLabel = demoText(language, "Select Date Range");
  const periodLabel = demoText(language, "Select Period");
  const comboboxLabel = demoText(language, "Combobox Menu");

  const mediumItems = (
    <>
      <Calendar label={triggerLabel} />
      <Calendar
        label={triggerLabel}
        showCombobox
        className={CALENDAR_ROW_CLASS}
        width={180}
        triggerClassName={TRIGGER_ROW_EXTRA_CLASS}
        comboboxLabel={comboboxLabel}
      />
      <Calendar
        label={triggerLabel}
        showCombobox
        comboboxFirst
        comboboxFull
        comboboxWide
        className={calendarColClass("medium")}
        comboboxPlaceholder={periodLabel}
        comboboxLabel={comboboxLabel}
      />
      <Calendar
        label={triggerLabel}
        showCombobox
        comboboxFirst
        comboboxFull
        className={CALENDAR_ROW_REV_CLASS}
        comboboxPlaceholder={periodLabel}
        comboboxLabel={comboboxLabel}
      />
    </>
  );

  const smallItems = (
    <>
      <Calendar label={triggerLabel} size="small" />
      <Calendar
        label={triggerLabel}
        size="small"
        showCombobox
        className={CALENDAR_ROW_CLASS}
        width={180}
        triggerClassName={TRIGGER_ROW_EXTRA_CLASS}
        comboboxLabel={comboboxLabel}
      />
      <Calendar
        label={triggerLabel}
        size="small"
        showCombobox
        comboboxFirst
        comboboxFull
        comboboxWide
        className={calendarColClass("small")}
        comboboxPlaceholder={periodLabel}
        comboboxLabel={comboboxLabel}
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
      />
    </>
  );

  return (
    <div className="w-full max-w-[862px] space-y-6">
      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <div className="flex justify-center py-12">
              <Calendar label={triggerLabel} />
            </div>
          </div>
        </div>
      </div>
      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="horizontal-layout"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="horizontal-layout">
            <div className="flex justify-center py-12">
              <Calendar label={triggerLabel} />
            </div>
          </div>
        </div>
      </div>
      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
      </div>
      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="compact"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="compact">
            <div className="flex justify-center py-12">
              <Calendar
                label={triggerLabel}
                showCombobox
                className={CALENDAR_ROW_CLASS}
                width={180}
                triggerClassName={TRIGGER_ROW_EXTRA_CLASS}
                comboboxLabel={comboboxLabel}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChoiceboxDemo() {
  const { language } = useLanguage();
  const [plan, setPlan] = React.useState("trial");
  const [features, setFeatures] = React.useState<string[]>([]);
  const [disabledPlan, setDisabledPlan] = React.useState("");
  return (
    <div className="w-full max-w-2xl space-y-6">
      <div
        className="mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
      </div>
      <div
        className="rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
      </div>
      <div
        className="rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
      </div>
    </div>
  );
}

function CommandMenuDemo() {
  const { language } = useLanguage();
  const [openVariant, setOpenVariant] = React.useState<
    "default" | "with-divider" | "with-suffix" | null
  >(null);

  const openDemo = (variant: "default" | "with-divider" | "with-suffix") => {
    setOpenVariant(variant);
  };

  const footerBar = (
    <div className="bg-background-200 relative flex items-center rounded-b-lg border-t border-gray-400">
      <div className="border-b-lg w-full" data-state="closed">
        <button
          type="button"
          aria-expanded={false}
          data-state="closed"
          className="bg-background-200 focus-visible:shadow-focus-ring flex h-[48px] w-full cursor-pointer items-center gap-3 rounded-b-lg px-4 text-left font-sans text-sm text-gray-900 focus:outline-none"
        >
          <div className="-rotate-90">
            <ChevronRight className="size-4" aria-hidden />
          </div>
          {demoText(language, "Show code")}
        </button>
        <div data-state="closed" hidden />
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[862px] space-y-6">
      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <Button
              type="default"
              className="relative flex max-w-full whitespace-normal leading-[21px]"
              onClick={() => openDemo("default")}
            >
              {demoText(language, "Open Command Menu")}
            </Button>
          </div>
        </div>
        {footerBar}
      </div>
      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="with-divider"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="with-divider">
            <Button
              type="default"
              className="relative flex max-w-full whitespace-normal leading-[21px]"
              onClick={() => openDemo("with-divider")}
            >
              {demoText(language, "Open Command Menu")}
            </Button>
          </div>
        </div>
        {footerBar}
      </div>
      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="with-suffix"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="with-suffix">
            <Button
              type="default"
              className="relative flex max-w-full whitespace-normal leading-[21px]"
              onClick={() => openDemo("with-suffix")}
            >
              {demoText(language, "Open Command Menu")}
            </Button>
          </div>
        </div>
        {footerBar}
      </div>
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
      <Grid columns={3} gap="md">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="flex h-16 items-center justify-center rounded-md border border-gray-alpha-400 bg-gray-alpha-100 font-mono text-copy-14 text-muted-foreground"
          >
            {n}
          </div>
        ))}
      </Grid>
      <Grid columns={12} gap="sm">
        <GridItem
          span={6}
          className="flex h-12 items-center justify-center rounded-md border border-gray-alpha-400 bg-gray-alpha-100 font-mono text-copy-14 text-muted-foreground"
        >
          span 6
        </GridItem>
        <GridItem
          span={6}
          className="flex h-12 items-center justify-center rounded-md border border-gray-alpha-400 bg-gray-alpha-100 font-mono text-copy-14 text-muted-foreground"
        >
          span 6
        </GridItem>
        <GridItem
          span={4}
          className="flex h-12 items-center justify-center rounded-md border border-gray-alpha-400 bg-gray-alpha-100 font-mono text-copy-14 text-muted-foreground"
        >
          span 4
        </GridItem>
        <GridItem
          span={4}
          className="flex h-12 items-center justify-center rounded-md border border-gray-alpha-400 bg-gray-alpha-100 font-mono text-copy-14 text-muted-foreground"
        >
          span 4
        </GridItem>
        <GridItem
          span={4}
          className="flex h-12 items-center justify-center rounded-md border border-gray-alpha-400 bg-gray-alpha-100 font-mono text-copy-14 text-muted-foreground"
        >
          span 4
        </GridItem>
      </Grid>
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
  return (
    <div className="w-full max-w-xs">
      <Phone>
        <PhoneScreen>
          <div className="flex h-full min-h-[540px] items-center justify-center rounded-md bg-gray-alpha-100 text-copy-14 text-muted-foreground">
            Mobile screenshot
          </div>
        </PhoneScreen>
      </Phone>
    </div>
  );
}

function ProjectBannerDemo() {
  return (
    <div className="w-full">
      <ProjectBanner>
        <ProjectBannerContent>
          <span className="text-copy-14 text-foreground">
            Attack Challenge Mode is enabled for this project
          </span>
          <a
            href="#"
            className="text-copy-14 font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
          >
            Disable
          </a>
        </ProjectBannerContent>
        <ProjectBannerClose />
      </ProjectBanner>
    </div>
  );
}

function SliderDemo() {
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
        <div
          key={demo.id}
          data-demo-card={demo.id}
          className="rounded-[8px] border border-gray-alpha-400 bg-background-100"
        >
          <div data-demo-container={demo.id} className="w-full p-6">
            {demo.content}
          </div>
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

const codeBlockReferenced = `function MyComponent(props) {
  return (
    <div>
      <h1>Count: {props.count}</h1>
    </div>
  );
}`;

/** 官方 prism token 结构：每行的 token-line 子节点数（tokenCounts 缺省为 1）。 */
const codeBlockExampleTokens = [2, 3, 3, 3, 10, 5, 5, 15, 9, 5, 4, 2];
const codeBlockBasicTokens = [9, 5, 5, 15, 9, 5, 4, 2];
const codeBlockDiffTokens = [8, 6, 7, 4, 7, 2];
const codeBlockTabTokens = [9, 5, 5, 15, 9, 5, 4, 2];
const codeBlockReferencedTokens = [9, 5, 5, 14, 5, 4, 2];

const codeExample = `export function Component(): JSX.Element {
  return <Snippet text="npm init next-app" width="300px" />;
}`;

function CodeDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <p className="text-copy-14 text-muted-foreground">
        Install with <InlineCode>npm i geist</InlineCode> and import the component.
      </p>
      <p className="text-copy-14 text-muted-foreground">
        Use <InlineCode>type="error"</InlineCode> for destructive confirmations.
      </p>
      <Code syntax="javascript">{codeExample}</Code>
    </div>
  );
}

function CodeBlockDemo() {
  const languageOptions = ["JavaScript", "TypeScript", "Next.js", "Lua"];
  const switcher = { options: languageOptions, value: "JavaScript", onChange: () => {} };

  return (
    <div className="w-full max-w-[862px] space-y-6">
      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <CodeBlockComponent
              aria-label="Hello world"
              filename="Table.jsx"
              language="jsx"
              tokenCounts={codeBlockExampleTokens}
            >
              {codeBlockExample}
            </CodeBlockComponent>
          </div>
        </div>
      </div>
      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="no-filename"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="no-filename">
            <CodeBlockComponent
              aria-label="Hello world"
              language="jsx"
              tokenCounts={codeBlockBasicTokens}
            >
              {codeBlockBasic}
            </CodeBlockComponent>
          </div>
        </div>
      </div>
      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="highlighted-lines"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="highlighted-lines">
            <CodeBlockComponent
              aria-label="Hello world"
              filename="highlighted.jsx"
              language="jsx"
              highlightedLinesNumbers={[1, 4]}
              tokenCounts={codeBlockBasicTokens}
            >
              {codeBlockBasic}
            </CodeBlockComponent>
          </div>
        </div>
      </div>
      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
              tokenCounts={codeBlockDiffTokens}
            >
              {codeBlockDiff}
            </CodeBlockComponent>
          </div>
        </div>
      </div>
      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="referenced-lines"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="referenced-lines">
            <CodeBlockComponent
              aria-label="Hello world"
              language="jsx"
              referencedLinesNumbers={[4]}
              tokenCounts={codeBlockReferencedTokens}
            >
              {codeBlockReferenced}
            </CodeBlockComponent>
          </div>
        </div>
      </div>
      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="language-switcher"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="language-switcher">
            <CodeBlockComponent
              aria-label="Hello world"
              filename="language-switcher.jsx"
              language="jsx"
              switcher={switcher}
              tokenCounts={codeBlockTabTokens}
            >
              {codeBlockTab}
            </CodeBlockComponent>
          </div>
        </div>
      </div>
      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="language-switcher-with-tabs"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="language-switcher-with-tabs">
            <CodeBlockComponent
              aria-label="Hello world"
              filename="language-switcher.jsx"
              language="jsx"
              tabs={switcher}
              tokenCounts={codeBlockTabTokens}
            >
              {codeBlockTab}
            </CodeBlockComponent>
          </div>
        </div>
      </div>
      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="hidden-line-numbers"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="hidden-line-numbers">
            <CodeBlockComponent
              aria-label="Hello world"
              filename="hidden-line-numbers.jsx"
              language="jsx"
              hideLineNumbers
              tokenCounts={codeBlockTabTokens}
            >
              {codeBlockTab}
            </CodeBlockComponent>
          </div>
        </div>
      </div>
      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
                tokenCounts={codeBlockBasicTokens}
              >
                {codeBlockBasic}
              </CodeBlockComponent>
              <CodeBlockComponent
                filename="Table.jsx"
                language="jsx"
                v0="build"
                tokenCounts={codeBlockBasicTokens}
              >
                {codeBlockBasic}
              </CodeBlockComponent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DestructiveActionModalDemo() {
  const { language } = useLanguage();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button typeName="button" type="error" onClick={() => setOpen(true)}>
        {demoText(language, "Delete Project")}
      </Button>
      <DestructiveActionModal
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title={demoText(language, "Delete Project")}
        description={demoText(
          language,
          "next-year-boilerplate and all its deployments, domains, and environment variables will be permanently deleted.",
        )}
        confirmLabel={demoText(language, "Delete Project")}
        verificationPhrase="next-year-boilerplate"
        verificationLabel={demoText(language, "project name")}
        irreversibleDescription="Deleting next-year-boilerplate cannot be undone."
      />
    </>
  );
}

function FeedbackDemo() {
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <div className="w-full max-w-md">
      {submitted ? (
        <p className="rounded-[8px] border border-gray-alpha-400 bg-background p-4 text-center text-copy-14 text-muted-foreground">
          Thanks for your feedback!
        </p>
      ) : (
        <Feedback onSubmit={() => setSubmitted(true)} />
      )}
    </div>
  );
}

function LoadMoreButtonDemo() {
  const [loading, setLoading] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleClick = () => {
    setLoading(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setLoading(false);
      setCount((c) => c + 1);
    }, 1200);
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <LoadMoreButton onClick={handleClick} loading={loading}>
        {demoText(language, "Load More")}
      </LoadMoreButton>
      <p className="text-center text-copy-13 text-muted-foreground">
        {demoTextWithValues(language, "{count} items loaded", { count })}
      </p>
    </div>
  );
}

function TextWithCopyButtonDemo() {
  return (
    <div className="flex flex-col gap-3">
      <TextWithCopyButton textToCopy="npm i geist" textLabel="npm i geist" />
      <TextWithCopyButton textToCopy="vercel deploy --prod" textLabel="vercel deploy --prod" />
    </div>
  );
}

function ContextCardDemo() {
  const { language } = useLanguage();
  const triggers = [
    { label: demoText(language, "Top"), id: "top" },
    { label: demoText(language, "Bottom"), id: "bottom" },
    { label: demoText(language, "Left"), id: "left" },
    { label: demoText(language, "Right"), id: "right" },
  ];
  return (
    <div className="w-full max-w-[862px]">
      <div
        className="group relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <div className="flex flex-row items-stretch justify-around flex-initial">
              {triggers.map((trigger) => (
                <div
                  key={trigger.id}
                  className="flex flex-col items-center justify-center flex-initial"
                >
                  <div className="inline-flex cursor-pointer flex-[0_1_auto] overflow-hidden">
                    <span className="block text-base leading-6 text-gray-1000">
                      {trigger.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-background-200 relative flex items-center rounded-b-lg border-t border-gray-400">
          <div className="border-b-lg w-full" data-state="closed">
            <button
              type="button"
              aria-expanded={false}
              data-state="closed"
              className="bg-background-200 focus-visible:shadow-focus-ring flex h-[48px] w-full cursor-pointer items-center gap-3 rounded-b-lg px-4 text-left font-sans text-sm text-gray-900 focus:outline-none"
            >
              <div className="-rotate-90">
                <ChevronRight className="size-4" aria-hidden />
              </div>
            </button>
            <div data-state="closed" hidden />
          </div>
        </div>
      </div>
    </div>
  );
}

function ContextMenuDemo() {
  const { language } = useLanguage();
  const rightClickHere = demoText(language, "Right click here");
  const itemOne = demoText(language, "Item one");
  const itemTwo = demoText(language, "Item Two");
  const itemThree = demoText(language, "Item Three");
  const itemFour = demoText(language, "Item Four");

  const footerBar = (
    <div className="bg-background-200 relative flex items-center rounded-b-lg border-t border-gray-400">
      <div className="border-b-lg w-full" data-state="closed">
        <button
          type="button"
          aria-expanded={false}
          data-state="closed"
          className="bg-background-200 focus-visible:shadow-focus-ring flex h-[48px] w-full cursor-pointer items-center gap-3 rounded-b-lg px-4 text-left font-sans text-sm text-gray-900 focus:outline-none"
        >
          <div className="-rotate-90">
            <ChevronRight className="size-4" aria-hidden />
          </div>
          {demoText(language, "Show code")}
        </button>
        <div data-state="closed" hidden />
      </div>
    </div>
  );

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
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>

      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>
    </div>
  );
}

function DotsMenuDemo() {
  const { language } = useLanguage();
  const items = (
    <>
      <DotsMenuItem>{demoText(language, "View Build Logs")}</DotsMenuItem>
      <DotsMenuItem>{demoText(language, "View Projects")}</DotsMenuItem>
      <DotsMenuItem>{demoText(language, "View Analytics")}</DotsMenuItem>
    </>
  );
  const footerBar = (
    <div className="bg-background-200 relative flex items-center rounded-b-lg border-t border-gray-400">
      <div className="border-b-lg w-full" data-state="closed">
        <button
          type="button"
          aria-expanded={false}
          data-state="closed"
          className="bg-background-200 focus-visible:shadow-focus-ring flex h-[48px] w-full cursor-pointer items-center gap-3 rounded-b-lg px-4 text-left font-sans text-sm text-gray-900 focus:outline-none"
        >
          <div className="-rotate-90">
            <ChevronRight className="size-4" aria-hidden />
          </div>
          {demoText(language, "Show code")}
        </button>
        <div data-state="closed" hidden />
      </div>
    </div>
  );
  return (
    <div className="w-full max-w-[862px] space-y-6">
      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <DotsMenu>{items}</DotsMenu>
          </div>
        </div>
        {footerBar}
      </div>
      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>
      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="disabled"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="disabled">
            <DotsMenu disabled>{items}</DotsMenu>
          </div>
        </div>
        {footerBar}
      </div>
      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
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
  return (
    <div className="w-full max-w-xs">
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
  return (
    <div className="w-full max-w-[862px] space-y-6">
      <div
        className="rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
      </div>
      <div
        className="rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
      </div>
      <div
        className="rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
      </div>
    </div>
  );
}

function BannerDemo() {
  return (
    <Banner button={{ href: "#/components", content: "Read more" }} className="w-full p-4">
      <b>Big News</b> – New components finally available
    </Banner>
  );
}

function BreadcrumbsDemo() {
  const { language } = useLanguage();
  return (
    <Breadcrumb type="menu">
      <BreadcrumbItem href="#/">{demoText(language, "Home")}</BreadcrumbItem>
      <BreadcrumbItem href="#/components">Components</BreadcrumbItem>
      <BreadcrumbItem active>Breadcrumbs</BreadcrumbItem>
    </Breadcrumb>
  );
}

function ClearableInputDemo() {
  const { language } = useLanguage();
  const [defaultValue, setDefaultValue] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [callbackValue, setCallbackValue] = React.useState("");
  const [clearCount, setClearCount] = React.useState(0);

  return (
    <div className="w-full max-w-[862px] space-y-6">
      <div
        className="mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
      </div>
      <div
        className="rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
      </div>
      <div
        className="rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
      </div>
      <div
        className="rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
      </div>
      <div
        className="rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
      </div>
    </div>
  );
}

function CollapseDemo() {
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
  const renderItem = (title: string, body: string, defaultOpen = false) => (
    <Collapse className="border-b border-[#eaeaea]" defaultOpen={defaultOpen}>
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
        className="mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="default"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <div className="border-t border-[#eaeaea]">
              {renderItem(questionA, lorem)}
              {renderItem(questionB, duis)}
            </div>
          </div>
        </div>
      </div>
      <div
        className="mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="expanded"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="expanded">
            <div className="border-t border-[#eaeaea]">
              {renderItem(questionA, lorem)}
              {renderItem(questionB, duis, true)}
            </div>
          </div>
        </div>
      </div>
      <div
        className="mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="multiple"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="multiple">
            <div className="border-t border-[#eaeaea]">
              {renderItem(questionA, lorem)}
              {renderItem(questionB, duis)}
            </div>
          </div>
        </div>
      </div>
      <div
        className="mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="small"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="small">
            <Collapse size="small" className="border-t border-b border-[#eaeaea]">
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
      </div>
    </>
  );
}

function ComboboxDemo() {
  const { language } = useLanguage();
  const [controlledValue, setControlledValue] = React.useState("b");
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

  const footerBar = (
    <div className="bg-background-200 relative flex items-center rounded-b-lg border-t border-gray-400">
      <div className="border-b-lg w-full" data-state="closed">
        <button
          type="button"
          aria-expanded={false}
          data-state="closed"
          className="bg-background-200 focus-visible:shadow-focus-ring flex h-[48px] w-full cursor-pointer items-center gap-3 rounded-b-lg px-4 text-left font-sans text-sm text-gray-900 focus:outline-none"
        >
          <div className="-rotate-90">
            <ChevronRight className="size-4" aria-hidden />
          </div>
          {demoText(language, "Show code")}
        </button>
        <div data-state="closed" hidden />
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[862px]">
      <div
        className="relative mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>

      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>

      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>

      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
        {footerBar}
      </div>

      <div
        className="relative rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="with-label"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="with-label">
            <div className="space-y-2">
              <label className="text-label-14 text-gray-900">{countryLabel}</label>
              <Combobox aria-label={countryLabel} placeholder={countriesPlaceholder}>
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
        </div>
        {footerBar}
      </div>
    </div>
  );
}

function DescriptionDemo() {
  const { language } = useLanguage();
  const title = demoText(language, "Section Title");
  const content = demoText(language, "Data about this section.");
  const tooltip = demoText(language, "Additional context about what this section refers to.");
  return (
    <>
      <div className="mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100">
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="default">
            <Description data-demo-id="default" title={title} content={content} tooltip={tooltip} />
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100">
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
      </div>
      <div className="mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100">
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
  "--geist-background": "var(--background-100)",
  "--accents-1": "#fafafa",
  "--accents-2": "#eaeaea",
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
    <div className="w-full max-w-[862px] space-y-6">
      <div
        className="mt-6 rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
      </div>
      <div
        className="rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
      </div>
      <div
        className="rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
      </div>
      <div
        className="rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="entity-with-list-and-checkbox"
        style={ENTITY_DEMO_VARS}
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div
            className="w-full min-w-full p-6"
            data-demo-container="entity-with-list-and-checkbox"
          >
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
                            checked
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
      </div>
      <div
        className="rounded-[8px] border border-gray-alpha-400 bg-background-100"
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
      </div>
      <div
        className="rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="entity-with-column-class-names"
        style={ENTITY_DEMO_VARS}
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div
            className="w-full min-w-full p-6"
            data-demo-container="entity-with-column-class-names"
          >
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
      </div>
    </div>
  );
}

function ErrorDemo() {
  return <Error>Deployment failed. Review the build logs and try again.</Error>;
}

function ErrorCardDemo() {
  return (
    <ErrorCard className="w-full max-w-md" icon={<Trash2 className="size-6" />}>
      <ErrorCardTitle>No Credits Left</ErrorCardTitle>
      <ErrorCardDescription>Add credits to continue deploying projects.</ErrorCardDescription>
      <ErrorCardAction>
        <Button>Add Credits</Button>
      </ErrorCardAction>
    </ErrorCard>
  );
}

function FieldSetDemo() {
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
  const { language } = useLanguage();

  const footerBar = (
    <div className="bg-background-200 relative flex items-center rounded-b-lg border-t border-gray-400">
      <div className="border-b-lg w-full" data-state="closed">
        <button
          type="button"
          aria-expanded={false}
          data-state="closed"
          className="bg-background-200 focus-visible:shadow-focus-ring flex h-[48px] w-full cursor-pointer items-center gap-3 rounded-b-lg px-4 text-left font-sans text-sm text-gray-900 focus:outline-none"
        >
          <div className="-rotate-90">
            <ChevronRight className="size-4" aria-hidden />
          </div>
          {demoText(language, "Show code")}
        </button>
        <div data-state="closed" hidden />
      </div>
    </div>
  );

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
        {footerBar}
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
        {footerBar}
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
        {footerBar}
      </div>
    </>
  );
}

function LoadingDotsDemo() {
  const { language } = useLanguage();
  return (
    <div className="flex items-center gap-3 text-copy-14 text-muted-foreground">
      {demoText(language, "Loading deployment")} <LoadingDots />
    </div>
  );
}

function MiddleTruncateDemo() {
  return (
    <div className="w-64 font-mono text-copy-13 text-foreground">
      <MiddleTruncate value="https://example.com/teams/hustradio/projects/geist-style-framework/deployments/latest" />
    </div>
  );
}

function MultiSelectDemo() {
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
      data-demo-card={id}
      className="rounded-[8px] border border-gray-alpha-400 bg-background-100"
    >
      <div data-demo-container={id} className="w-full p-6">
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      {card(
        "select-actions",
        <div className="flex flex-col items-start gap-4">
          <MultiSelectRoot>
            <MultiSelectTrigger aria-label="Select design system items">
              {selectedActions.size} {selectedActions.size === 1 ? "item" : "items"} selected
            </MultiSelectTrigger>
            <MultiSelectContent>
              {actionItems.map((name) => (
                <MultiSelectRow
                  key={name}
                  name={name}
                  checked={selectedActions.has(name)}
                  selectedCount={selectedActions.size}
                  totalCount={actionItems.length}
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
              {selectedCategories.size} {selectedCategories.size === 1 ? "category" : "categories"}{" "}
              selected
            </MultiSelectTrigger>
            <MultiSelectContent>
              {categories.map((name) => (
                <MultiSelectRow
                  key={name}
                  name={name}
                  checked={selectedCategories.has(name)}
                  selectedCount={selectedCategories.size}
                  totalCount={categories.length}
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
                  selectedCount={selectedFeatures.size}
                  totalCount={controlledItems.length}
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
  const { language } = useLanguage();
  const [active, setActive] = React.useState("all");
  return (
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
  );
}

function RadioDemo() {
  const { language } = useLanguage();

  const footerBar = (
    <div className="bg-background-200 relative flex items-center rounded-b-lg border-t border-gray-400">
      <div className="border-b-lg w-full" data-state="closed">
        <button
          type="button"
          aria-expanded={false}
          data-state="closed"
          className="bg-background-200 focus-visible:shadow-focus-ring flex h-[48px] w-full cursor-pointer items-center gap-3 rounded-b-lg px-4 text-left font-sans text-sm text-gray-900 focus:outline-none"
        >
          <div className="-rotate-90">
            <ChevronRight className="size-4" aria-hidden />
          </div>
          {demoText(language, "Show code")}
        </button>
        <div data-state="closed" hidden />
      </div>
    </div>
  );

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
              name="radio-name"
            >
              <div className="flex flex-col items-stretch justify-start gap-6">
                <RadioGroupItem value="option-1">{demoText(language, "Option 1")}</RadioGroupItem>
                <RadioGroupItem value="option-2">{demoText(language, "Option 2")}</RadioGroupItem>
              </div>
            </RadioGroup>
          </div>
        </div>
        {footerBar}
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
              name="radio-name"
            >
              <div className="flex flex-col items-stretch justify-start gap-6">
                <RadioGroupItem value="option-1">{demoText(language, "Option 1")}</RadioGroupItem>
                <RadioGroupItem value="option-2">{demoText(language, "Option 2")}</RadioGroupItem>
              </div>
            </RadioGroup>
          </div>
        </div>
        {footerBar}
      </div>

      <div
        className="relative mt-6 w-full rounded-[8px] border border-gray-alpha-400 bg-background-100"
        data-demo-card="radio-required"
      >
        <div className="flex w-full overflow-x-auto md:overflow-visible">
          <div className="w-full p-6" data-demo-container="radio-required">
            <RadioGroup
              label={demoText(language, "Required Radio Example")}
              required
              name="radio-name"
            >
              <form className="flex flex-col items-start justify-start gap-6">
                <div className="flex flex-col items-stretch justify-start gap-4">
                  <RadioGroupItem value="option-1">{demoText(language, "Option 1")}</RadioGroupItem>
                  <RadioGroupItem value="option-2">{demoText(language, "Option 2")}</RadioGroupItem>
                </div>
                <Button typeName="submit" size="small">
                  {demoText(language, "Submit")}
                </Button>
              </form>
            </RadioGroup>
          </div>
        </div>
        {footerBar}
      </div>
    </>
  );
}

function RelativeTimeCardDemo() {
  return <RelativeTimeCard date={Date.now() - 5 * 60 * 1000} />;
}

function SearchInputDemo() {
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
        <div
          key={id}
          data-demo-card={id}
          className="rounded-[8px] border border-gray-alpha-400 bg-background-100"
        >
          <div data-demo-container={id} className="w-full p-6">
            {control}
          </div>
        </div>
      ))}
    </div>
  );
}

function ShowMoreDemo() {
  const [expanded, setExpanded] = React.useState(false);
  const copy =
    "Geist Style Framework provides reusable tokens, primitives, and component patterns for building consistent React interfaces in both light and dark themes.";

  return (
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

function Section({
  title,
  children,
  tableCode,
}: {
  title: string;
  children: React.ReactNode;
  tableCode?: string;
}) {
  const { language } = useLanguage();
  return (
    <section className="mt-10">
      <h2 className="text-heading-24 text-foreground">{demoText(language, title)}</h2>
      {tableCode ? (
        <TableDemoCard code={tableCode}>{children}</TableDemoCard>
      ) : (
        <div className="mt-6 flex min-h-28 flex-wrap items-center gap-x-6 gap-y-4 rounded-[8px] border border-gray-alpha-400 bg-background p-6">
          {children}
        </div>
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
        <label className="flex justify-between gap-4">
          <span className="text-copy-13 text-foreground">{demoText(language, "Option 1")}</span>
          {component}
        </label>
        <label className="flex justify-between gap-4">
          <span className="text-copy-13 text-foreground">{demoText(language, "Option 2")}</span>
          {component2}
        </label>
      </div>
    </RadioGroup>
  );
}

function RadioStandaloneDemo() {
  const { language } = useLanguage();
  const [value, setValue] = React.useState("one");

  return (
    <ul className="flex list-none flex-row items-stretch justify-start gap-6">
      <li className="flex items-center gap-2">
        <span className="text-copy-13 text-foreground">{demoText(language, "Option 1")}</span>
        <Radio
          aria-label="Option 1"
          checked={value === "one"}
          onChange={() => setValue("one")}
          value="one"
        />
      </li>
      <li className="flex items-center gap-2">
        <span className="text-copy-13 text-foreground">{demoText(language, "Option 2")}</span>
        <Radio
          aria-label="Option 2"
          checked={value === "two"}
          onChange={() => setValue("two")}
          value="two"
        />
      </li>
    </ul>
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
          onCheckedChange={() => setChecked(!checked)}
        />
        <Toggle
          aria-label={demoText(language, "Enable Firewall")}
          checked={checked}
          color="red"
          onCheckedChange={() => setChecked(!checked)}
        />
      </div>
      <div className="flex flex-row flex-wrap items-center gap-6">
        <Toggle
          aria-label={demoText(language, "Enable Firewall")}
          checked={checked}
          color="amber"
          onCheckedChange={() => setChecked(!checked)}
          size="large"
        />
        <Toggle
          aria-label={demoText(language, "Enable Firewall")}
          checked={checked}
          color="red"
          onCheckedChange={() => setChecked(!checked)}
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
        <Toggle checked={checked} onCheckedChange={() => setChecked(!checked)}>
          {label}
        </Toggle>
        <Toggle checked={checked} direction="rtl" onCheckedChange={() => setChecked(!checked)}>
          {label}
        </Toggle>
      </div>
      <div className="flex flex-row flex-wrap items-center gap-6">
        <Toggle checked={checked} onCheckedChange={() => setChecked(!checked)} size="large">
          {label}
        </Toggle>
        <Toggle
          checked={checked}
          direction="rtl"
          onCheckedChange={() => setChecked(!checked)}
          size="large"
        >
          {label}
        </Toggle>
      </div>
    </div>
  );
}

/** Toast 额外演示分段 — 每个分段一个触发按钮（Toasts 视口由 ToastDemo 挂载一次） */
function ToastExtraSections() {
  const toasts = useToasts();

  return (
    <>
      <Section title="Multi-line">
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
      <Section title="With jsx">
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
      <Section title="With a link">
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
      <Section title="Preserve">
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
      <Section title="Action">
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
      <Section title="Undo">
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
      <Section title="Success">
        <Button
          typeName="button"
          onClick={() => toasts.success("The Evil Rabbit jumped over the fence.")}
        >
          {demoText(language, "Show Toast")}
        </Button>
      </Section>
      <Section title="Warning">
        <Button
          typeName="button"
          onClick={() => toasts.warning("The Evil Rabbit jumped over the fence.")}
        >
          {demoText(language, "Show Toast")}
        </Button>
      </Section>
      <Section title="Error">
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

/** 名称 → 额外演示分段（Sizes / Variants / States），未命中的组件返回 null */
function renderExtraSections(name: string, language: DocsLanguage): React.ReactNode {
  switch (name) {
    case "button":
      return (
        <>
          <Section title="Sizes">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Button typeName="button" size="small">
                  Small
                </Button>
                <Button typeName="button">Medium</Button>
                <Button typeName="button" size="large">
                  Large
                </Button>
              </div>
            </div>
          </Section>
          <Section title="Variants">
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
          <Section title="Prefix and Suffix">
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
        </>
      );
    case "input":
      return (
        <>
          <Section title="States">
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
          <Section title="With Options">
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
          <Section title="Disabled">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Toggle
                  aria-label={demoText(language, "Enable Firewall")}
                  checked={false}
                  disabled
                />
                <span className="text-copy-14 text-muted-foreground">Unchecked (disabled)</span>
              </div>
              <div className="flex items-center gap-3">
                <Toggle aria-label={demoText(language, "Enable Firewall")} checked disabled />
                <span className="text-copy-14 text-muted-foreground">Checked (disabled)</span>
              </div>
            </div>
          </Section>
          <Section title="Sizes">
            <div className="flex flex-row flex-wrap items-center gap-6">
              <Toggle aria-label={demoText(language, "Enable Firewall")} checked={false} />
              <Toggle
                aria-label={demoText(language, "Enable Firewall")}
                checked={false}
                size="medium"
              />
              <Toggle
                aria-label={demoText(language, "Enable Firewall")}
                checked={false}
                size="large"
              />
            </div>
          </Section>
          <Section title="Custom Color">
            <ToggleColorDemo />
          </Section>
          <Section title="With Label">
            <ToggleLabelDemo />
          </Section>
        </>
      );
    case "checkbox":
      return (
        <>
          <Section title="Indeterminate">
            <div className="flex flex-col gap-3">
              <label className="flex cursor-pointer items-center gap-2.5">
                <Checkbox
                  checked="indeterminate"
                  aria-label={demoText(language, "Indeterminate")}
                />
                <span className="text-copy-14 text-foreground">
                  Indeterminate (partial selection)
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-2.5">
                <Checkbox checked aria-label={demoText(language, "Checked")} />
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
          <Section title="Label">
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
          <Section title="Default color scale">
            <div className="flex flex-row flex-wrap items-stretch justify-start gap-8">
              <Gauge size="small" value={14} />
              <Gauge size="small" value={34} />
              <Gauge size="small" value={68} />
            </div>
          </Section>
          <Section title="Custom color range">
            <div className="flex flex-row flex-wrap items-stretch justify-start gap-2">
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((value) => (
                <Gauge key={value} colors={GAUGE_PINK_SCALE} size="small" value={value} />
              ))}
            </div>
          </Section>
          <Section title="Custom secondary color">
            <div className="flex justify-start">
              <Gauge
                colors={{ primary: "var(--blue-700)", secondary: "var(--blue-300)" }}
                size="medium"
                value={50}
              />
            </div>
          </Section>
          <Section title="Arc priority">
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
          <Section title="Indeterminate">
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
          <Section title="Radio disabled">
            <RadioGroup disabled label="Disabled Radio Example" defaultValue="one">
              <div className="flex flex-col items-stretch justify-start gap-6">
                <RadioGroupItem value="one">{demoText(language, "Option 1")}</RadioGroupItem>
                <RadioGroupItem value="two">{demoText(language, "Option 2")}</RadioGroupItem>
              </div>
            </RadioGroup>
          </Section>
          <Section title="Radio required">
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
          <Section title="Radio headless">
            <RadioHeadlessDemo />
          </Section>
          <Section title="Radio standalone">
            <RadioStandaloneDemo />
          </Section>
        </>
      );
    case "switch":
      return (
        <>
          <Section title="Disabled">
            <div className="flex w-full max-w-md flex-col items-start">
              <Switch name="reference-view-mode">
                <SwitchControl defaultChecked disabled label="Source" value="source" />
                <SwitchControl disabled label="Output" value="output" />
              </Switch>
            </div>
          </Section>
          <Section title="Sizes">
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
          <Section title="Full width">
            <Switch name="reference-full-width" style={{ width: "100%" }}>
              <SwitchControl defaultChecked label="Source" value="source" />
              <SwitchControl label="Output" value="output" />
            </Switch>
          </Section>
          <Section title="Tooltip">
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
          <Section title="Icon">
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
          <Section title="Error">
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
          <Section title="Sizes">
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
          <Section title="Read Only">
            <div className="flex w-full max-w-md flex-col">
              <Textarea
                aria-label="Read only"
                defaultValue={LOREM_IPSUM}
                readOnly
                style={{ minHeight: 100 }}
              />
            </div>
          </Section>
          <Section title="Rows">
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
          <Section title="No delay">
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
          <Section title="Box align">
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
          <Section title="Custom content">
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
          <Section title="Custom type">
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
          <Section title="Components">
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
          <Section title="Other">
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
          <Section title="No Loop">
            <div className="w-full min-w-0 max-w-[600px]">
              <Video height={582} lazy={false} loop={false} src="/demo.mp4" width={600} />
            </div>
          </Section>
          <Section title="No Controls">
            <div className="w-full min-w-0 max-w-[600px]">
              <Video controls={false} height={582} lazy={false} src="/demo.mp4" width={600} />
            </div>
          </Section>
        </>
      );
    case "label":
      return (
        <>
          <Section title="With Input">
            <div className="flex w-full max-w-sm flex-col">
              <Label id="label-input" value="Email Address" withInput />
              <Input
                aria-labelledby="label-input"
                id="label-input"
                placeholder={demoText(language, "Enter email address...")}
              />
            </div>
          </Section>
          <Section title="Bypass Casing">
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
          <Section
            title="Striped table"
            tableCode="<Table><TableBody striped>…</TableBody></Table>"
          >
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
          <Section
            title="Bordered table"
            tableCode="<Table><TableBody bordered>…</TableBody></Table>"
          >
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
            tableCode="<Table><TableBody interactive>…</TableBody></Table>"
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
          <Section title="Full featured table" tableCode="<Table>…full featured rows…</Table>">
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
                  <TableCell className="tabular-nums">$5,000.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Oil Filters</TableCell>
                  <TableCell>200 filters</TableCell>
                  <TableCell>$10 per filter</TableCell>
                  <TableCell className="tabular-nums">$2,000.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Car Batteries</TableCell>
                  <TableCell>50 batteries</TableCell>
                  <TableCell>$100 per battery</TableCell>
                  <TableCell className="tabular-nums">$5,000.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Headlight Bulbs</TableCell>
                  <TableCell>300 bulbs</TableCell>
                  <TableCell>$15 per bulb</TableCell>
                  <TableCell className="tabular-nums">$4,500.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Windshield Wipers</TableCell>
                  <TableCell>250 pairs</TableCell>
                  <TableCell>$20 per pair</TableCell>
                  <TableCell className="tabular-nums">$5,000.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Spark Plugs</TableCell>
                  <TableCell>500 sets</TableCell>
                  <TableCell>$5 per set</TableCell>
                  <TableCell className="tabular-nums">$2,500.00</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="text-gray-1000 font-medium" colSpan={3}>
                    Subtotal
                  </TableCell>
                  <TableCell className="text-gray-1000 font-medium tabular-nums">
                    $24,000.00
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Section>
        </>
      );
    case "avatar":
      return (
        <>
          <Section title="Group">
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
          <Section title="Stacking order">
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
          <Section title="Overlap">
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
          <Section title="Fixed overlap">
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
          <Section title="Size">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar size={24} username="evilrabbit" />
              <Avatar size={32} username="evilrabbit" />
              <Avatar size={48} username="evilrabbit" />
            </div>
          </Section>
          <Section title="Git">
            <div className="flex flex-wrap items-center gap-4">
              <GitHubAvatar size={32} username="rauchg" />
              <GitLabAvatar size={32} username="severinlandolt" />
              <BitbucketAvatar size={32} username="evilrabbit" />
            </div>
          </Section>
          <Section title="With custom icon">
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
          <Section title="Letter">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar letter="SL" placeholder size={32} />
              <Avatar letter="EK" placeholder size={32} />
              <Avatar letter="CK" placeholder size={32} />
            </div>
          </Section>
          <Section title="Placeholder">
            <Avatar placeholder size={90} />
          </Section>
        </>
      );
    case "badge":
      return (
        <>
          <Section title="Variants">
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
          <Section title="Sizes">
            <div className="flex flex-wrap items-center gap-2">
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
              <Badge size="lg">Large</Badge>
            </div>
          </Section>
          <Section title="With icons">
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
          <Section title="Pill">
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
          <Section title="Default">
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
          <Section title="Active">
            <Breadcrumb>
              <BreadcrumbItem>{demoText(language, "Home")}</BreadcrumbItem>
              <BreadcrumbItem active>{demoText(language, "Dashboard")}</BreadcrumbItem>
              <BreadcrumbItem>{demoText(language, "Overview")}</BreadcrumbItem>
            </Breadcrumb>
          </Section>
          <Section title="Disabled">
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
          <Section title="Default">
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
          <Section title="Expanded">
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
          <Section title="Multiple">
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
          <Section title="Small">
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
          <Section title="Single line">
            <div className="w-full max-w-md">
              <JsonView data={{ foo: "bar" }} defaultExpandDepth={1} />
            </div>
          </Section>
          <Section title="Wrapped">
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
          <Section title="Collapsed">
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
          <Section title="Highlighted">
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
          <Section title="Vertical">
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
          <Section title="Horizontal">
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
          <Section title="Free">
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
          <Section title="Vertical with buttons">
            <div className="flex max-w-full flex-col gap-4">
              <Scroller childrenContainerClassName="gap-4" height={220} overflow="y" withButtons>
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="h-60 w-96 shrink-0 bg-gray-1000" />
                ))}
              </Scroller>
            </div>
          </Section>
          <Section title="Horizontal with buttons">
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
          <Section title="Menu Alignment">
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
          <Section title="Icon">
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
        </>
      );
    case "toast":
      return <ToastExtraSections />;
    default:
      return null;
  }
}

/* ---------- 总览模式 ---------- */

function ComponentsOverview() {
  const { language } = useLanguage();
  return (
    <div>
      <h1 className="text-heading-40 text-foreground">{demoText(language, "Components")}</h1>
      <p className="mt-3 max-w-xl text-copy-20 text-muted-foreground">
        {demoText(language, "Building blocks for React applications.")}
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {COMPONENTS.map((component) => (
          <a
            key={component.name}
            href={`#/components/${component.name}`}
            className="group block border-b border-r border-border p-6 transition-colors hover:bg-gray-alpha-100"
          >
            <p className="font-mono text-label-12 text-muted-foreground">{component.official}</p>
            <h3 className="mt-1 text-label-16 font-medium text-foreground">
              {demoText(language, component.label)}
            </h3>
            <p className="mt-1 text-copy-13 text-muted-foreground">
              {demoText(language, component.description)}
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
        <h1 className="text-heading-40 text-foreground">
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
        <h1 className="text-heading-40 text-foreground">{demoText(language, meta.label)}</h1>
        <span className="rounded-full border border-gray-alpha-400 px-2 py-0.5 font-mono text-label-12 text-muted-foreground">
          {meta.official}
        </span>
      </div>
      <p className="mt-3 max-w-xl text-copy-20 text-muted-foreground">
        {demoText(language, meta.description)}
      </p>

      <section className="mt-10">
        <h2 className="text-heading-24 text-foreground">{demoText(language, "Live Demo")}</h2>
        {name === "table" ? (
          <TableDemoCard code={meta.code}>{renderDemo(name)}</TableDemoCard>
        ) : name === "description" ? (
          <div>{renderDemo(name)}</div>
        ) : (
          <DemoSection>{renderDemo(name)}</DemoSection>
        )}
      </section>

      {renderExtraSections(name, language)}

      <section className="mt-12">
        <h2 className="text-heading-24 text-foreground">{demoText(language, "Usage")}</h2>
        <div className="mt-6">
          <CodeBlock code={meta.code} label={`components/${name}.tsx`} />
        </div>
      </section>

      {meta.bestPractices && meta.bestPractices.length > 0 && (
        <section className="mt-12">
          <h2 className="text-heading-24 text-foreground">
            {demoText(language, "Best Practices")}
          </h2>
          <ul className="mt-6 space-y-3">
            {meta.bestPractices.map((bp, i) => (
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
