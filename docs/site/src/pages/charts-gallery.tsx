import { AreaChart } from "@/components/ui/charts/area-chart";

import { COMPONENTS } from "../data/components";
import { type DocsLanguage } from "../i18n/language";
import {
  DocsPageLead,
  DocsPageTitle,
  DocsBlock,
} from "../components/docs-typography";

/**
 * 「图表」分组首页（/charts）：画廊式索引页。
 * 对齐 tremor.so/charts 的展示方式：顶部 hero demo（面积图）+ 逐组件卡片网格。
 * 卡片与 /components 索引共用 docs-card 视觉语言；详情页由 component-detail 渲染器承接。
 */

/** 图表分组组件名单（与 docs-routes 的 CHART_COMPONENT_NAMES 保持一致）。 */
const CHART_COMPONENT_NAMES: ReadonlySet<string> = new Set([
  "area-chart",
  "bar-chart",
  "line-chart",
  "combo-chart",
  "donut-chart",
  "spark-chart",
  "category-bar",
  "bar-list",
  "tracker",
  "progress-circle",
]);

const HERO_DATA = [
  { month: "Jan", visitors: 2890, pageviews: 4210 },
  { month: "Feb", visitors: 3012, pageviews: 4480 },
  { month: "Mar", visitors: 3245, pageviews: 4932 },
  { month: "Apr", visitors: 3120, pageviews: 4750 },
  { month: "May", visitors: 3560, pageviews: 5418 },
  { month: "Jun", visitors: 3822, pageviews: 5890 },
];

const COPY = {
  "zh-CN": {
    lead: "图表基于 Tremor Raw，覆盖趋势、数值比较、占比和迷你图，支持明暗主题。",
    heroTitle: "Visitor analytics",
    heroSubtitle: "近 6 个月访客与浏览量（AreaChart live demo）",
  },
  "en-US": {
    lead: "Charts based on Tremor Raw for trends, comparisons, proportions, and small visualizations, with light and dark themes.",
    heroTitle: "Visitor analytics",
    heroSubtitle: "Visitors and pageviews over the last 6 months (AreaChart live demo)",
  },
} as const;

export function ChartsGalleryPage({ language }: { language: DocsLanguage }) {
  const copy = COPY[language];
  const charts = COMPONENTS.filter((component) => CHART_COMPONENT_NAMES.has(component.name));

  return (
    <div>
      <DocsPageTitle>{language === "zh-CN" ? "图表" : "Charts"}</DocsPageTitle>
      <DocsPageLead className="max-w-xl">{copy.lead}</DocsPageLead>

      <DocsBlock data-demo-component="area-chart" data-demo-mode="live">
        <div className="rounded-[8px] border border-gray-alpha-400 bg-background-100">
          <div className="flex flex-col gap-1 border-b border-gray-alpha-400 p-6 pb-4">
            <p className="text-label-16 font-medium text-foreground">{copy.heroTitle}</p>
            <p className="text-copy-13 text-muted-foreground">{copy.heroSubtitle}</p>
          </div>
          <div className="w-full p-6">
            <AreaChart
              data={HERO_DATA}
              index="month"
              categories={["visitors", "pageviews"]}
              colors={["blue", "violet"]}
              valueFormatter={(value) =>
                Intl.NumberFormat("us", { notation: "compact" }).format(value).toString()
              }
            />
          </div>
        </div>
      </DocsBlock>

      <div className="mt-10 grid grid-cols-1 border-t border-l border-border sm:grid-cols-2 xl:grid-cols-3">
        {charts.map((component) => (
          <a
            key={component.name}
            href={`#/charts/${component.name}`}
            data-slot="docs-card"
            className="group block border-b border-r border-border p-6 transition-colors hover:bg-gray-alpha-100"
          >
            <p
              data-slot="component-id"
              className="font-mono text-label-12 text-muted-foreground"
            >
              {component.name}
            </p>
            <h3 className="mt-1 text-label-16 font-medium text-foreground">
              {language === "zh-CN" ? (component.labelZh ?? component.label) : component.label}
            </h3>
            <p className="mt-1 text-copy-13 text-muted-foreground">
              {language === "zh-CN"
                ? (component.descriptionZh ?? component.description)
                : component.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
