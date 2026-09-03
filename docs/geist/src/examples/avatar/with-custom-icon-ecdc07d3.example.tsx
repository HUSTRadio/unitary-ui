import { AvatarWithIcon } from "@/components/ui/avatar";
import { ArrowDownCircle, CircleCheck, Clock } from "lucide-react";

export function AvatarWithCustomIconECDC07D3Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <AvatarWithIcon
        icon={<ArrowDownCircle className="size-3.5" aria-hidden />}
        size={32}
        iconBackground
      />
      <AvatarWithIcon
        icon={<CircleCheck className="size-3.5" aria-hidden />}
        size={32}
        iconBackground
      />
      <AvatarWithIcon
        icon={<Clock className="size-3.5" aria-hidden />}
        size={32}
        iconBackground
      />
    </div>
  );
}
