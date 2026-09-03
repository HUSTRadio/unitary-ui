import * as React from "react";
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
  Smartphone,
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
import { BottomSheet } from "@/components/ui/bottom-sheet";
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
import { ErrorBoundary } from "@/components/ui/error-boundary";
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
import { Device, DeviceScreen } from "@/components/ui/device";
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
import { getComponentGuide } from "../content/component-guides";
import { ComponentGuideSections } from "./component-guide-sections";
import { ComponentApiReference } from "./docs-api-reference";
import {
  DocsList,
  DocsPageLead,
  DocsPageTitle,
  DocsSection,
  DocsSectionTitle,
} from "./docs-typography";
import { EXAMPLE_REGISTRY, type ExampleRecord } from "../examples/registry";

import { demoText, demoTextWithValues } from "../i18n/components-demo";
import { type DocsLanguage, useLanguage } from "../i18n/language";
import { useInputModality } from "@/lib/input-modality";

/**
 * Components 文档页（docs/geist 专用）。
 * 总览模式（/components）：13 元件索引卡片网格。
 * 详情模式（/components/:name）：返回链接 + 实时 demo（直接渲染根元件）+ 代码块（带 Copy 按钮）。
 */

/* ---------- 代码块 ---------- */

/** mobileOnly 标注：灰色 Smartphone 图标（替代旧「仅移动端」胶囊 Badge）。 */
function MobileOnlyMark({ language }: { language: DocsLanguage }) {
  return (
    <Smartphone
      className="size-4 text-gray-700"
      role="img"
      aria-label={demoText(language, "Mobile only")}
    />
  );
}

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


function TableDemoCard({
  children,
  code,
  id,
}: {
  children: React.ReactNode;
  code: string;
  id?: string;
}) {
  return (
    <div
      className="mt-6 overflow-hidden rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card={id}
    >
      <div
        data-slot="docs-local-scroll"
        data-demo-container={id}
        className="w-full overflow-x-auto p-6"
      >
        {children}
      </div>
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




























/** 名称 → 实时 demo 渲染器（未命中的分支在调用前已拦截） */
function primaryExample(records: readonly ExampleRecord[]): ExampleRecord | undefined {
  return records.find((record) => record.id === "default") ?? records[0];
}

/** Live rendering and Show Code source are paired in the same registry record. */
function renderDemo(name: string): React.ReactNode {
  const record = primaryExample(EXAMPLE_REGISTRY[name] ?? []);
  if (!record) return null;
  const Example = record.Component;
  return (
    <TableDemoCard id={record.id} code={record.source}>
      <Example />
    </TableDemoCard>
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
        <TableDemoCard id={title} code={code}>{children}</TableDemoCard>
      ) : (
        <div className="mt-6">{children}</div>
      )}
    </section>
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


/** 名称 → 额外演示分段（Sizes / Variants / States），未命中的组件返回 null */
function renderExtraSections(name: string, _language: DocsLanguage): React.ReactNode {
  const records = EXAMPLE_REGISTRY[name] ?? [];
  const primary = primaryExample(records);
  const remaining = primary ? records.filter((record) => record !== primary) : records;
  if (remaining.length === 0) return null;
  return (
    <>
      {remaining.map((record) => {
        const Example = record.Component;
        return (
          <Section key={`${record.slug}/${record.id}`} title={record.id} code={record.source}>
            <Example />
          </Section>
        );
      })}
    </>
  );
}

/* ---------- 总览模式 ---------- */

function ComponentsOverview() {
  const { language } = useLanguage();
  return (
    <div>
      <DocsPageTitle>{demoText(language, "Components")}</DocsPageTitle>
      <DocsPageLead className="max-w-xl">
        {demoText(language, "Building blocks for React applications.")}
      </DocsPageLead>

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
              {component.mobileOnly && <MobileOnlyMark language={language} />}
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
  const guide = getComponentGuide(name, language);

  if (!meta) {
    return (
      <div>
        <BackLink />
        <DocsPageTitle>{demoText(language, "Component not found")}</DocsPageTitle>
        <DocsPageLead className="max-w-xl">
          {demoTextWithValues(language, "No component named {name} was found.", { name })}
        </DocsPageLead>
      </div>
    );
  }

  return (
    <div>
      <BackLink />
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <DocsPageTitle>
          {language === "zh-CN" ? (meta.labelZh ?? meta.label) : meta.label}
        </DocsPageTitle>
        <span className="rounded-full border border-gray-alpha-400 px-2 py-0.5 font-mono text-label-12 text-muted-foreground">
          {meta.official}
        </span>
        {meta.mobileOnly && <MobileOnlyMark language={language} />}
      </div>
      <DocsPageLead className="max-w-xl">
        {language === "zh-CN" ? (meta.descriptionZh ?? meta.description) : meta.description}
      </DocsPageLead>

      {guide && <ComponentGuideSections guide={guide} />}

      <DocsSection>
        <DocsSectionTitle>{demoText(language, "Live Demo")}</DocsSectionTitle>
        <DemoSection componentName={name}>{renderDemo(name)}</DemoSection>
      </DocsSection>

      {renderExtraSections(name, language)}

      <ComponentApiReference componentName={name} />

      {meta.bestPractices && meta.bestPractices.length > 0 && (
        <DocsSection>
          <DocsSectionTitle>{demoText(language, "Best Practices")}</DocsSectionTitle>
          <DocsList>
            {(language === "zh-CN"
              ? (meta.bestPracticesZh ?? meta.bestPractices)
              : meta.bestPractices
            ).map((bp, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground"
                  aria-hidden
                />
                {bp}
              </li>
            ))}
          </DocsList>
        </DocsSection>
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
 * Canonical route registry determines overview or detail mode and App.tsx passes the
 * component detail descriptor's name explicitly.
 */
export function ComponentsPage({ componentName }: { componentName?: string }) {
  if (componentName) {
    return <ComponentDetail name={componentName} />;
  }
  return <ComponentsOverview />;
}
