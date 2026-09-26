import { Avatar } from "@/components/ui/avatar";
import { Entity, EntityAction, EntityContent, EntityDescription, EntityMedia, EntityTitle } from "@/components/ui/entity";

export function EntityDefault37A8EEC1Example() {
  return (
    <Entity>
      <EntityMedia>
        <Avatar size={32} username="evilrabbit" />
      </EntityMedia>
      <EntityContent fill>
        <EntityTitle>Evil Rabbit</EntityTitle>
        <EntityDescription>Glenn Hitchcock (@gln)</EntityDescription>
      </EntityContent>
      <EntityAction>
        <p className="text-copy-14 text-muted-foreground">Connected 1h ago</p>
      </EntityAction>
    </Entity>
  );
}
