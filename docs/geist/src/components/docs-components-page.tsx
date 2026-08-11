import * as React from "react";
import { useLocation } from "react-router-dom";
import {
  ArrowDownCircle,
  ArrowLeft,
  CircleCheck,
  ChevronRight,
  Clock,
  Copy,
  CopyCheck,
  Edit,
  ExternalLink,
  Inbox,
  LayoutGrid,
  List,
  Rocket,
  Search,
  Shield,
  Trash2,
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
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { ClearableInput } from "@/components/ui/clearable-input";
import { ChoiceboxGroup, ChoiceboxGroupItem } from "@/components/ui/choicebox";
import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";
import { Combobox, ComboboxContent, ComboboxItem, ComboboxTrigger } from "@/components/ui/combobox";
import { Code, InlineCode } from "@/components/ui/code";
import { CodeBlock as CodeBlockComponent } from "@/components/ui/code-block";
import {
  CommandMenu,
  CommandMenuContent,
  CommandMenuGroup,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
  CommandMenuTrigger,
} from "@/components/ui/command-menu";
import {
  ContextCard,
  ContextCardAvatar,
  ContextCardBody,
  ContextCardDescription,
  ContextCardFooter,
  ContextCardHeader,
  ContextCardTitle,
} from "@/components/ui/context-card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
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
import { Drawer, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { FieldSet, FieldSetItem, FieldSetLabel, FieldSetLegend } from "@/components/ui/fieldset";
import { FileTree, FileTreeIcon, FileTreeItem, FileTreeLabel } from "@/components/ui/file-tree";
import { Gauge } from "@/components/ui/gauge";
import { Grid, GridItem } from "@/components/ui/grid";
import { Input } from "@/components/ui/input";
import { JsonView, makeJsonViewHighlightPattern } from "@/components/ui/json-view";
import { KeyboardInput, Kbd } from "@/components/ui/keyboard-input";
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
      <div className="flex items-center justify-between border-b border-gray-alpha-400 py-1 pr-1 pl-3">
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
        className="flex h-12 w-full items-center gap-2 border-t border-gray-alpha-400 bg-background-200 px-6 text-left text-copy-14 text-foreground transition-colors hover:bg-gray-200 focus-ring"
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
          className="overflow-x-auto border-t border-gray-alpha-400 bg-background p-6 font-mono text-copy-13 leading-relaxed text-foreground"
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
  return (
    <div className="w-full max-w-md">
      <EmptyState
        icon={<EmptyStateIcon icon={<Inbox aria-hidden />} />}
        title="No results"
        description="Clear your filters to see all logs."
      />
    </div>
  );
}

function ButtonDemo() {
  const { language } = useLanguage();
  return (
    <>
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
      <Button typeName="button" size="small">
        Small
      </Button>
      <Button typeName="button" size="large">
        Large
      </Button>
      <Button typeName="button" prefix={<Search aria-hidden />}>
        Search
      </Button>
      <Button typeName="button" type="tertiary" loading>
        Loading
      </Button>
      <Button typeName="button" disabled>
        Disabled
      </Button>
    </>
  );
}

function CheckboxDemo() {
  const { language } = useLanguage();
  const [checked, setChecked] = React.useState<boolean[]>([true, false]);
  const allChecked = checked.every(Boolean);
  const someChecked = checked.some(Boolean);
  // 半选态：Radix CheckedState 的 "indeterminate" 字符串值
  const parentState: boolean | "indeterminate" = allChecked
    ? true
    : someChecked
      ? "indeterminate"
      : false;

  return (
    <div className="flex flex-col gap-3">
      <label className="flex cursor-pointer items-center gap-2.5">
        <Checkbox
          checked={parentState}
          onCheckedChange={(value) => setChecked([value === true, value === true])}
          aria-label={demoText(language, "All permissions")}
        />
        <span className="text-copy-14 text-foreground">All permissions</span>
      </label>
      <label className="flex cursor-pointer items-center gap-2.5">
        <Checkbox
          checked={checked[0]}
          onCheckedChange={(value) => setChecked([value === true, checked[1]])}
          aria-label={demoText(language, "Read access")}
        />
        <span className="text-copy-14 text-muted-foreground">Read access</span>
      </label>
      <label className="flex cursor-pointer items-center gap-2.5">
        <Checkbox
          checked={checked[1]}
          onCheckedChange={(value) => setChecked([checked[0], value === true])}
          aria-label={demoText(language, "Write access")}
        />
        <span className="text-copy-14 text-muted-foreground">Write access</span>
      </label>
    </div>
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
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Input
        placeholder={demoText(language, "Project name")}
        aria-label={demoText(language, "Project name")}
      />
      <Input
        placeholder={demoText(language, "Disabled input")}
        disabled
        aria-label={demoText(language, "Disabled input")}
      />
    </div>
  );
}

function ModalDemo() {
  const { language } = useLanguage();
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button typeName="button">{demoText(language, "Open Modal")}</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{demoText(language, "Delete Project")}</ModalTitle>
          <ModalDescription>This action cannot be undone.</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose asChild>
            <Button typeName="button" type="secondary">
              Cancel
            </Button>
          </ModalClose>
          <Button typeName="button" type="error">
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function SwitchDemo() {
  const { language } = useLanguage();
  const [view, setView] = React.useState("preview");
  return (
    <Switch
      name="editor-view"
      value={view}
      onValueChange={setView}
      aria-label={demoText(language, "Editor view")}
    >
      <SwitchControl value="preview" label="Preview" />
      <SwitchControl value="code" label="Code" />
      <SwitchControl value="split" label="Split" />
    </Switch>
  );
}

function SelectDemo() {
  const { language } = useLanguage();
  return (
    <Select
      className="w-56"
      defaultValue="vercel"
      aria-label={demoText(language, "Select project")}
    >
      <option value="vercel">Vercel</option>
      <option value="nextjs">Next.js</option>
      <option value="turbo">Turborepo</option>
      <option value="v0">v0</option>
    </Select>
  );
}

function SeparatorDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-label-14 text-muted-foreground">Horizontal</p>
        <Separator />
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-label-14 text-muted-foreground">Vertical</p>
        <div className="flex h-10 items-center gap-3">
          <span className="text-copy-14 text-foreground">Left</span>
          <Separator orientation="vertical" />
          <span className="text-copy-14 text-muted-foreground">Middle</span>
          <Separator orientation="vertical" />
          <span className="text-copy-14 text-foreground">Right</span>
        </div>
      </div>
    </div>
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
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Textarea
        placeholder={demoText(language, "Describe your project…")}
        aria-label={demoText(language, "Project description")}
      />
      <Textarea
        placeholder={demoText(language, "Disabled textarea")}
        disabled
        aria-label={demoText(language, "Disabled textarea")}
      />
    </div>
  );
}

function ToggleDemo() {
  const { language } = useLanguage();
  const [enabled, setEnabled] = React.useState(true);
  return (
    <div className="flex items-center gap-3">
      <Toggle
        checked={enabled}
        onCheckedChange={setEnabled}
        aria-label={demoText(language, "Toggle settings")}
      />
      <span className="text-copy-14 text-muted-foreground">{enabled ? "On" : "Off"}</span>
    </div>
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

  return (
    <>
      <Button typeName="button" onClick={() => setOpen(true)}>
        {demoText(language, "Open Drawer")}
      </Button>
      <Drawer show={open} onDismiss={() => setOpen(false)}>
        <div className="p-5">
          <DrawerTitle>{demoText(language, "Filter Logs")}</DrawerTitle>
          <DrawerDescription>
            {demoText(language, "Narrow the logs by environment.")}
          </DrawerDescription>
          <div className="mt-5 flex gap-3">
            <Button typeName="button" type="secondary" onClick={() => setOpen(false)}>
              {demoText(language, "Cancel")}
            </Button>
            <Button typeName="button" onClick={() => setOpen(false)}>
              {demoText(language, "Apply")}
            </Button>
          </div>
        </div>
      </Drawer>
    </>
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
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button typeName="button">{demoText(language, "Open Sheet")}</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Deployment Details</SheetTitle>
          <SheetDescription>Inspect the latest production deployment.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild>
            <Button typeName="button" type="secondary">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
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
  return (
    <div className="w-full max-w-xs">
      <Calendar />
    </div>
  );
}

function ChoiceboxDemo() {
  const { language } = useLanguage();
  const [plan, setPlan] = React.useState("pro");
  const [features, setFeatures] = React.useState<string[]>(["analytics"]);
  return (
    <div className="w-full max-w-2xl space-y-4">
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
      <ChoiceboxGroup
        label={demoText(language, "Select frameworks")}
        listClassName="flex-row"
        onChange={setFeatures}
        type="checkbox"
        value={features}
      >
        <ChoiceboxGroupItem description="Next.js" title="Next.js" value="nextjs" />
        <ChoiceboxGroupItem description="Web Analytics" title="Analytics" value="analytics" />
      </ChoiceboxGroup>
    </div>
  );
}

function CommandMenuDemo() {
  const { language } = useLanguage();
  const [open, setOpen] = React.useState(false);
  return (
    <CommandMenu open={open} onOpenChange={setOpen}>
      <CommandMenuTrigger asChild>
        <Button typeName="button">{demoText(language, "Open Command Menu")}</Button>
      </CommandMenuTrigger>
      <CommandMenuContent>
        <CommandMenuInput placeholder={demoText(language, "What do you need?")} />
        <CommandMenuList>
          <CommandMenuGroup heading="Suggestions">
            <CommandMenuItem onClick={() => setOpen(false)}>Figma Import</CommandMenuItem>
          </CommandMenuGroup>
          <CommandMenuGroup heading="Commands">
            <CommandMenuItem onClick={() => setOpen(false)}>Import Extension</CommandMenuItem>
            <CommandMenuItem onClick={() => setOpen(false)}>Manage Extensions</CommandMenuItem>
          </CommandMenuGroup>
        </CommandMenuList>
      </CommandMenuContent>
    </CommandMenu>
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
  const [value, setValue] = React.useState<number[]>([50]);
  return (
    <div className="w-full max-w-md">
      <Slider value={value} onValueChange={setValue} aria-label={demoText(language, "Volume")} />
      <p className="mt-3 text-copy-14 text-muted-foreground">
        {demoTextWithValues(language, "Value: {value}", { value: value[0] })}
      </p>
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
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}`;

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
  return (
    <div className="w-full max-w-2xl">
      <CodeBlockComponent filename="Table.jsx" language="jsx">
        {codeBlockExample}
      </CodeBlockComponent>
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
  return (
    <ContextCard>
      <ContextCardHeader>
        <ContextCardAvatar src="https://github.com/vercel.png" alt="Acme" />
        <div>
          <ContextCardTitle>{demoText(language, "Acme Inc.")}</ContextCardTitle>
          <ContextCardDescription>
            {demoText(language, "@acme · San Francisco")}
          </ContextCardDescription>
        </div>
      </ContextCardHeader>
      <ContextCardBody>
        <p className="text-copy-13 text-muted-foreground">
          {demoText(language, "Last Active: 2h ago")}
        </p>
        <p className="text-copy-13 text-muted-foreground">{demoText(language, "Plan: Pro")}</p>
      </ContextCardBody>
      <ContextCardFooter>
        <Button typeName="button" size="small">
          {demoText(language, "View Project")}
        </Button>
      </ContextCardFooter>
    </ContextCard>
  );
}

function ContextMenuDemo() {
  const { language } = useLanguage();
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Button typeName="button" type="tertiary">
          {demoText(language, "Right click here")}
        </Button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>{demoText(language, "Open in New Tab")}</ContextMenuItem>
        <ContextMenuItem>{demoText(language, "Copy URL")}</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground">
          {demoText(language, "Delete Deployment")}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function DotsMenuDemo() {
  return (
    <DotsMenu>
      <DotsMenuItem>View Build Logs</DotsMenuItem>
      <DotsMenuItem>View Projects</DotsMenuItem>
      <DotsMenuItem>View Analytics</DotsMenuItem>
    </DotsMenu>
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
    <div className="flex flex-wrap items-center gap-4">
      <KeyboardInput>
        <Kbd meta>K</Kbd>
      </KeyboardInput>
      <KeyboardInput>
        <Kbd shift>Enter</Kbd>
      </KeyboardInput>
      <Kbd>Esc</Kbd>
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
  return <ClearableInput className="w-full max-w-sm" defaultValue="geist-style-framework" />;
}

function CollapseDemo() {
  return (
    <Collapse className="w-full max-w-md rounded-[8px] border border-gray-alpha-400 p-4">
      <CollapseTrigger className="text-label-14 text-foreground">
        What is Geist Style Framework?
      </CollapseTrigger>
      <CollapseContent className="pt-3 text-copy-14 text-muted-foreground">
        A reusable React style foundation aligned with the Vercel Geist design system.
      </CollapseContent>
    </Collapse>
  );
}

function ComboboxDemo() {
  const { language } = useLanguage();
  return (
    <Combobox
      defaultValue="nextjs"
      className="w-64"
      placeholder={demoText(language, "Select a framework")}
    >
      <ComboboxTrigger aria-label={demoText(language, "Select a framework")} />
      <ComboboxContent>
        <ComboboxItem value="nextjs">Next.js</ComboboxItem>
        <ComboboxItem value="react">React</ComboboxItem>
        <ComboboxItem value="vite">Vite</ComboboxItem>
      </ComboboxContent>
    </Combobox>
  );
}

function DescriptionDemo() {
  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-6">
      <Description title="Framework" content="Next.js" />
      <Description title="Region" content="Washington, D.C., USA" />
    </div>
  );
}

function EntityDemo() {
  return (
    <Entity className="w-full max-w-lg">
      <EntityMedia>
        <Avatar size={24} letter="ER" />
      </EntityMedia>
      <EntityContent>
        <EntityTitle>Evil Rabbit</EntityTitle>
        <EntityDescription>evilrabbit@example.com</EntityDescription>
      </EntityContent>
      <EntityAction>
        <Button type="secondary" size="small">
          Manage
        </Button>
      </EntityAction>
    </Entity>
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
  return (
    <FieldSet className="w-full max-w-sm space-y-3">
      <FieldSetLegend>Project Settings</FieldSetLegend>
      <FieldSetItem>
        <FieldSetLabel id="fieldset-project" value="Project Name" />
        <Input id="fieldset-project" defaultValue="geist-style-framework" />
      </FieldSetItem>
    </FieldSet>
  );
}

function LabelDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label id="label-project" value="Project Name" />
      <Input id="label-project" placeholder="my-project" />
    </div>
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
  const { language } = useLanguage();
  const options = ["React", "Next.js", "Vite"];
  const [selected, setSelected] = React.useState(["React"]);
  const toggle = (name: string) =>
    setSelected((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    );

  return (
    <MultiSelectRoot className="w-64">
      <MultiSelectTrigger aria-label={demoText(language, "Select frameworks")}>
        {demoTextWithValues(language, "{count} selected", { count: selected.length })}
      </MultiSelectTrigger>
      <MultiSelectContent>
        {options.map((name) => (
          <MultiSelectRow
            key={name}
            name={name}
            checked={selected.includes(name)}
            selectedCount={selected.length}
            totalCount={options.length}
            onChange={() => toggle(name)}
            onSelectOnly={() => setSelected([name])}
            onSelectAll={() => setSelected(options)}
          />
        ))}
      </MultiSelectContent>
    </MultiSelectRoot>
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
  return (
    <RadioGroup label="Deployment Region" defaultValue="iad1" name="deployment-region">
      <RadioGroupItem value="iad1">Washington, D.C.</RadioGroupItem>
      <RadioGroupItem value="fra1">Frankfurt</RadioGroupItem>
      <RadioGroupItem value="hnd1">Tokyo</RadioGroupItem>
    </RadioGroup>
  );
}

function RelativeTimeCardDemo() {
  return <RelativeTimeCard date={Date.now() - 5 * 60 * 1000} />;
}

function SearchInputDemo() {
  const { language } = useLanguage();
  return (
    <SearchInput
      className="w-full max-w-sm"
      placeholder={demoText(language, "Search projects")}
      aria-label={demoText(language, "Search projects")}
    />
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
              <Switch name="view-mode">
                <SwitchControl defaultChecked disabled label="Source" value="source" />
                <SwitchControl disabled label="Output" value="output" />
              </Switch>
            </div>
          </Section>
          <Section title="Sizes">
            <div className="flex w-full flex-col gap-4 lg:flex-row lg:flex-wrap">
              <Switch name="sizes-small" size="small">
                <SwitchControl defaultChecked label="Source" value="source" />
                <SwitchControl label="Output" value="output" />
              </Switch>
              <Switch name="sizes-default">
                <SwitchControl defaultChecked label="Source" value="source" />
                <SwitchControl label="Output" value="output" />
              </Switch>
              <Switch name="sizes-large" size="large">
                <SwitchControl defaultChecked label="Source" value="source" />
                <SwitchControl label="Output" value="output" />
              </Switch>
            </div>
          </Section>
          <Section title="Full width">
            <Switch name="full-width" style={{ width: "100%" }}>
              <SwitchControl defaultChecked label="Source" size="large" value="source" />
              <SwitchControl label="Output" size="large" value="output" />
            </Switch>
          </Section>
          <Section title="Tooltip">
            <div className="flex w-full max-w-md flex-col items-start">
              <Switch name="view-mode">
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
            <div className="flex w-full flex-col gap-4 lg:flex-row lg:flex-wrap">
              <Switch name="icons-small" size="small">
                <SwitchControl
                  defaultChecked
                  icon={<LayoutGrid aria-hidden />}
                  label="Source"
                  value="source"
                />
                <SwitchControl icon={<List aria-hidden />} label="Output" value="output" />
              </Switch>
              <Switch name="icons-default">
                <SwitchControl
                  defaultChecked
                  icon={<LayoutGrid aria-hidden />}
                  label="Source"
                  value="source"
                />
                <SwitchControl icon={<List aria-hidden />} label="Output" value="output" />
              </Switch>
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
