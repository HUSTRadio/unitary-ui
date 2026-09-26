import { Entity, EntityContent, EntityDescription } from "@/components/ui/entity";

export function EntityEntityWithFill1C9008CFExample() {
  return (
    <ul className="flex flex-col">
      <Entity>
        <EntityContent fill>
          <EntityDescription>This is a simple description</EntityDescription>
        </EntityContent>
        <EntityContent>
          <EntityDescription>This is a simple description</EntityDescription>
        </EntityContent>
      </Entity>
    </ul>
  );
}
