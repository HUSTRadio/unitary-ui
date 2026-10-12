import { Select } from "@hustradio/unitary-ui";
import { ArrowUpCircle } from "lucide-react";

export function SelectPrefixAndSuffix99076368Example() {
  const icon = <ArrowUpCircle aria-hidden />;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
      <Select aria-label="Small" placeholder="Small" size="small" prefix={icon} suffix={icon} />
      <Select aria-label="Default" placeholder="Default" prefix={icon} suffix={icon} />
      <Select aria-label="Large" placeholder="Large" size="large" prefix={icon} suffix={icon} />
    </div>
  );
}
