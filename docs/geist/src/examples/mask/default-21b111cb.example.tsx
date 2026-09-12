import { Mask } from "@/components/ui/mask";
import { Skeleton } from "@/components/ui/skeleton";

/** 骨架模板：与真实卡片同构（头像 40px + 两行文本），unmask 时不发生位移。 */
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
        <p className="truncate text-label-14 text-gray-1000">Lena Roy</p>
        <p className="truncate text-copy-13 text-muted-foreground">Staff engineer · Berlin</p>
      </div>
    </div>
  );
}

export function MaskDefault21B111CBExample() {
  return (
    <Mask label="Loading profile" skeleton={<ProfileSkeleton />}>
      <ProfileCard />
    </Mask>
  );
}
