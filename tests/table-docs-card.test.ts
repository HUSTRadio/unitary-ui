import { describe, expect, it } from "vitest";
import { EXAMPLE_SOURCE } from "../docs/site/src/examples/registry";

import { docsPageSource as source, demoShowCodeSource } from "./helpers/docs-page-source";

describe("Table docs demo card contract", () => {
  it("uses a dedicated full-width Table demo card", () => {
    expect(source).toContain("function TableDemoCard");
    // 默认横向滚动；白名单组件（如 feedback）改用 overflow-visible 以放行浮层。
    expect(source).toContain("w-full p-6");
    expect(source).toContain("overflow-x-auto");
    expect(source).toContain("overflow-visible");
    expect(source).toContain("DEMO_OVERFLOW_VISIBLE_SLUGS");
  });

  it("renders the official Show code footer as part of the card", () => {
    expect(demoShowCodeSource).toContain("aria-expanded={showCode}");
    expect(demoShowCodeSource).toContain("aria-controls={codeId}");
    expect(demoShowCodeSource).toContain("id={codeId}");
    expect(demoShowCodeSource).toContain("Show code");
    expect(demoShowCodeSource).toContain("h-12 w-full items-center");
    expect(demoShowCodeSource).toContain("border-t border-gray-400 bg-background-200");
  });

  it("uses TableDemoCard for table variants", () => {
    expect(source).toContain("function TableDemoCard");
    expect(Object.keys(EXAMPLE_SOURCE.table)).toHaveLength(7);
    /*
     * 命名契约：bordered 只表示**行间分隔线**，容器外框由 TableRoot 的 frame 提供。
     * 旧名 Bordered table（带边框表格）描述的正是行分隔线变体没有的东西，
     * 现在两者拆成 Row dividers（无外框）与 Outlined table（有外框）两个独立变体。
     */
    expect(EXAMPLE_SOURCE.table).not.toHaveProperty("Bordered table");
    expect(EXAMPLE_SOURCE.table["Row dividers"]).not.toContain("<TableRoot");
    expect(EXAMPLE_SOURCE.table["Outlined table"]).toContain('frame="outline"');
    for (const example of Object.values(EXAMPLE_SOURCE.table)) {
      expect(example).toContain("<Table");
    }
  });

  it("table Live Demo pairs the component and source from one registry record", () => {
    expect(source).toContain("const record = primaryExample(EXAMPLE_REGISTRY[name] ?? []);");
    expect(source).toContain("const Example = record.Component;");
    expect(source).toContain("<TableDemoCard id={record.id} code={record.source} slug={name}>");
    expect(EXAMPLE_SOURCE.table.Default).toContain("export function");
    expect(EXAMPLE_SOURCE.table.Default).toContain("<Table");
  });
});
