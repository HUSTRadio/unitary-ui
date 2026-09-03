import { Button } from "@/components/ui/button";

export function ButtonRounded01024DEEExample() {
  return (
    <div className="flex flex-col items-start gap-4 md:flex-row">
      <Button shadow shape="rounded" size="small" type="secondary" typeName="button">Upload</Button>
      <Button shadow shape="rounded" type="secondary" typeName="button">Upload</Button>
      <Button shadow shape="rounded" size="large" type="secondary" typeName="button">Upload</Button>
    </div>
  );
}
