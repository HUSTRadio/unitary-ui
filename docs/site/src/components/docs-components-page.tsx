import { DemoShowCode } from "./demo-show-code";
import { DOCS_ROUTE_SEQUENCE } from "../data/docs-routes";
import * as React from "react";
import { ArrowLeft, Smartphone } from "lucide-react";

import { SubFrame } from "@hustradio/unitary-ui";
import { cn } from "@hustradio/unitary-ui";
import { createPrefetch, type PrefetchResource } from "@hustradio/unitary-ui";

import { getComponentGuide } from "../content/component-guides";
import { COMPONENTS, type ComponentMeta } from "../data/components";
import type { ExampleRecord } from "../examples/registry";
import { EXAMPLE_LOADERS } from "../examples/registry.ts?example-loaders";
import { demoSectionTitle, demoText, demoTextWithValues } from "../i18n/components-demo";
import { type DocsLanguage, useLanguage } from "../i18n/language";
import { ComponentGuideSections } from "./component-guide-sections";
import { ComponentApiReference } from "./docs-api-reference";
import {
  DocsBlock,
  DocsList,
  DocsPageLead,
  DocsPageTitle,
  DocsParagraph,
  DocsSection,
  DocsSectionTitle,
} from "./docs-typography";

/**
 * Components 文档页（docs/site 专用）。
 * 总览模式（/components）：13 元件索引卡片网格。
 * 详情模式（/components/:name）：返回链接 + 实时 demo（直接渲染根元件）+ 代码块（带 Copy 按钮）。
 */

/* ---------- 代码块 ---------- */

/** mobileOnly 标注：灰色 Smartphone 图标（替代旧「仅移动端」胶囊 Badge）。 */
function MobileOnlyMark({ language }: { language: DocsLanguage }) {
  return (
    <Smartphone
      className="size-4 text-gray-700"
      role="img"
      aria-label={demoText(language, "Mobile only")}
    />
  );
}

/* ---------- Demo 容器 ---------- */

function DemoSection({
  children,
  componentName,
}: {
  children: React.ReactNode;
  componentName?: string;
}) {
  return (
    <DocsBlock data-demo-component={componentName} data-demo-mode="live">
      {children}
    </DocsBlock>
  );
}

/**
 * 部分组件的演示需要向上/向外浮出预览框（例如 Feedback 的 Inline 胶囊向上弹出表单），
 * 这类组件必须解除预览框的 overflow 裁切，否则浮层会被静默切掉。
 * 仅对白名单内的组件放开，避免其他 demo 意外溢出。
 */
const DEMO_OVERFLOW_VISIBLE_SLUGS = new Set<string>(["feedback"]);

function TableDemoCard({
  children,
  code,
  id,
  slug,
}: {
  children: React.ReactNode;
  code: string;
  id?: string;
  slug?: string;
}) {
  const allowOverflow = slug !== undefined && DEMO_OVERFLOW_VISIBLE_SLUGS.has(slug);
  if (slug === "activity-view") {
    return (
      <div data-demo-card={id} className="overflow-hidden rounded-lg border border-gray-alpha-400 bg-background-100">
        {/* 844px 是演示视口的固定高度；与可展开的源码列表相互独立。
            844px is the demo viewport fixture, independent of the expandable source listing. */}
        <SubFrame className="h-[min(844px,100dvh)]">
          <div data-slot="docs-local-scroll" data-demo-container={id} className="w-full overflow-x-auto p-6">
            {children}
          </div>
        </SubFrame>
        <DemoShowCode code={code} />
      </div>
    );
  }
  return (
    // 卡片本身就是局部浮层容器：demo 里的 BottomSheet / HamburgerMenu 会落在卡片内，
    // 而不是盖住整页文档。裁剪仍沿用卡片原本的 overflow 类（故 clip={false}）。
    <SubFrame
      clip={false}
      className={cn(
        "rounded-lg border border-gray-alpha-400 bg-background-100",
        allowOverflow ? "overflow-visible" : "overflow-hidden",
      )}
      data-demo-card={id}
    >
      <div
        data-slot="docs-local-scroll"
        data-demo-container={id}
        className={cn("w-full p-6", allowOverflow ? "overflow-visible" : "overflow-x-auto")}
      >
        {children}
      </div>
      <DemoShowCode code={code} />
    </SubFrame>
  );
}

/** 官方 show code 统一实现：按钮（收起态 rounded-b-lg 作卡片底边；展开态直角，无缝衔接代码区）+ 展开代码（rounded-b-lg + border-t，含行号）。官方实测：按钮 focus 无可见 ring，故不施加 focus-ring。 */
/** 名称 → 实时 demo 渲染器（未命中的分支在调用前已拦截） */
function primaryExample(records: readonly ExampleRecord[]): ExampleRecord | undefined {
  return records.find((record) => record.id === "default") ?? records[0];
}

/** Live rendering and Show Code source are paired in the same registry record. */
type ExampleRegistry = Readonly<Record<string, readonly ExampleRecord[]>>;

function renderDemo(name: string, EXAMPLE_REGISTRY: ExampleRegistry): React.ReactNode {
  const record = primaryExample(EXAMPLE_REGISTRY[name] ?? []);
  if (!record) return null;
  const Example = record.Component;
  return (
    <TableDemoCard id={record.id} code={record.source} slug={name}>
      <Example />
    </TableDemoCard>
  );
}

function Section({
  title,
  description,
  children,
  code,
  slug,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  code?: string;
  slug?: string;
}) {
  const { language } = useLanguage();
  return (
    <DocsSection>
      <DocsSectionTitle>{demoSectionTitle(language, title)}</DocsSectionTitle>
      {description ? <DocsParagraph>{description}</DocsParagraph> : null}
      <DocsBlock>
        {code ? (
          <TableDemoCard id={title} code={code} slug={slug}>
            {children}
          </TableDemoCard>
        ) : (
          children
        )}
      </DocsBlock>
    </DocsSection>
  );
}

/** 名称 → 额外演示分段（Sizes / Variants / States），未命中的组件返回 null */
function renderExtraSections(name: string, language: DocsLanguage, EXAMPLE_REGISTRY: ExampleRegistry): React.ReactNode {
  const records = EXAMPLE_REGISTRY[name] ?? [];
  const guide = getComponentGuide(name, language);
  const primary = primaryExample(records);
  const remaining = primary
    ? records.filter((record) => record !== primary && record.renderInSection !== false)
    : records.filter((record) => record.renderInSection !== false);
  if (remaining.length === 0) return null;
  return (
    <>
      {remaining.map((record) => {
        const Example = record.Component;
        return (
          <Section
            key={`${record.slug}/${record.id}`}
            title={record.id}
            description={guide?.examples.find(
              (example) => example.demoKey === record.id && example.showDescriptionInDemo,
            )?.description}
            code={record.source}
            slug={name}
          >
            <Example />
          </Section>
        );
      })}
    </>
  );
}

// Stable promises let Suspense retry without starting another import. The
// registry still owns the component/source pairing and visible section order.
const exampleModules = new Map<string, PrefetchResource<{ EXAMPLE_REGISTRY: ExampleRegistry }>>();

export function loadComponentExamples(name: string): Promise<{ EXAMPLE_REGISTRY: ExampleRegistry }> {
  let resource = exampleModules.get(name);
  if (!resource) {
    resource = createPrefetch(() => EXAMPLE_LOADERS[name]?.() ?? { EXAMPLE_REGISTRY: {} });
    exampleModules.set(name, resource);
  }
  return resource.load();
}

function ComponentExamples({ name }: { name: string }) {
  const { language } = useLanguage();
  const { EXAMPLE_REGISTRY } = React.use(loadComponentExamples(name));
  return (
    <>
      <DocsSection>
        <DocsSectionTitle>{demoText(language, "Live Demo")}</DocsSectionTitle>
        <DemoSection componentName={name}>{renderDemo(name, EXAMPLE_REGISTRY)}</DemoSection>
      </DocsSection>
      {renderExtraSections(name, language, EXAMPLE_REGISTRY)}
    </>
  );
}

/* ---------- 总览模式 ---------- */

function ComponentsOverview() {
  const { language } = useLanguage();
  return (
    <div>
      <DocsPageTitle>{demoText(language, "Components")}</DocsPageTitle>
      <DocsPageLead className="max-w-xl">
        {demoText(language, "Building blocks for React applications.")}
      </DocsPageLead>

      <div className="mt-10 grid grid-cols-1 border-t border-l border-border sm:grid-cols-2 xl:grid-cols-3">
        {COMPONENTS.filter((component) => DOCS_ROUTE_SEQUENCE.some((route) => route.group === "components" && route.renderer.kind === "component-detail" && route.renderer.componentName === component.name)).map((component) => (
          <a
            key={component.name}
            href={`#${DOCS_ROUTE_SEQUENCE.find((route) => route.renderer.kind === "component-detail" && route.renderer.componentName === component.name)!.to}`}
            data-slot="docs-card"
            className="group block border-b border-r border-border p-6 transition-colors hover:bg-gray-alpha-100"
          >
            <p
              data-slot="component-id"
              className="font-mono text-label-12 text-muted-foreground"
            >
              {component.name}
            </p>
            <h3 className="mt-1 flex flex-wrap items-center gap-1.5 text-label-16 font-medium text-foreground">
              {language === "zh-CN" ? (component.labelZh ?? component.label) : component.label}
              {component.mobileOnly && <MobileOnlyMark language={language} />}
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

/* ---------- 详情模式 ---------- */

function ComponentDetail({ name }: { name: string }) {
  const { language } = useLanguage();
  const meta: ComponentMeta | undefined = COMPONENTS.find((component) => component.name === name);
  const guide = getComponentGuide(name, language);

  if (!meta) {
    return (
      <div>
        <BackLink name={name} />
        <DocsPageTitle>{demoText(language, "Component not found")}</DocsPageTitle>
        <DocsPageLead className="max-w-xl">
          {demoTextWithValues(language, "No component named {name} was found.", { name })}
        </DocsPageLead>
      </div>
    );
  }

  return (
    <div>
      <BackLink name={name} />
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <DocsPageTitle>
          {language === "zh-CN" ? (meta.labelZh ?? meta.label) : meta.label}
        </DocsPageTitle>
        <span
          data-slot="component-id"
          className="rounded-full border border-gray-alpha-400 px-2 py-0.5 font-mono text-label-12 text-muted-foreground"
        >
          {meta.name}
        </span>
        {meta.mobileOnly && <MobileOnlyMark language={language} />}
      </div>
      <DocsPageLead className="max-w-xl">
        {language === "zh-CN" ? (meta.descriptionZh ?? meta.description) : meta.description}
      </DocsPageLead>

      {guide && <ComponentGuideSections guide={guide} />}

      <React.Suspense key={name} fallback={
        <div role="status" data-slot="docs-examples-loading" className="py-10 text-copy-14 text-muted-foreground">
          {demoText(language, "Loading...")}
        </div>
      }>
        <ComponentExamples name={name} />
      </React.Suspense>

      <ComponentApiReference componentName={name} />

      {meta.bestPractices && meta.bestPractices.length > 0 && (
        <DocsSection>
          <DocsSectionTitle>{demoText(language, "Best Practices")}</DocsSectionTitle>
          <DocsList>
            {(language === "zh-CN"
              ? (meta.bestPracticesZh ?? meta.bestPractices)
              : meta.bestPractices
            ).map((bp, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground"
                  aria-hidden
                />
                {bp}
              </li>
            ))}
          </DocsList>
        </DocsSection>
      )}
    </div>
  );
}

function BackLink({ name }: { name: string }) {
  const { language } = useLanguage();
  const route = DOCS_ROUTE_SEQUENCE.find((item) => item.renderer.kind === "component-detail" && item.renderer.componentName === name);
  if (route?.group !== "components" && route?.group !== "charts") return null;
  return (
    <a
      href={route.group === "charts" ? "#/charts" : "#/components"}
      className="inline-flex items-center gap-1.5 text-copy-14 whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
    >
      {/*
       * 图标按字形居中，而不是按行盒居中。
       * flex 的 align-items:center 对中的是**行盒**，字体度量却不对称：本项目字体栈下
       * （text-copy-14 = 15px/20px）CJK 字形实测 ascent 13 / descent 2，留白几乎全在
       * 上方，于是行盒中心比字形中心高约 1px。图标放在几何中心就会明显偏高。
       * 这里把图标与文本放进同一个 inline-flex 盒子，两者一起按行盒居中，图标便与
       * 字形基线区域对齐。不覆盖 line-height：行盒高度即墨迹参考框，任何压缩它的
       * 做法（如 leading-[1.1]）都会把图标再往下推。
       * whitespace-nowrap 防止 CJK 在窄容器里按字换行（"返回组件" 会变成竖排多行）。
       */}
      <span className="inline-flex items-center gap-[0.3125rem] whitespace-nowrap">
        <ArrowLeft className="size-4" aria-hidden />
        {route.group === "charts" ? (language === "zh-CN" ? "返回图表" : "Back to Charts") : demoText(language, "Back to Components")}
      </span>
    </a>
  );
}

/* ---------- 页面入口 ---------- */

/**
 * Canonical route registry determines overview or detail mode and App.tsx passes the
 * component detail descriptor's name explicitly.
 */
export function ComponentsPage({ componentName }: { componentName?: string }) {
  if (componentName) {
    return <ComponentDetail name={componentName} />;
  }
  return <ComponentsOverview />;
}
