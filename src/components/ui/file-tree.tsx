import * as React from "react";
import { File, Folder, FolderOpen } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * FileTree — Geist 官方 File Tree 规范（docs/geist-markdown-refs/components/file-tree.md 实测语义）。
 * 官方实测：ul/li 层级树；行高 28px（h-7）、13px mono、pad 4px 8px、radius 4px、图标 16px；
 * 文件夹行是 <button>（点击展开/收起，子节点随状态卸载），文件行是 <a>（可带 href）；
 * 每层缩进 ≈23px；文件夹图标随开合切换 open/closed 两套 path。
 * 本实现额外补齐 tree 语义：role="tree" / treeitem / group + aria-expanded。
 */

const FILE_ICONS = {
  file: File,
  folder: Folder,
  "folder-open": FolderOpen,
} as const;

type FileTreeProps = React.ComponentProps<"ul">;
type FileTreeIconType = keyof typeof FILE_ICONS;
type FileTreeLabelProps = React.HTMLAttributes<HTMLSpanElement>;
type FileTreeIconProps = React.SVGProps<SVGSVGElement> & {
  type?: FileTreeIconType;
};

function FileTree({ className, ...props }: FileTreeProps) {
  return (
    <ul
      data-slot="file-tree"
      role="tree"
      className={cn("flex flex-col gap-0.5 text-copy-13", className)}
      {...props}
    />
  );
}

interface FileTreeItemProps extends React.HTMLAttributes<HTMLLIElement> {
  /** 初始展开态（非受控）；缺省时按行首文件夹图标推断（folder-open → 展开） */
  defaultOpen?: boolean;
  /** 受控展开态（与 onOpenChange 搭配） */
  open?: boolean;
  /** 展开态变化回调 */
  onOpenChange?: (open: boolean) => void;
  /** 文件链接：提供后该行渲染为 <a> */
  href?: string;
}

function FileTreeItem({
  className,
  children,
  defaultOpen,
  open,
  onOpenChange,
  href,
  ...props
}: FileTreeItemProps) {
  // 行内容（icon/label）与嵌套条目分离：嵌套 FileTreeItem 渲染在折叠容器中
  const row: React.ReactNode[] = [];
  const nested: React.ReactNode[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === FileTreeItem) {
      nested.push(child);
    } else {
      row.push(child);
    }
  });

  const expandable = nested.length > 0;
  const iconType = findFolderIconType(row);
  const [internalOpen, setInternalOpen] = React.useState<boolean>(
    defaultOpen ?? iconType === "folder-open",
  );
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleToggle = () => {
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  // 可展开的文件夹行：图标随开合状态切换（folder ↔ folder-open）
  const rowChildren = expandable ? syncFolderIcon(row, isOpen) : row;

  const rowClassName =
    "flex h-7 w-full cursor-pointer items-center gap-2 rounded-sm px-2 text-left hover:bg-gray-alpha-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

  let rowElement: React.ReactNode;
  if (expandable) {
    rowElement = (
      <button
        type="button"
        data-slot="file-tree-toggle"
        aria-expanded={isOpen}
        onClick={handleToggle}
        className={cn("bg-transparent", rowClassName)}
      >
        {rowChildren}
      </button>
    );
  } else if (href) {
    rowElement = (
      <a href={href} data-slot="file-tree-link" className={cn("no-underline", rowClassName)}>
        {rowChildren}
      </a>
    );
  } else {
    rowElement = (
      <div data-slot="file-tree-row" className={rowClassName}>
        {rowChildren}
      </div>
    );
  }

  return (
    <li
      data-slot="file-tree-item"
      role="treeitem"
      aria-expanded={expandable ? isOpen : undefined}
      className={cn("flex flex-col", className)}
      {...props}
    >
      {rowElement}
      {expandable && isOpen && (
        <ul data-slot="file-tree-nested" role="group" className="flex flex-col gap-0.5 pl-[23px]">
          {nested}
        </ul>
      )}
    </li>
  );
}

function FileTreeLabel({ className, ...props }: FileTreeLabelProps) {
  return (
    <span
      data-slot="file-tree-label"
      className={cn(
        "truncate font-mono text-copy-13 text-foreground leading-7 text-center",
        className,
      )}
      {...props}
    />
  );
}

function FileTreeIcon({ className, type = "file", ...props }: FileTreeIconProps) {
  const Icon = FILE_ICONS[type];
  return (
    <Icon
      data-slot="file-tree-icon"
      className={cn("size-4 shrink-0 text-muted-foreground", className)}
      aria-hidden
      {...props}
    />
  );
}

/** 取行首文件夹图标类型（folder / folder-open），用于推断默认展开态 */
function findFolderIconType(children: React.ReactNode): FileTreeIconType | undefined {
  let type: FileTreeIconType | undefined;
  React.Children.forEach(children, (child) => {
    if (type) return;
    if (React.isValidElement(child) && child.type === FileTreeIcon) {
      const t = (child.props as { type?: FileTreeIconType }).type;
      if (t === "folder" || t === "folder-open") type = t;
    }
  });
  return type;
}

/** 将行内文件夹图标与开合状态同步 */
function syncFolderIcon(children: React.ReactNode, open: boolean): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === FileTreeIcon) {
      const t = (child.props as { type?: FileTreeIconType }).type;
      if (t === "folder" || t === "folder-open") {
        return React.cloneElement(child as React.ReactElement<{ type?: FileTreeIconType }>, {
          type: open ? "folder-open" : "folder",
        });
      }
    }
    return child;
  });
}

export { FileTree, FileTreeItem, FileTreeLabel, FileTreeIcon };
export type {
  FileTreeProps,
  FileTreeItemProps,
  FileTreeLabelProps,
  FileTreeIconProps,
  FileTreeIconType,
};
