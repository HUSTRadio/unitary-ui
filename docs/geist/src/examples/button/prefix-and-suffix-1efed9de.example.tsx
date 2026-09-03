import { Button } from "@/components/ui/button";
import { Copy, Search } from "lucide-react";

export function ButtonPrefixAndSuffix1EFED9DEExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button prefix={<Search />} typeName="button">Search</Button>
      <Button prefix={<Copy />} type="secondary" typeName="button">Copy</Button>
      <Button loading type="tertiary" typeName="button">Loading</Button>
      <Button disabled typeName="button">Disabled</Button>
    </div>
  );
}
