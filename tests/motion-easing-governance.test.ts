import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import postcss from "postcss";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { isNonlinearCubic } from "../src/lib/motion-easing";

const root = process.cwd();
const policy = JSON.parse(readFileSync("tests/audit/motion-easing-allowlist.json", "utf8")) as {
  rotationFiles: string[];
  definition: { file: string; property: string; value: string; reason: string };
};
const scanRoots = ["src/components", "src/lib", "src/styles", "src/examples", "src/vendor", "docs/site/src"];
function files(directory: string): string[] {
  return readdirSync(path.join(root, directory), { withFileTypes: true }).flatMap(entry => {
    const relative = `${directory}/${entry.name}`;
    return entry.isDirectory() ? files(relative) : /\.(?:tsx?|css)$/.test(entry.name) ? [relative] : [];
  });
}
const timingProperties = new Set(["ease", "easing", "animationEasing", "transitionTimingFunction", "animationTimingFunction", "cubic", "transition", "animation"]);
function constantSpeed(value: string): boolean {
  if (/(?:^|[\s,])linear(?:[\s,(]|$)/i.test(value)) return true;
  return [...value.matchAll(/cubic-bezier\(([^)]+)\)/gi)].some(match => {
    const parts = match[1].split(",").map(part => part.trim());
    const points = parts.every(Boolean) ? parts.map(Number) : [];
    return points.length === 4 && points.every(Number.isFinite)
      && points[0] === points[1] && points[2] === points[3];
  });
}
function numericValue(node: ts.Expression): number | null {
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(node.operand)) return -Number(node.operand.text);
  return null;
}

function sourceViolations(file: string, text: string, rotations = new Set<string>()) {
  const violations: string[] = [];
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const timing = (node: ts.Expression) => {
    if (ts.isStringLiteralLike(node) && constantSpeed(node.text)) violations.push(`${file}: linear timing property`);
    if (ts.isConditionalExpression(node)) {
      timing(node.whenTrue);
      timing(node.whenFalse);
    }
    if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) timing(node.expression);
    if (ts.isArrayLiteralExpression(node)) {
      const points = node.elements.map(item => numericValue(item as ts.Expression));
      if (points.length === 4 && points.every((point): point is number => point !== null)) {
        if (!isNonlinearCubic(points)) violations.push(`${file}: invalid/constant-speed curve tuple`);
      } else for (const item of node.elements) timing(item as ts.Expression);
    }
  };
  const visit = (node: ts.Node) => {
    if (ts.isStringLiteralLike(node)) {
      if (/(?:^|\s)(?:[\w\[\]=:-]+:)?ease-linear(?:\s|$)|animate-\[[^\]]+_linear(?:_|\])/.test(node.text)) violations.push(`${file}: linear utility`);
      if (/(?:^|\s)animate-spin(?:\s|$)/.test(node.text)) rotations.add(file);
    }
    if (ts.isPropertyAssignment(node) && timingProperties.has(node.name.getText(source).replace(/["']/g, ""))) timing(node.initializer);
    if (ts.isJsxAttribute(node) && timingProperties.has(node.name.getText(source)) && node.initializer) {
      const initializer = ts.isJsxExpression(node.initializer) ? node.initializer.expression : node.initializer;
      if (initializer) timing(initializer);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return violations;
}

describe("motion easing governance", () => {
  it("allows constant speed only at documented loading-rotation consumers", () => {
    const violations: string[] = [];
    const rotations = new Set<string>();
    let definitionSeen = false;
    for (const file of scanRoots.flatMap(files)) {
      if (["src/lib/token-catalog.ts", "src/lib/motion-easing-defaults.ts"].includes(file)) continue;
      const text = readFileSync(path.join(root, file), "utf8");
      if (file.endsWith(".css")) {
        postcss.parse(text).walkDecls(declaration => {
          const curves = [...declaration.value.matchAll(/cubic-bezier\(([^)]+)\)/gi)];
          for (const curve of curves) {
            const points = curve[1].split(",").map(Number);
            if (!isNonlinearCubic(points) || file !== "src/styles/index.css" || !declaration.prop.startsWith("--ease-")) violations.push(`${file}:${declaration.source?.start?.line} curve outside canonical tokens`);
          }
          if (!/^(?:--animate-|animation(?:-timing-function)?$|transition(?:-timing-function)?$)/.test(declaration.prop)) return;
          if (!constantSpeed(declaration.value)) return;
          if (file === policy.definition.file && declaration.prop === policy.definition.property && declaration.value === policy.definition.value) definitionSeen = true;
          else violations.push(`${file}:${declaration.source?.start?.line} ${declaration.prop}`);
        });
        continue;
      }
      violations.push(...sourceViolations(file, text, rotations));
    }
    expect(violations).toEqual([]);
    expect(definitionSeen).toBe(true);
    expect([...rotations].sort()).toEqual([...policy.rotationFiles].sort());
    expect(policy.definition.reason).not.toBe("");
  });
  it("detects equivalent curve strings, easing arrays and JSX expressions", () => {
    for (const text of [
      'const x = { transitionTimingFunction: "cubic-bezier(.2,.2,.8,.8)" };',
      'const x = { ease: ["easeIn", "linear"] };',
      'const x = { ease: [[.22,1,.36,1], [0,0,1,1]] };',
      '<X easing={"linear"} />;',
      '<X easing="linear" />;',
      '<X className="data-[state=open]:ease-linear" />;',
      'const x = { easing: "linear,ease-out" };',
      'const x = { transition: "opacity 200ms linear,transform 200ms ease-out" };',
      'const x = { easing: "LINEAR" };',
      'const x = { easing: condition ? "linear" : [.22,1,.36,1] };',
      '<X easing={condition ? "linear" : [.22,1,.36,1]} />;',
    ]) expect(sourceViolations("fixture.tsx", text)).not.toEqual([]);
    expect(sourceViolations("fixture.tsx", '<X type="linear" style={{ background: "linear-gradient(red, blue)" }} />')).toEqual([]);
    expect(sourceViolations("fixture.tsx", 'const x = { ease: [.22,1,.36,1] };')).toEqual([]);
  });
});
