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
  Link,
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

import { Input } from "@/components/ui/input";
import { useLanguage } from "../i18n/language";
import { demoText } from "../i18n/components-demo";

/**
 * Icons 页面（/icons）— 复刻 vercel.com/geist/icons 的图标集页：
 * 标题 + 描述 + 搜索过滤 + 响应式图标网格（图标 + 名称）。
 * 图标统一 lucide-react（AGENTS.md 约定），点击图标格复制图标名。
 */

const ICONS: { name: string; Icon: LucideIcon }[] = [
  { name: "Search", Icon: Search },
  { name: "Settings", Icon: Settings },
  { name: "User", Icon: User },
  { name: "Users", Icon: Users },
  { name: "Home", Icon: Home },
  { name: "Menu", Icon: Menu },
  { name: "X", Icon: X },
  { name: "Check", Icon: Check },
  { name: "Plus", Icon: Plus },
  { name: "Minus", Icon: Minus },
  { name: "ChevronDown", Icon: ChevronDown },
  { name: "ChevronUp", Icon: ChevronUp },
  { name: "ChevronLeft", Icon: ChevronLeft },
  { name: "ChevronRight", Icon: ChevronRight },
  { name: "ArrowLeft", Icon: ArrowLeft },
  { name: "ArrowRight", Icon: ArrowRight },
  { name: "ArrowUp", Icon: ArrowUp },
  { name: "ArrowDown", Icon: ArrowDown },
  { name: "Copy", Icon: Copy },
  { name: "Edit", Icon: Edit },
  { name: "Trash", Icon: Trash },
  { name: "Download", Icon: Download },
  { name: "Upload", Icon: Upload },
  { name: "Share", Icon: Share },
  { name: "Link", Icon: Link },
  { name: "ExternalLink", Icon: ExternalLink },
  { name: "RotateCw", Icon: RotateCw },
  { name: "ZoomIn", Icon: ZoomIn },
  { name: "ZoomOut", Icon: ZoomOut },
  { name: "Filter", Icon: Filter },
  { name: "AlertCircle", Icon: AlertCircle },
  { name: "AlertTriangle", Icon: AlertTriangle },
  { name: "Info", Icon: Info },
  { name: "HelpCircle", Icon: HelpCircle },
  { name: "Loader2", Icon: Loader2 },
  { name: "Eye", Icon: Eye },
  { name: "EyeOff", Icon: EyeOff },
  { name: "Star", Icon: Star },
  { name: "Heart", Icon: Heart },
  { name: "ThumbsUp", Icon: ThumbsUp },
  { name: "Bookmark", Icon: Bookmark },
  { name: "Flag", Icon: Flag },
  { name: "Bell", Icon: Bell },
  { name: "BellOff", Icon: BellOff },
  { name: "File", Icon: File },
  { name: "FileText", Icon: FileText },
  { name: "Folder", Icon: Folder },
  { name: "FolderPlus", Icon: FolderPlus },
  { name: "Archive", Icon: Archive },
  { name: "Mail", Icon: Mail },
  { name: "MessageCircle", Icon: MessageCircle },
  { name: "Send", Icon: Send },
  { name: "Inbox", Icon: Inbox },
  { name: "Image", Icon: Image },
  { name: "Camera", Icon: Camera },
  { name: "Music", Icon: Music },
  { name: "Play", Icon: Play },
  { name: "Pause", Icon: Pause },
  { name: "Video", Icon: Video },
  { name: "Mic", Icon: Mic },
  { name: "Shield", Icon: Shield },
  { name: "Lock", Icon: Lock },
  { name: "Unlock", Icon: Unlock },
  { name: "Key", Icon: Key },
  { name: "Clock", Icon: Clock },
  { name: "Calendar", Icon: Calendar },
  { name: "Timer", Icon: Timer },
  { name: "Hourglass", Icon: Hourglass },
  { name: "MapPin", Icon: MapPin },
  { name: "Navigation", Icon: Navigation },
  { name: "Compass", Icon: Compass },
  { name: "Globe", Icon: Globe },
  { name: "Smartphone", Icon: Smartphone },
  { name: "Monitor", Icon: Monitor },
  { name: "Laptop", Icon: Laptop },
  { name: "Wifi", Icon: Wifi },
  { name: "Bluetooth", Icon: Bluetooth },
  { name: "Battery", Icon: Battery },
  { name: "Sun", Icon: Sun },
  { name: "Moon", Icon: Moon },
  { name: "Cloud", Icon: Cloud },
  { name: "CloudUpload", Icon: CloudUpload },
  { name: "CloudDownload", Icon: CloudDownload },
  { name: "Droplet", Icon: Droplet },
  { name: "Flame", Icon: Flame },
  { name: "Zap", Icon: Zap },
  { name: "Database", Icon: Database },
  { name: "Terminal", Icon: Terminal },
  { name: "Command", Icon: Command },
  { name: "Code", Icon: Code },
  { name: "Tag", Icon: Tag },
  { name: "Wallet", Icon: Wallet },
  { name: "CreditCard", Icon: CreditCard },
  { name: "ShoppingCart", Icon: ShoppingCart },
  { name: "Package", Icon: Package },
  { name: "Truck", Icon: Truck },
  { name: "Briefcase", Icon: Briefcase },
  { name: "HardDrive", Icon: HardDrive },
  { name: "Rocket", Icon: Rocket },
  { name: "Sparkles", Icon: Sparkles },
  { name: "Lightbulb", Icon: Lightbulb },
  { name: "PenTool", Icon: PenTool },
  { name: "Palette", Icon: Palette },
  { name: "Layers", Icon: Layers },
  { name: "Wrench", Icon: Wrench },
  { name: "Power", Icon: Power },
  { name: "Gift", Icon: Gift },
  { name: "Award", Icon: Award },
  { name: "Trophy", Icon: Trophy },
  { name: "Target", Icon: Target },
  { name: "TrendingUp", Icon: TrendingUp },
  { name: "TrendingDown", Icon: TrendingDown },
];

export function IconsPage() {
  const { language } = useLanguage();
  const [query, setQuery] = React.useState("");
  const [copied, setCopied] = React.useState<string | null>(null);
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? ICONS.filter(({ name }) => name.toLowerCase().includes(normalized))
    : ICONS;

  const handleCopy = async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = name;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setCopied(name);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div>
      <h1 className="text-heading-24 sm:text-heading-40 text-foreground">
        {demoText(language, "Icons")}
      </h1>
      <p className="mt-3 max-w-xl text-copy-20 text-muted-foreground">
        {demoText(language, "Icon set tailored for developer tools.")}
      </p>

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
        <p className="mt-10 text-copy-14 text-muted-foreground">
          {demoText(language, "No icons match your search.")}
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-3 gap-1 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8">
          {filtered.map(({ name, Icon }) => (
            <button
              key={name}
              type="button"
              onClick={() => handleCopy(name)}
              title={name}
              aria-label={`${name}${copied === name ? " — copied" : ""}`}
              className="group flex flex-col items-center justify-center gap-2 rounded-md p-3 text-muted-foreground transition-colors duration-150 hover:bg-gray-alpha-100 hover:text-foreground"
            >
              <Icon className="size-5 transition-colors" strokeWidth={1.5} aria-hidden />
              <span className="w-full truncate text-center text-label-12">{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
