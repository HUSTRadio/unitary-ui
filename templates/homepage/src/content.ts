import type { Localized } from "./locale";

export const site = { brand: "Orbit", contactEmail: "hello@example.com" };
const zh = {
  navigation: "网站导航",
  features: "功能",
  workflow: "使用方式",
  pricing: "套餐",
  faq: "常见问题",
  eyebrow: "让团队专注于交付",
  title: "把想法变成团队的下一次交付。",
  lead: "在一个清晰的工作空间中规划项目、管理资源，了解每一步的进展。",
  start: "开始体验",
  explore: "查看功能",
  preview: "团队工作空间",
  previewLead: "让计划、进展与资源保持同步。",
  projects: "进行中的项目",
  tasks: "已完成任务",
  uptime: "服务可用率",
  sample: "示例产品与演示数据",
  featuresTitle: "从规划到交付，保持清晰",
  featuresLead: "用恰到好处的工具连接团队的日常工作。",
  workflowTitle: "从一个项目开始",
  pricingTitle: "适合每个阶段的套餐",
  pricingLead: "示例价格，按月展示每位成员的费用。",
  monthly: "按月",
  yearly: "按年",
  perMonth: "／成员／月",
  annualNote: "按年支付",
  monthlyNote: "按月支付",
  choose: "选择套餐",
  recommended: "推荐",
  faqTitle: "开始之前，你可能想了解",
  closing: "为下一次交付做好准备。",
  closingLead: "从清晰的项目计划开始，让团队向同一个方向前进。",
  back: "回到顶部",
  rights: "示例产品 · 替换为你的品牌信息",
  formTitle: "申请产品体验",
  formLead: "这是本地表单演示，填写内容不会发送到服务器。",
  name: "姓名",
  email: "工作邮箱",
  submit: "提交体验申请",
  cancel: "取消",
  done: "本地演示已完成，你的填写内容没有发送到服务器。",
  close: "关闭",
  selectedPlan: "选择的套餐",
  skip: "跳到正文",
};
const en: Record<keyof typeof zh, string> = {
  navigation: "Site navigation",
  features: "Features",
  workflow: "How it works",
  pricing: "Pricing",
  faq: "FAQ",
  eyebrow: "Give your team room to deliver",
  title: "Turn your ideas into your team's next delivery.",
  lead: "Plan projects, manage resources, and follow every step in one clear workspace.",
  start: "Start a trial",
  explore: "Explore features",
  preview: "Team workspace",
  previewLead: "Keep plans, progress, and resources connected.",
  projects: "Active projects",
  tasks: "Completed tasks",
  uptime: "Service availability",
  sample: "Sample product and demo data",
  featuresTitle: "Clarity from planning to delivery",
  featuresLead: "Connect everyday work with just the tools your team needs.",
  workflowTitle: "Start with one project",
  pricingTitle: "A plan for every stage",
  pricingLead: "Sample prices shown per member, per month.",
  monthly: "Monthly",
  yearly: "Yearly",
  perMonth: "/ member / month",
  annualNote: "Billed yearly",
  monthlyNote: "Billed monthly",
  choose: "Choose plan",
  recommended: "Recommended",
  faqTitle: "A few things before you start",
  closing: "Get ready for your next delivery.",
  closingLead: "Start with a clear plan and move your team in the same direction.",
  back: "Back to top",
  rights: "Sample product · Replace with your brand",
  formTitle: "Request a product trial",
  formLead: "This local form demo does not send your details to a server.",
  name: "Name",
  email: "Work email",
  submit: "Request trial",
  cancel: "Cancel",
  done: "Local demo complete. Your details were not sent to a server.",
  close: "Close",
  selectedPlan: "Selected plan",
  skip: "Skip to content",
};
export const copy = { "zh-CN": zh, en };
export const features: { title: Localized; description: Localized }[] = [
  {
    title: { "zh-CN": "共享项目计划", en: "Shared project plans" },
    description: {
      "zh-CN": "让目标、负责人和下一步行动始终清晰。",
      en: "Keep goals, owners, and next steps clear.",
    },
  },
  {
    title: { "zh-CN": "资源一目了然", en: "Resources in view" },
    description: {
      "zh-CN": "为团队提供统一的文件与资源入口。",
      en: "Give your team one place for files and resources.",
    },
  },
  {
    title: { "zh-CN": "进展随时可见", en: "Visible progress" },
    description: {
      "zh-CN": "通过简洁的概览了解进度，及时调整计划。",
      en: "Follow progress in a simple overview and adjust your plans.",
    },
  },
];
export const steps: Localized[] = [
  { "zh-CN": "创建项目并明确交付目标", en: "Create a project and define its goal" },
  { "zh-CN": "邀请团队，整理资源", en: "Bring your team and resources together" },
  { "zh-CN": "跟踪进展，持续改进", en: "Track progress and improve as you go" },
];
export const plans = [
  {
    id: "starter",
    name: "Starter",
    monthly: 12,
    yearly: 9,
    recommended: false,
    features: [
      { "zh-CN": "3 个项目", en: "3 projects" },
      { "zh-CN": "基础协作", en: "Core collaboration" },
    ],
  },
  {
    id: "team",
    name: "Team",
    monthly: 24,
    yearly: 18,
    recommended: true,
    features: [
      { "zh-CN": "无限项目", en: "Unlimited projects" },
      { "zh-CN": "团队资源管理", en: "Team resource management" },
    ],
  },
  {
    id: "business",
    name: "Business",
    monthly: 48,
    yearly: 36,
    recommended: false,
    features: [
      { "zh-CN": "高级分析", en: "Advanced analytics" },
      { "zh-CN": "优先支持", en: "Priority support" },
    ],
  },
] satisfies {
  id: string;
  name: string;
  monthly: number;
  yearly: number;
  recommended: boolean;
  features: Localized[];
}[];
export const questions: { question: Localized; answer: Localized }[] = [
  {
    question: { "zh-CN": "可以先试用吗？", en: "Can I try it first?" },
    answer: {
      "zh-CN": "可以。使用体验申请表单演示你的产品试用入口。",
      en: "Yes. The trial form demonstrates an entry point for your product.",
    },
  },
  {
    question: { "zh-CN": "可以随时更换套餐吗？", en: "Can I change plans?" },
    answer: {
      "zh-CN": "这里展示月付与年付的示例，实际计费规则由你的业务决定。",
      en: "These plans demonstrate monthly and yearly prices. Your product defines the billing rules.",
    },
  },
  {
    question: { "zh-CN": "我的数据会被保存吗？", en: "Will my data be saved?" },
    answer: {
      "zh-CN": "此演示没有后端，表单数据只在当前页面中使用。",
      en: "This demo has no backend. Form details stay on the current page.",
    },
  },
];
export const metrics = [
  { key: "projects", value: "12" },
  { key: "tasks", value: "128" },
  { key: "uptime", value: "99.9%" },
] as const;
