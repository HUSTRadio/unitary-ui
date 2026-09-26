import type { ReactNode } from "react";

import { Link } from "react-router-dom";

import {
  DocsList,
  DocsPageLead,
  DocsPageTitle,
  DocsParagraph,
  DocsSection,
  DocsSectionTitle,
} from "./docs-typography";

/**
 * 文档站通用内容模型：把「页面文案」从 JSX 中拆出为纯数据，
 * 由 DocArticle 统一渲染。双语 = 同一结构的两份 Record<DocsLanguage, …>，
 * TypeScript 保证两种语言的 block 结构完全同构，漏译即编译错误。
 *
 * 行内富文本用极简 run 表示（Karpathy 最小实现）：
 * 仅覆盖文档实际需要的四种形态——纯文本 / 行内代码 / 加粗 / 站内链接。
 * 不做通用 CMS：表格、代码块等仍由专门组件承担。
 */

/** 行内 run：string = 普通文本。 */
export type DocInline =
  | string
  | { code: string }
  | { strong: string }
  /** [显示文本, 站内路由] */
  | { link: [string, string] };

export type DocBlock =
  | { p: DocInline[] }
  | { ul: DocInline[][] };

export interface DocSection {
  heading: string;
  blocks: DocBlock[];
}

export interface DocPageContent {
  title: string;
  lead: DocInline[];
  sections: DocSection[];
}

/**
 * 行内代码：Geist 排版规范指定 inline code mention 使用 mono 变体；
 * label-13-mono 是与 14px 正文（copy-14）配对的官方组合。
 */
function Code({ children }: { children: ReactNode }) {
  return (
    <code translate="no" className="font-mono text-label-13-mono text-foreground">
      {children}
    </code>
  );
}

export function DocText({ runs }: { runs: DocInline[] }): ReactNode {
  return runs.map((run, index) => {
    if (typeof run === "string") return run;
    if ("code" in run) return <Code key={index}>{run.code}</Code>;
    if ("strong" in run) return <strong key={index}>{run.strong}</strong>;
    return (
      <Link key={index} className="text-link underline underline-offset-4" to={run.link[1]}>
        {run.link[0]}
      </Link>
    );
  });
}

function DocBlocks({ blocks }: { blocks: DocBlock[] }): ReactNode {
  return blocks.map((block, index) =>
    "p" in block ? (
      <DocsParagraph key={index}>
        <DocText runs={block.p} />
      </DocsParagraph>
    ) : (
      <DocsList key={index}>
        {block.ul.map((item, itemIndex) => (
          <li key={itemIndex}>
            <DocText runs={item} />
          </li>
        ))}
      </DocsList>
    ),
  );
}

export function DocArticle({ content }: { content: DocPageContent }): ReactNode {
  return (
    <article className="max-w-3xl">
      <DocsPageTitle>{content.title}</DocsPageTitle>
      <DocsPageLead>
        <DocText runs={content.lead} />
      </DocsPageLead>
      {content.sections.map((section) => (
        <DocsSection key={section.heading}>
          <DocsSectionTitle>{section.heading}</DocsSectionTitle>
          <DocBlocks blocks={section.blocks} />
        </DocsSection>
      ))}
    </article>
  );
}
