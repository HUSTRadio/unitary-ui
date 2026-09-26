import { Input } from "@/components/ui/input";
import { ArrowUpCircle } from "lucide-react";

export function InputDisabled17EB3C01Example() {
  const icon = <ArrowUpCircle aria-hidden />;

  return (
    <div className="flex flex-col items-start justify-start gap-4">
      <Input disabled placeholder="Disabled with placeholder" />
      <Input disabled defaultValue="Disabled with value" />
      <Input disabled placeholder="Disabled with prefix" prefix={icon} />
      <Input disabled placeholder="Disabled with suffix" suffix={icon} />
      <Input disabled placeholder="Disabled with prefix and suffix" prefix="https://" suffix=".com" />
      <Input
        disabled
        placeholder="Disabled with prefix and suffix"
        prefix={icon}
        prefixStyling={false}
        suffix={icon}
        suffixStyling={false}
      />
    </div>
  );
}
