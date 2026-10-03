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

const statuses = {
  active: ["受支持", "Supported"],
  reserved: ["预留", "Reserved"],
  deprecated: ["已弃用", "Deprecated"],
} as const;

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
      <DocsPageTitle>{zh ? "全局变量" : "Global Tokens"}</DocsPageTitle>
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
            ? "目录中的运行时变量可用 setToken 修改。构建映射包括 @theme inline 映射和所有 --breakpoint-* 断点。Tailwind 可能把表达式直接写入工具类；断点则在构建时展开为媒体条件，即使 @theme static 发射了变量，条件也不会随写入改变。API 和 RuntimeTokenName 因此排除这些构建配置，请修改工具类实际消费的运行时变量。例如 --radius 影响 rounded-sm/rounded-md，rounded-lg 使用独立的固定映射。局部修改动效档位时，也应让目标直接消费该变量，或覆盖目标消费的语义别名。"
            : "Runtime entries can be changed with setToken. Build mappings include @theme inline mappings and every --breakpoint-* token. Tailwind may embed expressions in utilities; breakpoints compile into media conditions that stay fixed even when @theme static emits the variables. The API and RuntimeTokenName exclude these build configurations. Edit the runtime variable actually consumed by the utility: --radius affects rounded-sm/rounded-md, while rounded-lg uses an independent fixed mapping. For scoped motion changes, consume the edited tier directly or override the semantic alias consumed by the target."}
        </DocsParagraph>
        <DocsParagraph>
          {zh
            ? "--font-metric-cjk-ratio、--font-metric-digit-w、--font-metric-baseline、--font-metric-colon 是 applyFontMetrics 测量后写入的输出，不在静态目录内；字体探针会重新计算这些值。字体方案的覆盖记录在 variants 中。"
            : "--font-metric-cjk-ratio, --font-metric-digit-w, --font-metric-baseline and --font-metric-colon are measured outputs written by applyFontMetrics rather than static catalog entries. The font probe recalculates them. Font-tier overrides appear in variants."}
        </DocsParagraph>
        <DocsParagraph>
          {zh
            ? "Grid 的 grid-xs/sm/smd/md token 是 400/600/768/960px 的视口档位上界（默认 16px 字号），Grid 的 lg 档从 960px 以上开始。历史 grid-lg: 工具类保留 1280px 阈值，不代表组件的 lg 档入口。Tailwind 的无 max- 前缀变体从阈值起生效，max- 变体在阈值以下生效，应按条件而不是同名档位选择。"
            : "Grid's grid-xs/sm/smd/md tokens are viewport tier upper bounds at 400/600/768/960px with the default 16px font size; the component's lg tier starts above 960px. The legacy grid-lg: utility retains its 1280px threshold and does not represent the component's lg entry. Tailwind variants without max- start at the threshold; max- variants apply below it. Choose by the condition rather than by a matching tier name."}
        </DocsParagraph>
      </DocsSection>
      <DocsSection>
        <DocsSectionTitle>{zh ? "生命周期与推荐入口" : "Lifecycle and preferred names"}</DocsSectionTitle>
        <DocsParagraph>
          {zh
            ? "目录的 status 区分 active（受支持）、reserved（预留）与 deprecated（已弃用）；状态独立于 runtime/mapping 配置机制。受支持不表示每个组件都消费该变量，预留表示工具类或定义已有契约但当前界面未接入。已弃用名称继续保留兼容，其 replacement 给出推荐替代入口；替换前应检查消费语义，不自动转换原有配色。"
            : "Catalog status distinguishes active (supported), reserved and deprecated entries independently of runtime/mapping behavior. Supported does not mean every component consumes the variable. Reserved entries have a definition or utility contract without current UI integration. Deprecated names remain compatible; replacement identifies the preferred alternative. Check the consuming role before migrating rather than automatically converting existing colors."}
        </DocsParagraph>
        <DocsParagraph>
          {zh
            ? "新代码使用 --radius-circular/--radius-capsule，旧 circle/pill 名称保留为兼容入口。--invert-background/foreground 不再用于默认 Tooltip；默认 Tooltip 使用 --background-100/--foreground。--radius-continuous 是预留的普通圆角降级工具类，ContinuousSurface 的曲线与降级半径由 radius prop 控制。菜单行高使用 --uni-popover-row-height，默认 36px；Menu 的触控最小高度仍为 44px。"
            : "New code uses --radius-circular/--radius-capsule; the circle/pill names remain compatibility entries. --invert-background/foreground are no longer used by the default Tooltip, which consumes --background-100/--foreground. --radius-continuous is a reserved ordinary-radius fallback utility; ContinuousSurface uses its radius prop for both curves and fallback. Menu row height consumes --uni-popover-row-height, defaulting to 36px; Menu retains a 44px minimum height for touch pointers."}
        </DocsParagraph>
        <DocsParagraph>
          {zh
            ? "--uni-doc-space-* 与 --uni-doc-list-indent 服务文档站内容排版，保留既有公共 CSS 契约。新增站点外壳尺寸与媒体条件由 docs/site/src/index.css 管理，避免继续扩展组件库的站点专用目录。"
            : "--uni-doc-space-* and --uni-doc-list-indent serve documentation content typography and retain their existing public CSS contract. New site shell geometry and media conditions belong in docs/site/src/index.css to avoid extending the library catalog with site-specific configuration."}
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
                      <p className="mt-1 text-muted-foreground" data-token-status={token.status}>
                        {statuses[token.status][zh ? 0 : 1]}
                        {"replacement" in token && <> · {zh ? "推荐" : "Prefer"} <code>{token.replacement}</code></>}
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
