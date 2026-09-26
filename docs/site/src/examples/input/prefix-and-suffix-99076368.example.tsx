import { Input } from "@/components/ui/input";
import { ArrowUpCircle } from "lucide-react";

export function InputPrefixAndSuffix99076368Example() {
  const icon = <ArrowUpCircle aria-hidden />;

  return (
    <div className="flex flex-col items-start justify-start gap-6">
      <Input placeholder="Default" prefix={icon} />
      <Input placeholder="Default" suffix={icon} />
      <Input placeholder="Default" prefix="https://" suffix=".com" />
      <Input
        placeholder="Default"
        prefix={icon}
        prefixStyling={false}
        suffix={icon}
        suffixStyling={false}
      />
      <Input placeholder="Default" prefix="vercel/" suffix={icon} suffixStyling={false} />
    </div>
  );
}
