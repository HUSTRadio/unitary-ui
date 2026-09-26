import { AvatarGroup } from "@/components/ui/avatar";

export function AvatarGroup34CA0E76Example() {
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
        limit={4}
        members={[
          { username: "christopherkindl" },
          { username: "rauno" },
          { username: "shuding" },
          { username: "skllcrn" },
          { username: "almonk" },
        ]}
        size={32}
      />
    </div>
  );
}
