import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonMask } from "@/components/ui/skeleton-mask";

/**
 * SkeletonMask 用法：把「骨架模板」和「真实内容」一起交给它，由 masked 决定显示哪一侧。
 * 骨架模板与真实卡片同构（头像 40px + 两行文本），因此 unmask 时不发生任何位移。
 */
function ProfileSkeleton() {
  return (
    <div className="flex w-[280px] items-center gap-3 rounded-[8px] border border-gray-alpha-400 p-3">
      <Skeleton height={40} pill width={40} />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton height={14} width="60%" />
        <Skeleton height={12} width="85%" />
      </div>
    </div>
  );
}

function ProfileCard() {
  return (
    <div className="flex w-[280px] items-center gap-3 rounded-[8px] border border-gray-alpha-400 p-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-alpha-200 text-label-14">
        LR
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate text-label-14 text-foreground">Lena Roy</p>
        <p className="truncate text-copy-13 text-muted-foreground">Staff engineer · Berlin</p>
      </div>
    </div>
  );
}

export function SkeletonMaskUsage21B111CBExample() {
  // masked 由调用方持有（这里固定为遮罩态，静态展示两侧的对应关系）；
  // 需要可交互的切换见 Controlled toggle 示例。
  return (
    <SkeletonMask label="Loading profile" masked skeleton={<ProfileSkeleton />}>
      <ProfileCard />
    </SkeletonMask>
  );
}
