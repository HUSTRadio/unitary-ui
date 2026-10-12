import { Badge } from "@hustradio/unitary-ui";
import { Shield } from "lucide-react";

export function BadgeWithIcons1F71F4BCExample() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge icon={<Shield aria-hidden />} size="lg" variant="gray">
          Gray
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="md" variant="gray">
          Gray
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="sm" variant="gray">
          Gray
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="lg" variant="gray" contrast="low">
          Gray
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="md" variant="gray" contrast="low">
          Gray
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="sm" variant="gray" contrast="low">
          Gray
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge icon={<Shield aria-hidden />} size="lg" variant="blue">
          Blue
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="md" variant="blue">
          Blue
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="sm" variant="blue">
          Blue
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="lg" variant="blue" contrast="low">
          Blue
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="md" variant="blue" contrast="low">
          Blue
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="sm" variant="blue" contrast="low">
          Blue
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge icon={<Shield aria-hidden />} size="lg" variant="green">
          Green
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="md" variant="green">
          Green
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="sm" variant="green">
          Green
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="lg" variant="green" contrast="low">
          Green
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="md" variant="green" contrast="low">
          Green
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="sm" variant="green" contrast="low">
          Green
        </Badge>
      </div>
    </div>
  );
}
