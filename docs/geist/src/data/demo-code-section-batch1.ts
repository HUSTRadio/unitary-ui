/**
 * Batch 1 — Section 区块独立源码（Show code 折叠展开显示）。
 *
 * 结构：DEMO_CODE_SECTION_BATCH1[组件 slug][Section title] = 该 Section 的完整 TSX 源码。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 * 官方 prop 本地未实现的区块，源码诚实展示本地 API，不伪造官方 prop。
 *
 * 填充约定：
 * - 每段源码含 import + 该 Section 的完整用法（官方 demo 代码映射到本地 API，
 *   结构与 docs-components-page.tsx renderExtraSections 的 Section children 对齐）。
 * - 图标用 lucide-react（`import { X } from "lucide-react"`），不用 @vercel/geistcn-assets。
 * - key 与 renderExtraSections 里 <Section title="X"> 的 title 原文一致。
 */

export const DEMO_CODE_SECTION_BATCH1: Record<string, Record<string, string>> = {
  avatar: {
    Group: `import { AvatarGroup } from "@/components/ui/avatar";

<div className="flex flex-wrap items-center gap-4">
  <AvatarGroup
    members={[
      { username: "evilrabbit" },
      { username: "severinlandolt" },
      { username: "rauchg" },
    ]}
    size={32}
  />
  <AvatarGroup
    limit={4}
    members={[
      { username: "christopherkindl" },
      { username: "rauno" },
      { username: "shuding" },
      { username: "skllcrn" },
      { username: "almonk" },
    ]}
    size={32}
  />
</div>`,
    "Stacking order": `import { AvatarGroup } from "@/components/ui/avatar";

<div className="flex flex-wrap items-center gap-4">
  <AvatarGroup
    members={[
      { username: "evilrabbit" },
      { username: "severinlandolt" },
      { username: "rauchg" },
    ]}
    size={32}
  />
  <AvatarGroup
    reverse
    members={[
      { username: "evilrabbit" },
      { username: "severinlandolt" },
      { username: "rauchg" },
    ]}
    size={32}
  />
</div>`,
    Overlap: `import { AvatarGroup } from "@/components/ui/avatar";

<div className="flex flex-wrap items-center gap-6">
  <AvatarGroup
    overlap="auto"
    members={[
      { username: "evilrabbit" },
      { username: "severinlandolt" },
      { username: "rauchg" },
    ]}
    size={16}
  />
  <AvatarGroup
    overlap="auto"
    members={[
      { username: "evilrabbit" },
      { username: "severinlandolt" },
      { username: "rauchg" },
    ]}
    size={24}
  />
  <AvatarGroup
    overlap="auto"
    members={[
      { username: "evilrabbit" },
      { username: "severinlandolt" },
      { username: "rauchg" },
    ]}
    size={32}
  />
  <AvatarGroup
    overlap="auto"
    members={[
      { username: "evilrabbit" },
      { username: "severinlandolt" },
      { username: "rauchg" },
    ]}
    size={48}
  />
</div>`,
    "Fixed overlap": `import { AvatarGroup } from "@/components/ui/avatar";

<div className="flex flex-wrap items-center gap-4">
  <AvatarGroup
    overlap={10}
    members={[
      { username: "evilrabbit" },
      { username: "severinlandolt" },
      { username: "rauchg" },
    ]}
    size={24}
  />
  <AvatarGroup
    overlap={6}
    members={[
      { username: "evilrabbit" },
      { username: "severinlandolt" },
      { username: "rauchg" },
    ]}
    size={24}
  />
  <AvatarGroup
    overlap={0}
    members={[
      { username: "evilrabbit" },
      { username: "severinlandolt" },
      { username: "rauchg" },
    ]}
    size={24}
  />
</div>`,
    Size: `import { Avatar } from "@/components/ui/avatar";

<div className="flex flex-wrap items-center gap-4">
  <Avatar size={24} username="evilrabbit" />
  <Avatar size={32} username="evilrabbit" />
  <Avatar size={48} username="evilrabbit" />
</div>`,
    Git: `import { GitHubAvatar, GitLabAvatar, BitbucketAvatar } from "@/components/ui/avatar";

<div className="flex flex-wrap items-center gap-4">
  <GitHubAvatar size={32} username="rauchg" />
  <GitLabAvatar size={32} username="severinlandolt" />
  <BitbucketAvatar size={32} username="evilrabbit" />
</div>`,
    "With custom icon": `import { AvatarWithIcon } from "@/components/ui/avatar";
import { ArrowDownCircle, CircleCheck, Clock } from "lucide-react";

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
</div>`,
    Letter: `import { Avatar } from "@/components/ui/avatar";

<div className="flex flex-wrap items-center gap-4">
  <Avatar letter="SL" placeholder size={32} />
  <Avatar letter="EK" placeholder size={32} />
  <Avatar letter="CK" placeholder size={32} />
</div>`,
    Placeholder: `import { Avatar } from "@/components/ui/avatar";

<Avatar placeholder size={90} />`,
  },
  badge: {
    Variants: `import { Badge } from "@/components/ui/badge";

<div className="flex flex-col gap-2">
  <div className="flex flex-wrap items-center gap-1.5">
    <Badge variant="gray">Gray</Badge>
    <Badge variant="gray" contrast="low">
      Gray Subtle
    </Badge>
  </div>
  <div className="flex flex-wrap items-center gap-1.5">
    <Badge variant="blue">Blue</Badge>
    <Badge variant="blue" contrast="low">
      Blue Subtle
    </Badge>
  </div>
  <div className="flex flex-wrap items-center gap-1.5">
    <Badge variant="purple">Purple</Badge>
    <Badge variant="purple" contrast="low">
      Purple Subtle
    </Badge>
  </div>
  <div className="flex flex-wrap items-center gap-1.5">
    <Badge variant="amber">Amber</Badge>
    <Badge variant="amber" contrast="low">
      Amber Subtle
    </Badge>
  </div>
  <div className="flex flex-wrap items-center gap-1.5">
    <Badge variant="red">Red</Badge>
    <Badge variant="red" contrast="low">
      Red Subtle
    </Badge>
  </div>
  <div className="flex flex-wrap items-center gap-1.5">
    <Badge variant="pink">Pink</Badge>
    <Badge variant="pink" contrast="low">
      Pink Subtle
    </Badge>
  </div>
  <div className="flex flex-wrap items-center gap-1.5">
    <Badge variant="green">Green</Badge>
    <Badge variant="green" contrast="low">
      Green Subtle
    </Badge>
  </div>
  <div className="flex flex-wrap items-center gap-1.5">
    <Badge variant="teal">Teal</Badge>
    <Badge variant="teal" contrast="low">
      Teal Subtle
    </Badge>
  </div>
  <div className="flex flex-wrap items-center gap-1.5">
    <Badge variant="inverted">Inverted</Badge>
    <Badge variant="trial">Trial</Badge>
    <Badge variant="turbo">Turborepo</Badge>
  </div>
</div>`,
    Sizes: `import { Badge } from "@/components/ui/badge";

<div className="flex flex-wrap items-center gap-2">
  <Badge size="sm">Small</Badge>
  <Badge size="md">Medium</Badge>
  <Badge size="lg">Large</Badge>
</div>`,
    "With icons": `import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

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
</div>`,
    Pill: `import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

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
</div>`,
  },
  breadcrumbs: {
    Default: `import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumbs";

<div className="flex w-full max-w-md flex-col gap-4">
  <Breadcrumb type="text">
    <BreadcrumbItem>Home</BreadcrumbItem>
    <BreadcrumbItem>Dashboard</BreadcrumbItem>
    <BreadcrumbItem>Overview</BreadcrumbItem>
  </Breadcrumb>
  <Breadcrumb type="menu">
    <BreadcrumbItem>Home</BreadcrumbItem>
    <BreadcrumbItem>Dashboard</BreadcrumbItem>
    <BreadcrumbItem>Overview</BreadcrumbItem>
  </Breadcrumb>
</div>`,
    Active: `import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumbs";

<Breadcrumb>
  <BreadcrumbItem>Home</BreadcrumbItem>
  <BreadcrumbItem active>Dashboard</BreadcrumbItem>
  <BreadcrumbItem>Overview</BreadcrumbItem>
</Breadcrumb>`,
    Disabled: `import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumbs";

<Breadcrumb>
  <BreadcrumbItem>Home</BreadcrumbItem>
  <BreadcrumbItem disabled>Dashboard</BreadcrumbItem>
  <BreadcrumbItem>Overview</BreadcrumbItem>
</Breadcrumb>`,
  },
  error: {
    "Custom label": `import { Error } from "@/components/ui/error";

<Error label="Email Error">This email address is already in use.</Error>`,
    "No label": `import { Error } from "@/components/ui/error";

<Error label={false}>This email address is already in use.</Error>`,
    Sizes: `import { Error } from "@/components/ui/error";

<div className="flex w-full flex-col items-stretch gap-6">
  <Error size="small">This email is in use.</Error>
  <Error>This email is in use.</Error>
  <Error size="large">This email is in use.</Error>
</div>`,
    "With an error property": `import { Error } from "@/components/ui/error";

<Error
  error={{
    message: "The request failed.",
    action: "Contact Us",
    link: "https://vercel.com/contact",
  }}
/>`,
  },
  gauge: {
    Label: `import { Gauge } from "@/components/ui/gauge";

<div className="flex flex-row flex-wrap items-stretch justify-start gap-8">
  <Gauge showValue size="tiny" value={80} />
  <Gauge showValue size="small" value={80} />
  <Gauge showValue size="small" value={100} />
  <Gauge showValue size="medium" value={80} />
  <Gauge showValue size="medium" value={100} />
  <Gauge showValue size="large" value={80} />
  <Gauge showValue size="large" value={100} />
</div>`,
    "Default color scale": `import { Gauge } from "@/components/ui/gauge";

<div className="flex flex-row flex-wrap items-stretch justify-start gap-8">
  <Gauge size="small" value={14} />
  <Gauge size="small" value={34} />
  <Gauge size="small" value={68} />
</div>`,
    "Custom color range": `import { Gauge } from "@/components/ui/gauge";

const PINK_SCALE = {
  "0": "var(--pink-100)",
  "10": "var(--pink-200)",
  "20": "var(--pink-300)",
  "30": "var(--pink-400)",
  "50": "var(--pink-500)",
  "60": "var(--pink-600)",
  "70": "var(--pink-700)",
  "80": "var(--pink-800)",
  "90": "var(--pink-900)",
  "100": "var(--pink-1000)",
};

<div className="flex flex-row flex-wrap items-stretch justify-start gap-2">
  {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((value) => (
    <Gauge key={value} colors={PINK_SCALE} size="small" value={value} />
  ))}
</div>`,
    "Custom secondary color": `import { Gauge } from "@/components/ui/gauge";

<div className="flex justify-start">
  <Gauge
    colors={{ primary: "var(--blue-700)", secondary: "var(--blue-300)" }}
    size="medium"
    value={50}
  />
</div>`,
    "Arc priority": `import { Gauge } from "@/components/ui/gauge";

<div className="flex justify-start">
  <Gauge
    arcPriority="equal"
    colors={{ primary: "var(--blue-700)", secondary: "var(--red-700)" }}
    showValue
    size="medium"
    value={50}
  />
</div>`,
    Indeterminate: `import { Gauge } from "@/components/ui/gauge";

<div className="flex flex-row flex-wrap items-stretch justify-start gap-2">
  <Gauge indeterminate size="tiny" value={25} />
  <Gauge indeterminate size="small" value={25} />
  <Gauge indeterminate size="medium" value={25} />
  <Gauge indeterminate size="large" value={25} />
</div>`,
  },
};
