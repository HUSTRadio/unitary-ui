import { AvatarGroup } from "@hustradio/unitary-ui";

export function AvatarFixedOverlapD4FD80A3Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <AvatarGroup
        overlap={10}
        members={[
          { username: "evilrabbit" },
          { username: "severinlandolt" },
          { username: "rauchg" },
        ]}
        size={24}
      />
      <AvatarGroup
        overlap={6}
        members={[
          { username: "evilrabbit" },
          { username: "severinlandolt" },
          { username: "rauchg" },
        ]}
        size={24}
      />
      <AvatarGroup
        overlap={0}
        members={[
          { username: "evilrabbit" },
          { username: "severinlandolt" },
          { username: "rauchg" },
        ]}
        size={24}
      />
    </div>
  );
}
