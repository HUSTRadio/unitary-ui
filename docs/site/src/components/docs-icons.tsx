import * as React from "react";
import {
  AlertCircle,
  AlertTriangle,
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  Battery,
  Bell,
  BellOff,
  Bluetooth,
  Bookmark,
  Briefcase,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Cloud,
  CloudDownload,
  CloudUpload,
  Code,
  Command,
  Compass,
  Copy,
  CreditCard,
  Database,
  Download,
  Droplet,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  File,
  FileText,
  Filter,
  Flag,
  Flame,
  Folder,
  FolderPlus,
  Gift,
  Globe,
  HardDrive,
  Heart,
  HelpCircle,
  Home,
  Hourglass,
  Image,
  Inbox,
  Info,
  Key,
  Laptop,
  Layers,
  Lightbulb,
  Link as LinkIcon,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Mic,
  Minus,
  Monitor,
  Moon,
  Music,
  Navigation,
  Package,
  Palette,
  Pause,
  PenTool,
  Play,
  Plus,
  Power,
  Rocket,
  RotateCw,
  Search,
  Send,
  Settings,
  Share,
  Shield,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Star,
  Sun,
  Tag,
  Target,
  Terminal,
  ThumbsUp,
  Timer,
  Trash,
  TrendingDown,
  TrendingUp,
  Trophy,
  Truck,
  Unlock,
  Upload,
  User,
  Users,
  Video,
  Wallet,
  Wifi,
  Wrench,
  X,
  Zap,
  ZoomIn,
  ZoomOut,
  type LucideIcon,
} from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { CodeBlock as CodeBlockComponent } from "@/components/ui/code-block";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/components/ui/link";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { useLanguage } from "../i18n/language";
import { demoText } from "../i18n/components-demo";
import {
  DocsPageLead,
  DocsPageTitle,
  DocsParagraph,
  DocsSectionTitle,
} from "./docs-typography";

/** 图标库来源：lucide（矢量 stroke 图标）或 simple-icons（品牌 fill 图标，经 CDN 渲染）。 */
type IconLib = "lucide" | "simple-icons";
export type { IconLib };

type IconEntry =
  | { name: string; Icon: LucideIcon; lib: "lucide" }
  | { name: string; slug: string; lib: "simple-icons" };

/** 详情面板默认预览设置。 */
type IconSettings = {
  color: string;
  size: number;
  strokeWidth: number;
  absoluteStrokeWidth: boolean;
};

const DEFAULT_SETTINGS: IconSettings = {
  color: "#18181b",
  size: 24,
  strokeWidth: 2,
  absoluteStrokeWidth: false,
};

/**
 * simple-icons 品牌图标：经 CDN mask 渲染（背景色 = color，与 lucide 的 color 语义对齐）。
 * 零依赖、随 currentColor 着色（语言图标组件同款方案）。
 *
 * CDN fallback（工程审查 P2）：mask 图加载失败（离线/CDN 不可达/slug 下架）时
 * mask-image 本身不触发 img.onerror，因此用隐藏 <img> 探测加载结果；
 * 失败后降级为「首字母占位」——同尺寸圆角块 + 文字缩写，保证网格布局不留空洞。
 */
function SimpleIconGlyph({
  slug,
  size,
  color,
  className,
}: {
  slug: string;
  size?: number;
  color?: string;
  className?: string;
}) {
  const [failed, setFailed] = React.useState(false);
  const url = `https://cdn.simpleicons.org/${slug}`;

  if (failed) {
    return (
      <span
        aria-hidden
        className={cn("flex shrink-0 items-center justify-center rounded-sm font-medium", className)}
        style={{
          width: size,
          height: size,
          backgroundColor: "var(--gray-alpha-200, rgba(128,128,128,0.2))",
          color: color ?? "currentColor",
          fontSize: Math.max(9, Math.round((size ?? 20) * 0.5)),
          lineHeight: 1,
        }}
      >
        {slug.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <>
      {/* 加载探测器：mask-image 不暴露加载失败，用真实 <img> 感知 onerror */}
      <img
        src={url}
        alt=""
        aria-hidden
        style={{ display: "none" }}
        onError={() => setFailed(true)}
      />
      <span
        aria-hidden
        className={className}
        style={{
          width: size,
          height: size,
          backgroundColor: color ?? "currentColor",
          WebkitMaskImage: `url(${url})`,
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskImage: `url(${url})`,
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center",
        }}
      />
    </>
  );
}

function buildExampleCode(entry: IconEntry, settings: IconSettings): string {
  const { color, size, strokeWidth, absoluteStrokeWidth } = settings;
  if (entry.lib === "lucide") {
    const props = [`size={${size}}`, `strokeWidth={${strokeWidth}}`];
    if (absoluteStrokeWidth) props.push("absoluteStrokeWidth");
    props.push(`color="${color}"`);
    return `import { ${entry.name} } from "lucide-react";\n\n<${entry.name} ${props.join(" ")} />`;
  }
  const colorPath = color ? `/${color.replace("#", "")}` : "";
  return `import { ${entry.slug} } from "simple-icons";\n\n<img\n  src="https://cdn.simpleicons.org/${entry.slug}${colorPath}"\n  width="${size}"\n  height="${size}"\n  alt="${entry.name}"\n/>`;
}

/**
 * Icons 页面（/icons）— 复刻 vercel.com/geist/icons 的图标集页：
 * 标题 + 描述 + 外链（lucide.dev / simpleicons.org）+ 搜索过滤 + 响应式图标网格。
 * 点击图标打开详情面板：实时预览（color / size / strokeWidth / absoluteStrokeWidth，
 * 后两者仅 lucide 生效）+ 示例代码生成 + 复制图标名。
 * lucide 图标统一 lucide-react（AGENTS.md 约定）；simple-icons 经 CDN 渲染不装包。
 */

const ICONS: IconEntry[] = [
{ name: "Search", Icon: Search, lib: "lucide" },
  { name: "Settings", Icon: Settings, lib: "lucide" },
  { name: "User", Icon: User, lib: "lucide" },
  { name: "Users", Icon: Users, lib: "lucide" },
  { name: "Home", Icon: Home, lib: "lucide" },
  { name: "Menu", Icon: Menu, lib: "lucide" },
  { name: "X", Icon: X, lib: "lucide" },
  { name: "Check", Icon: Check, lib: "lucide" },
  { name: "Plus", Icon: Plus, lib: "lucide" },
  { name: "Minus", Icon: Minus, lib: "lucide" },
  { name: "ChevronDown", Icon: ChevronDown, lib: "lucide" },
  { name: "ChevronUp", Icon: ChevronUp, lib: "lucide" },
  { name: "ChevronLeft", Icon: ChevronLeft, lib: "lucide" },
  { name: "ChevronRight", Icon: ChevronRight, lib: "lucide" },
  { name: "ArrowLeft", Icon: ArrowLeft, lib: "lucide" },
  { name: "ArrowRight", Icon: ArrowRight, lib: "lucide" },
  { name: "ArrowUp", Icon: ArrowUp, lib: "lucide" },
  { name: "ArrowDown", Icon: ArrowDown, lib: "lucide" },
  { name: "Copy", Icon: Copy, lib: "lucide" },
  { name: "Edit", Icon: Edit, lib: "lucide" },
  { name: "Trash", Icon: Trash, lib: "lucide" },
  { name: "Download", Icon: Download, lib: "lucide" },
  { name: "Upload", Icon: Upload, lib: "lucide" },
  { name: "Share", Icon: Share, lib: "lucide" },
  { name: "Link", Icon: LinkIcon, lib: "lucide" },
  { name: "ExternalLink", Icon: ExternalLink, lib: "lucide" },
  { name: "RotateCw", Icon: RotateCw, lib: "lucide" },
  { name: "ZoomIn", Icon: ZoomIn, lib: "lucide" },
  { name: "ZoomOut", Icon: ZoomOut, lib: "lucide" },
  { name: "Filter", Icon: Filter, lib: "lucide" },
  { name: "AlertCircle", Icon: AlertCircle, lib: "lucide" },
  { name: "AlertTriangle", Icon: AlertTriangle, lib: "lucide" },
  { name: "Info", Icon: Info, lib: "lucide" },
  { name: "HelpCircle", Icon: HelpCircle, lib: "lucide" },
  { name: "Loader2", Icon: Loader2, lib: "lucide" },
  { name: "Eye", Icon: Eye, lib: "lucide" },
  { name: "EyeOff", Icon: EyeOff, lib: "lucide" },
  { name: "Star", Icon: Star, lib: "lucide" },
  { name: "Heart", Icon: Heart, lib: "lucide" },
  { name: "ThumbsUp", Icon: ThumbsUp, lib: "lucide" },
  { name: "Bookmark", Icon: Bookmark, lib: "lucide" },
  { name: "Flag", Icon: Flag, lib: "lucide" },
  { name: "Bell", Icon: Bell, lib: "lucide" },
  { name: "BellOff", Icon: BellOff, lib: "lucide" },
  { name: "File", Icon: File, lib: "lucide" },
  { name: "FileText", Icon: FileText, lib: "lucide" },
  { name: "Folder", Icon: Folder, lib: "lucide" },
  { name: "FolderPlus", Icon: FolderPlus, lib: "lucide" },
  { name: "Archive", Icon: Archive, lib: "lucide" },
  { name: "Mail", Icon: Mail, lib: "lucide" },
  { name: "MessageCircle", Icon: MessageCircle, lib: "lucide" },
  { name: "Send", Icon: Send, lib: "lucide" },
  { name: "Inbox", Icon: Inbox, lib: "lucide" },
  { name: "Image", Icon: Image, lib: "lucide" },
  { name: "Camera", Icon: Camera, lib: "lucide" },
  { name: "Music", Icon: Music, lib: "lucide" },
  { name: "Play", Icon: Play, lib: "lucide" },
  { name: "Pause", Icon: Pause, lib: "lucide" },
  { name: "Video", Icon: Video, lib: "lucide" },
  { name: "Mic", Icon: Mic, lib: "lucide" },
  { name: "Shield", Icon: Shield, lib: "lucide" },
  { name: "Lock", Icon: Lock, lib: "lucide" },
  { name: "Unlock", Icon: Unlock, lib: "lucide" },
  { name: "Key", Icon: Key, lib: "lucide" },
  { name: "Clock", Icon: Clock, lib: "lucide" },
  { name: "Calendar", Icon: Calendar, lib: "lucide" },
  { name: "Timer", Icon: Timer, lib: "lucide" },
  { name: "Hourglass", Icon: Hourglass, lib: "lucide" },
  { name: "MapPin", Icon: MapPin, lib: "lucide" },
  { name: "Navigation", Icon: Navigation, lib: "lucide" },
  { name: "Compass", Icon: Compass, lib: "lucide" },
  { name: "Globe", Icon: Globe, lib: "lucide" },
  { name: "Smartphone", Icon: Smartphone, lib: "lucide" },
  { name: "Monitor", Icon: Monitor, lib: "lucide" },
  { name: "Laptop", Icon: Laptop, lib: "lucide" },
  { name: "Wifi", Icon: Wifi, lib: "lucide" },
  { name: "Bluetooth", Icon: Bluetooth, lib: "lucide" },
  { name: "Battery", Icon: Battery, lib: "lucide" },
  { name: "Sun", Icon: Sun, lib: "lucide" },
  { name: "Moon", Icon: Moon, lib: "lucide" },
  { name: "Cloud", Icon: Cloud, lib: "lucide" },
  { name: "CloudUpload", Icon: CloudUpload, lib: "lucide" },
  { name: "CloudDownload", Icon: CloudDownload, lib: "lucide" },
  { name: "Droplet", Icon: Droplet, lib: "lucide" },
  { name: "Flame", Icon: Flame, lib: "lucide" },
  { name: "Zap", Icon: Zap, lib: "lucide" },
  { name: "Database", Icon: Database, lib: "lucide" },
  { name: "Terminal", Icon: Terminal, lib: "lucide" },
  { name: "Command", Icon: Command, lib: "lucide" },
  { name: "Code", Icon: Code, lib: "lucide" },
  { name: "Tag", Icon: Tag, lib: "lucide" },
  { name: "Wallet", Icon: Wallet, lib: "lucide" },
  { name: "CreditCard", Icon: CreditCard, lib: "lucide" },
  { name: "ShoppingCart", Icon: ShoppingCart, lib: "lucide" },
  { name: "Package", Icon: Package, lib: "lucide" },
  { name: "Truck", Icon: Truck, lib: "lucide" },
  { name: "Briefcase", Icon: Briefcase, lib: "lucide" },
  { name: "HardDrive", Icon: HardDrive, lib: "lucide" },
  { name: "Rocket", Icon: Rocket, lib: "lucide" },
  { name: "Sparkles", Icon: Sparkles, lib: "lucide" },
  { name: "Lightbulb", Icon: Lightbulb, lib: "lucide" },
  { name: "PenTool", Icon: PenTool, lib: "lucide" },
  { name: "Palette", Icon: Palette, lib: "lucide" },
  { name: "Layers", Icon: Layers, lib: "lucide" },
  { name: "Wrench", Icon: Wrench, lib: "lucide" },
  { name: "Power", Icon: Power, lib: "lucide" },
  { name: "Gift", Icon: Gift, lib: "lucide" },
  { name: "Award", Icon: Award, lib: "lucide" },
  { name: "Trophy", Icon: Trophy, lib: "lucide" },
  { name: "Target", Icon: Target, lib: "lucide" },
  { name: "TrendingUp", Icon: TrendingUp, lib: "lucide" },
  { name: "TrendingDown", Icon: TrendingDown, lib: "lucide" },
  { name: "GitHub", slug: "github", lib: "simple-icons" },
  { name: "Vercel", slug: "vercel", lib: "simple-icons" },
  { name: "React", slug: "react", lib: "simple-icons" },
  { name: "TypeScript", slug: "typescript", lib: "simple-icons" },
  { name: "Tailwind CSS", slug: "tailwindcss", lib: "simple-icons" },
  { name: "Next.js", slug: "nextdotjs", lib: "simple-icons" },
  { name: "Docker", slug: "docker", lib: "simple-icons" },
  { name: "Figma", slug: "figma", lib: "simple-icons" },
  { name: "Node.js", slug: "nodedotjs", lib: "simple-icons" },
  { name: "Python", slug: "python", lib: "simple-icons" },
  { name: "Rust", slug: "rust", lib: "simple-icons" },
  { name: "Linux", slug: "linux", lib: "simple-icons" },
];

export function IconsPage() {
  const { language } = useLanguage();
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<IconEntry | null>(null);
  const [settings, setSettings] = React.useState<IconSettings>(DEFAULT_SETTINGS);

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? ICONS.filter(({ name }) => name.toLowerCase().includes(normalized))
    : ICONS;
  const lucideIcons = filtered.filter((e) => e.lib === "lucide");
  const simpleIcons = filtered.filter((e) => e.lib === "simple-icons");

  const isLucide = selected?.lib === "lucide";

  const exampleCode = selected ? buildExampleCode(selected, settings) : "";
  const libLabel = selected?.lib === "simple-icons" ? "simple-icons" : "lucide";

  return (
    <div>
      <DocsPageTitle>{demoText(language, "Icons")}</DocsPageTitle>
      <DocsPageLead className="max-w-xl">
        {demoText(language, "Icon set tailored for developer tools.")}
      </DocsPageLead>

      <div className="relative mt-8 max-w-xs" role="search">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={demoText(language, "Search icons…")}
          aria-label={demoText(language, "Search icons…")}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <DocsParagraph>{demoText(language, "No icons match your search.")}</DocsParagraph>
      ) : (
        <div className="mt-8 space-y-10">
          {/* Lucide 分区 — 小标题 as link */}
          <section>
            <DocsSectionTitle>
              <Link href="https://lucide.dev">Lucide</Link>
            </DocsSectionTitle>
            <DocsParagraph>
              {demoText(
                language,
                "Open-source stroke icons, tree-shakeable via lucide-react.",
              )}
            </DocsParagraph>
            {lucideIcons.length === 0 ? (
              <DocsParagraph>
                {demoText(language, "No lucide icons match your search.")}
              </DocsParagraph>
            ) : (
              <div className="mt-4 grid grid-cols-3 gap-1 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8">
                {lucideIcons.map((entry) =>
                  entry.lib === "lucide" ? (
                    <button
                      key={entry.name}
                      type="button"
                      onClick={() => setSelected(entry)}
                      title={entry.name}
                      aria-label={entry.name}
                      className="group flex flex-col items-center justify-center gap-2 rounded-md p-3 text-muted-foreground transition-colors duration-(--uni-duration-fast) hover:bg-gray-alpha-100 hover:text-foreground"
                    >
                      <entry.Icon className="size-5 transition-colors" strokeWidth={1.5} aria-hidden />
                      <span className="w-full truncate text-center text-label-12">{entry.name}</span>
                    </button>
                  ) : null,
                )}
              </div>
            )}
          </section>

          {/* Simple Icons 分区 — 小标题 as link + 品牌版权声明 */}
          <section>
            <DocsSectionTitle>
              <Link href="https://simpleicons.org">Simple Icons</Link>
            </DocsSectionTitle>
            <DocsParagraph>
              {demoText(
                language,
                "Brand icons for popular products, rendered from the simple-icons CDN.",
              )}
            </DocsParagraph>
            {/* 版权附注：legal 小字，属局部体系而非文章正文，以 data-slot 显式标记 */}
            <p data-slot="legal-note" className="mt-2 max-w-xl text-copy-13 text-muted-foreground">
              {demoText(
                language,
                "All brand names, logos, and icons are trademarks of their respective owners. Simple Icons is not affiliated with any of these brands, and the project makes no claim of ownership over them.",
              )}
            </p>
            {simpleIcons.length === 0 ? (
              <DocsParagraph>
                {demoText(language, "No brand icons match your search.")}
              </DocsParagraph>
            ) : (
              <div className="mt-4 grid grid-cols-3 gap-1 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8">
                {simpleIcons.map((entry) =>
                  entry.lib === "simple-icons" ? (
                    <button
                      key={entry.name}
                      type="button"
                      onClick={() => setSelected(entry)}
                      title={entry.name}
                      aria-label={`${entry.name} (simple-icons)`}
                      className="group flex flex-col items-center justify-center gap-2 rounded-md p-3 text-muted-foreground transition-colors duration-(--uni-duration-fast) hover:bg-gray-alpha-100 hover:text-foreground"
                    >
                      <SimpleIconGlyph slug={entry.slug} className="size-5 transition-colors" />
                      <span className="w-full truncate text-center text-label-12">{entry.name}</span>
                    </button>
                  ) : null,
                )}
              </div>
            )}
          </section>
        </div>
      )}

      <Modal open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        {selected ? (
          <ModalContent showCloseButton>
            <ModalHeader>
              <ModalTitle translate="no">{selected.name}</ModalTitle>
              <p className="text-copy-14 text-muted-foreground">
                <span className="rounded-sm border border-gray-alpha-400 px-1.5 py-0.5 text-label-12" translate="no">
                  {libLabel}
                </span>
                <span className="ml-2">
                  {isLucide
                    ? demoText(language, "Stroke icon with configurable weight.")
                    : demoText(language, "Brand icon rendered from the simple-icons CDN.")}
                </span>
              </p>
            </ModalHeader>

            <div className="mt-5 flex h-40 items-center justify-center rounded-lg border border-gray-alpha-400 bg-background-200">
              {selected.lib === "lucide" ? (
                <selected.Icon
                  size={settings.size}
                  strokeWidth={settings.strokeWidth}
                  absoluteStrokeWidth={settings.absoluteStrokeWidth}
                  color={settings.color}
                  aria-hidden
                />
              ) : (
                <SimpleIconGlyph slug={selected.slug} size={settings.size} color={settings.color} />
              )}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
              <div>
                <Label id="icon-color" value={demoText(language, "Color")} />
                <input
                  id="icon-color"
                  type="color"
                  value={settings.color}
                  onChange={(event) =>
                    setSettings((prev) => ({ ...prev, color: event.target.value }))
                  }
                  className="h-8 w-full cursor-pointer rounded-md border border-gray-alpha-400 bg-background-100 p-1"
                />
              </div>
              <div>
                <Label id="icon-size" value={demoText(language, "Size")} />
                <Input
                  id="icon-size"
                  type="number"
                  min={8}
                  max={128}
                  value={settings.size}
                  onChange={(event) =>
                    setSettings((prev) => ({ ...prev, size: Number(event.target.value) || 0 }))
                  }
                />
              </div>
              {isLucide ? (
                <>
                  <div>
                    <Label id="icon-stroke-width" value={demoText(language, "Stroke Width")} />
                    <Input
                      id="icon-stroke-width"
                      type="number"
                      min={0.5}
                      max={4}
                      step={0.5}
                      value={settings.strokeWidth}
                      onChange={(event) =>
                        setSettings((prev) => ({
                          ...prev,
                          strokeWidth: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 text-copy-14 text-muted-foreground">
                      <Checkbox
                        id="icon-absolute-stroke-width"
                        checked={settings.absoluteStrokeWidth}
                        onChange={() =>
                          setSettings((prev) => ({
                            ...prev,
                            absoluteStrokeWidth: !prev.absoluteStrokeWidth,
                          }))
                        }
                      />
                      {demoText(language, "Absolute Stroke Width")}
                    </label>
                  </div>
                </>
              ) : null}
            </div>

            <div className="mt-5">
              <p className="mb-2 text-label-13 text-muted-foreground">
                {demoText(language, "Example")}
              </p>
              <CodeBlockComponent language="tsx" hideLineNumbers>
                {exampleCode}
              </CodeBlockComponent>
            </div>
          </ModalContent>
        ) : null}
      </Modal>
    </div>
  );
}
