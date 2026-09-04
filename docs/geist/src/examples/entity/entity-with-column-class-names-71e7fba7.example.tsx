import { Avatar } from "@/components/ui/avatar";
import { Entity, EntityAction, EntityContent, EntityDescription, EntityMedia } from "@/components/ui/entity";

export function EntityEntityWithColumnClassNames71E7FBA7Example() {
  return (
    <ul className="flex flex-col">
      <Entity
        leftClassName="border border-dashed border-gray-300 rounded-md p-2"
        rightClassName="border border-dashed border-gray-300 rounded-md p-2"
      >
        <EntityMedia>
          <Avatar placeholder size={50} />
        </EntityMedia>
        <EntityContent>
          <EntityDescription>Entity with dashed borders</EntityDescription>
        </EntityContent>
        <EntityAction>
          <span className="text-copy-14 text-gray-900">[some action]</span>
        </EntityAction>
      </Entity>
    </ul>
  );
}
