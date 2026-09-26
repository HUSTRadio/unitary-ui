import { Button } from "@/components/ui/button";

export function ButtonAllTypesAndSizesInComparisonF6E8021DExample() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button size="small" type="default" typeName="button">Upload</Button>
        <Button size="small" type="error" typeName="button">Upload</Button>
        <Button size="small" type="warning" typeName="button">Upload</Button>
        <Button size="small" type="secondary" typeName="button">Upload</Button>
        <Button size="small" type="tertiary" typeName="button">Upload</Button>
      </div>
      <div className="flex items-center gap-3">
        <Button type="default" typeName="button">Upload</Button>
        <Button type="error" typeName="button">Upload</Button>
        <Button type="warning" typeName="button">Upload</Button>
        <Button type="secondary" typeName="button">Upload</Button>
        <Button type="tertiary" typeName="button">Upload</Button>
      </div>
      <div className="flex items-center gap-3">
        <Button size="large" type="default" typeName="button">Upload</Button>
        <Button size="large" type="error" typeName="button">Upload</Button>
        <Button size="large" type="warning" typeName="button">Upload</Button>
        <Button size="large" type="secondary" typeName="button">Upload</Button>
        <Button size="large" type="tertiary" typeName="button">Upload</Button>
      </div>
    </div>
  );
}
