import * as React from "react";

import { BottomSheet, type BottomSheetProps } from "@/components/ui/bottom-sheet";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * ActivityView — Apple HIG「Activity Views」的 Geist 化实现：底部分享面板。
 *
 * 结构（与 HIG 一致）：
 * 1. 标题（可选，默认 "Share"）；
 * 2. **分享目标网格**：横向滚动的 app / 服务项（图标 + 名称）；
 * 3. **操作列表**：Copy、Print、Save to Files 等（图标 + 标题，destructive 标红）；
 * 4. 取消行（默认渲染）。
 *
 * 与 BottomSheet 的关系：BottomSheet 只提供"多档位底部弹层容器"，
 * 本组件是它的**内容层**——分享目标与操作列表的排布语义，两者不合并。
 * 选择任意目标或操作后触发回调并关闭面板（HIG：活动是一次性动作）。
 * 手势：渲染触控指示条并支持下拉关闭（单档位 0.6，不支持上拉展开）；
 * 需要多档位拖拽或去掉指示条时用 sheetProps 覆盖。
 *
 * ```tsx
 * <ActivityView
 *   open={open}
 *   onOpenChange={setOpen}
 *   targets={[{ id: "copy", icon: <Copy />, title: "Copy", onSelect: share }]}
 *   actions={[{ id: "print", icon: <Printer />, title: "Print", onSelect: print }]}
 * />
 * ```
 */

export interface ActivityTarget {
  id: string;
  /** 目标图标（20px 档，渲染在 48px 圆角方块内） */
  icon: React.ReactNode;
  /** 目标名称（单行截断） */
  title: React.ReactNode;
  onSelect: () => void;
}

export interface ActivityAction {
  id: string;
  /** 行首图标（20px 档） */
  icon?: React.ReactNode;
  title: React.ReactNode;
  onSelect: () => void;
  /** 破坏性操作（标红） */
  destructive?: boolean;
}

export interface ActivityViewProps {
  /** 受控打开状态 */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 分享目标（网格区） */
  targets?: readonly ActivityTarget[];
  /** 操作列表 */
  actions?: readonly ActivityAction[];
  /** 面板标题；传 null 则不渲染标题行 */
  title?: React.ReactNode;
  /** 底部取消行，默认 true */
  showCancel?: boolean;
  /**
   * 透传给底层 BottomSheet（放在默认配置之后展开，可覆盖 detents / showIndicator /
   * gestures 等）。需要多档位拖拽或自定义面板高度时用；多数场景保持默认即可。
   */
  sheetProps?: Partial<Omit<BottomSheetProps, "open" | "onOpenChange" | "children">>;
  className?: string;
}

function ActivityView({
  open,
  onOpenChange,
  targets,
  actions,
  title,
  showCancel = true,
  sheetProps,
  className,
}: ActivityViewProps) {
  const { t } = useI18n();
  const close = React.useCallback(() => onOpenChange(false), [onOpenChange]);
  /** 活动是一次性动作：执行后即关闭面板。 */
  const run = React.useCallback(
    (action: () => void) => {
      action();
      close();
    },
    [close],
  );

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      detents={[0.6]}
      // 指示条 + 下拉关闭（HIG：分享面板可下拉收起）；单档位下 resize 只表现为
      // “跟手下拉 → 松手回弹或关闭”，expandUp:false 把上拉锁在最高档。
      showIndicator
      gestures={{ expandUp: false }}
      {...sheetProps}
      // 面板 Content 不带内边距：触控指示条相对面板全宽真居中，且不受内容区
      // 滚动条宽度影响；内边距由下方内容 wrapper 承担。
      // pt-1.5 使指示条与面板顶缘的间距（15px）与指示条到标题的间距（16px）均衡
      className={cn("flex flex-col pt-1.5", sheetProps?.className)}
    >
      <div
        className={cn(
          // pb-4 与 pt-4 对称；取消行 mt-auto 贴内容区底部（HIG 分享面板的取消行
          // 固定在下缘），内容不足时中间留白、底部不悬空。
          "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pt-4 pb-4",
          className,
        )}
      >
      {title !== null ? (
        // 面板标题是说明性文字（copy 系列），不是控件标签（label 系列）；
        // HIG 分享面板的标题在面板顶部居中显示
        <h2
          data-slot="activity-view-title"
          className="text-center text-copy-14 text-gray-1000"
        >
          {title ?? t("Share")}
        </h2>
      ) : null}

      {targets && targets.length > 0 ? (
        <div
          data-slot="activity-view-targets"
          className="flex gap-3 overflow-x-auto overscroll-x-contain pb-1"
        >
          {targets.map((target) => (
            <button
              key={target.id}
              type="button"
              onClick={() => run(target.onSelect)}
              className="flex w-16 shrink-0 flex-col items-center gap-1.5 outline-none"
            >
              <span
                aria-hidden="true"
                className="flex size-12 items-center justify-center rounded-[14px] bg-gray-alpha-100 text-gray-1000 [&_svg]:size-5"
              >
                {target.icon}
              </span>
              {/* 目标名是按钮标签：对齐控件标签惯例（label 系列 + 主文字色，
                  同 menu-bar trigger / toolbar item） */}
              <span className="w-full truncate text-center text-label-13 text-gray-1000">
                {target.title}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {actions && actions.length > 0 ? (
        // 操作组（HIG：操作与分享目标是两个视觉组）无描边框：容器只负责用圆角 +
        // overflow 收住行的激活态背景，避免 hover 灰底通栏到面板边缘。
        <div data-slot="activity-view-actions" className="overflow-hidden rounded-overlay">
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => run(action.onSelect)}
              className={cn(
                "flex h-11 w-full items-center gap-3 px-3 text-left text-label-14 outline-none transition-colors hover:bg-gray-alpha-100 focus-visible:bg-gray-alpha-100",
                action.destructive ? "text-[#ee0000]" : "text-gray-1000",
              )}
            >
              {action.icon ? (
                <span
                  aria-hidden="true"
                  className="flex size-5 shrink-0 items-center justify-center [&_svg]:size-5"
                >
                  {action.icon}
                </span>
              ) : null}
              <span className="min-w-0 truncate">{action.title}</span>
            </button>
          ))}
        </div>
      ) : null}

      {showCancel ? (
        <button
          type="button"
          data-slot="activity-view-cancel"
          onClick={close}
          className="mt-auto h-11 shrink-0 rounded-overlay-item text-label-14 text-gray-1000 outline-none transition-colors hover:bg-gray-alpha-100"
        >
          {t("Cancel")}
        </button>
      ) : null}
      </div>
    </BottomSheet>
  );
}

export { ActivityView };
