import * as React from "react";
import { ArrowLeft, ChevronRight, Smartphone } from "lucide-react";

import { CodeBlock as CodeBlockComponent } from "@/components/ui/code-block";

import { getComponentGuide } from "../content/component-guides";
import { COMPONENTS, type ComponentMeta } from "../data/components";
import { EXAMPLE_REGISTRY, type ExampleRecord } from "../examples/registry";
import { demoText, demoTextWithValues } from "../i18n/components-demo";
import { type DocsLanguage, useLanguage } from "../i18n/language";
import { ComponentGuideSections } from "./component-guide-sections";
import { ComponentApiReference } from "./docs-api-reference";
import {
  DocsBlock,
  DocsList,
  DocsPageLead,
  DocsPageTitle,
  DocsSection,
  DocsSectionTitle,
} from "./docs-typography";

/**
 * Components 文档页（docs/geist 专用）。
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

function TableDemoCard({
  children,
  code,
  id,
}: {
  children: React.ReactNode;
  code: string;
  id?: string;
}) {
  return (
    <div
      className="overflow-hidden rounded-[8px] border border-gray-alpha-400 bg-background-100"
      data-demo-card={id}
    >
      <div
        data-slot="docs-local-scroll"
        data-demo-container={id}
        className="w-full overflow-x-auto p-6"
      >
        {children}
      </div>
      <DemoShowCode code={code} />
    </div>
  );
}

/** 官方 show code 统一实现：按钮（收起态 rounded-b-lg 作卡片底边；展开态直角，无缝衔接代码区）+ 展开代码（rounded-b-lg + border-t，含行号）。官方实测：按钮 focus 无可见 ring，故不施加 focus-ring。 */
function DemoShowCode({ code }: { code: string }) {
  const { language } = useLanguage();
  const [showCode, setShowCode] = React.useState(false);
  const codeId = React.useId();
  return (
    <>
      <button
        type="button"
        aria-expanded={showCode}
        aria-controls={codeId}
        onClick={() => setShowCode((v) => !v)}
        className={`flex h-12 w-full items-center gap-3 border-t border-gray-400 bg-background-200 px-4 text-left text-copy-14 text-gray-900 transition-colors hover:bg-gray-200 focus:outline-none${showCode ? "" : " rounded-b-[8px]"}`}
      >
        <ChevronRight
          className={`size-4 transition-transform${showCode ? " rotate-90" : ""}`}
          aria-hidden
        />
        {demoText(language, "Show code")}
      </button>
      {showCode ? (
        <div id={codeId} className="overflow-hidden">
          <CodeBlockComponent
            language="tsx"
            className="rounded-none rounded-b-[8px] border-0 border-t border-gray-alpha-400"
          >
            {code}
          </CodeBlockComponent>
        </div>
      ) : null}
    </>
  );
}

/** 名称 → 实时 demo 渲染器（未命中的分支在调用前已拦截） */
function primaryExample(records: readonly ExampleRecord[]): ExampleRecord | undefined {
  return records.find((record) => record.id === "default") ?? records[0];
}

/** Live rendering and Show Code source are paired in the same registry record. */
function renderDemo(name: string): React.ReactNode {
  const record = primaryExample(EXAMPLE_REGISTRY[name] ?? []);
  if (!record) return null;
  const Example = record.Component;
  return (
    <TableDemoCard id={record.id} code={record.source}>
      <Example />
    </TableDemoCard>
  );
}

function Section({
  title,
  children,
  code,
}: {
  title: string;
  children: React.ReactNode;
  code?: string;
}) {
  const { language } = useLanguage();
  return (
    <DocsSection>
      <DocsSectionTitle>{demoText(language, title)}</DocsSectionTitle>
      <DocsBlock>
        {code ? <TableDemoCard id={title} code={code}>{children}</TableDemoCard> : children}
      </DocsBlock>
    </DocsSection>
  );
}

/** 名称 → 额外演示分段（Sizes / Variants / States），未命中的组件返回 null */
function renderExtraSections(name: string, _language: DocsLanguage): React.ReactNode {
  const records = EXAMPLE_REGISTRY[name] ?? [];
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
          <Section key={`${record.slug}/${record.id}`} title={record.id} code={record.source}>
            <Example />
          </Section>
        );
      })}
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
        {COMPONENTS.map((component) => (
          <a
            key={component.name}
            href={`#/components/${component.name}`}
            className="group block border-b border-r border-border p-6 transition-colors hover:bg-gray-alpha-100"
          >
            <p className="font-mono text-label-12 text-muted-foreground">{component.official}</p>
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
        <BackLink />
        <DocsPageTitle>{demoText(language, "Component not found")}</DocsPageTitle>
        <DocsPageLead className="max-w-xl">
          {demoTextWithValues(language, "No component named {name} was found.", { name })}
        </DocsPageLead>
      </div>
    );
  }

  return (
    <div>
      <BackLink />
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <DocsPageTitle>
          {language === "zh-CN" ? (meta.labelZh ?? meta.label) : meta.label}
        </DocsPageTitle>
        <span className="rounded-full border border-gray-alpha-400 px-2 py-0.5 font-mono text-label-12 text-muted-foreground">
          {meta.official}
        </span>
        {meta.mobileOnly && <MobileOnlyMark language={language} />}
      </div>
      <DocsPageLead className="max-w-xl">
        {language === "zh-CN" ? (meta.descriptionZh ?? meta.description) : meta.description}
      </DocsPageLead>

      {guide && <ComponentGuideSections guide={guide} />}

      <DocsSection>
        <DocsSectionTitle>{demoText(language, "Live Demo")}</DocsSectionTitle>
        <DemoSection componentName={name}>{renderDemo(name)}</DemoSection>
      </DocsSection>

      {renderExtraSections(name, language)}

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

function BackLink() {
  const { language } = useLanguage();
  return (
    <a
      href="#/components"
      className="inline-flex items-center gap-1.5 text-copy-14 text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-4" aria-hidden />
      {demoText(language, "Back to Components")}
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
