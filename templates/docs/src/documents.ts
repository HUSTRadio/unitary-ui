import type { Localized } from "./locale";

// This registry owns navigation, route identity, ordering, and bilingual titles.
export const documentRegistry: { id: string; group: "guides" | "support"; title: Localized }[] = [
  { id: "introduction", group: "guides", title: { "zh-CN": "介绍", en: "Introduction" } },
  { id: "getting-started", group: "guides", title: { "zh-CN": "快速开始", en: "Getting started" } },
  { id: "configuration", group: "guides", title: { "zh-CN": "配置指南", en: "Configuration" } },
  { id: "faq", group: "support", title: { "zh-CN": "常见问题", en: "FAQ" } },
];
