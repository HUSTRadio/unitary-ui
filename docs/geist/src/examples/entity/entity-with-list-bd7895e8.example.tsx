import { Button } from "@/components/ui/button";
import { Entity, EntityAction, EntityContent, EntityDescription, EntityTitle } from "@/components/ui/entity";

export function EntityEntityWithListBD7895E8Example() {
  return (
    <ul className="flex flex-col">
      <Entity>
        <EntityContent>
          <EntityTitle>GitHub Desktop on MacBook Pro</EntityTitle>
          <EntityDescription>Last used just now</EntityDescription>
        </EntityContent>
        <EntityAction>
          <Button size="small" type="secondary">
            Decline
          </Button>
        </EntityAction>
      </Entity>
      <Entity>
        <EntityContent>
          <EntityTitle>VS Code on Windows 11</EntityTitle>
          <EntityDescription>Last used 10min ago</EntityDescription>
        </EntityContent>
        <EntityAction>
          <Button size="small" type="secondary">
            Decline
          </Button>
        </EntityAction>
      </Entity>
      <Entity>
        <EntityContent>
          <EntityTitle>Terminal on Ubuntu 24.04</EntityTitle>
          <EntityDescription>Last used 25min ago</EntityDescription>
        </EntityContent>
        <EntityAction>
          <Button size="small" type="secondary">
            Decline
          </Button>
        </EntityAction>
      </Entity>
    </ul>
  );
}
