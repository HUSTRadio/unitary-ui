/**
 * Show code 审计库：三层检查
 * 1. 覆盖：docs-components-page.tsx 中所有 demoCode()/sectionCode() 引用 → EXAMPLE_SOURCE 解析结果（ok/missing/empty）
 * 2. 语法：EXAMPLE_SOURCE 每条条目作为 TSX 解析，收集语法诊断
 * 3. 类型：把条目写成独立 .tsx fixture + tsconfig（@ alias），交 tsc --noEmit（由调用方执行）
 */
import { readFile } from "node:fs/promises";
import { mkdir, rm, writeFile } from "node:fs/promises";
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

const PAGE_PATH = "docs/site/src/components/docs-components-page.tsx";

/** Read the paired source files without executing live demos or Vite-only imports. */
export async function loadExampleSources(
  repoRoot: string,
): Promise<Record<string, Record<string, string>>> {
  const registryPath = path.join(repoRoot, "docs/site/src/examples/registry.ts");
  const registry = ts.createSourceFile(
    registryPath,
    await readFile(registryPath, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const diagnostics =
    (registry as unknown as { parseDiagnostics?: readonly ts.Diagnostic[] }).parseDiagnostics ?? [];
  if (diagnostics.length) throw new Error(`${registryPath}: invalid registry syntax`);
  const imports = new Map<string, string>();
  let records: ts.ArrayLiteralExpression | undefined;
  for (const statement of registry.statements) {
    if (
      ts.isImportDeclaration(statement) &&
      statement.importClause?.name &&
      ts.isStringLiteral(statement.moduleSpecifier) &&
      statement.moduleSpecifier.text.endsWith("?example-source")
    ) {
      imports.set(
        statement.importClause.name.text,
        path.resolve(path.dirname(registryPath), statement.moduleSpecifier.text.split("?")[0]),
      );
    }
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.name.text === "EXAMPLE_RECORDS") {
          if (!declaration.initializer || !ts.isArrayLiteralExpression(declaration.initializer)) {
            throw new Error(`${registryPath}: expected an EXAMPLE_RECORDS array`);
          }
          records = declaration.initializer;
        }
      }
    }
  }
  if (!records?.elements.length) throw new Error(`${registryPath}: no example records found`);

  const sources = new Map<string, Map<string, string>>();
  for (const record of records.elements) {
    if (!ts.isObjectLiteralExpression(record)) {
      throw new Error(`${registryPath}: expected a literal example record`);
    }
    const fields = new Map<string, ts.Expression>();
    for (const property of record.properties) {
      if (ts.isPropertyAssignment(property) && ts.isIdentifier(property.name)) {
        fields.set(property.name.text, property.initializer);
      }
    }
    const slug = fields.get("slug");
    const id = fields.get("id");
    const source = fields.get("source");
    if (
      !slug ||
      !ts.isStringLiteral(slug) ||
      !id ||
      !ts.isStringLiteral(id) ||
      !source ||
      !ts.isIdentifier(source)
    ) {
      throw new Error(`${registryPath}: expected literal slug/id and an imported source`);
    }
    const sourcePath = imports.get(source.text);
    if (!sourcePath) throw new Error(`${slug.text}/${id.text}: source import not found`);
    const blocks = sources.get(slug.text) ?? new Map<string, string>();
    if (blocks.has(id.text)) throw new Error(`${slug.text}/${id.text}: duplicate example record`);
    blocks.set(id.text, await readFile(sourcePath, "utf8"));
    sources.set(slug.text, blocks);
  }
  return Object.fromEntries([...sources].map(([slug, blocks]) => [slug, Object.fromEntries(blocks)]));
}

/** 从页面源码提取 (slug, blockId) 引用集合（线性扫描：锚点就近归属） */
export function extractReferences(pageSource: string): { slug: string; id: string }[] {
  const refs: { slug: string; id: string; pos: number }[] = [];

  // 锚点 1：字面 slug 的 demoCode / sectionCode（点形式与方括号形式）
  const anchorLiteral =
    /const (?:demoCode|sectionCode) = \((?:id|title): string\) => EXAMPLE_SOURCE(?:\.([\w-]+)|\["([\w-]+)"\])\?\.\[(?:id|title)\]/g;
  // 锚点 2：泛型 EXAMPLE_SOURCE[name]（renderExtraSections 内，slug 由最近的 case 决定）
  const anchorGeneric = /const sectionCode = \(title: string\) => EXAMPLE_SOURCE\[name\]\?\.\[title\]/g;
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
  const dynamicCallPattern = /(?:demoCode|sectionCode)\((?:id|demo\.id|demoId|name)\)/g;
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

  // 调用点 C：直接传给 Show Code 的字面 EXAMPLE_SOURCE 访问。
  // 仅检查 ShowCode/ShowCodeFooter 的 code 属性，避免把变量、注释或其他 JSX 属性误算为消费。
  const sourceFile = ts.createSourceFile(
    PAGE_PATH,
    pageSource,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const literalMemberName = (node: ts.Node): string | null => {
    if (ts.isPropertyAccessExpression(node)) return node.name.text;
    if (ts.isElementAccessExpression(node) && ts.isStringLiteral(node.argumentExpression)) {
      return node.argumentExpression.text;
    }
    return null;
  };
  const directDemoCodeReference = (node: ts.Node): { slug: string; id: string } | null => {
    if (!ts.isPropertyAccessExpression(node) && !ts.isElementAccessExpression(node)) return null;
    const id = literalMemberName(node);
    const slugAccess = node.expression;
    if (
      id === null ||
      (!ts.isPropertyAccessExpression(slugAccess) && !ts.isElementAccessExpression(slugAccess))
    ) {
      return null;
    }
    const slug = literalMemberName(slugAccess);
    const root = slugAccess.expression;
    return slug !== null && ts.isIdentifier(root) && root.text === "EXAMPLE_SOURCE"
      ? { slug, id }
      : null;
  };
  const visit = (node: ts.Node): void => {
    if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
      const tagName = node.tagName.getText(sourceFile);
      if (tagName === "ShowCode" || tagName === "ShowCodeFooter") {
        const codeAttribute = node.attributes.properties.find(
          (attribute): attribute is ts.JsxAttribute =>
            ts.isJsxAttribute(attribute) && attribute.name.getText(sourceFile) === "code",
        );
        const expression =
          codeAttribute?.initializer && ts.isJsxExpression(codeAttribute.initializer)
            ? codeAttribute.initializer.expression
            : undefined;
        if (expression) {
          const findReference = (candidate: ts.Node): void => {
            const reference = directDemoCodeReference(candidate);
            if (reference) {
              refs.push({ ...reference, pos: candidate.getStart(sourceFile) });
              return;
            }
            ts.forEachChild(candidate, findReference);
          };
          findReference(expression);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

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
 * 故豁免 TS2657「JSX expressions must have one parent element」，
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
  const registryDriven =
    pageSource.includes("EXAMPLE_REGISTRY[name]") &&
    pageSource.includes("record.Component") &&
    pageSource.includes("record.source");
  const refs = registryDriven
    ? Object.entries(demoCode).flatMap(([slug, blocks]) =>
        Object.keys(blocks).map((id) => ({ slug, id })),
      )
    : extractReferences(pageSource);

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

  // 孤儿条目：EXAMPLE_SOURCE 中存在但页面从未引用
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
export function buildTypecheckFixtureSource(slug: string, id: string, code: string): string {
  const sourceFile = ts.createSourceFile(
    `${slug}__${id}.tsx`,
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const diagnostics = (sourceFile as unknown as { parseDiagnostics?: ts.Diagnostic[] })
    .parseDiagnostics ?? [];
  const fixtureHeader = `// show code fixture: ${slug}/${id}\n`;

  if (diagnostics.length === 0) return `${fixtureHeader}${code}\nexport {};\n`;

  if (diagnostics.some((diagnostic) => diagnostic.code !== 2657)) {
    const codes = diagnostics.map((diagnostic) => `TS${diagnostic.code}`).join(", ");
    throw new Error(`Cannot create typecheck fixture for ${slug}/${id}: ${codes}`);
  }

  const tail = sourceFile.statements.at(-1);
  if (!tail || !ts.isExpressionStatement(tail)) {
    throw new Error(`Cannot normalize TS2657 fixture for ${slug}/${id}: trailing JSX not found`);
  }

  const prefix = code.slice(0, tail.getStart(sourceFile));
  const trailingJsx = code.slice(tail.getStart(sourceFile), tail.end);
  const fixture = `${fixtureHeader}${prefix}<>\n${trailingJsx}\n</>;\nexport {};\n`;
  const normalized = ts.createSourceFile(
    `${slug}__${id}.tsx`,
    fixture,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const normalizedDiagnostics =
    (normalized as unknown as { parseDiagnostics?: ts.Diagnostic[] }).parseDiagnostics ?? [];
  if (normalizedDiagnostics.length > 0) {
    const codes = normalizedDiagnostics.map((diagnostic) => `TS${diagnostic.code}`).join(", ");
    throw new Error(`Cannot normalize TS2657 fixture for ${slug}/${id}: ${codes}`);
  }

  return fixture;
}

/** 把全部条目写成类型检查 fixture（每条目一个 .tsx + 一个 tsconfig） */
export async function writeTypecheckFixtures(
  repoRoot: string,
  demoCode: Record<string, Record<string, string>>,
  outDir: string,
): Promise<{ fileCount: number; tsconfigPath: string }> {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  let fileCount = 0;
  for (const [slug, blocks] of Object.entries(demoCode)) {
    for (const [id, code] of Object.entries(blocks)) {
      if (code.trim() === "") continue;
      const encodedSlug = Buffer.from(slug, "utf8").toString("hex");
      const encodedId = Buffer.from(id, "utf8").toString("hex");
      const filePath = path.join(outDir, `${encodedSlug}__${encodedId}.tsx`);
      await writeFile(filePath, buildTypecheckFixtureSource(slug, id, code));
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
          allowArbitraryExtensions: true,
          jsx: "react-jsx",
          strict: true,
          noEmit: true,
          skipLibCheck: true,
          ignoreDeprecations: "6.0",
          baseUrl: repoRoot,
          paths: { "@/*": ["src/*"], "@hustradio/unitary-ui": ["src/lib/index.ts"] },
          types: ["react", "react-dom", "vite/client"],
        },
        include: ["./*.tsx", path.join(repoRoot, "src/types/**/*.d.ts")],
      },
      null,
      2,
    ),
  );
  return { fileCount, tsconfigPath };
}
