import type { Locale, Localized } from "./locale";
import { documentRegistry } from "./documents";

export const site = { brand: "Orbit", title: { "zh-CN": "Orbit 文档", en: "Orbit documentation" } };
const zh = {
  navigation: "文档导航",
  guides: "使用指南",
  support: "支持",
  search: "搜索文档",
  searchPlaceholder: "搜索标题或正文",
  noResults: "没有找到文档",
  contents: "本页目录",
  skip: "跳到正文",
  notFound: "文档不存在",
  home: "返回介绍",
  footer: "示例文档 · 替换为你的项目内容",
};
const en: Record<keyof typeof zh, string> = {
  navigation: "Documentation navigation",
  guides: "Guides",
  support: "Support",
  search: "Search documentation",
  searchPlaceholder: "Search titles or content",
  noResults: "No documents found",
  contents: "On this page",
  skip: "Skip to content",
  notFound: "Document not found",
  home: "Return to introduction",
  footer: "Sample documentation · Replace with your project content",
};
export const copy = { "zh-CN": zh, en };
const sources = import.meta.glob<string>("./content/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});
export const documents: {
  id: string;
  group: "guides" | "support";
  title: Localized;
  content: Record<Locale, string>;
}[] = documentRegistry.map((document) => ({
  ...document,
  content: Object.fromEntries(
    ["zh-CN", "en"].map((locale) => {
      const source = sources[`./content/${locale}/${document.id}.md`];
      if (!source) throw new Error(`Missing document: ${locale}/${document.id}`);
      return [locale, source];
    }),
  ) as Record<Locale, string>,
}));

export function searchDocuments(query: string, locale: Locale) {
  const needle = query.trim().toLocaleLowerCase();
  return documents.filter((document) =>
    `${document.title[locale]} ${document.content[locale]}`.toLocaleLowerCase().includes(needle),
  );
}
