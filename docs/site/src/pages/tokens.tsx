import { useState } from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { SearchInput } from "@/components/ui/search-input";
import { Select, SelectItem } from "@/components/ui/select";
import { TokensExample } from "@/examples/TokensExample";
import TokensExampleSource from "@/examples/TokensExample.tsx?example-source";
import {
  GLOBAL_TOKENS,
  TOKEN_NAMES,
  RUNTIME_TOKEN_NAMES,
  type TokenGroup,
} from "@/lib/token-catalog";
import {
  DocsPageTitle,
  DocsPageLead,
  DocsSection,
  DocsSectionTitle,
  DocsParagraph,
} from "../components/docs-typography";
import type { DocsLanguage } from "../i18n/language";

const groups: Record<TokenGroup, [string, string]> = {
  colors: ["颜色", "Colors"],
  typography: ["字体与排版", "Typography"],
  motion: ["动画", "Motion"],
  shape: ["圆角", "Shape"],
  layers: ["层级", "Layers"],
  materials: ["材质", "Materials"],
  layout: ["尺寸与间距", "Layout"],
};

const api = [
  [
    "getToken(name, options?)",
    "string",
    "读取指定变量的当前级联值。",
    "Read a token's current cascaded value.",
  ],
  [
    "getTokens(names?, options?)",
    "TokenValues",
    "批量读取；默认读取全部运行时变量。",
    "Read selected tokens; defaults to all runtime tokens.",
  ],
  [
    "setToken(name, value, options?)",
    "boolean",
    "在目标元素写入一个运行时变量。",
    "Write one runtime token on the target element.",
  ],
  [
    "setTokens(values, options?)",
    "boolean",
    "先校验所有条目，再批量写入。",
    "Validate all entries before writing the batch.",
  ],
  [
    "resetToken(name, options?)",
    "boolean",
    "移除指定变量的行内覆盖。",
    "Remove one inline override.",
  ],
  [
    "resetTokens(names?, options?)",
    "boolean",
    "移除指定覆盖；默认移除全部运行时 token 的覆盖。",
    "Remove selected overrides; defaults to every runtime token.",
  ],
  [
    "subscribeTokens(listener, options?)",
    "() => void",
    "订阅修改；返回取消订阅函数。",
    "Subscribe to changes; returns an unsubscribe function.",
  ],
  [
    "useTokens(names?, options?)",
    "TokenValues",
    "React 订阅，返回缓存的只读快照。",
    "React subscription with a cached, readonly snapshot.",
  ],
] as const;

const quickStart = `import {
  getToken, getTokens, setToken, setTokens, resetTokens,
  subscribeTokens, useTokens, GLOBAL_TOKENS,
} from "@hustradio/unitary-ui";
import "@hustradio/unitary-ui/styles.css";

const radius = getToken("--radius");
const motion = getTokens(["--uni-duration-fast", "--ease-snap"]);
setToken("--radius", "8px");
setTokens({ "--primary": "#0070f3", "--primary-foreground": "#ffffff" });
const source = GLOBAL_TOKENS["--radius"].value;
const unsubscribe = subscribeTokens(() => console.log(getToken("--radius")));
unsubscribe();
resetTokens(["--radius", "--primary", "--primary-foreground"]);

function RadiusValue() {
  const values = useTokens(["--radius"]);
  return <output>{values["--radius"]}</output>;
}`;

const scopedCode = `const target = document.querySelector<HTMLElement>("#preview");
setTokens({ "--radius": "16px", "--primary": "#0b7a53" }, { target });
const current = getTokens(["--radius", "--primary"], { target });
resetTokens(["--radius", "--primary"], { target });`;

export function TokensPage({ language }: { language: DocsLanguage }) {
  const zh = language === "zh-CN";
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const visible = TOKEN_NAMES.filter((name) => {
    const token = GLOBAL_TOKENS[name];
    return (
      (group === "all" || token.group === group) &&
      `${name} ${token.value} ${token.darkValue}`.toLowerCase().includes(query.trim().toLowerCase())
    );
  });
  const cell = "border-b border-border p-3 text-left align-top text-copy-13";
  return (
    <article className="min-w-0 max-w-3xl">
      <DocsPageTitle>{zh ? "全局 Token" : "Global Tokens"}</DocsPageTitle>
      <DocsPageLead>
        {zh
          ? "查阅全局设计变量，并通过包根导出的 API 读取、修改和订阅当前页面的样式。"
          : "Browse global design variables and use the package-root API to read, update and subscribe to the current page's styles."}
      </DocsPageLead>
      <DocsSection>
        <DocsSectionTitle>{zh ? "快速开始" : "Quick start"}</DocsSectionTitle>
        <DocsParagraph>
          {zh
            ? "所有名称均带 -- 前缀。颜色、长度、字体、时长等值使用 CSS 字符串；getToken/getTokens 返回浏览器的级联值，GLOBAL_TOKENS 保存源码表达式、暗色覆盖及字体方案覆盖。"
            : "Every name starts with --. Values are CSS strings for colors, lengths, fonts and durations. getToken/getTokens return browser-cascaded values; GLOBAL_TOKENS stores source expressions, dark overrides and font-tier overrides."}
        </DocsParagraph>
        <CodeBlock language="tsx" filename="tokens.tsx">
          {quickStart}
        </CodeBlock>
      </DocsSection>
      <DocsSection>
        <DocsSectionTitle>{zh ? "实时演示" : "Live editor"}</DocsSectionTitle>
        <DocsParagraph>
          {zh
            ? "默认仅修改预览区域。选择整个页面后，覆盖写入根元素并保留到恢复或刷新；改变主题不会清除行内覆盖。"
            : "The editor starts with the preview scope. Choosing the entire page writes root overrides until reset or reload; switching themes retains inline overrides."}
        </DocsParagraph>
        <div className="rounded-lg border border-border p-4" data-token-demo>
          <TokensExample />
        </div>
        <details className="mt-4 overflow-hidden rounded-lg border border-border">
          <summary className="cursor-pointer p-4 text-label-14 focus-ring">
            {zh ? "显示代码" : "Show code"}
          </summary>
          <CodeBlock language="tsx" filename="TokensExample.tsx">
            {TokensExampleSource}
          </CodeBlock>
        </details>
      </DocsSection>
      <DocsSection>
        <DocsSectionTitle>{zh ? "作用范围与恢复" : "Scope and reset"}</DocsSectionTitle>
        <DocsParagraph>
          {zh
            ? 'TokenOptions.target 默认为 document.documentElement；传入元素即可局部覆盖，显式 null 表示暂未挂载，读值为空、写入返回 false。TokenWriteOptions.priority 可为 "" 或 "important"。恢复只移除指定 token 的行内值，不改动其他样式，随后采用当前 CSS 级联与主题。API 不自动持久化。'
            : 'TokenOptions.target defaults to document.documentElement. Pass an element for local overrides; explicit null represents an unmounted target, with empty reads and false writes. TokenWriteOptions.priority accepts "" or "important". Reset removes selected inline token values, preserves other styles and restores the current cascade and theme. The API does not persist changes.'}
        </DocsParagraph>
        <CodeBlock language="tsx" filename="scoped-tokens.ts">
          {scopedCode}
        </CodeBlock>
        <DocsParagraph>
          {zh
            ? "变量遵循浏览器级联规则：继承的别名可能已在祖先上解析，局部主题应直接覆盖组件消费的语义变量（如 --primary），而不是假设修改底层色板会重新解析全部继承别名。"
            : "Tokens follow browser cascade rules. Inherited aliases may already be resolved on an ancestor. For a local theme, override the semantic variable consumed by the component (such as --primary); changing a palette variable does not necessarily re-resolve inherited aliases."}
        </DocsParagraph>
      </DocsSection>
      <DocsSection>
        <DocsSectionTitle>API</DocsSectionTitle>
        <div data-slot="docs-local-scroll" className="overflow-x-auto">
          <table className="w-full min-w-[32rem]" aria-label={zh ? "Token API" : "Token API"}>
            <thead>
              <tr>
                {[zh ? "函数" : "Function", zh ? "返回" : "Returns", zh ? "行为" : "Behavior"].map(
                  (text) => (
                    <th key={text} className={cell}>
                      {text}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {api.map(([name, returns, cn, en]) => (
                <tr key={name}>
                  <td className={cell}>
                    <code>{name}</code>
                  </td>
                  <td className={cell}>
                    <code>{returns}</code>
                  </td>
                  <td className={cell}>{zh ? cn : en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DocsParagraph>
          {zh
            ? "TokenName 包含全部目录条目；RuntimeTokenName 仅包含可写变量；TokenGroup 是分组联合类型。TokenTarget 接受 HTMLElement 或 SVGElement；TokenValues 是按名称索引的只读字符串映射。TOKEN_NAMES 与 RUNTIME_TOKEN_NAMES 提供枚举列表。"
            : "TokenName covers the whole catalog; RuntimeTokenName covers writable variables; TokenGroup is the group union. TokenTarget accepts HTMLElement or SVGElement. TokenValues is a readonly name-to-string map. TOKEN_NAMES and RUNTIME_TOKEN_NAMES provide enumeration lists."}
        </DocsParagraph>
        <DocsParagraph>
          {zh
            ? "未知名称、构建映射、空值或错误 priority 会抛出 TypeError；CSS 字符串不保证在每个消费属性中都有效。订阅响应 API 写入、目标及祖先的 class/style/data-theme/data-font-tier 变化、窗口尺寸及深浅色/减少动画媒体变化；直接修改 CSSStyleSheet 或异步加载样式后，需主动读取。SSR 中读值为空、写入为 false，useTokens 使用空服务端快照并在客户端挂载后更新。"
            : "Unknown names, build mappings, empty values or invalid priority throw TypeError. A CSS string is not guaranteed to be valid for every consuming property. Subscriptions respond to API writes, target/ancestor class/style/data-theme/data-font-tier changes, resize, and color-scheme/reduced-motion media changes. Read explicitly after direct CSSStyleSheet edits or asynchronous stylesheet loading. SSR reads are empty and writes return false; useTokens hydrates from an empty server snapshot and updates after mounting."}
        </DocsParagraph>
      </DocsSection>
      <DocsSection>
        <DocsSectionTitle>
          {zh ? "变量与构建映射" : "Variables and build mappings"}
        </DocsSectionTitle>
        <DocsParagraph>
          {zh
            ? "目录中的运行时变量可用 setToken 修改。构建映射来自 @theme inline，Tailwind 可能把表达式直接写入工具类，修改映射变量不一定影响现有类；API 因此拒绝写入映射，请修改其 value 引用的运行时变量。例如圆角 --radius 影响 rounded-sm/rounded-md，rounded-lg 使用独立的固定映射。断点用于构建媒体查询，不能用运行时 API 更改响应式布局断点。"
            : "Runtime entries can be changed with setToken. Build mappings originate in @theme inline, whose expressions may be embedded in utilities. Changing the mapping variable may not affect existing classes, so writes are rejected; edit the runtime variable referenced by its value. For example, --radius affects rounded-sm/rounded-md, while rounded-lg has an independent fixed mapping. Breakpoints build media queries and cannot change responsive breakpoints through the runtime API."}
        </DocsParagraph>
        <DocsParagraph>
          {zh
            ? "--font-metric-cjk-ratio、--font-metric-digit-w、--font-metric-baseline、--font-metric-colon 是 applyFontMetrics 测量后写入的输出，不在静态目录内；字体探针会重新计算这些值。字体方案的覆盖记录在 variants 中。"
            : "--font-metric-cjk-ratio, --font-metric-digit-w, --font-metric-baseline and --font-metric-colon are measured outputs written by applyFontMetrics rather than static catalog entries. The font probe recalculates them. Font-tier overrides appear in variants."}
        </DocsParagraph>
      </DocsSection>
      <DocsSection>
        <DocsSectionTitle>{zh ? "完整目录" : "Complete catalog"}</DocsSectionTitle>
        <DocsParagraph>
          {zh
            ? `从样式源码生成 ${TOKEN_NAMES.length} 个条目，其中 ${RUNTIME_TOKEN_NAMES.length} 个运行时变量。下表保留源码的 var()/calc() 表达式；无暗色覆盖时沿用基础值。新增或修改样式定义后运行 pnpm run tokens:generate，再运行 pnpm run tokens:check。`
            : `${TOKEN_NAMES.length} entries generated from the stylesheet, including ${RUNTIME_TOKEN_NAMES.length} runtime variables. The table retains source var()/calc() expressions; dark mode inherits the base value when no override exists. Run pnpm run tokens:generate then pnpm run tokens:check after changing definitions.`}
        </DocsParagraph>
        <div className="mb-4 flex flex-wrap gap-3">
          <SearchInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label={zh ? "搜索 Token" : "Search tokens"}
            placeholder={zh ? "搜索名称或值" : "Search name or value"}
            layout={{ width: "min(20rem, 100%)" }}
          />
          <Select
            value={group}
            onValueChange={setGroup}
            aria-label={zh ? "Token 分组" : "Token group"}
            layout={{ width: 180 }}
          >
            <SelectItem value="all">{zh ? "全部分组" : "All groups"}</SelectItem>
            {Object.entries(groups).map(([id, labels]) => (
              <SelectItem key={id} value={id}>
                {labels[zh ? 0 : 1]}
              </SelectItem>
            ))}
          </Select>
        </div>
        <p role="status" className="mb-3 text-copy-13 text-muted-foreground">
          {zh ? `${visible.length} 个条目` : `${visible.length} entries`}
        </p>
        <div
          data-slot="docs-local-scroll"
          className="overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label={zh ? "全局 Token 目录" : "Global token catalog"}
        >
          <table className="w-full min-w-[48rem]" data-token-catalog>
            <thead>
              <tr>
                {[
                  zh ? "名称 / 分组 / 类型" : "Name / group / kind",
                  zh ? "基础值" : "Base value",
                  zh ? "暗色值" : "Dark value",
                  zh ? "字体覆盖" : "Font overrides",
                ].map((text) => (
                  <th key={text} className={cell}>
                    {text}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((name) => {
                const token = GLOBAL_TOKENS[name];
                return (
                  <tr key={name} data-token-name={name}>
                    <td className={`${cell} min-w-56`}>
                      <code className="break-all">{name}</code>
                      <p className="mt-1 text-muted-foreground">
                        {groups[token.group][zh ? 0 : 1]} ·{" "}
                        {token.kind === "runtime"
                          ? zh
                            ? "运行时"
                            : "Runtime"
                          : zh
                            ? "构建映射"
                            : "Build mapping"}
                      </p>
                    </td>
                    <td className={`${cell} max-w-80 break-words`}>
                      <code>{token.value || "—"}</code>
                    </td>
                    <td className={`${cell} max-w-80 break-words`}>
                      <code>{token.darkValue || token.value || "—"}</code>
                    </td>
                    <td className={`${cell} max-w-80 break-words`}>
                      {Object.entries(token.variants).map(([key, value]) => (
                        <p key={key}>
                          <code>
                            {key}: {value}
                          </code>
                        </p>
                      ))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DocsSection>
    </article>
  );
}
