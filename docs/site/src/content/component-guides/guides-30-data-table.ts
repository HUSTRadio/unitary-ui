import type { ComponentGuide } from "../component-guide-schema";

const DATA_TABLE_ZH: ComponentGuide = {
  slug: "data-table",
  locale: "zh-CN",
  summary:
    "用带类型的列渲染调用方持有的行数据，并显式处理加载、空与错误状态；不排序、不筛选、不分页。",
  whenToUse: [
    "同一批数据要用多列对照阅读，且每列有自己的渲染方式（链接、徽标、数值对齐）。",
    "需要稳定的行标识来避免列表重排或单元格重建。",
    "加载、空、错误三种状态需要与表格骨架统一呈现。",
  ],
  whenNotToUse: [
    "少量键值对用 Description；单列清单用 Bar List。",
    "需要排序、选择、编辑或虚拟滚动时，等对应能力交付后再用；v1 只做展示。",
    "需要自定义表头合并、复杂 colSpan 排版时直接用 Table 组合。",
  ],
  examples: [
    {
      id: "data-table-basic",
      kind: "minimal",
      title: "列定义与四种状态",
      description:
        "columns 决定表头与单元格，rows 与 getRowKey 决定数据行；切换 loading / empty / error 观察状态互斥。",
      demoKey: "basic",
      showDescriptionInDemo: true,
    },
  ],
  accessibility: {
    status: "not-applicable",
    reason:
      "本轮不含无障碍增强：DataTable 复用 Table 的语义化 table 结构，不额外声明 aria-sort、选择态或键盘网格导航；这些留待表格交互专项。",
  },
  controlledBehavior: {
    status: "covered",
    content: [
      "rows 完全受控：组件不复制、不排序、不筛选，也不发起请求。",
      "loading 优先于 error，error 优先于 empty，三者都显式传入，不由空数组推断。",
      "getRowKey(row, index) 每行调用一次，key 稳定时行节点在重渲染间保持不变。",
      "onRowClick 只回调行数据与下标，选中态与导航由调用方决定。",
      "排序是受控的：sort 传入当前排序，点击可排序列只通过 onSortChange 报出下一次完整数组（asc → desc → 关闭），rows 顺序始终由调用方决定。",
      "默认单列排序，点击另一列会替换；multiSort 时追加并以下标表达优先级。",
      "选择同样是受控的：selection.selectedKeys 决定勾选态，行勾选与表头全选都只经 onChange 报出下一次完整数组。",
      "表头全选只作用于当前可见且可选的行走（保留其它选择），部分选中时表头呈现半选；选择列点击不会触发 onRowClick。",
    ],
  },
  responsiveBehavior: {
    status: "covered",
    content: [
      "容器使用 w-full min-w-0，表格随外层宽度伸缩，不撑破栅格。",
      "列宽可传数字或 CSS 长度写入 colgroup；不传时由 Table 自行分配。",
      "骨架行与错误消息行复用同一列数，切换状态时表头不跳动。",
    ],
  },
  themeBehavior: {
    status: "covered",
    content: [
      "外观通过 colorScheme 透传给 Table（basic / striped / bordered / interactive），颜色全部来自既有语义 token。",
      "骨架块使用 gray-alpha-300，并在 motion-reduce 下关闭脉冲动画。",
    ],
  },
};

const DATA_TABLE_EN: ComponentGuide = {
  slug: "data-table",
  locale: "en-US",
  summary:
    "Render caller-owned rows through typed columns with explicit loading, empty and error states; it never sorts, filters or paginates.",
  whenToUse: [
    "The same records are read across several columns, each with its own renderer (link, badge, numeric alignment).",
    "Rows need a stable identity so the list does not reorder or rebuild cells.",
    "Loading, empty and error need the same table skeleton instead of three ad-hoc layouts.",
  ],
  whenNotToUse: [
    "A few key-value pairs belong to Description; a single-column list belongs to Bar List.",
    "Sorting, selection, editing or virtual scrolling should wait for those capabilities; v1 only presents.",
    "Complex header merges or spans are better composed directly with Table.",
  ],
  examples: [
    {
      id: "data-table-basic",
      kind: "minimal",
      title: "Columns and the four states",
      description:
        "columns define headers and cells, rows plus getRowKey define the data; switch loading, empty and error to see the states stay exclusive.",
      demoKey: "basic",
      showDescriptionInDemo: true,
    },
  ],
  accessibility: {
    status: "not-applicable",
    reason:
      "Accessibility work is out of scope this round: DataTable reuses the semantic table structure from Table and declares no aria-sort, selection state or keyboard grid navigation, which stay with a dedicated table-interaction effort.",
  },
  controlledBehavior: {
    status: "covered",
    content: [
      "rows are fully controlled: the component never copies, sorts, filters or fetches them.",
      "loading wins over error and error wins over empty; all three are explicit props rather than inferred from an empty array.",
      "getRowKey(row, index) runs once per row, and stable keys keep row nodes identical across renders.",
      "onRowClick only reports the row and index; selection and navigation stay with the caller.",
      "Sorting is controlled: sort carries the current state and activating a sortable header only reports the next full array through onSortChange (asc to desc to off); the rows order always belongs to the caller.",
      "Single-column sorting is the default and clicking another column replaces it; multiSort appends and exposes the priority through the sort index.",
      "Selection is controlled too: selection.selectedKeys drives the checkboxes, and both row toggles and the header select-all only report the next full array through onChange.",
      "Select-all affects the visible, selectable rows and keeps other selections; a partial selection shows the header as indeterminate, and selection clicks never trigger onRowClick.",
    ],
  },
  responsiveBehavior: {
    status: "covered",
    content: [
      "The container uses w-full min-w-0, so the table stretches with its parent instead of breaking the grid.",
      "Column widths accept numbers or CSS lengths through colgroup; without them Table distributes space.",
      "Skeleton and message rows reuse the same column count, so the header never jumps between states.",
    ],
  },
  themeBehavior: {
    status: "covered",
    content: [
      "Appearance is forwarded to Table through colorScheme (basic, striped, bordered, interactive) and every color comes from existing semantic tokens.",
      "Skeleton blocks use gray-alpha-300 and stop pulsing under motion-reduce.",
    ],
  },
};

export const DATA_TABLE_GUIDES_ZH: Record<string, ComponentGuide> = { "data-table": DATA_TABLE_ZH };
export const DATA_TABLE_GUIDES_EN: Record<string, ComponentGuide> = { "data-table": DATA_TABLE_EN };
