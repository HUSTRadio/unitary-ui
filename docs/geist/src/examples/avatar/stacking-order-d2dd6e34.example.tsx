import { AvatarGroup } from "@/components/ui/avatar";

export function AvatarStackingOrderD2DD6E34Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <AvatarGroup
        members={[
          { username: "evilrabbit" },
          { username: "severinlandolt" },
          { username: "rauchg" },
        ]}
        size={32}
      />
      <AvatarGroup
        reverse
        members={[
          { username: "evilrabbit" },
          { username: "severinlandolt" },
          { username: "rauchg" },
        ]}
        size={32}
      />
    </div>
  );
}
