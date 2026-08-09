import * as React from "react";
import { useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  CopyCheck,
  Edit,
  Search,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepPoint } from "@/components/ui/step-point";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { Toggle } from "@/components/ui/toggle";

import { COMPONENTS, type ComponentMeta } from "../data/components";

/**
 * Components 文档页（docs/geist 专用）。
 * 总览模式（/components）：13 元件索引卡片网格。
 * 详情模式（/components/:name）：返回链接 + 实时 demo（直接渲染根元件）+ 代码块（带 Copy 按钮）。
 */

/* ---------- Copy 按钮（复用 Introduction 页终端行模式） ---------- */

function CopyButton({ text }: { text: string }) {
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
        <CopyButton text={code} />
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
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="success">Success</Badge>
    </>
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

function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline">
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>
          <Edit aria-hidden />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy aria-hidden />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground">
          <Trash2 aria-hidden />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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

function SegmentedControlDemo() {
  const [view, setView] = React.useState("preview");
  return (
    <SegmentedControl
      options={[
        { value: "preview", label: "Preview" },
        { value: "code", label: "Code" },
        { value: "split", label: "Split" },
      ]}
      value={view}
      onValueChange={setView}
      ariaLabel="编辑器视图"
    />
  );
}

function SelectDemo() {
  return (
    <Select defaultValue="vercel">
      <SelectTrigger className="w-56" aria-label="选择项目">
        <SelectValue placeholder="Select a project" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="vercel">Vercel</SelectItem>
        <SelectItem value="nextjs">Next.js</SelectItem>
        <SelectItem value="turbo">Turborepo</SelectItem>
        <SelectItem value="v0">v0</SelectItem>
      </SelectContent>
    </Select>
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
  return (
    <div className="w-full max-w-xl">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-4 text-copy-14 text-muted-foreground">
          Building blocks for consistent web experiences.
        </TabsContent>
        <TabsContent value="usage" className="pt-4 text-copy-14 text-muted-foreground">
          Import from @/components/ui/tabs and compose panels freely.
        </TabsContent>
        <TabsContent value="api" className="pt-4 text-copy-14 text-muted-foreground">
          Radix Tabs primitives with Geist styling.
        </TabsContent>
      </Tabs>
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
      <Toggle
        checked={enabled}
        onCheckedChange={setEnabled}
        aria-label="切换设置"
      />
      <span className="text-copy-14 text-muted-foreground">
        {enabled ? "On" : "Off"}
      </span>
    </div>
  );
}

function ThemeSwitchDemo() {
  return (
    <div className="flex items-center gap-2">
      <ThemeSwitch />
      <span className="text-copy-14 text-muted-foreground">
        点击图标切换 浅色 / 深色 / 跟随系统
      </span>
    </div>
  );
}

/** 名称 → 实时 demo 渲染器（未命中的分支在调用前已拦截） */
function renderDemo(name: string): React.ReactNode {
  switch (name) {
    case "badge":
      return <BadgeDemo />;
    case "button":
      return <ButtonDemo />;
    case "checkbox":
      return <CheckboxDemo />;
    case "dropdown-menu":
      return <DropdownMenuDemo />;
    case "input":
      return <InputDemo />;
    case "segmented-control":
      return <SegmentedControlDemo />;
    case "select":
      return <SelectDemo />;
    case "step-point":
      return <StepPointDemo />;
    case "table":
      return <TableDemo />;
    case "tabs":
      return <TabsDemo />;
    case "textarea":
      return <TextareaDemo />;
    case "toggle":
      return <ToggleDemo />;
    case "theme-switch":
      return <ThemeSwitchDemo />;
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
                <Button type="button" size="sm">Small</Button>
                <Button type="button">Medium</Button>
                <Button type="button" size="lg">Large</Button>
              </div>
            </div>
          </Section>
          <Section title="Variants">
            <div className="flex flex-wrap items-center gap-3">
              <Button type="button">Default</Button>
              <Button type="button" variant="secondary">Secondary</Button>
              <Button type="button" variant="outline">Outline</Button>
              <Button type="button" variant="ghost">Ghost</Button>
              <Button type="button" variant="destructive">Destructive</Button>
            </div>
          </Section>
          <Section title="Prefix and Suffix">
            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" prefix={<Search aria-hidden />}>Search</Button>
              <Button type="button" variant="secondary" prefix={<Copy aria-hidden />}>Copy</Button>
              <Button type="button" variant="outline" loading>Loading</Button>
              <Button type="button" disabled>Disabled</Button>
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
            <Select defaultValue="banana">
              <SelectTrigger className="w-56" aria-label="选择水果">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="grape">Grape</SelectItem>
              </SelectContent>
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
                <Toggle defaultChecked size="sm" aria-label="小号开启" />
                <span className="text-copy-14 text-muted-foreground">Small size</span>
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
                <span className="text-copy-14 text-foreground">Indeterminate (partial selection)</span>
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
            <p className="font-mono text-label-12 text-muted-foreground">
              {component.official}
            </p>
            <h3 className="mt-1 text-label-16 font-medium text-foreground">
              {component.label}
            </h3>
            <p className="mt-1 text-copy-13 text-muted-foreground">
              {component.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ---------- 详情模式 ---------- */

function ComponentDetail({ name }: { name: string }) {
  const meta: ComponentMeta | undefined = COMPONENTS.find(
    (component) => component.name === name,
  );

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
      <p className="mt-3 max-w-xl text-copy-20 text-muted-foreground">
        {meta.description}
      </p>

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
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground" aria-hidden />
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
