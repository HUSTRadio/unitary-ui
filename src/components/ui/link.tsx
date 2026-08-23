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
 * 文本超链接：http(s) 外链与 `gh:` / `github:` 快捷书写自动
 * `target="_blank"` + `rel="noreferrer"` 并附 ExternalLink 图标；
 * 站内相对路径保持普通锚点。按钮形态的外链请用 `<Button variant="link">`。
 */
function Link({ href, iconSide = "right", children, className, ...props }: LinkProps) {
  const resolved = resolveHref(href);
  const isExternal = /^https?:\/\//i.test(resolved ?? "");
  const icon = <ExternalLink aria-hidden className="size-3.5 shrink-0 text-gray-700" />;

  return (
    <a
      href={resolved}
      {...(isExternal ? { target: "_blank", rel: "noreferrer" } : null)}
      className={cn(
        "underline decoration-gray-alpha-400 underline-offset-4 transition-colors duration-150 hover:text-foreground",
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
