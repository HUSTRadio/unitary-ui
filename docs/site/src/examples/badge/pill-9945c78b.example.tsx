import { Badge } from "@hustradio/unitary-ui";
import { Shield } from "lucide-react";

export function BadgePill9945C78BExample() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="pill" size="sm">
          Label
        </Badge>
        <Badge variant="pill" size="md">
          Label
        </Badge>
        <Badge variant="pill" size="lg">
          Label
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="pill" size="sm" icon={<Shield aria-hidden />}>
          Label
        </Badge>
        <Badge variant="pill" size="md" icon={<Shield aria-hidden />}>
          Label
        </Badge>
        <Badge variant="pill" size="lg" icon={<Shield aria-hidden />}>
          Label
        </Badge>
      </div>
    </div>
  );
}
