import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

/**
 * RSC 模块边界分析（M0-01）。
 *
 * 判定一个公共模块是否必须位于 client 边界内：出现任何 React hook 调用
 * （含自定义 useXxx）、createContext / forwardRef / memo / lazy、类组件生命周期
 * （componentDidCatch、getDerivedStateFromError、extends Component/PureComponent）、
 * JSX 事件处理器属性（onXxx=）或浏览器全局对象属性访问（window/document/
 * localStorage/navigator.xxx）即判定 client。
 *
 * 基于 TypeScript AST，因此注释、字符串和 `typeof document` 守卫不会误报。
 * 分类台账见 tests/fixtures/rsc-boundaries.json；治理测试 tests/rsc-boundaries.test.ts。
 */

export const RSC_SCAN_ROOTS = ["src/components/ui", "src/lib"];

const CLIENT_HOOK_RE = /^use[A-Z]/;
const BROWSER_GLOBALS = new Set(["window", "document", "localStorage", "sessionStorage", "navigator"]);

function walkNode(node, hits, visit) {
  if (ts.isCallExpression(node)) {
    const callee = node.expression;
    if (ts.isIdentifier(callee) && CLIENT_HOOK_RE.test(callee.text)) {
      hits.add(`hook:${callee.text}`);
    } else if (ts.isPropertyAccessExpression(callee) && CLIENT_HOOK_RE.test(callee.name.text)) {
      hits.add(`hook:${callee.name.text}`);
    } else if (ts.isIdentifier(callee)) {
      if (callee.text === "createContext") hits.add("context:createContext");
      else if (callee.text === "forwardRef") hits.add("react:forwardRef");
      else if (callee.text === "memo") hits.add("react:memo");
      else if (callee.text === "lazy") hits.add("react:lazy");
      else if (callee.text === "matchMedia") hits.add("dom:matchMedia");
    }
  } else if (ts.isJsxAttribute(node) && ts.isIdentifier(node.name) && /^on[A-Z]/.test(node.name.text)) {
    hits.add(`event:${node.name.text}`);
  } else if (
    ts.isPropertyAccessExpression(node) &&
    ts.isIdentifier(node.expression) &&
    BROWSER_GLOBALS.has(node.expression.text)
  ) {
    hits.add(`dom:${node.expression.text}`);
  } else if (ts.isClassDeclaration(node) || ts.isClassExpression(node)) {
    for (const heritage of node.heritageClauses ?? []) {
      for (const type of heritage.types) {
        const name = ts.isIdentifier(type.expression) ? type.expression.text : type.expression.getText?.();
        if (name === "Component" || name === "React.Component" || name === "PureComponent" || name === "React.PureComponent") {
          hits.add(`class:${name}`);
        }
      }
    }
    for (const member of node.members) {
      const memberName = member.name && ts.isIdentifier(member.name) ? member.name.text : undefined;
      if (memberName === "componentDidCatch") hits.add("class:componentDidCatch");
      if (memberName === "getDerivedStateFromError") hits.add("class:getDerivedStateFromError");
    }
  }
  ts.forEachChild(node, visit);
}

/** Analyze one module source string. Returns sorted unique client indicator hits. */
export function analyzeRscModule(source) {
  const parsed = ts.createSourceFile("module.tsx", source, ts.ScriptTarget.Latest, true);
  if (parsed.parseDiagnostics?.length) throw new Error(`Cannot parse module: ${parsed.parseDiagnostics[0].messageText}`);
  const hits = new Set();
  const visit = (node) => {
    walkNode(node, hits, visit);
  };
  visit(parsed);
  return [...hits].sort();
}

export function hasUseClientDirective(source) {
  return /^\s*["']use client["']\s*(;|,)?\s*(\n|$)/.test(source);
}

/** List every implementation module under the RSC scan roots (tests excluded). */
export function listRscModuleFiles(root) {
  const files = [];
  const walk = (relative) => {
    const absolute = path.join(root, relative);
    for (const entry of readdirSync(absolute, { withFileTypes: true })) {
      const child = path.posix.join(relative, entry.name);
      if (entry.isDirectory()) walk(child);
      else if (/\.(tsx?|jsx?)$/.test(entry.name) && !/\.test\./.test(entry.name)) files.push(child.replace(/\\/g, "/"));
    }
  };
  for (const scanRoot of RSC_SCAN_ROOTS) walk(scanRoot);
  return files.sort();
}

/** Load one module's analysis result. */
export function inspectRscModule(root, file) {
  const source = readFileSync(path.join(root, file), "utf8");
  return { indicators: analyzeRscModule(source), hasDirective: hasUseClientDirective(source) };
}
