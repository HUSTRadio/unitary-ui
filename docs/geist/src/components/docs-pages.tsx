import { useEffect, useState } from "react";

import { DocsCardGrid } from "./docs-cards";
import {
  DocsList,
  DocsPageLead,
  DocsPageTitle,
  DocsParagraph,
  DocsSection,
  DocsSectionTitle,
} from "./docs-typography";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/utils";
import { FOUNDATION_COLOR_SCALES, type FoundationColor } from "../data/foundation-colors";
import { useLanguage } from "../i18n/language";
import { demoText } from "../i18n/components-demo";

/**
 * 文档站页面组件（docs/geist 专用）。
 * Introduction 首页 + Colors / Typography / Materials 内容页。
 * 内容值均提取自 docs/geist-markdown-refs/ 快照（2026-08-08 抓取），禁止凭记忆写值。
 */

/** Introduction — Geist 文档站首页：H1 + 副标题 + 发丝线卡片网格 */
export function IntroductionPage() {
  const { language } = useLanguage();
  return (
    <div className="relative">
      {/* 背景网格：复刻 vercel.com/geist/introduction — 9×2 细线网格，角落十字准星 */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,var(--color-gray-alpha-200)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-gray-alpha-200)_1px,transparent_1px)] [background-size:4rem_4rem]" />
        {/* 角落十字准星 */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-gray-alpha-300" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-gray-alpha-300" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-gray-alpha-300" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-gray-alpha-300" />
      </div>
      <DocsPageTitle>Unitary</DocsPageTitle>
      <DocsPageLead className="max-w-xl">
        {demoText(language, "Vercel design system for building consistent web experiences.")}
      </DocsPageLead>
      <div className="mt-3 text-label-14">
        <Link href="gh:HUSTRadio/unitary-ui">
          {demoText(language, "GitHub Repository")}
        </Link>
      </div>
      <DocsCardGrid className="mt-10" />
    </div>
  );
}

/* ================= Colors ================= */

const FOUNDATION_COLORS = FOUNDATION_COLOR_SCALES.flatMap((scale) => scale.steps);

function readComputedColor(token: FoundationColor["token"]) {
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}

function readFoundationColorValues() {
  return Object.fromEntries(
    FOUNDATION_COLORS.map((color) => [color.token, readComputedColor(color.token)]),
  );
}

function useFoundationColorValues() {
  const [values, setValues] = useState(readFoundationColorValues);

  useEffect(() => {
    const syncValues = () => setValues(readFoundationColorValues());
    const observer = new MutationObserver(syncValues);

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return [values, () => setValues(readFoundationColorValues())] as const;
}

/** Colors — current theme token values, rendered from CSS custom properties. */
export function ColorsPage() {
  const { language } = useLanguage();
  const [values, syncValues] = useFoundationColorValues();
  const [copyStatus, setCopyStatus] = useState("");

  const copyColor = async (token: FoundationColor["token"]) => {
    const value = readComputedColor(token);
    syncValues();

    if (!value || !navigator.clipboard?.writeText) {
      setCopyStatus("Unable to copy color value.");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus("Copied color value.");
    } catch {
      setCopyStatus("Unable to copy color value.");
    }
  };

  return (
    <div>
      <DocsPageTitle>{demoText(language, "Colors")}</DocsPageTitle>
      <DocsPageLead className="max-w-xl">
        {demoText(language, "A high contrast, accessible color system.")}
      </DocsPageLead>

      <DocsSection>
        <DocsSectionTitle>{demoText(language, "Scales")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {demoText(language, "There are 10 color scales in the system. Each swatch shows the current theme value and can be copied.")}
        </DocsParagraph>
        <p className="sr-only" role="status" aria-live="polite">
          {copyStatus}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {FOUNDATION_COLOR_SCALES.map((scale) => (
            <PaletteColumn
              key={scale.label}
              scale={scale}
              values={values}
              onCopy={copyColor}
            />
          ))}
        </div>
      </DocsSection>

      <DocsSection>
        <DocsSectionTitle>{demoText(language, "Backgrounds")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {demoText(
            language,
            "There are two background colors for pages and UI components. In most instances, use Background 1—especially when color is placed on top of the background. Use Background 2 sparingly when subtle differentiation is needed.",
          )}
        </DocsParagraph>
        <DocsList className="list-disc pl-5">
          <li>{demoText(language, "Background 1 — Default element background")}</li>
          <li>{demoText(language, "Background 2 — Secondary background")}</li>
        </DocsList>
      </DocsSection>
    </div>
  );
}

function PaletteColumn({
  scale,
  values,
  onCopy,
}: {
  scale: (typeof FOUNDATION_COLOR_SCALES)[number];
  values: Record<string, string>;
  onCopy: (token: FoundationColor["token"]) => Promise<void>;
}) {
  return (
    <div className="min-w-0">
      <p className="text-label-14 font-medium text-foreground">{scale.label}</p>
      <p className="mt-1 text-copy-13 text-muted-foreground">{scale.usage}</p>
      <ul className="mt-2 space-y-2">
        {scale.steps.map((color) => (
          <li key={color.token} className="overflow-hidden rounded-md">
            <button
              type="button"
              data-color-token={color.token}
              onClick={() => void onCopy(color.token)}
              className="focus-ring block w-full overflow-hidden border border-gray-alpha-400 text-left"
            >
              <span
                className="block h-10 w-full"
                style={{ backgroundColor: `var(${color.token})` }}
                aria-hidden
              />
              <span className="flex flex-col gap-0.5 bg-background px-2 py-1">
                <span className="flex items-center justify-between text-label-12 text-muted-foreground">
                  <span>{color.step}</span>
                  <span className="font-mono">{color.token}</span>
                </span>
                <span className="font-mono text-label-12 text-foreground">{values[color.token] || "—"}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
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
  {
    className: "text-heading-32",
    label: "Heading 32 with Subtle",
    sample: "Heading 32 with <strong>Subtle</strong>",
  },
  {
    className: "text-heading-24",
    label: "Heading 24 with Subtle",
    sample: "Heading 24 with <strong>Subtle</strong>",
  },
  {
    className: "text-heading-20",
    label: "Heading 20 with Subtle",
    sample: "Heading 20 with <strong>Subtle</strong>",
  },
  {
    className: "text-heading-16",
    label: "Heading 16 with Subtle",
    sample: "Heading 16 with <strong>Subtle</strong>",
  },
  { className: "text-heading-14", label: "Heading 14", sample: "Heading 14" },
];

const LABEL_SPECIMENS: TypeSpecimen[] = [
  { className: "text-label-20", label: "Label 20", sample: "Label 20" },
  { className: "text-label-18", label: "Label 18", sample: "Label 18" },
  {
    className: "text-label-16",
    label: "Label 16 with Strong",
    sample: "Label 16 with <strong>Strong</strong>",
  },
  {
    className: "text-label-14",
    label: "Label 14 with Strong",
    sample: "Label 14 with <strong>Strong</strong>",
  },
  { className: "text-label-14-mono", label: "Label 14 Mono", sample: "Label 14 Mono", mono: true },
  {
    className: "text-label-13",
    label: "Label 13 with Strong, and Tabular (123)",
    sample: "Label 13 with <strong>Strong</strong>, and Tabular (123)",
  },
  { className: "text-label-13-mono", label: "Label 13 Mono", sample: "Label 13 Mono", mono: true },
  {
    className: "text-label-12",
    label: "Label 12 with Strong, AND CAPS",
    sample: "Label 12 with <strong>Strong</strong>, AND CAPS",
  },
  { className: "text-label-12-mono", label: "Label 12 Mono", sample: "Label 12 Mono", mono: true },
];

const COPY_SPECIMENS: TypeSpecimen[] = [
  {
    className: "text-copy-24",
    label: "Copy 24 with Strong",
    sample: "Copy 24 with <strong>Strong</strong>",
  },
  {
    className: "text-copy-20",
    label: "Copy 20 with Strong",
    sample: "Copy 20 with <strong>Strong</strong>",
  },
  {
    className: "text-copy-18",
    label: "Copy 18 with Strong",
    sample: "Copy 18 with <strong>Strong</strong>",
  },
  {
    className: "text-copy-16",
    label: "Copy 16 with Strong",
    sample: "Copy 16 with <strong>Strong</strong>",
  },
  {
    className: "text-copy-14",
    label: "Copy 14 with Strong",
    sample: "Copy 14 with <strong>Strong</strong>",
  },
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
  const { language } = useLanguage();
  return (
    <div>
      <DocsPageTitle>{demoText(language, "Typography")}</DocsPageTitle>
      <DocsPageLead className="max-w-xl">
        {demoText(language, "Rules of typesetting throughout the system.")}
      </DocsPageLead>

      {/* Fonts — 项目内置字体展示：一个字体一行，动态字号防溢出（clamp） */}
      <DocsSection>
        <DocsSectionTitle>{demoText(language, "Fonts")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {demoText(
            language,
            "Three typefaces are bundled and subsetted into the framework: the default UI face, a Chinese-capable sans, and a mono for code.",
          )}
        </DocsParagraph>
        <ul className="mt-6 divide-y divide-gray-alpha-400">
          {/* OPPO Sans 4.0 — 默认 UI 字体（--font-sans 首选） */}
          <li className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8">
            <code className="w-52 shrink-0 font-mono text-label-12 text-muted-foreground">
              OPPO Sans 4.0
            </code>
            <span
              className="truncate text-foreground"
              style={{ fontFamily: '"OPPO Sans 4.0", sans-serif', fontSize: "clamp(1.25rem, 3vw, 2rem)", lineHeight: 1.2, letterSpacing: "-0.02em" }}
            >
              {demoText(language, "敏捷开发，Unitary 设计系统。")}
            </span>
          </li>
          {/* HarmonyOS Sans SC — 中文无衬线（--font-sans 中文兜底） */}
          <li className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8">
            <code className="w-52 shrink-0 font-mono text-label-12 text-muted-foreground">
              HarmonyOS Sans SC
            </code>
            <span
              className="truncate text-foreground"
              style={{ fontFamily: '"HarmonyOS Sans SC", "HarmonyOS Sans SC Subset", sans-serif', fontSize: "clamp(1.25rem, 3vw, 2rem)", lineHeight: 1.2, letterSpacing: "-0.02em" }}
            >
              {demoText(language, "设计出极致的美，简而有道。")}
            </span>
          </li>
          {/* JetBrains Maple Mono — 等宽（--font-mono 首选） */}
          <li className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8">
            <code className="w-52 shrink-0 font-mono text-label-12 text-muted-foreground">
              JetBrains Maple Mono
            </code>
            <span
              className="truncate font-mono text-foreground"
              style={{ fontSize: "clamp(1.125rem, 2.5vw, 1.75rem)", lineHeight: 1.25, letterSpacing: "-0.02em" }}
            >
              {demoText(language, "const unitary = await design()")}
            </span>
          </li>
        </ul>
      </DocsSection>

      {/* Headings */}
      <DocsSection>
        <DocsSectionTitle>{demoText(language, "Headings")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">{demoText(language, "Used to introduce pages or sections.")}</DocsParagraph>
        <ul className="mt-6 space-y-4">
          {HEADING_SPECIMENS.map((s) => (
            <SpecimenRow key={s.className} specimen={s} />
          ))}
        </ul>
      </DocsSection>

      {/* Buttons */}
      <DocsSection>
        <DocsSectionTitle>{demoText(language, "Buttons")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {demoText(language, "Only to be used within components that render buttons.")}
        </DocsParagraph>
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
      </DocsSection>

      {/* Label */}
      <DocsSection>
        <DocsSectionTitle>{demoText(language, "Label")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {demoText(
            language,
            "Designed for single-lines, and given ample line-height for highlighting & marrying up with icons.",
          )}
        </DocsParagraph>
        <ul className="mt-6 space-y-4">
          {LABEL_SPECIMENS.map((s) => (
            <SpecimenRow key={s.className} specimen={s} />
          ))}
        </ul>
      </DocsSection>

      {/* Copy */}
      <DocsSection>
        <DocsSectionTitle>{demoText(language, "Copy")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {demoText(
            language,
            "Designed for multiple lines of text, having a higher line height than Label.",
          )}
        </DocsParagraph>
        <ul className="mt-6 space-y-4">
          {COPY_SPECIMENS.map((s) => (
            <SpecimenRow key={s.className} specimen={s} />
          ))}
        </ul>
        <DocsParagraph className="max-w-xl">
          缺口：快照仅定义 copy 的 13 Mono 变体（text-copy-13-mono）；text-copy-14-mono 等其余 mono
          变体在框架中不存在，需新增时在 index.css 补 @utility。
        </DocsParagraph>
      </DocsSection>
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
        <Button typeName="button" type="tertiary" size="medium">
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
    usage:
      "Lightest shadow. Corner 6px. Tooltips will be the only floating element with a triangular stem.",
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
  const { language } = useLanguage();
  return (
    <div>
      <DocsPageTitle>{demoText(language, "Materials")}</DocsPageTitle>
      <DocsPageLead className="max-w-xl">
        {demoText(language, "Presets for radii, fills, strokes, and shadows.")}
      </DocsPageLead>

      <DocsParagraph className="max-w-xl">
        {demoText(
          language,
          "Surface — on the page. Floating — above the page. Each block applies its material-* class and lists its radius, usage, and z-index.",
        )}
      </DocsParagraph>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {MATERIALS.map((m) => (
          <div key={m.className} className="min-w-0">
            <div className={cn(m.className, "h-32 w-full")} aria-hidden />
            <p className="mt-3 text-label-14 font-medium text-foreground">{m.name}</p>
            <p className="mt-1 text-copy-13 text-muted-foreground">{m.usage}</p>
            <dl className="mt-2 space-y-1">
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-label-12 text-muted-foreground">
                  {demoText(language, "Class")}
                </dt>
                <dd className="font-mono text-label-12 text-foreground">{m.className}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-label-12 text-muted-foreground">
                  {demoText(language, "Radius")}
                </dt>
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

/* ================= Grid ================= */

/**
 * Grid - Geist Grid 系统（12 列响应式网格）。
 * 官方定位 Grid 为 Foundations（布局基础），内容展示 CSS grid 用法。
 */
export function GridPage() {
  const { language } = useLanguage();
  return (
    <div>
      <DocsPageTitle>{demoText(language, "Grid")}</DocsPageTitle>
      <DocsPageLead className="max-w-xl">
        {demoText(language, "A huge part of the new Vercel aesthetic.")}
      </DocsPageLead>

      <DocsSection>
        <DocsSectionTitle>{demoText(language, "12 Column Grid")}</DocsSectionTitle>
        <DocsParagraph>
          {demoText(
            language,
            "The grid system uses a 12-column layout with configurable gaps and breakpoints.",
          )}
        </DocsParagraph>
        {/* 可视化 12 列网格 */}
        <div className="mt-6 grid grid-cols-12 gap-2">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="h-16 rounded-md bg-gray-alpha-200"
              style={{ gridColumn: `span 1` }}
            >
              <span className="flex h-full items-center justify-center text-label-12 text-muted-foreground">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      </DocsSection>

      <DocsSection>
        <DocsSectionTitle>{demoText(language, "Responsive Breakpoints")}</DocsSectionTitle>
        <DocsParagraph>
          {demoText(
            language,
            "Breakpoints follow a mobile-first approach with sm, md, lg, xl, 2xl presets.",
          )}
        </DocsParagraph>
        <div className="mt-6 overflow-hidden rounded-[8px] border border-gray-alpha-400 bg-background">
          <table className="w-full text-copy-14">
            <thead className="border-b border-gray-alpha-400">
              <tr className="text-left text-label-12 text-muted-foreground">
                <th className="px-4 py-2 font-medium">Prefix</th>
                <th className="px-4 py-2 font-medium">Min Width</th>
                <th className="px-4 py-2 font-medium">Columns</th>
              </tr>
            </thead>
            <tbody>
              {[
                { prefix: "sm", width: "640px", cols: "4" },
                { prefix: "md", width: "768px", cols: "8" },
                { prefix: "lg", width: "1024px", cols: "12" },
                { prefix: "xl", width: "1280px", cols: "12" },
                { prefix: "2xl", width: "1536px", cols: "12" },
              ].map((bp) => (
                <tr key={bp.prefix} className="border-b border-gray-alpha-400 last:border-0">
                  <td className="px-4 py-2 font-mono text-foreground">{bp.prefix}</td>
                  <td className="px-4 py-2 text-muted-foreground">{bp.width}</td>
                  <td className="px-4 py-2 text-muted-foreground">{bp.cols}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocsSection>
    </div>
  );
}
