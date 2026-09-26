import { Button } from "@/components/ui/button";

export function ButtonLoadingB4A070A2Example() {
  return (
    <div className="flex flex-col items-start gap-4 md:flex-row">
      <Button loading size="small" typeName="button">Upload</Button>
      <Button loading typeName="button">Upload</Button>
      <Button loading size="large" typeName="button">Upload</Button>
    </div>
  );
}
