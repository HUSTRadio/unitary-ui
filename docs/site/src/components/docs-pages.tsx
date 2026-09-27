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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  FOUNDATION_COLOR_ROLE_PARTITIONS,
  FOUNDATION_COLOR_SCALES,
  SEMANTIC_COLOR_TOKENS,
  type FoundationColor,
  type SemanticColorToken,
} from "../data/foundation-colors";
import { useLanguage, type DocsLanguage } from "../i18n/language";
import { demoText } from "../i18n/components-demo";

/**
 * 文档站页面组件（docs/site 专用）。
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
        {demoText(language, "Unitary is a React component library built on the Vercel Geist design language.")}
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
const COLOR_TOKENS = [...FOUNDATION_COLORS, ...SEMANTIC_COLOR_TOKENS];

function readComputedColor(token: FoundationColor["token"] | SemanticColorToken["token"]) {
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}

function readColorValues() {
  return Object.fromEntries(
    COLOR_TOKENS.map((color) => [color.token, readComputedColor(color.token)]),
  );
}

function useColorValues() {
  const [values, setValues] = useState(readColorValues);

  useEffect(() => {
    const syncValues = () => setValues(readColorValues());
    const observer = new MutationObserver(syncValues);

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return [values, () => setValues(readColorValues())] as const;
}

/** Colors — current theme token values, rendered from CSS custom properties. */
export function ColorsPage() {
  const { language } = useLanguage();
  const [values, syncValues] = useColorValues();
  const [copyStatus, setCopyStatus] = useState("");

  const copyColor = async (token: FoundationColor["token"]) => {
    const value = readComputedColor(token);
    syncValues();

    if (!value || !navigator.clipboard?.writeText) {
      setCopyStatus(demoText(language, "Unable to copy color value."));
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus(demoText(language, "Copied color value."));
    } catch {
      setCopyStatus(demoText(language, "Unable to copy color value."));
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
        <div className="mt-6 space-y-4">
          {FOUNDATION_COLOR_SCALES.map((scale) => (
            <PaletteRow
              key={scale.label}
              scale={scale}
              language={language}
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

      <DocsSection>
        <DocsSectionTitle>{demoText(language, "Colors 1–10")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {demoText(language, "Numbered color steps group by their intended interface role.")}
        </DocsParagraph>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {FOUNDATION_COLOR_ROLE_PARTITIONS.map((partition) => (
            <section key={partition.range} className="rounded-md border border-gray-alpha-400 p-4">
              <h3 className="text-label-14 font-medium text-foreground">
                {demoText(language, `Colors ${partition.range}: ${partition.label}`)}
              </h3>
              <DocsParagraph className="mt-1.5">
                {demoText(language, partition.usage)}
              </DocsParagraph>
              <div className="mt-3 flex overflow-hidden rounded-md">
                {partition.steps.map((color) => (
                  <RuntimeColorSwatch
                    key={color.token}
                    color={color}
                    value={values[color.token]}
                    dataRoleToken
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </DocsSection>

      <DocsSection>
        <DocsSectionTitle>{demoText(language, "Semantic Tokens")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {demoText(language, "Semantic tokens communicate interface roles while resolving to the current theme value.")}
        </DocsParagraph>
        <div className="mt-6 max-w-3xl">
          <TableRoot>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{demoText(language, "Token")}</TableHead>
                  <TableHead>{demoText(language, "Role")}</TableHead>
                  <TableHead>{demoText(language, "Usage")}</TableHead>
                  <TableHead>{demoText(language, "Current value")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SEMANTIC_COLOR_TOKENS.map((semantic) => (
                  <TableRow key={semantic.token} data-semantic-token={semantic.token}>
                    <TableCell className="font-mono text-foreground">{semantic.token}</TableCell>
                    <TableCell className="text-foreground">{demoText(language, semantic.label)}</TableCell>
                    <TableCell>{demoText(language, semantic.usage)}</TableCell>
                    <TableCell>
                      <SemanticColorValue token={semantic.token} value={values[semantic.token]} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableRoot>
        </div>
      </DocsSection>
    </div>
  );
}

function PaletteRow({
  scale,
  language,
  values,
  onCopy,
}: {
  scale: (typeof FOUNDATION_COLOR_SCALES)[number];
  language: DocsLanguage;
  values: Record<string, string>;
  onCopy: (token: FoundationColor["token"]) => Promise<void>;
}) {
  // 10 档色阶在窄屏（<sm）降为 5 列两行，保证卡内 hex 值完整可读（响应式审计 Minor-1）；卡数 ≤5 的行无需降列
  const wrapsOnNarrow = scale.steps.length > 5;
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
      <div className="sm:w-40 sm:shrink-0">
        <p className="text-label-14 font-medium text-foreground">{demoText(language, scale.label)}</p>
        <p className="mt-0.5 text-copy-13 text-muted-foreground">{demoText(language, scale.usage)}</p>
      </div>
      {/* 一个色阶一行：10 档横向成条；token 全文交给 title，卡内只留 step 与实时值 */}
      <div
        className={cn(
          "min-w-0 flex-1 overflow-hidden rounded-md border border-gray-alpha-400",
          wrapsOnNarrow ? "grid grid-cols-5 sm:flex" : "flex",
        )}
      >
        {scale.steps.map((color) => {
          const value = values[color.token];
          return (
            <button
              key={color.token}
              type="button"
              data-color-token={color.token}
              onClick={() => void onCopy(color.token)}
              title={value ? `${color.token} · ${value}` : color.token}
              className={cn(
                "focus-ring min-w-0 flex-1 border-r border-gray-alpha-400 text-left last:border-r-0",
                wrapsOnNarrow &&
                  // 两行模式：行尾（第 5n 张）卡去右边框，末行（倒数 5 张）卡去下边框，行间由下边框分隔
                  "max-sm:border-b max-sm:[&:nth-child(5n)]:border-r-0 max-sm:[&:nth-last-child(-n+5)]:border-b-0",
              )}
            >
              <span
                className="block h-10 w-full"
                style={{ backgroundColor: `var(${color.token})` }}
                aria-hidden
              />
              <span className="flex flex-col border-t border-gray-alpha-400 bg-background px-0.5 py-1">
                <span className="text-label-12 text-muted-foreground">{color.step}</span>
                {/* 紧凑显示：卡内省略 # 前缀（title 提供完整值），10 列均分下 6 位 hex 才放得下 */}
                <span className="truncate font-mono text-label-12 text-foreground">
                  {value ? value.replace(/^#/, "") : "—"}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RuntimeColorSwatch({
  color,
  value,
  dataRoleToken = false,
}: {
  color: FoundationColor;
  value: string | undefined;
  dataRoleToken?: boolean;
}) {
  return (
    <div
      className="min-w-0 flex-1"
      {...(dataRoleToken ? { "data-role-color-token": color.token } : {})}
    >
      <span className="block h-12 w-full" style={{ backgroundColor: `var(${color.token})` }} aria-hidden />
      <span className="flex flex-col border border-t-0 border-gray-alpha-400 bg-background px-1.5 py-0.5">
        <span className="text-label-12 text-muted-foreground">{color.step}</span>
        <span className="font-mono text-label-12 text-foreground">{value ? value.replace(/^#/, "") : "—"}</span>
      </span>
    </div>
  );
}

function SemanticColorValue({
  token,
  value,
}: {
  token: SemanticColorToken["token"];
  value: string | undefined;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="size-4 shrink-0 rounded-sm border border-gray-alpha-400"
        style={{ backgroundColor: `var(${token})` }}
        aria-hidden
      />
      <span className="font-mono text-copy-13 text-foreground">{value || "—"}</span>
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
              style={{ fontFamily: '"OPPO Sans 4.0", sans-serif', fontSize: "clamp(1.125rem, 2.5vw, 1.75rem)", lineHeight: 1.2, letterSpacing: "-0.02em" }}
            >
              {demoText(language, "山原旷其盈视，川泽纡其骇瞩。")}
            </span>
          </li>
          {/* HarmonyOS Sans SC — 中文无衬线（--font-sans 中文兜底） */}
          <li className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8">
            <code className="w-52 shrink-0 font-mono text-label-12 text-muted-foreground">
              HarmonyOS Sans SC
            </code>
            <span
              className="truncate text-foreground"
              style={{ fontFamily: '"HarmonyOS Sans SC", "HarmonyOS Sans SC Subset", sans-serif', fontSize: "clamp(1.125rem, 2.5vw, 1.75rem)", lineHeight: 1.2, letterSpacing: "-0.02em" }}
            >
              {demoText(language, "纵一苇之所如，凌万顷之茫然。")}
            </span>
          </li>
          {/* JetBrains Maple Mono — 等宽（--font-mono 首选） */}
          <li className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8">
            <code className="w-52 shrink-0 font-mono text-label-12 text-muted-foreground">
              JetBrains Maple Mono
            </code>
            <span
              className="truncate font-mono text-foreground"
              style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)", lineHeight: 1.25, letterSpacing: "-0.02em" }}
            >
              {demoText(language, "Together for a shared future.")}
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
        {/* The snapshot currently defines only text-copy-13-mono. Add further mono copy utilities
            to index.css when the design system gains a documented use case for them. */}
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

/** 材质数据 — 类名 / 圆角 / 用途提取自 materials.md 快照；material=elevation 视觉契约，
 *  stacking/层级由独立 layer token 管理（Task 9），文档不展示 z-index。 */

interface MaterialSpec {
  className: string;
  name: string;
  radius: string;
  usage: string;
}

const SURFACE_MATERIALS: MaterialSpec[] = [
  {
    className: "material-base",
    name: "Base",
    radius: "6px",
    usage: "Everyday use. Radius 6px.",
  },
  {
    className: "material-small",
    name: "Small",
    radius: "6px",
    usage: "Slightly raised. Radius 6px.",
  },
  {
    className: "material-medium",
    name: "Medium",
    radius: "12px",
    usage: "Further raised. Radius 12px.",
  },
  {
    className: "material-large",
    name: "Large",
    radius: "12px",
    usage: "Further raised. Radius 12px.",
  },
];

const FLOATING_MATERIALS: MaterialSpec[] = [
  {
    className: "material-tooltip",
    name: "Tooltip",
    radius: "6px",
    usage:
      "Lightest shadow. Corner 6px. Tooltips will be the only floating element with a triangular stem.",
  },
  {
    className: "material-menu",
    name: "Menu",
    radius: "12px",
    usage: "Lift from page. Radius 12px.",
  },
  {
    className: "material-modal",
    name: "Modal",
    radius: "12px",
    usage: "Further lift. Radius 12px.",
  },
  {
    className: "material-fullscreen",
    name: "Fullscreen",
    radius: "16px",
    usage: "Biggest lift. Radius 16px.",
  },
];

/** 单个材质卡：材质块叠在带纹理的底面上让阴影/描边可观察 */
function MaterialCard({ material }: { material: MaterialSpec }) {
  const { language } = useLanguage();
  return (
    <div className="min-w-0">
      {/* 纹理底面：细网格 + 中性底色，让 hairline 描边与阴影可观察 */}
      <div
        aria-hidden
        className="rounded-md border border-gray-alpha-300 bg-background p-4 [background-image:linear-gradient(to_right,var(--color-gray-alpha-200)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-gray-alpha-200)_1px,transparent_1px)] [background-size:8px_8px]"
      >
        <div className={cn(material.className, "flex h-24 items-end justify-end p-2")}>
          <span className="font-mono text-label-12 text-muted-foreground">{material.className}</span>
        </div>
      </div>
      <p className="mt-3 text-label-14 font-medium text-foreground">{demoText(language, material.name)}</p>
      <p className="mt-1 text-copy-13 text-muted-foreground">{demoText(language, material.usage)}</p>
      <dl className="mt-2 space-y-1">
        <div className="flex gap-2">
          <dt className="w-16 shrink-0 text-label-12 text-muted-foreground">
            {demoText(language, "Class")}
          </dt>
          <dd className="font-mono text-label-12 text-foreground">{material.className}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-16 shrink-0 text-label-12 text-muted-foreground">
            {demoText(language, "Radius")}
          </dt>
          <dd className="text-label-12 text-foreground">{material.radius}</dd>
        </div>
      </dl>
    </div>
  );
}

/** Materials — Surface（文档流内）与 Floating（浮层）两组；material=elevation 契约，不含 z-index */
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
          "Surface — on the page. Floating — above the page. Each preset is an elevation visual contract; stacking order is managed by separate layer tokens, not by the material itself.",
        )}
      </DocsParagraph>

      <DocsSection>
        <DocsSectionTitle>{demoText(language, "Surface")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {demoText(language, "On the page, in normal document flow. Choose the lowest elevation that reads clearly.")}
        </DocsParagraph>
        <div
          data-material-group="surface"
          className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
        >
          {SURFACE_MATERIALS.map((m) => (
            <MaterialCard key={m.className} material={m} />
          ))}
        </div>
      </DocsSection>

      <DocsSection>
        <DocsSectionTitle>{demoText(language, "Floating")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {demoText(
            language,
            "Above the page. Never stack the same material twice; shadows do not replace focus rings or ARIA semantics. Check separation in both themes.",
          )}
        </DocsParagraph>
        <div
          data-material-group="floating"
          className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
        >
          {FLOATING_MATERIALS.map((m) => (
            <MaterialCard key={m.className} material={m} />
          ))}
        </div>
      </DocsSection>
    </div>
  );
}

/* ================= Grid ================= */

/**
 * Grid - 框架真实 Grid 系统的文档页。
 * 页面实现独立维护在 docs-grid-page.tsx，这里仅 re-export，
 * 避免路由注册表因文件拆分再次维护第二份映射。
 */
export { GridPage } from "./docs-grid-page";

