import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import type { Root } from "mdast";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  CodeBlock,
  InlineCode,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "@hustradio/unitary-ui";

// Both the outline and rendered heading IDs use the same AST and slug policy.
function headings(tree: Root) {
  const slugger = new GithubSlugger();
  return tree.children
    .filter((node) => node.type === "heading")
    .map((node) => {
      const title = toString(node);
      const id = slugger.slug(title);
      node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } };
      return { id, title, depth: node.depth };
    });
}
export function documentOutline(source: string) {
  return headings(unified().use(remarkParse).parse(source)).filter(
    (heading) => heading.depth === 2 || heading.depth === 3,
  );
}
function remarkHeadingIds() {
  return (tree: Root) => {
    headings(tree);
  };
}

const components: Components = {
  h1: ({ node: _node, ...props }) => <h1 {...props} className="docs-prose-title" />,
  h2: ({ node: _node, ...props }) => (
    <h2 {...props} className="docs-prose-heading template-section mt-10" />
  ),
  h3: ({ node: _node, ...props }) => (
    <h3 {...props} className="template-section mt-8 text-heading-20" />
  ),
  p: ({ node: _node, ...props }) => (
    <p {...props} data-slot="docs-prose-paragraph" className="docs-prose-paragraph" />
  ),
  ul: ({ node: _node, ...props }) => (
    <ul {...props} data-slot="docs-prose-list" className="docs-prose-list list-disc" />
  ),
  ol: ({ node: _node, ...props }) => (
    <ol {...props} data-slot="docs-prose-list" className="docs-prose-list list-decimal" />
  ),
  blockquote: ({ node: _node, ...props }) => (
    <blockquote {...props} className="my-6 border-l-2 border-border pl-4 text-muted-foreground" />
  ),
  code: ({ node: _node, ...props }) => <InlineCode {...props} />,
  pre: ({ node }) => {
    const code = node?.children.find(
      (child) => child.type === "element" && child.tagName === "code",
    );
    const language =
      code?.type === "element"
        ? String(code.properties.className ?? "").match(/language-([\w-]+)/)?.[1]
        : undefined;
    const source =
      code?.type === "element"
        ? code.children
            .map((child) => (child.type === "text" ? child.value : ""))
            .join("")
            .replace(/\n$/, "")
        : "";
    return (
      <div className="my-6 min-w-0">
        <CodeBlock language={language}>{source}</CodeBlock>
      </div>
    );
  },
  table: ({ node: _node, ...props }) => (
    <TableRoot className="my-6" tabIndex={0}>
      <Table {...props} />
    </TableRoot>
  ),
  thead: ({ node: _node, ...props }) => <TableHeader {...props} />,
  tbody: ({ node: _node, ...props }) => <TableBody {...props} />,
  tr: ({ node: _node, ...props }) => <TableRow {...props} />,
  th: ({ node: _node, align, ...props }) => (
    <TableHead
      {...props}
      align={align === "left" || align === "center" || align === "right" ? align : undefined}
    />
  ),
  td: ({ node: _node, align, ...props }) => (
    <TableCell
      {...props}
      align={align === "left" || align === "center" || align === "right" ? align : undefined}
    />
  ),
  img: ({ node: _node, ...props }) => <img {...props} className="my-6 max-w-full rounded-lg" />,
};

export function DocumentBody({ source }: { source: string }) {
  const { pathname } = useLocation();
  return (
    <Markdown
      remarkPlugins={[remarkGfm, remarkHeadingIds]}
      components={{
        ...components,
        a: ({ node: _node, href = "", ...props }) => {
          if (href.startsWith("#"))
            return (
              <RouterLink {...props} className="focus-ring underline" to={`${pathname}${href}`} />
            );
          if (/\.md(?:#|$)/.test(href))
            return (
              <RouterLink
                {...props}
                className="focus-ring underline"
                to={`/${href.replace(/^\.\//, "").replace(/\.md(?=#|$)/, "")}`}
              />
            );
          return <Link {...props} href={href} />;
        },
      }}
    >
      {source}
    </Markdown>
  );
}
