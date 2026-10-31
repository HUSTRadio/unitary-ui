import type { ComponentGuide } from "../component-guide-schema";

const IMPORT_MAPPER_ZH: ComponentGuide = {
  slug: "import-mapper",
  locale: "zh-CN",
  summary:
    "把已解析的源列映射到目标字段，校验映射并预览行，然后再提交；组件本身不读文件、不解析 CSV、不发请求。",
  whenToUse: [
    "用户已经选定文件、调用方也已解析出表头与行，接下来只需决定「哪一列对应哪个字段」。",
    "需要在提交前让用户确认实际会被导入的内容。",
    "必填字段与重复映射需要逐字段提示，而不是等到提交后才知道。",
  ],
  whenNotToUse: [
    "还没解析文件时，先用 Upload/文件选择把内容读进来。",
    "只是展示一个普通表单，用 Field 组合即可。",
    "需要列级编辑与粘贴修正时，等 DataTable 编辑能力落地后再组合。",
  ],
  examples: [
    {
      id: "import-mapper-mapping",
      kind: "stateful",
      title: "映射、校验与预览",
      description:
        "受控 mapping 决定预览列；把两个字段映射到同一列会立刻报重复，清空必填列则禁止提交。",
      demoKey: "mapping",
      showDescriptionInDemo: true,
    },
  ],
  accessibility: {
    status: "not-applicable",
    reason:
      "本轮不含无障碍增强：字段错误通过可见文案与 Field 的 error 区域表达，未添加 aria-describedby/aria-invalid 等关联；播报策略由调用方决定。",
  },
  controlledBehavior: {
    status: "covered",
    content: [
      "source 与 mapping 都是受控输入：组件不读文件、不解析 CSV、不发请求，也不缓存映射。",
      "校验是纯函数：必填缺失、重复映射、列越界三类问题逐字段给出一条，任意一条都阻止提交。",
      "预览只显示已映射字段，行数受 previewLimit 控制；total 始终是源记录总数。",
      "提交时把 resolveImportRows 的结果交给 onSubmit；pending 期间禁用提交，error 用 ErrorCard 呈现。",
    ],
  },
  responsiveBehavior: {
    status: "covered",
    content: [
      "根容器 w-full min-w-0，字段行按列堆叠，窄屏不挤压下拉框。",
      "预览复用 DataTable，宽度随容器收缩，列数等于已映射字段数。",
    ],
  },
  themeBehavior: {
    status: "covered",
    content: [
      "字段标签与错误文案使用既有 gray/error 语义色，下拉框复用 Select 的主题行为。",
      "预览表沿用 DataTable 的 colorScheme=\"striped\"，两档主题下都由语义 token 驱动。",
    ],
  },
};

const IMPORT_MAPPER_EN: ComponentGuide = {
  slug: "import-mapper",
  locale: "en-US",
  summary:
    "Map parsed source columns onto target fields, validate the mapping and preview rows before submitting; the component never reads files, parses CSV or fetches.",
  whenToUse: [
    "The user already picked a file and the caller has parsed columns and records; the only decision left is which column feeds which field.",
    "The user should confirm exactly what will be imported before committing.",
    "Required fields and duplicate columns need per-field feedback instead of a submit-time surprise.",
  ],
  whenNotToUse: [
    "Nothing has been parsed yet: read the file first with Upload or a file input.",
    "You only need a plain form: compose Field directly.",
    "Cell-level editing or paste correction should wait for the DataTable editing capability.",
  ],
  examples: [
    {
      id: "import-mapper-mapping",
      kind: "stateful",
      title: "Mapping, validation and preview",
      description:
        "The controlled mapping decides the preview columns; mapping two fields to one column reports duplicates immediately, and clearing a required column blocks submission.",
      demoKey: "mapping",
      showDescriptionInDemo: true,
    },
  ],
  accessibility: {
    status: "not-applicable",
    reason:
      "Accessibility work is out of scope this round: field errors are visible copy inside the Field error area without aria-describedby or aria-invalid wiring, and announcement strategy stays with the caller.",
  },
  controlledBehavior: {
    status: "covered",
    content: [
      "source and mapping are both controlled inputs: the component never reads files, parses CSV, fetches or caches the mapping.",
      "Validation is pure: missing required, duplicate column and out-of-range column produce one issue per field, and any issue blocks submission.",
      "The preview shows only mapped fields and caps rows by previewLimit, while total always reports the source record count.",
      "Submitting hands resolveImportRows output to onSubmit; pending disables the action and error renders in an ErrorCard.",
    ],
  },
  responsiveBehavior: {
    status: "covered",
    content: [
      "The root uses w-full min-w-0 and field rows stack, so narrow widths never squeeze the select.",
      "The preview reuses DataTable, shrinking with its container and showing one column per mapped field.",
    ],
  },
  themeBehavior: {
    status: "covered",
    content: [
      "Field labels and error copy use the existing gray and error semantic colors, and the select keeps Select's theme behaviour.",
      "The preview table uses DataTable's striped scheme, driven by semantic tokens in both themes.",
    ],
  },
};

export const IMPORT_MAPPER_GUIDES_ZH: Record<string, ComponentGuide> = {
  "import-mapper": IMPORT_MAPPER_ZH,
};
export const IMPORT_MAPPER_GUIDES_EN: Record<string, ComponentGuide> = {
  "import-mapper": IMPORT_MAPPER_EN,
};
