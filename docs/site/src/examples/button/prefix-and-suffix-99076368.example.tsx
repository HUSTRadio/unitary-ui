import { Button } from "@hustradio/unitary-ui";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function ButtonPrefixAndSuffix99076368Example() {
  return (
    <div className="flex flex-col items-start gap-4 md:flex-row">
      <Button prefix={<ArrowLeft />} typeName="button">Upload</Button>
      <Button suffix={<ArrowRight />} typeName="button">Upload</Button>
      <Button prefix={<ArrowLeft />} suffix={<ArrowRight />} typeName="button">Upload</Button>
    </div>
  );
}
