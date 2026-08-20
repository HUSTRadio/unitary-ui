/**
 * Batch 2 — 组件 Section 区块的独立源码（Show code 折叠展开显示）。
 *
 * 结构：DEMO_CODE_SECTION_BATCH2[组件 slug][Section title] = 该 Section 的完整 TSX 源码。
 * key 与 docs-components-page.tsx 的 renderExtraSections 里 <Section title="..."> 一致（英文原文）。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 * 官方 prop 本地未实现的区块，源码诚实展示本地 API，不伪造官方 prop。
 *
 * 填充约定：
 * - 每段源码含 import + 该 Section 的完整用法（官方 demo 代码映射到本地 API）。
 * - 图标用 lucide-react（`import { X } from "lucide-react"`），不用 @vercel/geistcn-assets。
 * - key 用本地 Section 的英文 title（带空格/特殊字符时用双引号）。
 * - 需要状态时保留 useState / 组件函数包装；纯展示区块直接给 JSX 用法。
 */

export const DEMO_CODE_SECTION_BATCH2: Record<string, Record<string, string>> = {
  grid: {
    Grid: `import { Grid, GridSystem } from "@/components/ui/grid";

<GridSystem debug guideWidth={1} unstable_useContainer>
  <Grid columns={5} height="preserve-aspect-ratio" rows={2} />
</GridSystem>`,
    "Basic grid": `import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

<GridSystem guideWidth={1} unstable_useContainer>
  <Grid columns={3} rows={2}>
    {[1, 2, 3, 4, 5, 6].map((n) => (
      <GridCell key={n}>{n}</GridCell>
    ))}
  </Grid>
</GridSystem>`,
    "Solid cells": `import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

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
</GridSystem>`,
    "Responsive grid": `import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

<GridSystem unstable_useContainer>
  <Grid columns={{ sm: 1, md: 2, lg: 3 }} rows={{ sm: 6, md: 3, lg: 2 }}>
    {[1, 2, 3, 4, 5, 6].map((n) => (
      <GridCell key={n}>{n}</GridCell>
    ))}
  </Grid>
</GridSystem>`,
    "Responsive guide clipping": `import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

<GridSystem unstable_useContainer>
  <Grid columns={{ sm: 1, md: 2, lg: 3 }} rows={{ sm: 6, md: 3, lg: 2 }}>
    <GridCell column={{ sm: "1", md: "1/3" }} row={{ sm: "1/3", md: 1 }} solid>
      1 + 2
    </GridCell>
    <GridCell>3</GridCell>
    <GridCell>4</GridCell>
    <GridCell column={{ sm: 1, md: "1/3", lg: "2/4" }} row={{ sm: "5/7", md: 3, lg: 2 }} solid>
      5 + 6
    </GridCell>
  </Grid>
</GridSystem>`,
    "Hidden row guides": `import { Grid, GridSystem } from "@/components/ui/grid";

<GridSystem unstable_useContainer>
  <Grid columns={12} height="preserve-aspect-ratio" hideGuides="row" rows={3} />
</GridSystem>`,
    "Hidden column guides": `import { Grid, GridSystem } from "@/components/ui/grid";

<GridSystem unstable_useContainer>
  <Grid columns={12} height="preserve-aspect-ratio" hideGuides="column" rows={3} />
</GridSystem>`,
    "Overlaying cells": `import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

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
</GridSystem>`,
    "Specific guide clipping": `import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

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
</GridSystem>`,
    "Grid with cross": `import { Grid, GridCell, GridCross, GridSystem } from "@/components/ui/grid";

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
</GridSystem>`,
    "Dashed grid with cross": `import { Grid, GridCell, GridCross, GridSystem } from "@/components/ui/grid";

<GridSystem dashedGuides guideWidth={1} unstable_useContainer>
  <Grid columns={1} rows={1}>
    <GridCross column={1} row={1} />
    <GridCross column={2} row={2} />
    <GridCross column={2} row={1} />
    <GridCross column={1} row={2} />
    <GridCell>Content here</GridCell>
  </Grid>
</GridSystem>`,
    "Dashed grid with grid page": `import { Grid, GridCell, GridCross, GridPage, GridSystem } from "@/components/ui/grid";

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
</GridPage>`,
  },
  "json-view": {
    "Single line": `import { JsonView } from "@/components/ui/json-view";

const data = {
  foo: "bar",
};

<JsonView data={data} defaultExpandDepth={1} />`,
    Wrapped: `import { JsonView } from "@/components/ui/json-view";

const data = {
  browserApiUrl:
    "https://browser-api.vercel.sh/screenshot?url=https%3A%2F%2Fprocore-com-prod-f5vem4o6u-marketing-web-dev.vercel.app&width=1440&height=900&fullPage=true",
};

<JsonView data={data} defaultExpandDepth={1} />`,
    Collapsed: `import { JsonView } from "@/components/ui/json-view";

const data = {
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
};

<JsonView data={data} defaultExpandDepth={0} />`,
    Highlighted: `import { JsonView, makeJsonViewHighlightPattern } from "@/components/ui/json-view";

const data = {
  level: "error",
  requestId: "req_00042",
  deploymentId: "dpl_9WjH8QFQySx7",
  message: "Deployment request failed",
  statusCode: 500,
};

const highlightPattern = makeJsonViewHighlightPattern(["request", "failed"]);

<JsonView data={data} defaultExpandDepth={1} highlightPattern={highlightPattern} />`,
  },
  note: {
    Sizes: `import { Note, NoteContent } from "@/components/ui/note";

<div className="flex w-full flex-col gap-3">
  <Note size="small">
    <NoteContent>A small note.</NoteContent>
  </Note>
  <Note>
    <NoteContent>A medium note.</NoteContent>
  </Note>
</div>`,
    Action: `import { Button } from "@/components/ui/button";
import { Note, NoteAction, NoteContent } from "@/components/ui/note";

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
</div>`,
    Secondary: `import { Note, NoteContent } from "@/components/ui/note";

<div className="flex w-full flex-col gap-3">
  <Note variant="secondary">
    <NoteContent>This note details some secondary information.</NoteContent>
  </Note>
</div>`,
    Violet: `import { Note, NoteContent } from "@/components/ui/note";

<Note variant="violet">
  <NoteContent>This note details some violet information.</NoteContent>
</Note>`,
    Cyan: `import { Note, NoteContent } from "@/components/ui/note";

<Note variant="cyan">
  <NoteContent>This note details some cyan information.</NoteContent>
</Note>`,
    Disabled: `import { Button } from "@/components/ui/button";
import { Note, NoteAction, NoteContent } from "@/components/ui/note";

<div className="flex w-full flex-col gap-3">
  <Note disabled fill variant="warning">
    <NoteContent>This note details a warning.</NoteContent>
    <NoteAction>
      <Button typeName="button" size="small">
        Upgrade
      </Button>
    </NoteAction>
  </Note>
</div>`,
    Label: `import { Note, NoteContent, NoteLabel } from "@/components/ui/note";

<Note>
  <NoteContent>
    <NoteLabel>Region Change:</NoteLabel>Changing this region restarts all functions.
  </NoteContent>
</Note>`,
    "Custom icon": `import { Note, NoteContent } from "@/components/ui/note";
import { Sparkles } from "lucide-react";

<div className="flex w-full flex-col gap-3">
  <Note icon={<Sparkles className="size-4" aria-hidden />}>
    <NoteContent>A custom icon replaces the variant's default.</NoteContent>
  </Note>
  <Note icon={null}>
    <NoteContent>Pass a null icon to render no icon at all.</NoteContent>
  </Note>
</div>`,
  },
  progress: {
    "Custom max": `import { Progress } from "@/components/ui/progress";

<Progress value={30} max={40} aria-label="Progress 30 of 40" />`,
    "Dynamic colors": `import { Progress } from "@/components/ui/progress";

<Progress
  value={50}
  aria-label="Dynamic colors progress"
  colors={{
    0: "var(--color-gray-1000)",
    25: "var(--color-destructive)",
    50: "var(--color-warning)",
    75: "var(--color-pink-600)",
    100: "var(--color-progress)",
  }}
/>`,
    Themed: `import { Progress } from "@/components/ui/progress";

<div className="flex w-full max-w-md flex-col gap-6">
  <Progress type="success" value={100} aria-label="Success progress" />
  <Progress type="error" value={10} aria-label="Error progress" />
  <Progress type="warning" value={40} aria-label="Warning progress" />
  <Progress type="secondary" value={70} aria-label="Secondary progress" />
</div>`,
    "With Stops": `import { Progress } from "@/components/ui/progress";

<Progress
  value={30}
  type="success"
  aria-label="Progress with stops"
  stops={[
    { value: 10, tooltip: "10%" },
    { value: 20, tooltip: "20%" },
    { value: 30, tooltip: "30%" },
    { value: 40, tooltip: "40%" },
    { value: 50, tooltip: "50%" },
  ]}
/>`,
    Widths: `import { Progress } from "@/components/ui/progress";

<div className="flex w-full max-w-md flex-col gap-6">
  <Progress value={60} width={100} aria-label="Progress width 100" />
  <Progress value={60} width={200} aria-label="Progress width 200" />
  <Progress value={60} width={300} aria-label="Progress width 300" />
  <Progress value={60} width="50%" aria-label="Progress width 50%" />
  <Progress value={60} width="100%" aria-label="Progress full width" />
</div>`,
    Heights: `import { Progress } from "@/components/ui/progress";

<div className="flex w-full max-w-md flex-col gap-6">
  <Progress value={60} height={4} aria-label="Progress height 4" />
  <Progress value={60} height={10} aria-label="Progress height 10" />
  <Progress value={60} height={50} aria-label="Progress height 50" />
  <Progress value={60} height={200} aria-label="Progress height 200" />
</div>`,
    "Label Positions": `import { Progress } from "@/components/ui/progress";

<div className="flex w-full max-w-md flex-col gap-8">
  <Progress value={45} label="left" labelPosition="left" aria-label="Label left" />
  <Progress value={45} label="right" labelPosition="right" aria-label="Label right" />
  <Progress value={45} label="top-left" labelPosition="top-left" aria-label="Label top left" />
  <Progress value={45} label="top-center" labelPosition="top-center" aria-label="Label top center" />
  <Progress value={45} label="top-right" labelPosition="top-right" aria-label="Label top right" />
  <Progress value={45} label="bottom-left" labelPosition="bottom-left" aria-label="Label bottom left" />
  <Progress value={45} label="bottom-center" labelPosition="bottom-center" aria-label="Label bottom center" />
  <Progress value={45} label="bottom-right" labelPosition="bottom-right" aria-label="Label bottom right" />
</div>`,
    Dynamic: `import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const [value, setValue] = useState(40);

<div className="flex w-full max-w-md flex-col items-start gap-6">
  <Progress value={value} label={\`\${value}%\`} labelPosition="right" aria-label="Dynamic progress" />
  <div className="flex gap-2">
    <Button type="default" size="small" onClick={() => setValue((v) => Math.min(100, v + 10))}>
      Increase
    </Button>
    <Button type="secondary" size="small" onClick={() => setValue((v) => Math.max(0, v - 10))}>
      Decrease
    </Button>
  </div>
</div>`,
  },
  scroller: {
    Vertical: `import { Scroller } from "@/components/ui/scroller";

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
</div>`,
    Horizontal: `import { Scroller } from "@/components/ui/scroller";

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
</div>`,
    Free: `import { Scroller } from "@/components/ui/scroller";

<div className="w-full max-w-2xl">
  <Scroller height={220} overflow="both" width="100%">
    <div className="grid grid-flow-col grid-rows-2 gap-4">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-96 w-96 bg-gray-1000" />
      ))}
    </div>
  </Scroller>
</div>`,
    "Vertical with buttons": `import { Scroller } from "@/components/ui/scroller";

<div className="flex max-w-full flex-col gap-4">
  <Scroller childrenContainerClassName="gap-4" height={220} overflow="y" withButtons>
    {Array.from({ length: 4 }, (_, i) => (
      <div key={i} className="h-60 w-96 shrink-0 bg-gray-1000" />
    ))}
  </Scroller>
</div>`,
    "Horizontal with buttons": `import { Scroller } from "@/components/ui/scroller";

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
</div>`,
  },
};
