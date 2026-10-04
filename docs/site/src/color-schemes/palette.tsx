import type { DocsLanguage } from "../i18n/language";
import type { SchemeTokens } from "./presets";
import type { CodeColors } from "./code-themes";

const uiRoles = [
  ["--background", "画布", "Canvas"], ["--card", "表面", "Surface"], ["--secondary", "次级表面", "Subtle surface"],
  ["--foreground", "主要文字", "Primary text"], ["--muted-foreground", "次级文字", "Secondary text"],
  ["--border", "细边框", "Subtle border"], ["--border-strong", "强边框", "Strong border"],
  ["--primary", "主动作", "Primary action"], ["--action-hover", "动作悬停", "Action hover"], ["--primary-foreground", "动作文字", "Action text"],
  ["--link", "链接", "Link"], ["--focus-ring-color", "焦点环", "Focus ring"],
  ["--success", "成功", "Success"], ["--warning", "警告", "Warning"], ["--destructive", "错误", "Error"],
] as const;
const codeLabels = {
  background: ["代码背景", "Background"], surface: ["标题表面", "Header surface"], foreground: ["普通文字", "Plain text"], border: ["边框", "Border"],
  comment: ["注释", "Comments"], keyword: ["关键字", "Keywords"], string: ["字符串", "Strings"], number: ["数字", "Numbers"], boolean: ["布尔值", "Booleans"], function: ["函数", "Functions"], property: ["属性", "Properties"], type: ["类型", "Types"], variable: ["变量", "Variables"], punctuation: ["标点", "Punctuation"],
  highlight: ["高亮行", "Highlighted line"], added: ["新增行", "Added line"], removed: ["删除行", "Removed line"], referenced: ["引用行", "Referenced line"],
} as const;
type Swatch = { role: string; label: string; value: string };
export function uiSwatches(tokens: SchemeTokens, language: DocsLanguage): Swatch[] {
  return uiRoles.map(([token, zh, en]) => ({ role: token, label: language === "zh-CN" ? zh : en, value: tokens[token]! }));
}
export function codeSwatches(colors: CodeColors, language: DocsLanguage): Swatch[] {
  return Object.entries(colors).map(([role, value]) => ({ role: `--scheme-code-${role}`, label: codeLabels[role as keyof CodeColors][language === "zh-CN" ? 0 : 1], value }));
}
export function inlineSwatches(colors: { foreground: string; background: string; border: string }, language: DocsLanguage): Swatch[] {
  return Object.entries(colors).map(([role, value]) => ({ role: `--scheme-inline-${role}`, label: (language === "zh-CN" ? { foreground: "行内文字", background: "行内背景", border: "行内边框" } : { foreground: "Inline text", background: "Inline background", border: "Inline border" })[role as keyof typeof colors], value }));
}
export function PaletteSwatches({ items, label }: { items: Swatch[]; label: string }) {
  return <section aria-label={label} className="scheme-swatches">
    {items.map(item => <figure key={item.role} data-color-role={item.role} data-color-value={item.value} className="scheme-swatch">
      <span data-slot="palette-swatch" className="scheme-swatch-color" style={{ background: item.value }} aria-hidden />
      <figcaption><span className="text-label-13">{item.label}</span><code className="text-label-12 font-mono">{item.value}</code><span className="scheme-swatch-token text-label-12">{item.role}</span></figcaption>
    </figure>)}
  </section>;
}
