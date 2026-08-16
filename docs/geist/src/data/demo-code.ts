/**
 * 组件 demo 区块的独立源码（Show code 折叠展开显示）。
 *
 * 结构：DEMO_CODE[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 * 官方 prop 本地未实现的区块，源码诚实展示本地 API，不伪造官方 prop。
 *
 * 填充约定：
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API）。
 * - 图标用 lucide-react（`import { X } from "lucide-react"`），不用 @vercel/geistcn-assets。
 * - blockId 与 docs-components-page.tsx 里 data-demo-card 的 id 一致。
 */

import { DEMO_CODE_BATCH1 } from "./demo-code-batch1";
import { DEMO_CODE_BATCH2 } from "./demo-code-batch2";
import { DEMO_CODE_BATCH3 } from "./demo-code-batch3";
import { DEMO_CODE_BATCH4 } from "./demo-code-batch4";
import { DEMO_CODE_BATCH5 } from "./demo-code-batch5";
import { DEMO_CODE_BATCH6 } from "./demo-code-batch6";
import { DEMO_CODE_BATCH7 } from "./demo-code-batch7";
import { DEMO_CODE_BATCH8 } from "./demo-code-batch8";
import { DEMO_CODE_SECTION_BATCH1 } from "./demo-code-section-batch1";
import { DEMO_CODE_SECTION_BATCH2 } from "./demo-code-section-batch2";
import { DEMO_CODE_SECTION_BATCH3 } from "./demo-code-section-batch3";
import { DEMO_CODE_DIRECT } from "./demo-code-direct";
import { DEMO_CODE_MULTI_BATCH1 } from "./demo-code-multi-batch1";
import { DEMO_CODE_MULTI_BATCH2 } from "./demo-code-multi-batch2";
import { DEMO_CODE_MULTI_BATCH3 } from "./demo-code-multi-batch3";

export const DEMO_CODE: Record<string, Record<string, string>> = {
  calendar: {
    default: `import { Calendar } from "@/components/ui/calendar";

<Calendar label="Select Date Range" />`,
    "horizontal-layout": `import { Calendar } from "@/components/ui/calendar";

<Calendar label="Select Date Range" horizontalLayout />`,
    sizes: `import { Calendar } from "@/components/ui/calendar";

<Calendar label="Select Date Range" size="small" />
<Calendar label="Select Date Range" />`,
    presets: `import { Calendar } from "@/components/ui/calendar";

<Calendar
  label="Select Date Range"
  showCombobox
  comboboxFirst
  comboboxFull
  comboboxWide
  comboboxLabel="Combobox Menu"
  comboboxPlaceholder="Select Period"
  presets={["Last 3 Days", "Last 7 Days", "Last 14 Days", "Last Month"]}
/>`,
    compact: `import { Calendar } from "@/components/ui/calendar";

<Calendar
  label="Select Date Range"
  compact
  comboboxLabel="Combobox Menu"
  presets={["Last 3 Days", "Last 7 Days", "Last 14 Days", "Last Month"]}
/>`,
    stacked: `import { Calendar } from "@/components/ui/calendar";

<Calendar
  label="Select Date Range"
  stacked
  comboboxLabel="Combobox Menu"
  comboboxPlaceholder="Select Period"
  presets={["Last 3 Days", "Last 7 Days", "Last 14 Days", "Last Month"]}
/>`,
    "presets-default": `import { Calendar } from "@/components/ui/calendar";

<Calendar
  label="Select Date Range"
  showCombobox
  comboboxFirst
  comboboxFull
  comboboxWide
  comboboxLabel="Combobox Menu"
  comboboxPlaceholder="Select Period"
  presets={["Last 3 Days", "Last 7 Days", "Last 14 Days", "Last Month"]}
  presetIndex={2}
/>`,
    "min-max": `import { Calendar } from "@/components/ui/calendar";

const now = new Date();
const minDate = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
const maxDate = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());

<Calendar label="Select Date Range" minValue={minDate} maxValue={maxDate} />`,
    "pinned-timezone": `import { Calendar } from "@/components/ui/calendar";

<Calendar label="Select Date Range" pinnedTimezone="America/Los_Angeles" />`,
  },
  ...DEMO_CODE_BATCH1,
  ...DEMO_CODE_BATCH2,
  ...DEMO_CODE_BATCH3,
  ...DEMO_CODE_BATCH4,
  ...DEMO_CODE_BATCH5,
  ...DEMO_CODE_BATCH6,
  ...DEMO_CODE_BATCH7,
  ...DEMO_CODE_BATCH8,
  ...DEMO_CODE_SECTION_BATCH1,
  ...DEMO_CODE_SECTION_BATCH2,
  ...DEMO_CODE_SECTION_BATCH3,
  ...DEMO_CODE_DIRECT,
  ...DEMO_CODE_MULTI_BATCH1,
  ...DEMO_CODE_MULTI_BATCH2,
  ...DEMO_CODE_MULTI_BATCH3,
};
