import { Separator } from "@/components/ui/separator";

export function SeparatorOrientationVariants25A5D06AExample() {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-2 text-label-14">Horizontal Separators</h4>
        <div className="space-y-2">
          <p className="text-copy-14">Content above separator</p>
          <Separator orientation="horizontal" />
          <p className="text-copy-14">Content below separator</p>
        </div>
      </div>
      <div>
        <h4 className="mb-2 text-label-14">Vertical Separators</h4>
        <div className="flex h-6 items-center space-x-2">
          <span className="text-copy-14">Left</span>
          <Separator orientation="vertical" />
          <span className="text-copy-14">Center</span>
          <Separator orientation="vertical" />
          <span className="text-copy-14">Right</span>
        </div>
      </div>
    </div>
  );
}
