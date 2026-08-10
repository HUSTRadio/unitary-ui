import type { DocsLanguage } from "./language";

export const LANGUAGE_OPTIONS: Array<{ value: DocsLanguage; label: string }> = [
  { value: "zh-CN", label: "中文" },
  { value: "en-US", label: "English" },
];

export const SHELL_COPY = {
  "zh-CN": {
    homeAria: "Geist Style Framework 首页",
    searchPlaceholder: "搜索 Geist",
    searchAria: "搜索文档",
    languageAria: "选择语言",
    languageLabel: "语言",
    themeAria: "显示主题",
    foundations: "基础",
    components: "组件",
    skip: "跳转到正文",
    pageInProgress: "页面开发中",
    pageInProgressDescription: (pathname: string) => `该页面（${pathname}）由后续任务实现。`,
    feedbackQuestion: "这篇文档对你有帮助吗？",
    feedbackYes: "有帮助",
    feedbackNo: "没有帮助",
    previous: "上一页",
    next: "下一页",
  },
  "en-US": {
    homeAria: "Geist Style Framework home",
    searchPlaceholder: "Search Geist",
    searchAria: "Search documentation",
    languageAria: "Select language",
    languageLabel: "Language",
    themeAria: "Display theme",
    foundations: "Foundations",
    components: "Components",
    skip: "Skip to content",
    pageInProgress: "Page in progress",
    pageInProgressDescription: (pathname: string) =>
      `This page (${pathname}) will be implemented later.`,
    feedbackQuestion: "Was this helpful?",
    feedbackYes: "Yes",
    feedbackNo: "No",
    previous: "Previous",
    next: "Next",
  },
} as const;

export type ShellCopy = (typeof SHELL_COPY)[DocsLanguage];
