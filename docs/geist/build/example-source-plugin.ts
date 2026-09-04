import { readFile } from "node:fs/promises";
import ts from "typescript";
import type { Plugin } from "vite";

const QUERY = "example-source";

function isExported(node: ts.Node): boolean {
  return (
    ts.canHaveModifiers(node) &&
    (ts.getModifiers(node)?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false)
  );
}

function extractExampleSource(fileName: string, source: string): string {
  if (source.trim() === "") throw new Error(`${fileName}: example source must not be empty`);

  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const diagnostics =
    (sourceFile as unknown as { parseDiagnostics?: readonly ts.Diagnostic[] }).parseDiagnostics ?? [];
  if (diagnostics.length > 0) {
    const message = diagnostics
      .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, " "))
      .join("; ");
    throw new Error(`${fileName}: invalid TSX: ${message}`);
  }

  const exportedFunctions = sourceFile.statements.filter(
    (statement): statement is ts.FunctionDeclaration =>
      ts.isFunctionDeclaration(statement) && isExported(statement),
  );
  if (exportedFunctions.length !== 1 || !exportedFunctions[0].name) {
    throw new Error(`${fileName}: expected exactly one exported function`);
  }

  const exportedFunction = exportedFunctions[0];
  const trailingStatements = sourceFile.statements.filter(
    (statement) => statement.getStart(sourceFile) > exportedFunction.getStart(sourceFile),
  );
  if (trailingStatements.length > 0) {
    throw new Error(`${fileName}: exported example function must be the final statement`);
  }

  // AST ranges validate the module shape; original substrings preserve imports,
  // helpers, JSX whitespace, quotes, and the trailing newline byte-for-byte.
  const firstStatement = sourceFile.statements[0];
  const prefix = source.slice(firstStatement.getFullStart(), exportedFunction.getStart(sourceFile));
  const declaration = source.slice(exportedFunction.getStart(sourceFile), exportedFunction.end);
  const trailing = source.slice(exportedFunction.end);
  return `${prefix}${declaration}${trailing}`;
}

export function exampleSourcePlugin(): Plugin {
  return {
    name: "unitary-example-source",
    enforce: "pre",
    async load(id) {
      const queryIndex = id.indexOf("?");
      if (queryIndex < 0) return null;
      const query = new URLSearchParams(id.slice(queryIndex + 1));
      if (!query.has(QUERY)) return null;
      const values = query.getAll(QUERY);
      if (values.length !== 1 || values[0] !== "") {
        throw new Error(`${id}: invalid example-source query`);
      }
      const fileName = id.slice(0, queryIndex);
      const source = await readFile(fileName, "utf8");
      return `export default ${JSON.stringify(extractExampleSource(fileName, source))};`;
    },
  };
}
