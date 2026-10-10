import { useState } from "react";
import { CodeBlock } from "@/components/ui/code-block";
import type { WebsiteShellProps } from "../../templates/website-shell";
import source from "../../templates/website-shell.tsx?example-source";
import type { DocsLanguage } from "../../i18n/language";
import { DocsPageLead, DocsPageTitle } from "../docs-typography";

export function SiteShellDemo({ language }: { language: DocsLanguage }) {
  const [variant, setVariant] = useState<NonNullable<WebsiteShellProps["variant"]>>("portal");
  const chinese = language === "zh-CN";
  const variants = ["portal", "editorial", "university", "corporate"] as const;
  const names = chinese
    ? ["内容门户", "编辑式官网", "大学门户", "企业叙事"]
    : ["Content portal", "Editorial", "University", "Corporate story"];
  return (
    <>
      <DocsPageTitle>
        {chinese ? "官网壳层与滚动配方" : "Website shells and scroll recipes"}
      </DocsPageTitle>
      <DocsPageLead>
        {chinese
          ? "四种可复制的布局配方，复用同一组官网导航与页脚契约。切换尺寸可检查桌面目录、移动折叠和自然滚动；内容与品牌由站点提供。"
          : "Four copyable recipes share website navigation and footer contracts. Resize to inspect desktop panels, mobile disclosures, and native scrolling; provide your own content and brand."}
      </DocsPageLead>
      <p className="my-4 text-copy-14">
        {chinese
          ? "usePageScroll(threshold = 80, target?) 返回 scrolled、direction 与 0–1 的 progress。scrolled 按绝对位置判断；direction 累计移动达到阈值才改变。target 省略或为 null 时观察文档，否则观察指定容器；初始化会读取恢复的滚动位置。"
          : "usePageScroll(threshold = 80, target?) returns scrolled, direction, and progress from 0 to 1. scrolled uses absolute position; direction changes after cumulative movement reaches the threshold. Omit target or pass null for the document, or supply a scroll container. Initialization reads restored scroll positions."}
      </p>
      <fieldset className="my-6 flex flex-wrap gap-3">
        <legend className="mb-3 text-copy-14">{chinese ? "选择模板" : "Choose a recipe"}</legend>
        {variants.map((value, index) => (
          <label
            key={value}
            className="flex min-h-11 items-center gap-2 rounded-md border border-gray-alpha-400 px-3"
          >
            <input
              type="radio"
              name="website-recipe"
              value={value}
              checked={value === variant}
              onChange={() => setVariant(value)}
            />
            {names[index]}
          </label>
        ))}
      </fieldset>
      <iframe
        key={variant + language}
        title={
          chinese
            ? `${names[variants.indexOf(variant)]}预览`
            : `${names[variants.indexOf(variant)]} preview`
        }
        src={`#/patterns/site-shell?preview=${variant}`}
        className="h-[min(75svh,45rem)] min-h-80 w-full border border-gray-alpha-400"
        data-demo-component="website-shell"
      />
      <a
        href={`#/patterns/site-shell?preview=${variant}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex min-h-11 items-center text-copy-14 underline focus-ring"
      >
        {chinese ? "在独立页面查看当前模板" : "Open the current recipe in a separate page"}
      </a>
      <p className="my-6 text-copy-14">
        {chinese
          ? "复制源码后替换链接、搜索服务、语言路由、社交信息和备案内容。模板不包含外部站点品牌素材或后台服务。auto-hide 使用视口固定定位，页面需要预留顶栏高度。"
          : "After copying, replace links, search integration, locale routes, social information, and legal details. Brand assets and backend services are not included. Reserve header space when using viewport-fixed auto-hide."}
      </p>
      <CodeBlock language="tsx">{source}</CodeBlock>
    </>
  );
}
