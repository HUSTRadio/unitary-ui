import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonMask } from "@/components/ui/skeleton-mask";
import { useState } from "react";

const ROWS = [
  ["Brake Pads Set", "$5,000.00"],
  ["Oil Filters", "$2,000.00"],
  ["Car Batteries", "$5,000.00"],
] as const;

/** 表格骨架复刻真实列宽，切换时不会横向跳动。 */
function TableSkeleton() {
  return (
    <div className="flex w-[320px] flex-col gap-2">
      {ROWS.map(([product]) => (
        <div key={product} className="flex items-center justify-between gap-4">
          <Skeleton height={14} width="55%" />
          <Skeleton height={14} width={72} />
        </div>
      ))}
    </div>
  );
}

function Table() {
  return (
    <div className="flex w-[320px] flex-col">
      {ROWS.map(([product, charge]) => (
        <div
          key={product}
          className="flex items-center justify-between gap-4 border-b border-gray-alpha-400 py-2 text-copy-14 last:border-0"
        >
          <span className="truncate text-foreground">{product}</span>
          <span className="shrink-0 tabular-nums text-muted-foreground">{charge}</span>
        </div>
      ))}
    </div>
  );
}

export function SkeletonMaskControlledToggle4D5A1E07Example() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex flex-col items-start gap-4">
      <SkeletonMask
        className="min-w-[320px]"
        label="Loading order lines"
        masked={loading}
        liveRegion
        skeleton={<TableSkeleton />}
      >
        <Table />
      </SkeletonMask>
      <Button size="small" onClick={() => setLoading((value) => !value)}>
        {loading ? "Unmask" : "Mask"}
      </Button>
    </div>
  );
}
