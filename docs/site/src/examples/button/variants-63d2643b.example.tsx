import { Button } from "@/components/ui/button";

export function ButtonVariants63D2643BExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button typeName="button">Default</Button>
      <Button type="secondary" typeName="button">Secondary</Button>
      <Button type="tertiary" typeName="button">Outline</Button>
      <Button type="tertiary" typeName="button">Ghost</Button>
      <Button type="error" typeName="button">Destructive</Button>
    </div>
  );
}
