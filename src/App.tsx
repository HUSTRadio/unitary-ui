import { useState } from "react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch, SwitchControl } from "@/components/ui/switch";
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
import { Textarea } from "@/components/ui/textarea";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { Toggle } from "@/components/ui/toggle";
import { DataTableExample } from "@/examples/DataTableExample";
import { FormExample } from "@/examples/FormExample";
import { SettingsExample } from "@/examples/SettingsExample";
import { WorkflowExample } from "@/examples/WorkflowExample";

/** Living styleguide — 组件总览 + 4 个组合示例。 */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-heading-24 text-foreground">{title}</h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

export default function App() {
  const [page, setPage] = useState<"components" | "form" | "table" | "workflow" | "settings">(
    "components",
  );
  const [checked, setChecked] = useState(true);
  const [toggled, setToggled] = useState(true);
  const [segment, setSegment] = useState("all");
  const [tab, setTab] = useState("overview");

  const NAV: { key: typeof page; label: string }[] = [
    { key: "components", label: "组件总览" },
    { key: "form", label: "表单示例" },
    { key: "table", label: "数据表格" },
    { key: "workflow", label: "审批流程" },
    { key: "settings", label: "设置面板" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-6">
          <h1 className="text-heading-20 text-foreground">Geist Style Framework</h1>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setPage(item.key)}
                className={cn(
                  "focus-ring rounded-md px-3 py-1.5 text-label-14 transition-colors",
                  page === item.key
                    ? "bg-selected font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <ThemeSwitcher small />
      </header>

      {/* 移动端导航 */}
      <div className="border-b border-border px-6 py-3 md:hidden">
        <Select
          value={page}
          onChange={(event) => setPage(event.target.value as typeof page)}
          aria-label="示例导航"
        >
          {NAV.map((item) => (
            <option key={item.key} value={item.key}>
              {item.label}
            </option>
          ))}
        </Select>
      </div>

      <main className="mx-auto max-w-6xl space-y-10 px-6 py-10">
        {page === "form" && <FormExample />}
        {page === "table" && <DataTableExample />}
        {page === "workflow" && <WorkflowExample />}
        {page === "settings" && <SettingsExample />}

        {page === "components" && (
          <>
            {/* 排版 */}
            <section className="space-y-3">
              <h2 className="text-heading-24 text-foreground">排版 Typography</h2>
              <p className="text-copy-14 text-muted-foreground">
                完整排版类见 <code className="font-mono">src/styles/index.css</code> 与{" "}
                <code className="font-mono">
                  docs/geist-markdown-refs/foundations/typography.md
                </code>
              </p>
              <div className="space-y-2">
                <p className="text-heading-32 text-foreground">Heading 32 — 主要区块标题</p>
                <p className="text-heading-20 text-foreground">Heading 20 — 区块标题</p>
                <p className="text-copy-16 text-foreground">
                  Copy 16 正文 — 常规内容排版，<strong>强调文本用 Strong 修饰</strong>
                </p>
                <p className="text-label-14 text-muted-foreground">Label 14 — 菜单 / 标签文本</p>
                <p className="text-copy-13-mono text-muted-foreground">NB-2024-0012（Mono 数字）</p>
              </div>
            </section>

            {/* 按钮 */}
            <Section title="Button">
              <Button>默认</Button>
              <Button type="secondary">次要</Button>
              <Button type="tertiary">描边</Button>
              <Button type="tertiary">幽灵</Button>
              <Button type="error">危险</Button>
              <Button size="small">小号</Button>
              <Button size="large">大号</Button>
              <Button prefix={<Plus className="size-3.5" aria-hidden />}>带图标</Button>
              <Button loading>加载中</Button>
              <Button disabled>禁用</Button>
            </Section>

            {/* 表单 */}
            <Section title="Input / Textarea / Select / Checkbox / Toggle">
              <div className="w-56">
                <Input placeholder="搜索资产…" aria-label="示例输入" />
              </div>
              <div className="w-56">
                <Input placeholder="禁用状态" disabled aria-label="禁用输入" />
              </div>
              <div className="w-56">
                <Select placeholder="选择类别" defaultValue="" aria-label="示例选择">
                  <option value="office">办公设备</option>
                  <option value="instrument">仪器设备</option>
                  <option value="comms">通信设备</option>
                </Select>
              </div>
              <div className="w-72">
                <Textarea placeholder="备注…" aria-label="示例备注" />
              </div>
              <label className="flex items-center gap-2 text-label-14 text-foreground">
                <Checkbox checked={checked} onCheckedChange={(c) => setChecked(c === true)} />
                已选中
              </label>
              <div className="flex items-center gap-2 text-label-14 text-foreground">
                <Toggle
                  checked={toggled}
                  onCheckedChange={(t) => setToggled(t)}
                  aria-label="示例开关"
                />
                开关
              </div>
            </Section>

            {/* 互斥视图切换 */}
            <Section title="Switch">
              <Switch
                name="asset-status"
                value={segment}
                onValueChange={setSegment}
                aria-label="筛选状态"
              >
                <SwitchControl value="all" label="全部" />
                <SwitchControl value="available" label="可出借" />
                <SwitchControl value="borrowed" label="借出中" />
              </Switch>
            </Section>

            {/* Tabs */}
            <Section title="Tabs">
              <Tabs
                tabs={[
                  { value: "overview", title: "概览" },
                  { value: "details", title: "详情" },
                  { value: "history", title: "历史" },
                ]}
                selected={tab}
                setSelected={setTab}
                ariaLabel="示例标签页"
              />
              <div className="pt-4 text-copy-14 text-muted-foreground">
                {tab === "overview" ? "概览内容" : tab === "details" ? "详情内容" : "历史内容"}
              </div>
            </Section>

            {/* Badge / StepPoint */}
            <Section title="Badge / StepPoint">
              <Badge variant="gray">默认</Badge>
              <Badge variant="gray" contrast="low">
                次要
              </Badge>
              <Badge variant="green">成功</Badge>
              <Badge variant="blue">信息</Badge>
              <Badge variant="amber">警告</Badge>
              <Badge variant="red">危险</Badge>
              <StepPoint status="done">第一步：填写信息</StepPoint>
              <StepPoint status="active">第二步：审批中</StepPoint>
              <StepPoint status="idle">第三步：待开始</StepPoint>
            </Section>

            {/* Table */}
            <Section title="Table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>资产</TableHead>
                    <TableHead>编号</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "ThinkPad X1 Carbon", id: "NB-2024-0012", status: "借出中" },
                    { name: "SIGLENT SDS1104X-E", id: "FA-OSC-0007", status: "可借" },
                    { name: "RF Explorer 6G Combo", id: "FA-RF-0012", status: "库内" },
                  ].map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium text-foreground">{row.name}</TableCell>
                      <TableCell className="font-mono text-copy-13 tabular-nums text-muted-foreground">
                        {row.id}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{row.status}</TableCell>
                      <TableCell>
                        <a
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          className="focus-ring rounded-[4px] text-label-14 text-link underline-offset-4 hover:underline"
                        >
                          查看
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Section>

            {/* 材质 */}
            <Section title="材质 Materials">
              <div className="material-base p-4 text-label-14 text-foreground">material-base</div>
              <div className="material-small p-4 text-label-14 text-foreground">material-small</div>
              <div className="material-medium p-4 text-label-14 text-foreground">
                material-medium
              </div>
              <div className="material-large p-4 text-label-14 text-foreground">material-large</div>
            </Section>
          </>
        )}
      </main>

      <footer className="border-t border-border px-6 py-4 text-label-12 text-muted-foreground">
        Geist Style Framework · docs/geist-markdown-refs 规范快照 · 2026-08-08
      </footer>
    </div>
  );
}
