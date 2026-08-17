import Prism from "prismjs";

// 语言组件按依赖顺序加载：markup/javascript → jsx/typescript/json/bash
import "prismjs/components/prism-markup";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";

/** 语言别名映射（消费方常用别名 → Prism 语言 key）。 */
const LANGUAGE_ALIASES: Record<string, string> = {
  js: "javascript",
  jsx: "jsx",
  mjs: "javascript",
  cjs: "javascript",
  ts: "typescript",
  tsx: "tsx",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
};

export type HighlightToken = { type: string; content: string };

/** 语言别名归一化（导出供 language-icons 复用）。 */
export function resolveLanguageKey(language?: string): string | undefined {
  if (!language) return undefined;
  return LANGUAGE_ALIASES[language] ?? language;
}

function resolveGrammar(language?: string): Prism.Grammar | undefined {
  const key = resolveLanguageKey(language);
  return key ? Prism.languages[key] : undefined;
}

/**
 * 对代码做 Prism 分词，返回按行分组的叶子 token。
 * 每个 token 的 type 为空格分隔的类名（如 "function maybe-class-name"），
 * 渲染为 <span className={`token ${type}`}>，与官方 Prism 输出结构一致。
 */
export function highlightLines(code: string, language?: string): HighlightToken[][] {
  const grammar = resolveGrammar(language);
  if (!grammar) {
    return code.split("\n").map((line) => [{ type: "plain", content: line }]);
  }

  const tokens = Prism.tokenize(code, grammar);

  // flatten 嵌套 token 为叶子：累积祖先 type + alias，同名字段去重，
  // 与官方复合 class 一致（如 "tag punctuation"、"keyword control-flow"、"function maybe-class-name"）
  const flat: HighlightToken[] = [];
  const walk = (list: Array<string | Prism.Token>, prefix = ""): void => {
    for (const token of list) {
      if (typeof token === "string") {
        flat.push({ type: prefix || "plain", content: token });
      } else {
        const aliases = Array.isArray(token.alias) ? token.alias : token.alias ? [token.alias] : [];
        const parts = [
          ...new Set(`${prefix} ${token.type} ${aliases.join(" ")}`.split(" ").filter(Boolean)),
        ];
        const fullType = parts.join(" ");
        if (Array.isArray(token.content)) walk(token.content, fullType);
        else flat.push({ type: fullType, content: String(token.content) });
      }
    }
  };
  walk(tokens);

  // 按换行符切行，保持 token 边界
  const lines: HighlightToken[][] = [[]];
  for (const { type, content } of flat) {
    const parts = content.split("\n");
    parts.forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ type, content: part });
    });
  }
  return lines;
}
