import { Badge } from "@hustradio/unitary-ui";
import { Bell } from "lucide-react";

/**
 * 圆角矩形 + compact（+ soft 底色）：导航状态标记这类密集场景的标准组合。
 * 与全圆胶囊（默认）对照，几何只有圆角与内边距两处差异。
 */
export function BadgeCompactRounded7C41E2A8Example() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge shape="rounded" size="compact" variant="gray" contrast="soft">
          Updated
        </Badge>
        <Badge shape="rounded" size="compact" variant="blue" contrast="soft">
          New
        </Badge>
        <Badge shape="rounded" size="compact" variant="green" contrast="soft">
          Healthy
        </Badge>
        <Badge shape="rounded" size="compact" variant="amber" contrast="soft">
          Warning
        </Badge>
        <Badge shape="rounded" size="compact" variant="red" contrast="soft">
          Failed
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge shape="pill" size="compact" variant="blue" contrast="soft">
          Pill compact
        </Badge>
        <Badge shape="rounded" size="compact" variant="blue">
          Rounded compact
        </Badge>
        <Badge shape="rounded" variant="blue" contrast="soft">
          Rounded md
        </Badge>
        <Badge
          shape="rounded"
          size="compact"
          variant="blue"
          contrast="soft"
          icon={<Bell aria-hidden />}
        >
          With icon
        </Badge>
      </div>
    </div>
  );
}
