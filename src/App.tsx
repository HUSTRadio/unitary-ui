import { useState } from "react";
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

/** Living styleguide — 展示框架全部基础组件 + 双主题切换。 */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-heading-24 text-foreground">{title}</h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

export default function App() {
  const [checked, setChecked] = useState(true);
  const [toggled, setToggled] = useState(true);
  const [segment, setSegment] = useState("all");
  const [tab, setTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border px-6">
        <h1 className="text-heading-20 text-foreground">Geist Style Framework</h1>
        <div className="flex items-center gap-3">
          <span className="text-label-14 text-muted-foreground">组件库示例</span>
          <ThemeSwitch />
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-10 px-6 py-10">
        {/* 排版 */}
        <section className="space-y-3">
          <h2 className="text-heading-24 text-foreground">排版 Typography</h2>
          <p className="text-copy-14 text-muted-foreground">
            完整排版类见 <code className="font-mono">src/styles/index.css</code> 与{" "}
            <code className="font-mono">docs/geist/foundations/typography.md</code>
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
          <Button variant="secondary">次要</Button>
          <Button variant="outline">描边</Button>
          <Button variant="ghost">幽灵</Button>
          <Button variant="destructive">危险</Button>
          <Button size="sm">小号</Button>
          <Button size="lg">大号</Button>
          <Button prefix={<Plus className="size-4" aria-hidden />}>带图标</Button>
          <Button loading>加载中</Button>
          <Button disabled>禁用</Button>
        </Section>

        {/* 表单 */}
        <Section title="Input / Textarea / Select / Checkbox / Toggle">
          <div className="w-56">
            <Input placeholder="搜索资产…" aria-label="示例输入" />
          </div>
          <div className="w-56">
            <Input placeholder="带图标的搜索" defaultValue="带图标" aria-label="示例输入带图标" />
          </div>
          <div className="w-56">
            <Select>
              <SelectTrigger aria-label="示例选择">
                <SelectValue placeholder="选择类别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="office">办公设备</SelectItem>
                <SelectItem value="instrument">仪器设备</SelectItem>
                <SelectItem value="comms">通信设备</SelectItem>
              </SelectContent>
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

        {/* 分段控件 */}
        <Section title="SegmentedControl">
          <SegmentedControl
            options={[
              { value: "all", label: "全部" },
              { value: "available", label: "可出借" },
              { value: "borrowed", label: "借出中" },
            ]}
            value={segment}
            onValueChange={setSegment}
            ariaLabel="筛选状态"
          />
        </Section>

        {/* Tabs */}
        <Section title="Tabs">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList aria-label="示例标签页">
              <TabsTrigger value="overview">概览</TabsTrigger>
              <TabsTrigger value="details">详情</TabsTrigger>
              <TabsTrigger value="history">历史</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-4 text-copy-14 text-muted-foreground">
              概览内容
            </TabsContent>
            <TabsContent value="details" className="pt-4 text-copy-14 text-muted-foreground">
              详情内容
            </TabsContent>
            <TabsContent value="history" className="pt-4 text-copy-14 text-muted-foreground">
              历史内容
            </TabsContent>
          </Tabs>
        </Section>

        {/* Badge / StepPoint */}
        <Section title="Badge / StepPoint">
          <Badge>默认</Badge>
          <Badge variant="secondary">次要</Badge>
          <Badge variant="success">成功</Badge>
          <Badge variant="info">信息</Badge>
          <Badge variant="warning">警告</Badge>
          <Badge variant="danger">危险</Badge>
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
                    <Button variant="ghost" size="sm">
                      查看
                    </Button>
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
          <div className="material-medium p-4 text-label-14 text-foreground">material-medium</div>
          <div className="material-large p-4 text-label-14 text-foreground">material-large</div>
        </Section>
      </main>

      <footer className="border-t border-border px-6 py-4 text-label-12 text-muted-foreground">
        Geist Style Framework · docs/geist 规范快照 · 2026-08-08
      </footer>
    </div>
  );
}
