import { Separator } from "@/components/ui/separator";

export function SeparatorVertical34DA5602Example() {
  return (
    <div className="flex h-8 items-center space-x-4">
      <p className="text-copy-14 text-gray-1000">Home</p>
      <Separator orientation="vertical" />
      <p className="text-copy-14 text-gray-1000">About</p>
      <Separator orientation="vertical" />
      <p className="text-copy-14 text-gray-1000">Services</p>
      <Separator orientation="vertical" />
      <p className="text-copy-14 text-gray-1000">Contact</p>
    </div>
  );
}
