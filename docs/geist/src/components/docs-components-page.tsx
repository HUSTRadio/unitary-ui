import * as React from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft, Copy, CopyCheck, Edit, Inbox, Search, Trash2 } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Banner } from "@/components/ui/banner";
import { Book } from "@/components/ui/book";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Browser } from "@/components/ui/browser";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { ClearableInput } from "@/components/ui/clearable-input";
import {
  Choicebox,
  ChoiceboxDescription,
  ChoiceboxItem,
  ChoiceboxLabel,
} from "@/components/ui/choicebox";
import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";
import { Combobox, ComboboxContent, ComboboxItem, ComboboxTrigger } from "@/components/ui/combobox";
import { Code } from "@/components/ui/code";
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
import { JsonView } from "@/components/ui/json-view";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
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
import { SplitButton, SplitButtonMain, SplitButtonMenu } from "@/components/ui/split-button";
import { StatusDot } from "@/components/ui/status-dot";
import { StepPoint } from "@/components/ui/step-point";
import {
  Table,
  TableBody,
  TableCell,
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

/**
 * Components 文档页（docs/geist 专用）。
 * 总览模式（/components）：13 元件索引卡片网格。
 * 详情模式（/components/:name）：返回链接 + 实时 demo（直接渲染根元件）+ 代码块（带 Copy 按钮）。
 */

/* ---------- Copy 按钮（复用 Introduction 页终端行模式） ---------- */

function CodeCopyButton({ text }: { text: string }) {
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
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={copied ? "已复制" : "复制代码"}
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
  return (
    <>
      <Button type="button">Default</Button>
      <Button type="button" variant="secondary">
        Secondary
      </Button>
      <Button type="button" variant="outline">
        Outline
      </Button>
      <Button type="button" variant="ghost">
        Ghost
      </Button>
      <Button type="button" variant="destructive">
        Destructive
      </Button>
      <Button type="button" size="sm">
        Small
      </Button>
      <Button type="button" size="lg">
        Large
      </Button>
      <Button type="button" prefix={<Search aria-hidden />}>
        Search
      </Button>
      <Button type="button" variant="outline" loading>
        Loading
      </Button>
      <Button type="button" disabled>
        Disabled
      </Button>
    </>
  );
}

function CheckboxDemo() {
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
          aria-label="全选权限"
        />
        <span className="text-copy-14 text-foreground">All permissions</span>
      </label>
      <label className="flex cursor-pointer items-center gap-2.5">
        <Checkbox
          checked={checked[0]}
          onCheckedChange={(value) => setChecked([value === true, checked[1]])}
          aria-label="读取权限"
        />
        <span className="text-copy-14 text-muted-foreground">Read access</span>
      </label>
      <label className="flex cursor-pointer items-center gap-2.5">
        <Checkbox
          checked={checked[1]}
          onCheckedChange={(value) => setChecked([checked[0], value === true])}
          aria-label="写入权限"
        />
        <span className="text-copy-14 text-muted-foreground">Write access</span>
      </label>
    </div>
  );
}

function MenuDemo() {
  return (
    <MenuContainer>
      <MenuButton>Actions</MenuButton>
      <Menu width={200}>
        <MenuItem prefix={<Edit aria-hidden />}>Edit Project</MenuItem>
        <MenuItem prefix={<Copy aria-hidden />}>Duplicate Project</MenuItem>
        <MenuDivider />
        <MenuItem type="error" prefix={<Trash2 aria-hidden />}>
          Delete Project
        </MenuItem>
      </Menu>
    </MenuContainer>
  );
}

function InputDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Input placeholder="Project name" aria-label="项目名" />
      <Input placeholder="Disabled input" disabled aria-label="禁用输入框" />
    </div>
  );
}

function ModalDemo() {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button type="button">Open Modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Delete Project</ModalTitle>
          <ModalDescription>This action cannot be undone.</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </ModalClose>
          <Button type="button" variant="destructive">
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function SwitchDemo() {
  const [view, setView] = React.useState("preview");
  return (
    <Switch name="editor-view" value={view} onValueChange={setView} aria-label="编辑器视图">
      <SwitchControl value="preview" label="Preview" />
      <SwitchControl value="code" label="Code" />
      <SwitchControl value="split" label="Split" />
    </Switch>
  );
}

function SelectDemo() {
  return (
    <Select className="w-56" defaultValue="vercel" aria-label="选择项目">
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
        <Spinner size="sm" />
        <span className="text-label-12 text-muted-foreground">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="md" />
        <span className="text-label-12 text-muted-foreground">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" />
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
  return (
    <div className="w-full max-w-xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Deployments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Vercel</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>12</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Next.js</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>8</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Turborepo</TableCell>
            <TableCell>Paused</TableCell>
            <TableCell>3</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
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
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Textarea placeholder="Describe your project…" aria-label="项目描述" />
      <Textarea placeholder="Disabled textarea" disabled aria-label="禁用文本区" />
    </div>
  );
}

function ToggleDemo() {
  const [enabled, setEnabled] = React.useState(true);
  return (
    <div className="flex items-center gap-3">
      <Toggle checked={enabled} onCheckedChange={setEnabled} aria-label="切换设置" />
      <span className="text-copy-14 text-muted-foreground">{enabled ? "On" : "Off"}</span>
    </div>
  );
}

function TooltipDemo() {
  return (
    <Tooltip text="The Evil Rabbit Jumped over the Fence">
      <Button type="button" variant="outline">
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
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <Progress value={30} aria-label="进度 30%" />
        <span className="text-copy-13 text-muted-foreground">30%</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <Progress value={60} aria-label="进度 60%" />
        <span className="text-copy-13 text-muted-foreground">60%</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <Progress value={90} aria-label="进度 90%" />
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
  const toasts = useToasts();

  return (
    <>
      <Button type="button" onClick={() => toasts.message({ text: "Project deleted" })}>
        Show Toast
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
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Open Drawer
      </Button>
      <Drawer show={open} onDismiss={() => setOpen(false)}>
        <div className="p-5">
          <DrawerTitle>Filter Logs</DrawerTitle>
          <DrawerDescription>Narrow the logs by environment.</DrawerDescription>
          <div className="mt-5 flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => setOpen(false)}>
              Apply
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
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Deployment Details</SheetTitle>
          <SheetDescription>Inspect the latest production deployment.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="button" variant="secondary">
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
  return (
    <div className="w-full max-w-md">
      <Book title="The user experience of the Frontend Cloud" />
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
  return (
    <div className="w-full max-w-md">
      <Choicebox defaultValue="pro" aria-label="select a plan">
        <ChoiceboxItem value="trial">
          <ChoiceboxLabel>Pro Trial</ChoiceboxLabel>
          <ChoiceboxDescription>Free for two weeks</ChoiceboxDescription>
        </ChoiceboxItem>
        <ChoiceboxItem value="pro">
          <ChoiceboxLabel>Pro</ChoiceboxLabel>
          <ChoiceboxDescription>Get started now</ChoiceboxDescription>
        </ChoiceboxItem>
      </Choicebox>
    </div>
  );
}

function CommandMenuDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <CommandMenu open={open} onOpenChange={setOpen}>
      <CommandMenuTrigger asChild>
        <Button type="button">Open Command Menu</Button>
      </CommandMenuTrigger>
      <CommandMenuContent>
        <CommandMenuInput placeholder="What do you need?" />
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
  const [value, setValue] = React.useState<number[]>([50]);
  return (
    <div className="w-full max-w-md">
      <Slider value={value} onValueChange={setValue} aria-label="Volume" />
      <p className="mt-3 text-copy-14 text-muted-foreground">Value: {value[0]}</p>
    </div>
  );
}

function VideoDemo() {
  return (
    <div className="w-full max-w-md">
      <Video src="/demo.mp4" poster="/demo-poster.png" />
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

function CodeDemo() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-copy-14 text-muted-foreground">
        Install with <Code>npm i geist</Code> and import the component.
      </p>
      <p className="text-copy-14 text-muted-foreground">
        Use <Code>variant="destructive"</Code> for destructive confirmations.
      </p>
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
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button type="button" variant="destructive" onClick={() => setOpen(true)}>
        Delete Project
      </Button>
      <DestructiveActionModal
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title="Delete Project"
        description="next-year-boilerplate and all its deployments, domains, and environment variables will be permanently deleted."
        confirmLabel="Delete Project"
        verificationPhrase="next-year-boilerplate"
        verificationLabel="project name"
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
        Load More
      </LoadMoreButton>
      <p className="text-center text-copy-13 text-muted-foreground">{count} items loaded</p>
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
  return (
    <ContextCard>
      <ContextCardHeader>
        <ContextCardAvatar src="https://github.com/vercel.png" alt="Acme" />
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
        <Button type="button" size="sm">
          View Project
        </Button>
      </ContextCardFooter>
    </ContextCard>
  );
}

function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Button type="button" variant="outline">
          Right click here
        </Button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Open in New Tab</ContextMenuItem>
        <ContextMenuItem>Copy URL</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground">
          Delete Deployment
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
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KeyboardInput>
      <KeyboardInput>
        <Kbd>Shift</Kbd>
        <Kbd>Enter</Kbd>
      </KeyboardInput>
      <Kbd>Esc</Kbd>
    </div>
  );
}

function BannerDemo() {
  return (
    <Banner button={{ href: "#/components", content: "Read more" }} className="w-full p-4">
      <b>Big News</b> – A new framework version is available
    </Banner>
  );
}

function BreadcrumbsDemo() {
  return (
    <Breadcrumb type="menu">
      <BreadcrumbItem href="#/">Home</BreadcrumbItem>
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
  return (
    <Combobox defaultValue="nextjs" className="w-64" placeholder="Select a framework">
      <ComboboxTrigger aria-label="Select a framework" />
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
        <Button variant="secondary" size="sm">
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
  return (
    <div className="flex items-center gap-3 text-copy-14 text-muted-foreground">
      Loading deployment <LoadingDots />
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
  const options = ["React", "Next.js", "Vite"];
  const [selected, setSelected] = React.useState(["React"]);
  const toggle = (name: string) =>
    setSelected((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    );

  return (
    <MultiSelectRoot className="w-64">
      <MultiSelectTrigger aria-label="Select frameworks">
        {selected.length} selected
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
  const [active, setActive] = React.useState("all");
  return (
    <div className="flex flex-wrap gap-2" aria-label="Deployment status filter">
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
  return (
    <SearchInput
      className="w-full max-w-sm"
      placeholder="Search projects"
      aria-label="Search projects"
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
  return (
    <SplitButton>
      <SplitButtonMain>Deploy Project</SplitButtonMain>
      <SplitButtonMenu menuLabel="More deployment actions">
        <MenuItem>Deploy to Preview</MenuItem>
        <MenuItem>Deploy to Production</MenuItem>
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-heading-24 text-foreground">{title}</h2>
      <div className="mt-6 flex min-h-28 flex-wrap items-center gap-x-6 gap-y-4 rounded-[8px] border border-gray-alpha-400 bg-background p-6">
        {children}
      </div>
    </section>
  );
}

/** 名称 → 额外演示分段（Sizes / Variants / States），未命中的组件返回 null */
function renderExtraSections(name: string): React.ReactNode {
  switch (name) {
    case "button":
      return (
        <>
          <Section title="Sizes">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Button type="button" size="sm">
                  Small
                </Button>
                <Button type="button">Medium</Button>
                <Button type="button" size="lg">
                  Large
                </Button>
              </div>
            </div>
          </Section>
          <Section title="Variants">
            <div className="flex flex-wrap items-center gap-3">
              <Button type="button">Default</Button>
              <Button type="button" variant="secondary">
                Secondary
              </Button>
              <Button type="button" variant="outline">
                Outline
              </Button>
              <Button type="button" variant="ghost">
                Ghost
              </Button>
              <Button type="button" variant="destructive">
                Destructive
              </Button>
            </div>
          </Section>
          <Section title="Prefix and Suffix">
            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" prefix={<Search aria-hidden />}>
                Search
              </Button>
              <Button type="button" variant="secondary" prefix={<Copy aria-hidden />}>
                Copy
              </Button>
              <Button type="button" variant="outline" loading>
                Loading
              </Button>
              <Button type="button" disabled>
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
              <Input placeholder="Default" aria-label="默认" />
              <Input placeholder="Disabled" disabled aria-label="禁用" />
              <Input placeholder="With value" defaultValue="geist-docs" aria-label="有值" />
            </div>
          </Section>
        </>
      );
    case "select":
      return (
        <>
          <Section title="With Options">
            <Select className="w-56" defaultValue="banana" aria-label="选择水果">
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
          <Section title="States">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Toggle defaultChecked aria-label="开启" />
                <span className="text-copy-14 text-muted-foreground">Checked (ON)</span>
              </div>
              <div className="flex items-center gap-3">
                <Toggle aria-label="关闭" />
                <span className="text-copy-14 text-muted-foreground">Unchecked (OFF)</span>
              </div>
              <div className="flex items-center gap-3">
                <Toggle disabled aria-label="禁用关闭" />
                <span className="text-copy-14 text-muted-foreground">Disabled</span>
              </div>
              <div className="flex items-center gap-3">
                <Toggle defaultChecked size="large" aria-label="大号开启" />
                <span className="text-copy-14 text-muted-foreground">Large size</span>
              </div>
            </div>
          </Section>
        </>
      );
    case "checkbox":
      return (
        <>
          <Section title="Indeterminate">
            <div className="flex flex-col gap-3">
              <label className="flex cursor-pointer items-center gap-2.5">
                <Checkbox checked="indeterminate" aria-label="半选" />
                <span className="text-copy-14 text-foreground">
                  Indeterminate (partial selection)
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-2.5">
                <Checkbox checked aria-label="选中" />
                <span className="text-copy-14 text-muted-foreground">Checked</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2.5">
                <Checkbox aria-label="未选中" />
                <span className="text-copy-14 text-muted-foreground">Unchecked</span>
              </label>
            </div>
          </Section>
        </>
      );
    default:
      return null;
  }
}

/* ---------- 总览模式 ---------- */

function ComponentsOverview() {
  return (
    <div>
      <h1 className="text-heading-40 text-foreground">Components</h1>
      <p className="mt-3 max-w-xl text-copy-20 text-muted-foreground">
        Building blocks for React applications.
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {COMPONENTS.map((component) => (
          <a
            key={component.name}
            href={`#/components/${component.name}`}
            className="group block border-b border-r border-border p-6 transition-colors hover:bg-gray-alpha-100"
          >
            <p className="font-mono text-label-12 text-muted-foreground">{component.official}</p>
            <h3 className="mt-1 text-label-16 font-medium text-foreground">{component.label}</h3>
            <p className="mt-1 text-copy-13 text-muted-foreground">{component.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ---------- 详情模式 ---------- */

function ComponentDetail({ name }: { name: string }) {
  const meta: ComponentMeta | undefined = COMPONENTS.find((component) => component.name === name);

  if (!meta) {
    return (
      <div>
        <BackLink />
        <h1 className="text-heading-40 text-foreground">组件不存在</h1>
        <p className="mt-3 max-w-xl text-copy-20 text-muted-foreground">
          未找到名为 {name} 的元件。
        </p>
      </div>
    );
  }

  return (
    <div>
      <BackLink />
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h1 className="text-heading-40 text-foreground">{meta.label}</h1>
        <span className="rounded-full border border-gray-alpha-400 px-2 py-0.5 font-mono text-label-12 text-muted-foreground">
          {meta.official}
        </span>
      </div>
      <p className="mt-3 max-w-xl text-copy-20 text-muted-foreground">{meta.description}</p>

      <section className="mt-10">
        <h2 className="text-heading-24 text-foreground">Live Demo</h2>
        <DemoSection>{renderDemo(name)}</DemoSection>
      </section>

      {renderExtraSections(name)}

      <section className="mt-12">
        <h2 className="text-heading-24 text-foreground">Usage</h2>
        <div className="mt-6">
          <CodeBlock code={meta.code} label={`components/${name}.tsx`} />
        </div>
      </section>

      {meta.bestPractices && meta.bestPractices.length > 0 && (
        <section className="mt-12">
          <h2 className="text-heading-24 text-foreground">Best Practices</h2>
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
  return (
    <a
      href="#/components"
      className="inline-flex items-center gap-1.5 text-copy-14 text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-4" aria-hidden />
      Back to Components
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
