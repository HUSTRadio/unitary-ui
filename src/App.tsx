import { useState } from "react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/ui/search-input";
import { Select, SelectItem } from "@/components/ui/select";
import { Switch, SwitchControl } from "@/components/ui/switch";
import { StepPoint } from "@/components/ui/step-point";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "@/components/ui/table";
import { Tabs } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { Toggle } from "@/components/ui/toggle";
import { useFontMetrics } from "@/lib/font-metrics";
import { DataTableExample } from "@/examples/DataTableExample";
import { FormExample } from "@/examples/FormExample";
import { SettingsExample } from "@/examples/SettingsExample";
import { WorkflowExample } from "@/examples/WorkflowExample";
import { PagedMediaExample } from "@/examples/PagedMediaExample";
import { TokensExample } from "@/examples/TokensExample";
import { ScrollTrackingExample } from "@/examples/ScrollTrackingExample";
import { MotionExample } from "@/examples/MotionExample";

/** Living styleguide — 组件总览与可交互组合示例。 / Overview and interactive examples. */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-heading-24 text-foreground">{title}</h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

export default function App() {
  const [page, setPage] = useState<"components" | "form" | "table" | "workflow" | "settings" | "paged-media" | "tokens" | "motion">(
    "components",
  );
  const [checked, setChecked] = useState(true);
  const [toggled, setToggled] = useState(true);
  const [segment, setSegment] = useState("all");
  const [tab, setTab] = useState("overview");

  // 字体度量探针：字体就绪后测量 CJK:ASCII 比例/数字宽/基线偏移，
  // 供 .phone-status-time 等三处消费点做换字体后的视觉补偿（决策点3）。
  useFontMetrics();

  const NAV: { key: typeof page; label: string; labelEn: string }[] = [
    { key: "paged-media", label: "分页与媒体", labelEn: "Pagination and media" },
    { key: "components", label: "组件总览", labelEn: "Components overview" },
    { key: "form", label: "表单示例", labelEn: "Form example" },
    { key: "table", label: "数据表格", labelEn: "Data table" },
    { key: "workflow", label: "审批流程", labelEn: "Workflow" },
    { key: "settings", label: "设置面板", labelEn: "Settings panel" },
    { key: "tokens", label: "全局 Token", labelEn: "Global tokens" },
    { key: "motion", label: "动效与插画", labelEn: "Motion and illustrations" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-6">
          <h1 className="text-heading-16 text-foreground">Unitary</h1>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <button
                key={item.key}
                type="button"
                data-styleguide-page={item.key}
                data-styleguide-label-en={item.labelEn}
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
        <ThemeSwitcher compact />
      </header>

      {/* 移动端导航 */}
      <div className="border-b border-border px-6 py-3 md:hidden">
        <Select
          value={page}
          onValueChange={(value) => setPage(value as typeof page)}
          aria-label="示例导航"
        >
          {NAV.map((item) => (
            <SelectItem key={item.key} value={item.key}>
              {item.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      <main className="mx-auto max-w-6xl space-y-10 px-6 py-10">
        {/* 页面级边界：单个示例页崩溃只占位该区域，导航/其余页面继续可用；切换页面自动重置 */}
        <ErrorBoundary name={`styleguide:${page}`} resetKeys={[page]}>
          {page === "paged-media" && <PagedMediaExample />}
          {page === "form" && <FormExample />}
          {page === "table" && <DataTableExample />}
          {page === "workflow" && <WorkflowExample />}
          {page === "settings" && <SettingsExample />}
          {page === "tokens" && <TokensExample />}
          {page === "motion" && <MotionExample />}
        </ErrorBoundary>

        {page === "components" && (
          <ErrorBoundary name="styleguide:components-overview">
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
                <p className="text-copy-13-mono text-muted-foreground">
                  NB-2024-0012（Mono 数字）
                </p>
              </div>
            </section>

            {/* 按钮：用真实动作体现强调层级，避免把 API 名称直译成按钮文案。 */}
            <Section title="Button">
              <Button typeName="button">部署项目</Button>
              <Button typeName="button" type="secondary">
                查看日志
              </Button>
              <Button typeName="button" type="tertiary">
                更多操作
              </Button>
              <Button typeName="button" type="error">
                删除项目
              </Button>
              <Button typeName="button" type="warning">
                覆盖部署
              </Button>
              <Button typeName="button" size="small">
                上传
              </Button>
              <Button typeName="button" size="large">
                上传
              </Button>
              <Button typeName="button" prefix={<Plus className="size-3.5" aria-hidden />}>
                创建项目
              </Button>
              <Button typeName="button" loading>
                正在部署
              </Button>
              <Button typeName="button" disabled>
                暂不可用
              </Button>
            </Section>

            {/* 表单 */}
            <Section title="SearchInput / Input / Textarea / Select / Checkbox / Toggle">
              <SearchInput
                layout={{ width: 224 }}
                placeholder="搜索资产…"
                aria-label="搜索资产"
              />
              <Input
                layout={{ width: 224 }}
                placeholder="禁用状态"
                disabled
                aria-label="禁用输入"
              />
              <Input
                layout={{ width: 256 }}
                defaultValue="hustradio"
                prefix="https://"
                suffix=".com"
                aria-label="前后缀输入"
              />
              <Input
                layout={{ width: 256 }}
                defaultValue="hustradio"
                prefix="https://"
                suffix=".com"
                disabled
                aria-label="禁用前后缀输入"
              />
              <Input
                layout={{ width: 256 }}
                rounded
                defaultValue="42.5"
                prefix="$"
                suffix="USD"
                aria-label="胶囊前后缀输入"
              />
              <Select layout={{ width: 224 }} placeholder="选择类别" aria-label="示例选择">
                <SelectItem value="office">办公设备</SelectItem>
                <SelectItem value="instrument">仪器设备</SelectItem>
                <SelectItem value="comms">通信设备</SelectItem>
              </Select>
              <Textarea layout={{ width: 288 }} placeholder="备注…" aria-label="示例备注" />
              <Checkbox checked={checked} onChange={() => setChecked(!checked)}>
                已选中
              </Checkbox>
              <Toggle
                checked={toggled}
                onChange={() => setToggled(!toggled)}
                aria-label="自动更新"
                labelCasing="normal"
              >
                自动更新
              </Toggle>
            </Section>

            {/* 互斥视图切换 */}
            <Section title="Switch（分段选择）">
              <Switch
                name="asset-status"
                value={segment}
                onValueChange={setSegment}
                aria-label="筛选状态"
                className="w-full max-w-sm"
              >
                <SwitchControl value="all" label="全部" />
                <SwitchControl value="available" label="可出借" />
                <SwitchControl value="borrowed" label="借出中" />
              </Switch>
            </Section>

            {/* Tabs */}
            <Section title="Tabs（内容导航）">
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

            <Section title="Scroll Tracking（活动项滚动跟踪）">
              <ScrollTrackingExample />
            </Section>

            {/* Badge / StepPoint */}
            <Section title="Badge / StepPoint">
              <Badge variant="gray">草稿</Badge>
              <Badge variant="gray" contrast="low">
                内部
              </Badge>
              <Badge variant="green">运行中</Badge>
              <Badge variant="blue">预览</Badge>
              <Badge variant="amber">待处理</Badge>
              <Badge variant="red">失败</Badge>
              <ol role="list" className="m-0 w-full max-w-xs list-none p-0">
                <StepPoint status="done">第一步：填写信息</StepPoint>
                <StepPoint status="active">第二步：审批中</StepPoint>
                <StepPoint status="idle">第三步：待开始</StepPoint>
              </ol>
            </Section>

            {/* Table */}
            <Section title="Table">
              <TableRoot>
                <Table headerRow>
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
                          <Button
                            typeName="button"
                            type="tertiary"
                            size="small"
                            aria-label={`查看 ${row.name}`}
                          >
                            查看资产
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableRoot>
            </Section>

            {/* 材质 */}
            <Section title="材质 Materials">
              <div className="material-base p-4 text-label-14 text-foreground">material-base</div>
              <div className="material-small p-4 text-label-14 text-foreground">
                material-small
              </div>
              <div className="material-medium p-4 text-label-14 text-foreground">
                material-medium
              </div>
              <div className="material-large p-4 text-label-14 text-foreground">
                material-large
              </div>
            </Section>
          </>
          </ErrorBoundary>
        )}
      </main>

      <footer className="border-t border-border px-6 py-4 text-label-12 text-muted-foreground">
        Unitary · 组件示例与当前组件 API 同步
      </footer>
    </div>
  );
}
