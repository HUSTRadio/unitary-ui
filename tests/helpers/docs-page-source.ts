import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * 模块级单例：docs-components-page.tsx 源码。
 * 多个 docs-contract 测试共享一次读盘，避免 7000+ 行文件被重复读取；
 * 断言仍基于源码字符串，修改组件页面前先跑相关契约测试。
 */
export const docsPageSource = readFileSync(
  resolve(import.meta.dirname, "../../docs/site/src/components/docs-components-page.tsx"),
  "utf8",
);
