import {
  Accessibility,
  Blocks,
  Sparkles,
  Triangle,
  Type,
  Wind,
  type LucideIcon,
} from "lucide-react";

import { DocsCardGrid } from "./docs-cards";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/**
 * 文档站页面组件（docs/geist 专用）。
 * Introduction 首页 + Colors / Typography / Materials / Brands 内容页。
 * 内容值均提取自 docs/geist-markdown-refs/ 快照（2026-08-08 抓取），禁止凭记忆写值。
 */

/** Introduction — Geist 文档站首页：H1 + 副标题 + 发丝线卡片网格 */
export function IntroductionPage() {
  return (
    <div>
      <h1 className="text-heading-40 text-foreground">Geist Style Framework</h1>
      <p className="mt-3 max-w-xl text-copy-16 text-muted-foreground">
        Vercel design system for building consistent web experiences.
      </p>
      <DocsCardGrid className="mt-10" />
    </div>
  );
}

/* ================= Colors ================= */

/**
 * 色阶数据 — 提取自 colors.md 快照「完整色板（Dark 主题）」。
 * 每色取 100/300/500/700/900/1000 六个关键档；700 档在 Dark/Light 双主题下同值。
 */
interface ColorStep {
  step: number;
  hex: string;
}

interface ColorScale {
  name: string;
  steps: ColorStep[];
}

const COLOR_SCALES: ColorScale[] = [
  {
    name: "gray",
    steps: [
      { step: 100, hex: "#1a1a1a" },
      { step: 300, hex: "#292929" },
      { step: 500, hex: "#454545" },
      { step: 700, hex: "#8f8f8f" },
      { step: 900, hex: "#a1a1a1" },
      { step: 1000, hex: "#ededed" },
    ],
  },
  {
    name: "blue",
    steps: [
      { step: 100, hex: "#0f1e2e" },
      { step: 300, hex: "#153058" },
      { step: 500, hex: "#0d4a89" },
      { step: 700, hex: "#006efe" },
      { step: 900, hex: "#5ea2ff" },
      { step: 1000, hex: "#f5faff" },
    ],
  },
  {
    name: "red",
    steps: [
      { step: 100, hex: "#2a1314" },
      { step: 300, hex: "#561920" },
      { step: 500, hex: "#82202b" },
      { step: 700, hex: "#e5484d" },
      { step: 900, hex: "#ff6369" },
      { step: 1000, hex: "#fdf2f4" },
    ],
  },
  {
    name: "amber",
    steps: [
      { step: 100, hex: "#291a00" },
      { step: 300, hex: "#4d2600" },
      { step: 500, hex: "#70400b" },
      { step: 700, hex: "#ffb224" },
      { step: 900, hex: "#ff9a00" },
      { step: 1000, hex: "#fff6e8" },
    ],
  },
  {
    name: "green",
    steps: [
      { step: 100, hex: "#0d220f" },
      { step: 300, hex: "#143617" },
      { step: 500, hex: "#1d6329" },
      { step: 700, hex: "#46a758" },
      { step: 900, hex: "#6fe28d" },
      { step: 1000, hex: "#ecfdf0" },
    ],
  },
  {
    name: "teal",
    steps: [
      { step: 100, hex: "#04221d" },
      { step: 300, hex: "#073b33" },
      { step: 500, hex: "#0d5e55" },
      { step: 700, hex: "#17a693" },
      { step: 900, hex: "#12b5a1" },
      { step: 1000, hex: "#ecfbf5" },
    ],
  },
  {
    name: "purple",
    steps: [
      { step: 100, hex: "#201527" },
      { step: 300, hex: "#3d2050" },
      { step: 500, hex: "#5b2d78" },
      { step: 700, hex: "#8e4ec6" },
      { step: 900, hex: "#c57df0" },
      { step: 1000, hex: "#f8effc" },
    ],
  },
  {
    name: "pink",
    steps: [
      { step: 100, hex: "#2a1520" },
      { step: 300, hex: "#4b1c30" },
      { step: 500, hex: "#6e1e3c" },
      { step: 700, hex: "#e93d82" },
      { step: 900, hex: "#ff66ad" },
      { step: 1000, hex: "#fdf1f7" },
    ],
  },
];

/** 语义 token — Light/Dark 值取自框架 src/styles/index.css 实际定义（与快照色阶同源） */
interface SemanticToken {
  token: string;
  light: string;
  dark: string;
}

const SEMANTIC_TOKENS: SemanticToken[] = [
  { token: "background", light: "#ffffff", dark: "#0a0a0a" },
  { token: "foreground", light: "#171717", dark: "#ededed" },
  { token: "muted-foreground", light: "#4d4d4d", dark: "#a1a1a1" },
  { token: "border", light: "#ebebeb", dark: "#2e2e2e" },
  { token: "ring", light: "#171717", dark: "#ededed" },
  { token: "primary", light: "#171717", dark: "#ededed" },
  { token: "destructive", light: "#e5484d", dark: "#e5484d" },
  { token: "success", light: "#46a758", dark: "#46a758" },
  { token: "warning", light: "#ffb224", dark: "#ffb224" },
];

/** Colors — 色阶网格 + 语义 token 表 */
export function ColorsPage() {
  return (
    <div>
      <h1 className="text-heading-40 text-foreground">Colors</h1>
      <p className="mt-3 max-w-xl text-copy-16 text-muted-foreground">
        A high contrast, accessible color system.
      </p>

      {/* 色阶网格 — 8 色 × 关键档（值：colors.md 快照 Dark 主题） */}
      <section className="mt-10">
        <h2 className="text-heading-24 text-foreground">Scales</h2>
        <p className="mt-2 max-w-xl text-copy-14 text-muted-foreground">
          色值提取自 colors.md 快照「完整色板（Dark 主题）」，每色取
          100/300/500/700/900/1000 关键档。
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-8">
          {COLOR_SCALES.map((scale) => (
            <div key={scale.name} className="min-w-0">
              <p className="mb-2 text-label-14 font-medium text-foreground">{scale.name}</p>
              <ul className="space-y-2">
                {scale.steps.map((s) => (
                  <li key={s.step} className="overflow-hidden rounded-md">
                    <div className="h-10 w-full" style={{ backgroundColor: s.hex }} />
                    <div className="flex items-center justify-between border border-t-0 border-gray-alpha-400 bg-background px-2 py-1">
                      <span className="text-label-12 text-muted-foreground">{s.step}</span>
                      <span className="font-mono text-label-12 text-foreground">{s.hex}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 语义 token 表 */}
      <section className="mt-12">
        <h2 className="text-heading-24 text-foreground">Semantic Tokens</h2>
        <p className="mt-2 max-w-xl text-copy-14 text-muted-foreground">
          shadcn/ui alias roles 映射到框架语义 token，业务状态绑定语义 token、不直接使用原始色阶。
        </p>
        <div className="mt-6 max-w-2xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Light</TableHead>
                <TableHead>Dark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SEMANTIC_TOKENS.map((t) => (
                <TableRow key={t.token}>
                  <TableCell className="font-mono text-foreground">{t.token}</TableCell>
                  <TableCell>
                    <SwatchCell hex={t.light} />
                  </TableCell>
                  <TableCell>
                    <SwatchCell hex={t.dark} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}

/** 表格内色块 + hex 标注 */
function SwatchCell({ hex }: { hex: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="size-4 shrink-0 rounded-sm border border-gray-alpha-400"
        style={{ backgroundColor: hex }}
        aria-hidden
      />
      <span className="font-mono text-copy-13 text-foreground">{hex}</span>
    </span>
  );
}

/* ================= Typography ================= */

/** 排版类实例数据 — 类名与示例文案提取自 typography.md 快照 */
interface TypeSpecimen {
  className: string;
  label: string;
  /** 示例文案；含 <strong> 的用 Subtle/Strong 修饰（与快照一致） */
  sample: string;
  mono?: boolean;
}

const HEADING_SPECIMENS: TypeSpecimen[] = [
  { className: "text-heading-72", label: "Heading 72", sample: "Heading 72" },
  { className: "text-heading-64", label: "Heading 64", sample: "Heading 64" },
  { className: "text-heading-56", label: "Heading 56", sample: "Heading 56" },
  { className: "text-heading-48", label: "Heading 48", sample: "Heading 48" },
  { className: "text-heading-40", label: "Heading 40", sample: "Heading 40" },
  { className: "text-heading-32", label: "Heading 32 with Subtle", sample: "Heading 32 with <strong>Subtle</strong>" },
  { className: "text-heading-24", label: "Heading 24 with Subtle", sample: "Heading 24 with <strong>Subtle</strong>" },
  { className: "text-heading-20", label: "Heading 20 with Subtle", sample: "Heading 20 with <strong>Subtle</strong>" },
  { className: "text-heading-16", label: "Heading 16 with Subtle", sample: "Heading 16 with <strong>Subtle</strong>" },
  { className: "text-heading-14", label: "Heading 14", sample: "Heading 14" },
];

const LABEL_SPECIMENS: TypeSpecimen[] = [
  { className: "text-label-20", label: "Label 20", sample: "Label 20" },
  { className: "text-label-18", label: "Label 18", sample: "Label 18" },
  { className: "text-label-16", label: "Label 16 with Strong", sample: "Label 16 with <strong>Strong</strong>" },
  { className: "text-label-14", label: "Label 14 with Strong", sample: "Label 14 with <strong>Strong</strong>" },
  { className: "text-label-14-mono", label: "Label 14 Mono", sample: "Label 14 Mono", mono: true },
  { className: "text-label-13", label: "Label 13 with Strong, and Tabular (123)", sample: "Label 13 with <strong>Strong</strong>, and Tabular (123)" },
  { className: "text-label-13-mono", label: "Label 13 Mono", sample: "Label 13 Mono", mono: true },
  { className: "text-label-12", label: "Label 12 with Strong, AND CAPS", sample: "Label 12 with <strong>Strong</strong>, AND CAPS" },
  { className: "text-label-12-mono", label: "Label 12 Mono", sample: "Label 12 Mono", mono: true },
];

const COPY_SPECIMENS: TypeSpecimen[] = [
  { className: "text-copy-24", label: "Copy 24 with Strong", sample: "Copy 24 with <strong>Strong</strong>" },
  { className: "text-copy-20", label: "Copy 20 with Strong", sample: "Copy 20 with <strong>Strong</strong>" },
  { className: "text-copy-18", label: "Copy 18 with Strong", sample: "Copy 18 with <strong>Strong</strong>" },
  { className: "text-copy-16", label: "Copy 16 with Strong", sample: "Copy 16 with <strong>Strong</strong>" },
  { className: "text-copy-14", label: "Copy 14 with Strong", sample: "Copy 14 with <strong>Strong</strong>" },
  { className: "text-copy-13", label: "Copy 13", sample: "Copy 13" },
  { className: "text-copy-13-mono", label: "Copy 13 Mono", sample: "Copy 13 Mono", mono: true },
];

/** 渲染实例文本（支持 <strong> 修饰） */
function renderSample(sample: string) {
  // 快照中仅 Strong/Subtle 使用 <strong>，此处按样例拆分渲染
  const parts = sample.split(/<strong>(.*?)<\/strong>/g);
  return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

/** Typography — heading / label / copy / button 排版类实例 */
export function TypographyPage() {
  return (
    <div>
      <h1 className="text-heading-40 text-foreground">Typography</h1>
      <p className="mt-3 max-w-xl text-copy-16 text-muted-foreground">
        Rules of typesetting throughout the system.
      </p>

      {/* Headings */}
      <section className="mt-10">
        <h2 className="text-heading-24 text-foreground">Headings</h2>
        <p className="mt-2 max-w-xl text-copy-14 text-muted-foreground">
          Used to introduce pages or sections.
        </p>
        <ul className="mt-6 space-y-4">
          {HEADING_SPECIMENS.map((s) => (
            <SpecimenRow key={s.className} specimen={s} />
          ))}
        </ul>
      </section>

      {/* Buttons */}
      <section className="mt-12">
        <h2 className="text-heading-24 text-foreground">Buttons</h2>
        <p className="mt-2 max-w-xl text-copy-14 text-muted-foreground">
          Only to be used within components that render buttons.
        </p>
        <ul className="mt-6 space-y-4">
          <SpecimenRow
            specimen={{ className: "text-button-16", label: "Button 16", sample: "Button 16" }}
            renderAsButton
          />
          <SpecimenRow
            specimen={{ className: "text-button-14", label: "Button 14", sample: "Button 14" }}
            renderAsButton
          />
          <SpecimenRow
            specimen={{
              className: "text-button-12",
              label: "Button 12",
              sample: "Button 12",
            }}
            renderAsButton
          />
        </ul>
      </section>

      {/* Label */}
      <section className="mt-12">
        <h2 className="text-heading-24 text-foreground">Label</h2>
        <p className="mt-2 max-w-xl text-copy-14 text-muted-foreground">
          Designed for single-lines, and given ample line-height for highlighting &amp; marrying
          up with icons.
        </p>
        <ul className="mt-6 space-y-4">
          {LABEL_SPECIMENS.map((s) => (
            <SpecimenRow key={s.className} specimen={s} />
          ))}
        </ul>
      </section>

      {/* Copy */}
      <section className="mt-12">
        <h2 className="text-heading-24 text-foreground">Copy</h2>
        <p className="mt-2 max-w-xl text-copy-14 text-muted-foreground">
          Designed for multiple lines of text, having a higher line height than Label.
        </p>
        <ul className="mt-6 space-y-4">
          {COPY_SPECIMENS.map((s) => (
            <SpecimenRow key={s.className} specimen={s} />
          ))}
        </ul>
        <p className="mt-4 max-w-xl text-copy-13 text-muted-foreground">
          缺口：快照仅定义 copy 的 13 Mono 变体（text-copy-13-mono）；text-copy-14-mono 等其余
          mono 变体在框架中不存在，需新增时在 index.css 补 @utility。
        </p>
      </section>
    </div>
  );
}

/** 单行排版实例：左侧类名标注 + 右侧实例文本（button 类渲染在真实按钮内） */
function SpecimenRow({
  specimen,
  renderAsButton,
}: {
  specimen: TypeSpecimen;
  renderAsButton?: boolean;
}) {
  const { className, sample } = specimen;
  return (
    <li className="flex flex-col gap-2 border-b border-gray-alpha-400 pb-4 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-6">
      <code className="w-44 shrink-0 font-mono text-label-12 text-muted-foreground">
        {className}
      </code>
      {renderAsButton ? (
        // button 类仅在按钮内部使用：类挂在按钮内层 span 上，
        // 避免与 Button cva 的 text-[length:14px] 冲突
        <Button type="button" variant="outline" size="default">
          <span className={className}>{renderSample(sample)}</span>
        </Button>
      ) : (
        <span className={cn("text-foreground", className)}>{renderSample(sample)}</span>
      )}
    </li>
  );
}

/* ================= Materials ================= */

/** 材质数据 — 类名 / 圆角 / 用途提取自 materials.md 快照；z-index 为框架浮层约定 */
interface MaterialSpec {
  className: string;
  name: string;
  radius: string;
  usage: string;
  /** 表面材质在文档流内（auto）；浮层材质对齐框架 z-50 弹层带（同 dropdown/select） */
  zIndex: string;
}

const MATERIALS: MaterialSpec[] = [
  {
    className: "material-base",
    name: "Base",
    radius: "6px",
    usage: "Everyday use. Radius 6px.",
    zIndex: "auto（文档流内）",
  },
  {
    className: "material-small",
    name: "Small",
    radius: "6px",
    usage: "Slightly raised. Radius 6px.",
    zIndex: "auto（文档流内）",
  },
  {
    className: "material-medium",
    name: "Medium",
    radius: "12px",
    usage: "Further raised. Radius 12px.",
    zIndex: "auto（文档流内）",
  },
  {
    className: "material-large",
    name: "Large",
    radius: "12px",
    usage: "Further raised. Radius 12px.",
    zIndex: "auto（文档流内）",
  },
  {
    className: "material-tooltip",
    name: "Tooltip",
    radius: "6px",
    usage: "Lightest shadow. Corner 6px. Tooltips will be the only floating element with a triangular stem.",
    zIndex: "50（浮层，同 dropdown/select）",
  },
  {
    className: "material-menu",
    name: "Menu",
    radius: "12px",
    usage: "Lift from page. Radius 12px.",
    zIndex: "50（浮层，同 dropdown/select）",
  },
  {
    className: "material-modal",
    name: "Modal",
    radius: "12px",
    usage: "Further lift. Radius 12px.",
    zIndex: "50（浮层，同 dropdown/select）",
  },
  {
    className: "material-fullscreen",
    name: "Fullscreen",
    radius: "16px",
    usage: "Biggest lift. Radius 16px.",
    zIndex: "50（浮层，同 dropdown/select）",
  },
];

/** Materials — 8 级材质方块（surface 4 级 + floating 4 级） */
export function MaterialsPage() {
  return (
    <div>
      <h1 className="text-heading-40 text-foreground">Materials</h1>
      <p className="mt-3 max-w-xl text-copy-16 text-muted-foreground">
        Presets for radii, fills, strokes, and shadows.
      </p>

      <p className="mt-6 max-w-xl text-copy-14 text-muted-foreground">
        Surface — on the page. Floating — above the page. 每个方块应用对应
        material-* 类，标注圆角、用途与 z-index 层级。
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {MATERIALS.map((m) => (
          <div key={m.className} className="min-w-0">
            <div className={cn(m.className, "h-32 w-full")} aria-hidden />
            <p className="mt-3 text-label-14 font-medium text-foreground">{m.name}</p>
            <p className="mt-1 text-copy-13 text-muted-foreground">{m.usage}</p>
            <dl className="mt-2 space-y-1">
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-label-12 text-muted-foreground">Class</dt>
                <dd className="font-mono text-label-12 text-foreground">{m.className}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-label-12 text-muted-foreground">Radius</dt>
                <dd className="text-label-12 text-foreground">{m.radius}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-label-12 text-muted-foreground">z-index</dt>
                <dd className="text-label-12 text-foreground">{m.zIndex}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= Brands ================= */

/** 技术栈品牌数据 — 本框架实际依赖，非官方 Vercel/Next.js 品牌 */
interface BrandCard {
  name: string;
  role: string;
  description: string;
  icon: LucideIcon;
}

const BRAND_CARDS: BrandCard[] = [
  {
    name: "Vercel Geist",
    role: "设计基准",
    description: "视觉系统与快照来源：docs/geist-markdown-refs/ 下的官方页面抓取（2026-08-08）。",
    icon: Triangle,
  },
  {
    name: "shadcn/ui",
    role: "组件基础",
    description: "New York style 元件结构 + components.json 注册；根 src/components/ui 全部组件由此派生。",
    icon: Blocks,
  },
  {
    name: "Radix UI",
    role: "行为原语",
    description: "无障碍交互层：下拉、选择等键盘/焦点/ARIA 行为由 radix-ui 提供。",
    icon: Accessibility,
  },
  {
    name: "Tailwind CSS v4",
    role: "原子化 CSS",
    description: "@theme 定义设计 token，@source 扫描源码生成工具类。",
    icon: Wind,
  },
  {
    name: "lucide-react",
    role: "图标库",
    description: "1px stroke 线性图标；文档站与组件内图标统一从这里取。",
    icon: Sparkles,
  },
  {
    name: "HarmonyOS Sans SC + Maple Mono",
    role: "字体",
    description: "自托管 woff2（public/）+ @fontsource；--font-sans / --font-mono 双栈。",
    icon: Type,
  },
];

/** Brands — 本框架技术栈品牌卡片 */
export function BrandsPage() {
  return (
    <div>
      <h1 className="text-heading-40 text-foreground">Brands</h1>
      <p className="mt-3 max-w-xl text-copy-16 text-muted-foreground">
        The tech stack behind this framework.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {BRAND_CARDS.map((brand) => {
          const Icon = brand.icon;
          return (
            <div
              key={brand.name}
              className="material-base p-5 transition-colors hover:bg-gray-alpha-100"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-gray-alpha-400 bg-background text-foreground">
                  <Icon className="size-4" strokeWidth={1.5} aria-hidden />
                </span>
                <div className="min-w-0">
                  <h3 className="text-label-16 font-medium text-foreground">{brand.name}</h3>
                  <p className="text-label-12 text-muted-foreground">{brand.role}</p>
                </div>
              </div>
              <p className="mt-3 text-copy-13 text-muted-foreground">{brand.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
