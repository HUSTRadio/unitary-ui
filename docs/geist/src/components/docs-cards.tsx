import * as React from "react";
import {
  Bell,
  Calendar,
  Camera,
  Check,
  Clock,
  Copy,
  Download,
  Edit,
  Eye,
  File,
  Folder,
  Heart,
  Home,
  Image,
  Link,
  Mail,
  MapPin,
  Music,
  Play,
  Search,
  Settings,
  Share,
  Shield,
  Star,
  Trash,
  Upload,
  User,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLanguage } from "../i18n/language";
import { demoText } from "../i18n/components-demo";

/**
 * Introduction 页卡片网格（docs/geist 首页）。
 * 复刻 vercel.com/geist/introduction 的 2 列×3 行网格：
 * - 发丝线分隔（border-r / border-b border-border），无圆角、无背景、无阴影 —— 「网格单元」而非材质卡片
 * - 每卡 = 上半区预览示意（h-40 居中）+ 标题 + 描述
 * - 整卡可点击（hash 路由 <a>），hover 层 bg-gray-alpha-100
 */

/* ---------- 通用卡片单元 ---------- */

interface DocCardProps {
  /** hash 路由目标（如 "/typography" → href="#/typography"） */
  href: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

function DocCard({ href, title, description, children }: DocCardProps) {
  return (
    <a
      href={`#${href}`}
      className="group block border-b border-border p-6 transition-colors duration-150 hover:bg-gray-alpha-100 md:border-r"
    >
      {/* 上半区：预览示意 */}
      <div className="flex h-40 items-center justify-center">{children}</div>
      {/* 下半区：标题 + 描述 */}
      <h3 className="mt-4 text-label-16 font-medium text-foreground">{title}</h3>
      <p className="mt-1 text-copy-13 text-muted-foreground">{description}</p>
    </a>
  );
}

/* ---------- 5 张预览卡 ---------- */

/** Icons — 24 个 lucide 图标，8 列网格 */
const ICON_PREVIEWS = [
  Search,
  Settings,
  User,
  Mail,
  Home,
  Star,
  Heart,
  Bell,
  Calendar,
  Clock,
  Camera,
  MapPin,
  Folder,
  File,
  Image,
  Music,
  Play,
  Download,
  Upload,
  Trash,
  Edit,
  Eye,
  Share,
  Link,
];

function IconsPreview() {
  return (
    <div className="grid w-full max-w-xs grid-cols-8 gap-2 text-foreground">
      {ICON_PREVIEWS.map((Icon, i) => (
        <Icon key={i} className="size-4" strokeWidth={1.5} aria-hidden />
      ))}
    </div>
  );
}

/** Components — mono 终端行 + Copy + 2 个 icon Button + Label/Value 输入组 */
const COPY_TEXT = "vp dev docs/geist";

function ComponentsPreview() {
  const { language } = useLanguage();
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(COPY_TEXT);
    } catch {
      // 降级：隐藏 textarea + execCommand（无 clipboard 权限的环境仍可复制并给出反馈）
      const textarea = document.createElement("textarea");
      textarea.value = COPY_TEXT;
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
    <div className="flex w-full max-w-xs flex-col gap-2.5">
      {/* 终端行 + Copy */}
      <div className="flex items-center gap-1 rounded-md border border-gray-alpha-400 bg-background py-1 pr-1 pl-2.5">
        <span className="min-w-0 flex-1 truncate text-label-14-mono text-foreground">
          $ {COPY_TEXT}
        </span>
        <Button
          typeName="button"
          type="tertiary"
          svgOnly
          size="small"
          aria-label={demoText(language, copied ? "Copied" : "Copy code")}
          onClick={handleCopy}
          className="shrink-0"
        >
          {copied ? (
            <Check className="text-foreground" aria-hidden />
          ) : (
            <Copy className="text-muted-foreground" aria-hidden />
          )}
        </Button>
      </div>
      {/* 2 个 icon Button（Collaborate / Shield 风格） */}
      <div className="flex items-center gap-2">
        <Button
          typeName="button"
          type="secondary"
          aria-label="Collaborate"
          prefix={<Users aria-hidden />}
        >
          {demoText(language, "Collaborate")}
        </Button>
        <Button typeName="button" type="secondary" svgOnly size="medium" aria-label="Shield">
          <Shield aria-hidden />
        </Button>
      </div>
      {/* Label / Value 输入组 */}
      <div className="flex flex-col gap-1">
        <label htmlFor="docs-preview-project" className="text-label-12 text-muted-foreground">
          {demoText(language, "Project name")}
        </label>
        <Input id="docs-preview-project" defaultValue="geist-docs" readOnly />
      </div>
    </div>
  );
}

/**
 * Colors — 8 竖色条。
 * 色值来自 docs/geist-markdown-refs/foundations/colors.md（2026-08-08 抓取快照），
 * 700 档在 Dark/Light 双主题下同值，故直接写死 hex。
 */
const COLOR_BARS: { name: string; value: string }[] = [
  { name: "gray-700", value: "#8f8f8f" },
  { name: "blue-700", value: "#006efe" },
  { name: "purple-700", value: "#8e4ec6" },
  { name: "pink-700", value: "#e93d82" },
  { name: "red-700", value: "#e5484d" },
  { name: "amber-700", value: "#ffb224" },
  { name: "green-700", value: "#46a758" },
  { name: "teal-700", value: "#17a693" },
];

function ColorsPreview() {
  return (
    <div className="flex items-center gap-2">
      {COLOR_BARS.map((bar) => (
        <div
          key={bar.name}
          title={`${bar.name} · ${bar.value}`}
          className="h-24 w-6 rounded"
          style={{ backgroundColor: bar.value }}
        />
      ))}
    </div>
  );
}

/** Materials — 4 个不同圆角/阴影的材质方块（material-base/small/medium/large） */
const MATERIAL_SQUARES: { className: string; name: string; size: string }[] = [
  { className: "material-base", name: "base", size: "size-10" },
  { className: "material-small", name: "small", size: "size-12" },
  { className: "material-medium", name: "medium", size: "size-14" },
  { className: "material-large", name: "large", size: "size-16" },
];

function MaterialsPreview() {
  return (
    <div className="flex items-end gap-3">
      {MATERIAL_SQUARES.map((m) => (
        <div key={m.name} title={m.name} className={cn(m.className, m.size)} aria-hidden />
      ))}
    </div>
  );
}

/** Typeface — Sans / Mono 两个虚线字体盒 */
function TypefacePreview() {
  return (
    <div className="flex w-full max-w-sm gap-3">
      <div className="flex-1 rounded-md border border-dashed border-border px-4 py-6 text-center text-label-16 text-foreground">
        HarmonyOS Sans SC
      </div>
      <div className="flex-1 rounded-md border border-dashed border-border px-4 py-6 text-center font-mono text-label-16 text-foreground">
        JetBrains Maple Mono
      </div>
    </div>
  );
}

/* ---------- 网格 ---------- */

/* 陈列顺序与侧边栏（docs/geist/src/data/nav.ts）对齐：
   Foundations 组按 Introduction → Icons → Colors → Typography → Materials → Grid；
   Components 独立组紧随其后。首页卡片取 Foundations 的 Icons/Colors/Typeface/Materials
   与 Components 组，顺序 = 侧边栏出现顺序。 */
const DOC_CARDS: Omit<DocCardProps, "children">[] = [
  {
    href: "/icons",
    title: "Icons",
    description: "Icon set tailored for developer tools.",
  },
  {
    href: "/colors",
    title: "Colors",
    description: "A high contrast, accessible color system.",
  },
  {
    href: "/typography",
    title: "Typeface",
    description: "Specifically designed for developers and designers.",
  },
  {
    href: "/materials",
    title: "Materials",
    description: "Presets for radii, fills, strokes, and shadows.",
  },
  {
    href: "/components",
    title: "Components",
    description: "Building blocks for React applications.",
  },
];

const CARD_PREVIEWS = [
  <IconsPreview key="icons" />,
  <ColorsPreview key="colors" />,
  <TypefacePreview key="typeface" />,
  <MaterialsPreview key="materials" />,
  <ComponentsPreview key="components" />,
];

/**
 * 发丝线网格：单元自带 border-b（移动端单列）与 md:border-r（双列）。
 * 末列去右线（md 下 2n 单元）、末行去底线（md 下最后 2 个单元 / 移动端最后 1 个）。
 */
function DocsCardGrid({ className }: { className?: string }) {
  const { language } = useLanguage();
  const cards = DOC_CARDS.map((card) => ({
    ...card,
    title: demoText(language, card.title),
    description: demoText(language, card.description),
  }));
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2",
        "md:[&>*:nth-child(2n)]:border-r-0",
        "md:[&>*:nth-last-child(-n+2)]:border-b-0",
        "[&>*:last-child]:border-b-0",
        className,
      )}
    >
      {cards.map((card, i) => (
        <DocCard key={card.title} {...card}>
          {CARD_PREVIEWS[i]}
        </DocCard>
      ))}
    </div>
  );
}

export { DocCard, DocsCardGrid };
