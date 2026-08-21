/**
 * Show code 审计库：三层检查
 * 1. 覆盖：docs-components-page.tsx 中所有 demoCode()/sectionCode() 引用 → DEMO_CODE 解析结果（ok/missing/empty）
 * 2. 语法：DEMO_CODE 每条条目作为 TSX 解析，收集语法诊断
 * 3. 类型：把条目写成独立 .tsx fixture + tsconfig（@ alias），交 tsc --noEmit（由调用方执行）
 */
import { readFile } from "node:fs/promises";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

export interface AuditEntry {
  slug: string;
  id: string;
  status: "ok" | "missing" | "empty";
}

export interface SyntaxIssue {
  slug: string;
  id: string;
  message: string;
}

export interface AuditReport {
  totalReferences: number;
  okCount: number;
  missing: { slug: string; id: string }[];
  empty: { slug: string; id: string }[];
  orphanEntries: { slug: string; id: string }[];
  syntaxIssues: SyntaxIssue[];
  totalEntries: number;
}

const PAGE_PATH = "docs/geist/src/components/docs-components-page.tsx";

/** 从页面源码提取 (slug, blockId) 引用集合（线性扫描：锚点就近归属） */
export function extractReferences(pageSource: string): { slug: string; id: string }[] {
  const refs: { slug: string; id: string; pos: number }[] = [];

  // 锚点 1：字面 slug 的 demoCode / sectionCode（点形式与方括号形式）
  const anchorLiteral =
    /const (?:demoCode|sectionCode) = \((?:id|title): string\) => DEMO_CODE(?:\.([\w-]+)|\["([\w-]+)"\])\?\.\[(?:id|title)\]/g;
  // 锚点 2：泛型 DEMO_CODE[name]（renderExtraSections 内，slug 由最近的 case 决定）
  const anchorGeneric =
    /const sectionCode = \(title: string\) => DEMO_CODE\[name\]\?\.\[title\]/g;
  const caseMarks = [...pageSource.matchAll(/^\s*case "([^"]+)":/gm)].map((m) => ({
    slug: m[1],
    pos: m.index ?? 0,
  }));

  type Anchor = { slug: string | null; pos: number };
  const anchors: Anchor[] = [];
  for (const m of pageSource.matchAll(anchorLiteral)) {
    anchors.push({ slug: m[1] ?? m[2], pos: m.index ?? 0 });
  }
  for (const m of pageSource.matchAll(anchorGeneric)) {
    anchors.push({ slug: null, pos: m.index ?? 0 });
  }
  anchors.sort((a, b) => a.pos - b.pos);

  // 调用点 A：字面参数 demoCode("...") / sectionCode("...")
  const callPattern = /(?:demoCode|sectionCode)\("([^"]+)"\)/g;
  for (const m of pageSource.matchAll(callPattern)) {
    const pos = m.index ?? 0;
    const id = m[1];
    // 就近锚点
    let anchor: Anchor | undefined;
    for (const a of anchors) {
      if (a.pos < pos) anchor = a;
      else break;
    }
    let slug = anchor?.slug ?? null;
    if (slug === null) {
      // 泛型锚点：取调用点之前最近的 case 标记（且必须在泛型锚点之后）
      const genericPos = anchor?.pos ?? 0;
      let nearest: { slug: string; pos: number } | undefined;
      for (const c of caseMarks) {
        if (c.pos > genericPos && c.pos < pos) nearest = c;
      }
      slug = nearest?.slug ?? null;
    }
    if (slug) refs.push({ slug, id, pos });
  }

  // 调用点 B：动态 id 的卡片消费模式（id 由字面量提供）
  // B1: <Card id="字面量"> — 局部 Card 组件内部调 demoCode(id)
  // B2: demoId="字面量" — Fieldset 等组件透传
  // B3: const demos = [{ id: "字面量" ... }] — 经 demoCode(demo.id) 消费
  // B4: card("字面量", ...) — 局部 card(id) 辅助函数
  // B5: const demoVariants = ["字面量", ...] — 经 demoCode(name) 消费
  const dynamicCallPattern =
    /(?:demoCode|sectionCode)\((?:id|demo\.id|demoId|name)\)/g;
  const simpleIdSources = [
    /<(?:Card|Section|ContextCardDemoCard) id="([^"]+)">/g,
    /demoId="([^"]+)"/g,
    /data-demo-card="([^"]+)"/g,
    /\bcard\(\s*"([^"]+)"/g,
  ];
  for (const callMatch of pageSource.matchAll(dynamicCallPattern)) {
    const callPos = callMatch.index ?? 0;
    // 就近锚点（同上归属逻辑）
    let anchor: Anchor | undefined;
    for (const a of anchors) {
      if (a.pos < callPos) anchor = a;
      else break;
    }
    let slug = anchor?.slug ?? null;
    if (slug === null) {
      const genericPos = anchor?.pos ?? 0;
      let nearest: { slug: string; pos: number } | undefined;
      for (const c of caseMarks) {
        if (c.pos > genericPos && c.pos < callPos) nearest = c;
      }
      slug = nearest?.slug ?? null;
    }
    if (!slug) continue;
    // 锚点作用域内的所有 id 字面量来源
    const scopeEnd = (() => {
      const next = anchors.find((a) => a.pos > callPos);
      return next?.pos ?? pageSource.length;
    })();
    const anchorPos = anchor?.pos ?? 0;
    const scope = pageSource.slice(anchorPos, scopeEnd);
    for (const sourcePattern of simpleIdSources) {
      sourcePattern.lastIndex = 0;
      for (const m of scope.matchAll(sourcePattern)) {
        refs.push({ slug, id: m[1], pos: anchorPos + (m.index ?? 0) });
      }
    }
    // B3: const demos = [ ... ] as const; 数组内的 id 字段（仅限 demos 数组，排除业务数据）
    for (const arr of scope.matchAll(/const demos = \[([\s\S]*?)\]\s*(?:as const)?;/g)) {
      for (const idm of arr[1].matchAll(/\bid: "([^"]+)"/g)) {
        refs.push({ slug, id: idm[1], pos: anchorPos + (arr.index ?? 0) });
      }
    }
    // B5: const demoVariants = ["a", "b"] as const
    for (const arr of scope.matchAll(/const demoVariants = \[([^\]]*)\]/g)) {
      for (const idm of arr[1].matchAll(/"([^"]+)"/g)) {
        refs.push({ slug, id: idm[1], pos: anchorPos + (arr.index ?? 0) });
      }
    }
  }

  // 去重
  const seen = new Set<string>();
  const unique: { slug: string; id: string }[] = [];
  for (const r of refs) {
    const key = `${r.slug}/${r.id}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push({ slug: r.slug, id: r.id });
    }
  }
  return unique;
}

/** 语法检查：条目作为 TSX 模块解析。
 * 文档片段风格（import 行 + 裸 JSX 用法，可能多根）是有意为之，
 * 故豁免 TS17001「JSX expressions must have one parent element」，
 * 其余诊断视为真实语法错误。 */
export function checkSyntax(entries: Record<string, Record<string, string>>): SyntaxIssue[] {
  const issues: SyntaxIssue[] = [];
  for (const [slug, blocks] of Object.entries(entries)) {
    for (const [id, code] of Object.entries(blocks)) {
      const sourceFile = ts.createSourceFile(
        `${slug}__${id}.tsx`,
        code,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      );
      const diagnostics = (sourceFile as unknown as { parseDiagnostics?: ts.Diagnostic[] })
        .parseDiagnostics;
      for (const d of diagnostics ?? []) {
        if (d.code === 2657) continue; // 多根 JSX：文档片段有意风格
        issues.push({
          slug,
          id,
          message: ts.flattenDiagnosticMessageText(d.messageText, " "),
        });
      }
    }
  }
  return issues;
}

export async function auditShowCode(
  repoRoot: string,
  demoCode: Record<string, Record<string, string>>,
): Promise<AuditReport> {
  const pageSource = await readFile(path.join(repoRoot, PAGE_PATH), "utf8");
  const refs = extractReferences(pageSource);

  const missing: { slug: string; id: string }[] = [];
  const empty: { slug: string; id: string }[] = [];
  let okCount = 0;
  const referencedKeys = new Set<string>();
  for (const { slug, id } of refs) {
    referencedKeys.add(`${slug}/${id}`);
    const code = demoCode[slug]?.[id];
    if (code === undefined) missing.push({ slug, id });
    else if (code.trim() === "") empty.push({ slug, id });
    else okCount++;
  }

  // 孤儿条目：DEMO_CODE 中存在但页面从未引用
  const orphanEntries: { slug: string; id: string }[] = [];
  let totalEntries = 0;
  for (const [slug, blocks] of Object.entries(demoCode)) {
    for (const id of Object.keys(blocks)) {
      totalEntries++;
      if (!referencedKeys.has(`${slug}/${id}`)) orphanEntries.push({ slug, id });
    }
  }

  const syntaxIssues = checkSyntax(demoCode);

  return {
    totalReferences: refs.length,
    okCount,
    missing,
    empty,
    orphanEntries,
    syntaxIssues,
    totalEntries,
  };
}

/** 把全部条目写成类型检查 fixture（每条目一个 .tsx + 一个 tsconfig） */
export async function writeTypecheckFixtures(
  repoRoot: string,
  demoCode: Record<string, Record<string, string>>,
  outDir: string,
): Promise<{ fileCount: number; tsconfigPath: string }> {
  await mkdir(outDir, { recursive: true });
  let fileCount = 0;
  for (const [slug, blocks] of Object.entries(demoCode)) {
    for (const [id, code] of Object.entries(blocks)) {
      if (code.trim() === "") continue;
      const safeId = id.replace(/[^\w-]/g, "_");
      const filePath = path.join(outDir, `${slug}__${safeId}.tsx`);
      // 顶层加 export {} 使片段成为模块；多根 JSX 是文档片段风格（类型检查层豁免 TS2657）
      await writeFile(filePath, `// show code fixture: ${slug}/${id}\n${code}\nexport {};\n`);
      fileCount++;
    }
  }
  const tsconfigPath = path.join(outDir, "tsconfig.json");
  await writeFile(
    tsconfigPath,
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          lib: ["ES2022", "DOM", "DOM.Iterable"],
          module: "ESNext",
          moduleResolution: "bundler",
          jsx: "react-jsx",
          strict: true,
          noEmit: true,
          skipLibCheck: true,
          baseUrl: repoRoot,
          paths: { "@/*": ["src/*"] },
          types: ["react", "react-dom"],
        },
        include: ["./*.tsx"],
      },
      null,
      2,
    ),
  );
  return { fileCount, tsconfigPath };
}
