import { AvatarGroup } from "@/components/ui/avatar";

export function AvatarOverlap38B163F9Example() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <AvatarGroup
        overlap="auto"
        members={[
          { username: "evilrabbit" },
          { username: "severinlandolt" },
          { username: "rauchg" },
        ]}
        size={16}
      />
      <AvatarGroup
        overlap="auto"
        members={[
          { username: "evilrabbit" },
          { username: "severinlandolt" },
          { username: "rauchg" },
        ]}
        size={24}
      />
      <AvatarGroup
        overlap="auto"
        members={[
          { username: "evilrabbit" },
          { username: "severinlandolt" },
          { username: "rauchg" },
        ]}
        size={32}
      />
      <AvatarGroup
        overlap="auto"
        members={[
          { username: "evilrabbit" },
          { username: "severinlandolt" },
          { username: "rauchg" },
        ]}
        size={48}
      />
    </div>
  );
}
