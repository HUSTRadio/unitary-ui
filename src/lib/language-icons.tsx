import { resolveLanguageKey } from "@/lib/highlight";

/** 语言 key → simpleicons CDN slug（mask 出形状 + currentColor 填充）。 */
const LANGUAGE_ICON_SLUGS: Record<string, string> = {
  markup: "html5",
  html: "html5",
  javascript: "javascript",
  jsx: "react",
  typescript: "typescript",
  tsx: "typescript",
  json: "json",
  bash: "gnubash",
};

/** 默认代码图标（fallback，`</>` 尖括号）。 */
export function CodeBlockFileIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      <path d="m8 6-6 6 6 6" />
      <path d="m16 6 6 6-6 6" />
    </svg>
  );
}

/** 按语言渲染对应图标（CDN mask + currentColor 单色）；未知语言回退默认文件图标。 */
export function LanguageIcon({ language }: { language?: string }) {
  const key = resolveLanguageKey(language);
  const slug = key ? LANGUAGE_ICON_SLUGS[key] : undefined;
  if (!slug) return <CodeBlockFileIcon />;
  const url = `https://cdn.simpleicons.org/${slug}`;
  return (
    <span
      aria-hidden
      className="size-4 shrink-0"
      style={{
        backgroundColor: "currentColor",
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
  );
}
