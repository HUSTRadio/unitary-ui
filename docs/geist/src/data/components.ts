/**
 * 文档站 Components 数据（docs/geist 专用）。
 * 13 个已实现元件的元数据：路由 slug / 显示名 / 一句说明 / 官方对应组件名 / 用法代码片段。
 * 代码片段为「精简用法示例」字符串，详情页代码块展示，与根元件 API 保持一致。
 */

export interface ComponentMeta {
  /** 路由 slug（与侧栏 /components/:name 一致） */
  name: string;
  /** 侧栏 / 卡片显示名 */
  label: string;
  /** 一句说明（总览卡片 + 详情页副标题） */
  description: string;
  /** 官方 Geist（或 Penpot Core）对应组件名 */
  official: string;
  /** 用法 TSX 片段（详情页代码块，font-mono 展示） */
  code: string;
  /** Best Practices 要点（详情页底部列表） */
  bestPractices?: string[];
}

export const COMPONENTS: ComponentMeta[] = [
  {
    name: "badge",
    label: "Badge",
    description: "Small labels for statuses, counts, and metadata.",
    official: "Badge",
    code: `import { Badge } from "@/components/ui/badge";

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="ghost">Ghost</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="success">Success</Badge>`,
  },
  {
    name: "button",
    label: "Button",
    description: "Triggers an action with configurable variants, sizes, and icons.",
    official: "Button",
    code: `import { Button } from "@/components/ui/button";

<Button>Default</Button>
<Button variant="outline" size="sm">Small</Button>
<Button variant="secondary" size="lg">Large</Button>
<Button variant="ghost" prefix={<Search />}>Search</Button>
<Button variant="destructive" loading>Delete</Button>
<Button disabled>Disabled</Button>`,
  },
  {
    name: "checkbox",
    label: "Checkbox",
    description: "Allows users to select one or more items from a group.",
    official: "Checkbox",
    code: `import { Checkbox } from "@/components/ui/checkbox";

<Checkbox id="checked" checked />
<Checkbox id="unchecked" />
<Checkbox id="partial" indeterminate />`,
  },
  {
    name: "dropdown-menu",
    label: "Dropdown Menu",
    description: "Displays a list of actions in a floating menu.",
    official: "Dropdown Menu",
    code: `import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuItem>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
  },
  {
    name: "input",
    label: "Input",
    description: "A single-line text field for user input.",
    official: "Input",
    code: `import { Input } from "@/components/ui/input";

<Input placeholder="Name" />
<Input placeholder="Disabled" disabled />`,
  },
  {
    name: "segmented-control",
    label: "Segmented Control",
    description: "A slider group for mutually exclusive view options.",
    official: "Segmented Control",
    code: `import { SegmentedControl } from "@/components/ui/segmented-control";

<SegmentedControl
  options={[
    { value: "preview", label: "Preview" },
    { value: "code", label: "Code" },
    { value: "split", label: "Split" },
  ]}
  value={view}
  onValueChange={setView}
  ariaLabel="编辑器视图"
/>`,
  },
  {
    name: "select",
    label: "Select",
    description: "Presents a list of options in a dropdown.",
    official: "Select",
    code: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<Select defaultValue="vercel">
  <SelectTrigger className="w-56">
    <SelectValue placeholder="Select a project" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="vercel">Vercel</SelectItem>
    <SelectItem value="nextjs">Next.js</SelectItem>
    <SelectItem value="turbo">Turborepo</SelectItem>
  </SelectContent>
</Select>`,
  },
  {
    name: "step-point",
    label: "Step Point",
    description: "Marks progress through a multi-step flow.",
    official: "StepPoint",
    code: `import { StepPoint } from "@/components/ui/step-point";

<ul>
  <StepPoint status="done">Submitted</StepPoint>
  <StepPoint status="active">Under review</StepPoint>
  <StepPoint status="idle">Approved</StepPoint>
</ul>`,
  },
  {
    name: "table",
    label: "Table",
    description: "Displays structured data in rows and columns.",
    official: "Table",
    code: `import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Vercel</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Next.js</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
  },
  {
    name: "tabs",
    label: "Tabs",
    description: "Organizes content into switchable panels.",
    official: "Tabs",
    code: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="usage">Usage</TabsTrigger>
    <TabsTrigger value="api">API</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="usage">…</TabsContent>
  <TabsContent value="api">…</TabsContent>
</Tabs>`,
  },
  {
    name: "textarea",
    label: "Textarea",
    description: "A multi-line text field for longer input.",
    official: "Textarea",
    code: `import { Textarea } from "@/components/ui/textarea";

<Textarea placeholder="Describe your project" />
<Textarea placeholder="Disabled" disabled />`,
  },
  {
    name: "toggle",
    label: "Toggle",
    description: "A switch for a single boolean setting.",
    official: "Toggle",
    code: `import { Toggle } from "@/components/ui/toggle";

<Toggle checked={enabled} onCheckedChange={setEnabled} />`,
  },
  {
    name: "theme-switch",
    label: "Theme Switch",
    description: "Switches between light, dark, and system themes.",
    official: "Theme Switcher",
    code: `import { ThemeSwitch } from "@/components/ui/theme-switch";

<ThemeSwitch />`,
  },
];
