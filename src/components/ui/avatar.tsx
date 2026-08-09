import * as React from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Avatar — 官方 @vercel/geistcn Avatar 对齐实现（vercel.com/geist/avatar 实测）。
 *
 * - 尺寸：数字 size（24/32/48…）。
 * - Letter fallback：官方实测 Light bg #444 / Dark bg #999 + 白字 50% opacity（16px/500）。
 * - img object-fit: fill；根节点 role="img" + aria-label（title / "Placeholder Avatar" / "Avatar with initials: …"）。
 * - 新增 AvatarGroup{members,size,limit,overlap,reverse} / AvatarWithIcon / GitHub·GitLab·BitbucketAvatar。
 */

const AVATAR_IMG_URL: Record<string, (username: string, size: number) => string> = {
  github: (u, s) => `https://github.com/${u}.png?size=${s * 2}`,
  gitlab: (u, s) => `https://gitlab.com/${u}.png?size=${s * 2}`,
  bitbucket: (u, s) => `https://bitbucket.org/${u}/avatar/${s * 2}`,
};

/* 加载 shimmer 动画（官方 animate-loading，等价 keyframes 内联，避免改全局样式） */
const AVATAR_LOADING_CSS = `
@keyframes geist-avatar-loading {
  from { background-position: 0% 0; }
  to { background-position: 400% 0; }
}
`;

function Avatar({
  className,
  size = 32,
  src,
  username,
  letter,
  placeholder,
  title,
  alt,
  ...props
}: Omit<React.ComponentProps<typeof AvatarPrimitive.Root>, "children"> & {
  /** 数字尺寸（官方 24/32/48…） */
  size?: number;
  /** 图片地址 */
  src?: string;
  /** GitHub 用户名 → github.com 头像 */
  username?: string;
  /** 首字母 fallback（1–2 个大写字母） */
  letter?: string;
  /** 占位骨架（加载壳） */
  placeholder?: boolean;
  /** 实体名（作为 SR 标签） */
  title?: string;
  alt?: string;
}) {
  const px = size;
  const hasVisual = Boolean(src || username || letter || placeholder);
  const hasImage = Boolean(src || username);
  const imgSrc = src ?? (username ? AVATAR_IMG_URL.github(username, px) : undefined);
  const ariaLabel =
    title ??
    (placeholder ? "Placeholder Avatar" : letter ? `Avatar with initials: ${letter}` : undefined);
  const visual = hasImage ? (
    <img
      src={imgSrc}
      alt={alt ?? (username ? `Avatar for ${username}` : (title ?? ""))}
      loading="eager"
      className="relative size-full h-full w-full max-w-full"
    />
  ) : hasVisual ? (
    <span className="flex h-full items-center justify-center bg-[#444444] font-medium text-white/50 dark:bg-[#999999]">
      {letter ?? ""}
    </span>
  ) : null;

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      role="img"
      aria-label={ariaLabel}
      className={cn(
        "relative inline-block size-[var(--avatar-size)] shrink-0 overflow-hidden rounded-full align-top leading-[0] transition-[background] duration-200 ease-in-out",
        "after:pointer-events-none after:absolute after:inset-0 after:size-full after:rounded-full after:border after:border-gray-alpha-400 after:content-['']",
        hasVisual &&
          "before:pointer-events-none before:absolute before:inset-0 before:size-full before:animate-[geist-avatar-loading_1.4s_ease-in-out_infinite] before:bg-[linear-gradient(to_right_in_oklab,#fafafa,#eaeaea,#fafafa)] before:bg-[length:400%_100%] dark:before:bg-[linear-gradient(to_right_in_oklab,#111111,#333333,#111111)]",
        className,
      )}
      style={{ "--avatar-size": `${px}px` } as React.CSSProperties}
      {...props}
    >
      <style>{AVATAR_LOADING_CSS}</style>
      {visual}
    </AvatarPrimitive.Root>
  );
}

interface AvatarGroupMember {
  username: string;
  title?: string;
  [key: string]: unknown;
}

/**
 * AvatarGroup — 官方 API：members / size / limit / overlap（"auto" | 数字）/ reverse。
 * auto overlap = round(size × 0.3)（官方实测 16→5、24→7、32→10、48→14）。
 * limit 计数包含 +N 溢出片：shown = limit - 1。
 */
function AvatarGroup({
  className,
  members,
  size = 32,
  limit,
  overlap = "auto",
  reverse = false,
}: {
  className?: string;
  members: AvatarGroupMember[];
  size?: number;
  limit?: number;
  overlap?: "auto" | number;
  reverse?: boolean;
}) {
  const overlapPx = overlap === "auto" ? Math.round(size * 0.3) : overlap;
  const shown =
    limit !== undefined && members.length > limit ? members.slice(0, limit - 1) : members;
  const hiddenCount = members.length - shown.length;
  const list = reverse ? [...shown].reverse() : shown;
  const chipMember = limit !== undefined && hiddenCount > 0 ? members[limit - 1] : null;

  return (
    <div
      className={cn("flex items-center", className)}
      style={{ "--avatar-overlap": `${overlapPx}px` } as React.CSSProperties}
    >
      {list.map((member, i) => (
        <span
          key={member.username}
          className={cn(
            "relative inline-flex items-center rounded-full shadow-[0_0_0_1px_var(--color-background-100)]",
            i > 0 && "ml-[-1*var(--avatar-overlap)]",
          )}
        >
          <Avatar size={size} username={member.username} title={member.title ?? member.username} />
        </span>
      ))}
      {chipMember ? (
        <span
          aria-label={`${hiddenCount} more avatars in this group`}
          role="img"
          className="relative ml-[-1*var(--avatar-overlap)] inline-flex items-center rounded-full shadow-[0_0_0_1px_var(--color-background-100)]"
        >
          <Avatar
            size={size}
            username={chipMember.username}
            title={chipMember.title ?? chipMember.username}
          />
          <span className="absolute inset-0 flex items-center justify-center text-gray-1000 dark:text-gray-100">
            +{hiddenCount}
          </span>
        </span>
      ) : null}
    </div>
  );
}

/** AvatarWithIcon — 图标头像（iconBackground 给图标加浅色圆底） */
function AvatarWithIcon({
  className,
  icon,
  size = 32,
  iconBackground = false,
  title,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  icon: React.ReactNode;
  size?: number;
  iconBackground?: boolean;
  title?: string;
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar-with-icon"
      role="img"
      aria-label={title ?? "Avatar with icon"}
      className={cn(
        "relative inline-flex size-[var(--avatar-size)] shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-alpha-200 align-top leading-[0]",
        className,
      )}
      style={{ "--avatar-size": `${size}px` } as React.CSSProperties}
      {...props}
    >
      {iconBackground ? (
        <span className="flex size-[calc(var(--avatar-size)*0.75)] items-center justify-center rounded-full bg-background-100 shadow-[0_0_0_1px_var(--color-gray-400)]">
          {icon}
        </span>
      ) : (
        icon
      )}
    </AvatarPrimitive.Root>
  );
}

function GitHubAvatar(props: React.ComponentProps<typeof Avatar> & { username: string }) {
  return <Avatar {...props} username={props.username} />;
}

function GitLabAvatar(props: React.ComponentProps<typeof Avatar> & { username: string }) {
  return (
    <Avatar
      {...props}
      username={props.username}
      src={AVATAR_IMG_URL.gitlab(props.username, typeof props.size === "number" ? props.size : 32)}
    />
  );
}

function BitbucketAvatar(props: React.ComponentProps<typeof Avatar> & { username: string }) {
  return (
    <Avatar
      {...props}
      username={props.username}
      src={AVATAR_IMG_URL.bitbucket(
        props.username,
        typeof props.size === "number" ? props.size : 32,
      )}
    />
  );
}

export { Avatar, AvatarGroup, AvatarWithIcon, GitHubAvatar, GitLabAvatar, BitbucketAvatar };
