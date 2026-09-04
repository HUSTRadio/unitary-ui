import { Button } from "@/components/ui/button";

export function ButtonSizes7C69F3FAExample() {
  return (
    <div className="flex flex-col items-start gap-4 md:flex-row">
      <Button size="small" typeName="button">Upload</Button>
      <Button typeName="button">Upload</Button>
      <Button size="large" typeName="button">Upload</Button>
    </div>
  );
}
