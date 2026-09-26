import { Button } from "@/components/ui/button";

export function ButtonDisabledVariantsCB2C3BEAExample() {
  return (
    <div className="flex flex-col items-start gap-4 md:flex-row">
      <Button disabled typeName="button">Default</Button>
      <Button disabled type="secondary" typeName="button">Secondary</Button>
      <Button disabled type="tertiary" typeName="button">Tertiary</Button>
      <Button disabled type="error" typeName="button">Error</Button>
      <Button disabled type="warning" typeName="button">Warning</Button>
    </div>
  );
}
