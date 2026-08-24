import * as React from "react";
import { ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";

export interface LinkProps extends React.ComponentProps<"a"> {
  /** 外链图标位置；默认 right */
  iconSide?: "left" | "right";
}

/** `gh:` / `github:` 快捷前缀 → GitHub 仓库地址 */
function resolveHref(href?: string): string | undefined {
  if (!href) return href;
  const match = /^(?:gh|github):(.+)$/i.exec(href);
  return match ? `https://github.com/${match[1]}` : href;
}

/**
 * 代码托管平台 → simpleicons slug。命中域名时链接显示平台品牌图标
 * （mask + currentColor，与 CodeBlock 语言图标同一渲染模式），
 * 且不再叠加 ExternalLink 通用外链图标——品牌图标本身已传达
 * 「跳转到外部平台」，叠加反而视觉冗余。
 */
const FORGE_SLUGS: ReadonlyArray<{ host: RegExp; slug: string }> = [
  { host: /(^|\.)github\.com$/i, slug: "github" },
  { host: /(^|\.)gitlab\.com$/i, slug: "gitlab" },
  { host: /(^|\.)gitee\.com$/i, slug: "gitee" },
  { host: /(^|\.)codeberg\.org$/i, slug: "codeberg" },
  { host: /(^|\.)bitbucket\.org$/i, slug: "bitbucket" },
  { host: /(^|\.)forgejo\.org$/i, slug: "forgejo" },
  { host: /(^|\.)sr\.ht$/i, slug: "sourcehut" },
];

function resolveForge(href: string): string | undefined {
  try {
    const host = new URL(href).hostname;
    return FORGE_SLUGS.find((f) => f.host.test(host))?.slug;
  } catch {
    return undefined;
  }
}

/** simpleicons 品牌图标：mask 出形状 + currentColor 填充（单色，随文字色）。 */
function ForgeIcon({ slug }: { slug: string }) {
  return (
    <span
      aria-hidden
      className="size-3.5 shrink-0 text-gray-700"
      style={{
        backgroundColor: "currentColor",
        WebkitMaskImage: `url(https://cdn.simpleicons.org/${slug})`,
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskImage: `url(https://cdn.simpleicons.org/${slug})`,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
      }}
    />
  );
}

/**
 * 文本超链接：http(s) 外链与 `gh:` / `github:` 快捷书写自动
 * `target="_blank"` + `rel="noreferrer"` 并附图标；代码托管平台
 * （GitHub/GitLab/Gitee/Codeberg/Bitbucket/Forgejo/SourceHut）显示
 * simpleicons 品牌图标，其余外链附 ExternalLink。站内相对路径保持普通锚点。
 * 按钮形态的外链请用 `<Button variant="link">`。
 */
function Link({ href, iconSide = "right", children, className, ...props }: LinkProps) {
  const resolved = resolveHref(href);
  const isExternal = /^https?:\/\//i.test(resolved ?? "");
  const forgeSlug = resolved && isExternal ? resolveForge(resolved) : undefined;
  const icon = forgeSlug ? (
    <ForgeIcon slug={forgeSlug} />
  ) : (
    <ExternalLink aria-hidden className="size-3.5 shrink-0 text-gray-700" />
  );

  return (
    <a
      href={resolved}
      {...(isExternal ? { target: "_blank", rel: "noreferrer" } : null)}
      className={cn(
        // 交互态（Geist 官方 TextLink 语义）：
        // hover → 前景提亮到 gray-1000；active → 轻按下透明度；
        // focus-visible → 项目统一 focus-ring 双环（仅键盘聚焦显示）
        "focus-ring rounded-[2px] underline decoration-gray-alpha-400 underline-offset-4",
        "transition-[color,opacity,text-decoration-color] duration-150 ease-out",
        "hover:text-foreground hover:decoration-gray-alpha-600",
        "active:opacity-80",
        isExternal && "inline-flex items-center gap-1",
        className,
      )}
      {...props}
    >
      {isExternal && iconSide === "left" && icon}
      {children}
      {isExternal && iconSide === "right" && icon}
    </a>
  );
}

export { Link };
