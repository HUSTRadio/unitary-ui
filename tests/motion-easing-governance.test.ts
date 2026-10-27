import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import postcss from "postcss";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { isNonlinearCubic } from "../src/lib/motion-easing";

const root = process.cwd();
const policy = JSON.parse(readFileSync("tests/audit/motion-easing-allowlist.json", "utf8")) as {
  rotationFiles: string[];
  definition: { file: string; property: string; value: string; reason: string };
  keywordDefinition: { file: string; declaration: string; reason: string };
  authoredCurve: { property: string; frameProperty: string; reason: string };
};
const templateRoots = readdirSync(path.join(root, "templates"), { withFileTypes: true })
  .filter(entry => entry.isDirectory() && existsSync(path.join(root, "templates", entry.name, "src")))
  .map(entry => `templates/${entry.name}/src`);
const scanRoots = ["src", "docs/site/src", "website/src", "packages/dev-shell/src", ...templateRoots];
function proseRegistry(file: string): boolean {
  return /^docs\/site\/src\/(?:content|i18n|data)\//.test(file)
    || /^(?:website\/src|templates\/[^/]+\/src)\/(?:content|data|documents)\.ts$/.test(file);
}
function files(directory: string): string[] {
  return readdirSync(path.join(root, directory), { withFileTypes: true }).flatMap(entry => {
    const relative = `${directory}/${entry.name}`;
    if (["node_modules", "dist", "__tests__"].includes(entry.name)) return [];
    return entry.isDirectory() ? files(relative)
      : /\.(?:tsx?|css)$/.test(entry.name) && !/\.(?:test|spec)\.tsx?$/.test(entry.name) ? [relative] : [];
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
function fixedKeyword(value: string): boolean {
  return /(?:^|[\s,(])(?:ease(?:-in(?:-out)?|-out)?|easeIn(?:Out)?|easeOut|circIn(?:Out)?|circOut|backIn(?:Out)?|backOut|anticipate|step-start|step-end|steps\([^)]*\))(?=$|[\s,)])/i.test(value);
}
function numericValue(node: ts.Expression): number | null {
  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression(node)
    || ts.isTypeAssertionExpression(node)) return numericValue(node.expression);
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(node.operand)) return -Number(node.operand.text);
  return null;
}

function sourceViolations(file: string, text: string, rotations = new Set<string>(), definitions = new Set<string>()) {
  const violations: string[] = [];
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const isKeywordDefinition = (node: ts.Node) => {
    if (file !== policy.keywordDefinition.file) return false;
    for (let parent: ts.Node | undefined = node.parent; parent; parent = parent.parent) {
      if (ts.isVariableDeclaration(parent)) return parent.name.getText(source) === policy.keywordDefinition.declaration;
    }
    return false;
  };
  const timing = (node: ts.Expression, authored = false) => {
    if (ts.isStringLiteralLike(node)) {
      if (constantSpeed(node.text)) violations.push(`${file}: linear timing property`);
      else if (/cubic-bezier\(/i.test(node.text)) violations.push(`${file}: fixed curve outside canonical tokens`);
      else if (fixedKeyword(node.text)) violations.push(`${file}: fixed easing keyword outside canonical tokens`);
    }
    if (ts.isConditionalExpression(node)) {
      timing(node.whenTrue, authored);
      timing(node.whenFalse, authored);
    }
    if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression(node)
      || ts.isTypeAssertionExpression(node)) timing(node.expression, authored);
    if (ts.isArrayLiteralExpression(node)) {
      const points = node.elements.map(item => numericValue(item as ts.Expression));
      if (points.length > 0 && points.every((point): point is number => point !== null)) {
        if (!isNonlinearCubic(points)) violations.push(`${file}: invalid/constant-speed curve tuple`);
        else if (isKeywordDefinition(node)) definitions.add(`${file}#${policy.keywordDefinition.declaration}`);
        else if (!authored) violations.push(`${file}: fixed curve tuple outside canonical tokens`);
      } else for (const item of node.elements) timing(item as ts.Expression, authored);
    }
  };
  const visit = (node: ts.Node) => {
    if (ts.isStringLiteralLike(node) && !proseRegistry(file)) {
      if (/(?:^|\s)(?:[\w\[\]=:-]+:)?ease-linear(?:\s|$)|animate-\[[^\]]+_linear(?:_|\])/.test(node.text)) violations.push(`${file}: linear utility`);
      if (/ease-\[cubic-bezier\(|animate-\[[^\]]*_cubic-bezier\(/i.test(node.text)) violations.push(`${file}: fixed curve utility outside canonical tokens`);
      if (/(?:^|\s)animate-spin(?:\s|$)/.test(node.text)) rotations.add(file);
    }
    if (ts.isPropertyAssignment(node) && timingProperties.has(node.name.getText(source).replace(/["']/g, ""))) {
      const authored = node.name.getText(source).replace(/["']/g, "") === policy.authoredCurve.property
        && ts.isObjectLiteralExpression(node.parent)
        && node.parent.properties.some(property => (ts.isPropertyAssignment(property) || ts.isShorthandPropertyAssignment(property))
          && property.name.getText(source).replace(/["']/g, "") === policy.authoredCurve.frameProperty);
      timing(node.initializer, authored);
    }
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
  it("covers runtime shells and dynamically discovers copyable template sources", () => {
    const actual = scanRoots.flatMap(files);
    for (const file of ["docs/site/src/App.tsx", "docs/site/src/pages/tokens.tsx", "docs/site/src/index.css", "website/src/index.css", "packages/dev-shell/src/styles.css"]) {
      expect(actual).toContain(file);
    }
    for (const directory of templateRoots) expect(actual).toContain(`${directory}/App.tsx`);
    expect(actual.some(file => file.includes("/__tests__/"))).toBe(false);
  });

  it("allows constant speed only at documented loading-rotation consumers", () => {
    const violations: string[] = [];
    const rotations = new Set<string>();
    const definitions = new Set<string>();
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
          if (fixedKeyword(declaration.value)) violations.push(`${file}:${declaration.source?.start?.line} fixed easing keyword outside canonical tokens`);
          if (!constantSpeed(declaration.value)) return;
          if (file === policy.definition.file && declaration.prop === policy.definition.property && declaration.value === policy.definition.value) definitionSeen = true;
          else violations.push(`${file}:${declaration.source?.start?.line} ${declaration.prop}`);
        });
        continue;
      }
      violations.push(...sourceViolations(file, text, rotations, definitions));
    }
    expect(violations).toEqual([]);
    expect(definitionSeen).toBe(true);
    expect([...rotations].sort()).toEqual([...policy.rotationFiles].sort());
    expect(policy.definition.reason).not.toBe("");
    expect([...definitions]).toEqual([`${policy.keywordDefinition.file}#${policy.keywordDefinition.declaration}`]);
    expect(policy.keywordDefinition.reason.trim()).not.toBe("");
    expect(policy.authoredCurve).toMatchObject({ property: "cubic", frameProperty: "frame" });
    expect(policy.authoredCurve.reason.trim()).not.toBe("");
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
      'const x = { ease: [.22,1,.36,1] };',
      'const x = { ease: [[.22,1,.36,1], tokenCurve] };',
      'const x = { ease: ([.22,1,.36,1] as const) };',
      'const x = { ease: [.22 as number,1,.36,1] };',
      'const x = { easing: "cubic-bezier(.22,1,.36,1)" };',
      '<X easing={([.22,1,.36,1] satisfies number[])} />;',
      '<X transitionTimingFunction="cubic-bezier(.22,1,.36,1)" />;',
      '<X className="hover:ease-[cubic-bezier(.22,1,.36,1)]" />;',
      'const x = { frame: 0, cubic: [0,0,1,1] };',
      'const x = { cubic: [.22,1,.36,1] };',
      'const x = { easing: "ease-out" };',
      'const x = { ease: "easeOut" };',
      'const x = { ease: ["easeIn", "easeOut"] };',
      'const x = { ease: "anticipate" };',
      'const x = { transition: "opacity var(--uni-motion-state) ease-out" };',
    ]) expect(sourceViolations("fixture.tsx", text)).not.toEqual([]);
    expect(sourceViolations("fixture.tsx", '<X type="linear" style={{ background: "linear-gradient(red, blue)" }} />')).toEqual([]);
  });

  it("preserves token-derived curves, authored Hitu segments and displayed prose", () => {
    for (const text of [
      'const x = { ease: tokenCurve };',
      'const x = { ease: [...ease] };',
      'const x = { easing: `cubic-bezier(${curve.join(",")})` };',
      'const x = { transition: "opacity var(--uni-motion-state) var(--ease-snap)" };',
      'const x = { easing: "var(--ease-out)" };',
      'const x = { frame: 0, cubic: [.22,1,.36,1] };',
      'const x = { frames: [{ frame: 0, cubic: [.22,1,.36,1] as const }] };',
      'const frame = 0; const x = { frame, cubic: [.22,1,.36,1] };',
      'const text = "A curve example: cubic-bezier(.22,1,.36,1)";',
    ]) expect(sourceViolations("fixture.tsx", text)).toEqual([]);
    expect(sourceViolations("docs/site/src/content/guide.ts", 'const text = "ease-[cubic-bezier(.22,1,.36,1)]";')).toEqual([]);
    expect(sourceViolations("docs/site/src/content/guide.ts", 'const transition = { ease: [.22,1,.36,1] };')).not.toEqual([]);
  });

  it("limits the CSS keyword coordinate exception to its named parser declaration", () => {
    const definitions = new Set<string>();
    const keyword = 'const cssKeywords = { ease: [.25,.1,.25,1] };';
    expect(sourceViolations(policy.keywordDefinition.file, keyword, new Set(), definitions)).toEqual([]);
    expect([...definitions]).toEqual([`${policy.keywordDefinition.file}#cssKeywords`]);
    expect(sourceViolations("fixture.ts", keyword)).not.toEqual([]);
    expect(sourceViolations(policy.keywordDefinition.file, 'const other = { ease: [.25,.1,.25,1] };')).not.toEqual([]);
  });

  it("detects fixed CSS shorthand keywords without matching token names", () => {
    for (const value of ["ease-out", "ease-in-out", "opacity var(--uni-motion-state) ease", "pulse 2s ease-in infinite", "var(--ease-snap, ease-out)"]) {
      expect(fixedKeyword(value)).toBe(true);
    }
    for (const value of ["var(--ease-out)", "opacity var(--uni-motion-state) var(--ease-in-out)", "none"]) {
      expect(fixedKeyword(value)).toBe(false);
    }
  });
});
