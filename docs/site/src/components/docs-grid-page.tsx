import { DemoShowCode } from "./demo-show-code";
import { ComponentApiReference } from "./docs-api-reference";
import { GridGrid0D7D12ACExample } from "../examples/grid/grid-0d7d12ac.example";
import GridGrid0D7D12ACExampleSource from "../examples/grid/grid-0d7d12ac.example.tsx?example-source";
import { GridBasicGrid278AA3F9Example } from "../examples/grid/basic-grid-278aa3f9.example";
import GridBasicGrid278AA3F9ExampleSource from "../examples/grid/basic-grid-278aa3f9.example.tsx?example-source";
import { GridSolidCellsE676560CExample } from "../examples/grid/solid-cells-e676560c.example";
import GridSolidCellsE676560CExampleSource from "../examples/grid/solid-cells-e676560c.example.tsx?example-source";
import { GridResponsiveGrid8DF1FB3EExample } from "../examples/grid/responsive-grid-8df1fb3e.example";
import GridResponsiveGrid8DF1FB3EExampleSource from "../examples/grid/responsive-grid-8df1fb3e.example.tsx?example-source";
import { GridResponsiveGuideClippingA58874D5Example } from "../examples/grid/responsive-guide-clipping-a58874d5.example";
import GridResponsiveGuideClippingA58874D5ExampleSource from "../examples/grid/responsive-guide-clipping-a58874d5.example.tsx?example-source";
import { GridHiddenRowGuides59338B9FExample } from "../examples/grid/hidden-row-guides-59338b9f.example";
import GridHiddenRowGuides59338B9FExampleSource from "../examples/grid/hidden-row-guides-59338b9f.example.tsx?example-source";
import { GridHiddenColumnGuidesE1033A1BExample } from "../examples/grid/hidden-column-guides-e1033a1b.example";
import GridHiddenColumnGuidesE1033A1BExampleSource from "../examples/grid/hidden-column-guides-e1033a1b.example.tsx?example-source";
import { GridOverlayingCellsB9F603D6Example } from "../examples/grid/overlaying-cells-b9f603d6.example";
import GridOverlayingCellsB9F603D6ExampleSource from "../examples/grid/overlaying-cells-b9f603d6.example.tsx?example-source";
import { GridSpecificGuideClipping4F529B64Example } from "../examples/grid/specific-guide-clipping-4f529b64.example";
import GridSpecificGuideClipping4F529B64ExampleSource from "../examples/grid/specific-guide-clipping-4f529b64.example.tsx?example-source";
import { GridGridWithCross6A783E1BExample } from "../examples/grid/grid-with-cross-6a783e1b.example";
import GridGridWithCross6A783E1BExampleSource from "../examples/grid/grid-with-cross-6a783e1b.example.tsx?example-source";
import { GridDashedGridWithCrossB76B6591Example } from "../examples/grid/dashed-grid-with-cross-b76b6591.example";
import GridDashedGridWithCrossB76B6591ExampleSource from "../examples/grid/dashed-grid-with-cross-b76b6591.example.tsx?example-source";
import { GridDashedGridWithGridPageFA2E79AFExample } from "../examples/grid/dashed-grid-with-grid-page-fa2e79af.example";
import GridDashedGridWithGridPageFA2E79AFExampleSource from "../examples/grid/dashed-grid-with-grid-page-fa2e79af.example.tsx?example-source";
import {
  DocsList,
  DocsPageLead,
  DocsPageTitle,
  DocsParagraph,
  DocsSection,
  DocsSectionTitle,
} from "./docs-typography";
import { useLanguage } from "../i18n/language";
import { demoText } from "../i18n/components-demo";

/**
 * Grid — 框架真实 Grid 系统的文档页（docs/site 专用）。
 *
 * 直接演示 src/components/ui/grid 的现有 primitives 组合：
 * 空 guides、basic auto-flow、solid cells、三断点响应式 rows/columns、
 * 响应式 clipping、隐藏单轴 guides、叠放 cells、specific clipping、
 * cross、dashed cross 与 dashed GridPage。
 * 只使用现有 props，不新增“仅为 docs”的 Grid API；
 * 无辅助线的普通卡片列表推荐原生 CSS/Tailwind grid。
 *
 * 每个示例的滚动容器都带 `p-4 -mx-4 -mb-4`：Grid 的外框与探出的十字都画在网格盒之外
 * （gridSystem::before 的 top/left 为 -1px，GridCross 以交点为中心 inset 为负），
 * 不留 padding 就会被 overflow 直接裁掉；负 margin 抵掉水平与底部内边距，
 * 所以网格的尺寸与对齐位置与之前完全一致。
 */

export function GridPage() {
  const { language } = useLanguage();
  const t = (source: string) => demoText(language, source);

  return (
    <div>
      <DocsPageTitle>{t("Grid")}</DocsPageTitle>
      <DocsPageLead className="max-w-xl">
        {t("A two-dimensional layout system with guide lines, cells, crosses, and breakpoints.")}
      </DocsPageLead>

      <DocsSection data-grid-demo="best-practices">
        <DocsSectionTitle>{t("Best Practices")}</DocsSectionTitle>
        <DocsList>
          <li>
            {t(
              "Use Grid when the guide lines themselves are part of the design — a visible two-dimensional layout, not generic spacing.",
            )}
          </li>
          <li>
            {t("For ordinary card lists without guide lines, use a plain CSS or Tailwind grid layout instead.")}
          </li>
          <li>{t("Avoid nesting grids more than one level deep.")}</li>
          <li>
            {t(
              "Give rows and columns explicitly for all three supported breakpoints (sm, md, lg) so every viewport gets a deliberate layout.",
            )}
          </li>
          <li>
            {t("A solid cell occludes the guide borders it strictly overlaps — debug mode reveals them dashed.")}
          </li>
          <li>
            {t('Hide a single axis of guides (hideGuides="row" or "column") only when it improves readability.')}
          </li>
          <li>
            {t(
              "Interactive semantics live in the cell content — guides, crosses, and pages are purely decorative and hidden from assistive technology.",
            )}
          </li>
          <li>{t("Check guide contrast against cell backgrounds in both light and dark themes.")}</li>
        </DocsList>
      </DocsSection>

      <DocsSection data-grid-demo="empty-guides">
        <DocsSectionTitle>{t("Empty Guides")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t("A Grid without cells renders only its guide lines. Set height so the empty surface stays visible.")}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 -mx-4 -mb-4 overflow-x-auto p-4">
          <GridGrid0D7D12ACExample />
        </div>
        <DemoShowCode code={GridGrid0D7D12ACExampleSource} />
      </DocsSection>

      <DocsSection data-grid-demo="auto-flow">
        <DocsSectionTitle>{t("Basic Auto Flow")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t("Cells without explicit placement flow into the tracks in DOM order.")}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 -mx-4 -mb-4 overflow-x-auto p-4">
          <GridBasicGrid278AA3F9Example />
        </div>
        <DemoShowCode code={GridBasicGrid278AA3F9ExampleSource} />
      </DocsSection>

      <DocsSection data-grid-demo="solid-cells">
        <DocsSectionTitle>{t("Solid Cells")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t("A solid cell paints over its area and hides the guide borders strictly inside its span.")}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 -mx-4 -mb-4 overflow-x-auto p-4">
          <GridSolidCellsE676560CExample />
        </div>
        <DemoShowCode code={GridSolidCellsE676560CExampleSource} />
      </DocsSection>

      <DocsSection data-grid-demo="responsive-breakpoints">
        <DocsSectionTitle>{demoText(language, "Responsive Breakpoints")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t("columns and rows accept responsive objects; give values for sm, md, and lg explicitly.")}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 -mx-4 -mb-4 overflow-x-auto p-4">
          <GridResponsiveGrid8DF1FB3EExample />
        </div>
        <DemoShowCode code={GridResponsiveGrid8DF1FB3EExampleSource} />
      </DocsSection>

      <DocsSection data-grid-demo="responsive-clipping">
        <DocsSectionTitle>{t("Responsive Clipping")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t(
            "Cell placement accepts responsive objects too — a solid cell clips the guides of every breakpoint layer it covers.",
          )}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 -mx-4 -mb-4 overflow-x-auto p-4">
          <GridResponsiveGuideClippingA58874D5Example />
        </div>
        <DemoShowCode code={GridResponsiveGuideClippingA58874D5ExampleSource} />
      </DocsSection>

      <DocsSection data-grid-demo="hide-row-guides">
        <DocsSectionTitle>{t("Hiding Row Guides")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t('hideGuides="row" removes the horizontal guide borders.')}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 -mx-4 -mb-4 overflow-x-auto p-4">
          <GridHiddenRowGuides59338B9FExample />
        </div>
        <DemoShowCode code={GridHiddenRowGuides59338B9FExampleSource} />
      </DocsSection>

      <DocsSection data-grid-demo="hide-column-guides">
        <DocsSectionTitle>{t("Hiding Column Guides")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t('hideGuides="column" removes the vertical guide borders.')}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 -mx-4 -mb-4 overflow-x-auto p-4">
          <GridHiddenColumnGuidesE1033A1BExample />
        </div>
        <DemoShowCode code={GridHiddenColumnGuidesE1033A1BExampleSource} />
      </DocsSection>

      <DocsSection data-grid-demo="overlaying-cells">
        <DocsSectionTitle>{t("Overlaying Cells")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t("Cells can share tracks and overlap; stacking follows DOM order.")}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 -mx-4 -mb-4 overflow-x-auto p-4">
          <GridOverlayingCellsB9F603D6Example />
        </div>
        <DemoShowCode code={GridOverlayingCellsB9F603D6ExampleSource} />
      </DocsSection>

      <DocsSection data-grid-demo="specific-clipping">
        <DocsSectionTitle>{t("Specific Clipping")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t('Use explicit line ranges ("a/b") to clip exactly the guides under a span.')}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 -mx-4 -mb-4 overflow-x-auto p-4">
          <GridSpecificGuideClipping4F529B64Example />
        </div>
        <DemoShowCode code={GridSpecificGuideClipping4F529B64ExampleSource} />
      </DocsSection>

      <DocsSection data-grid-demo="cross">
        <DocsSectionTitle>{t("Cross")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">{t("GridCross marks an intersection of grid lines.")}</DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 -mx-4 -mb-4 overflow-x-auto p-4">
          <GridGridWithCross6A783E1BExample />
        </div>
        <DemoShowCode code={GridGridWithCross6A783E1BExampleSource} />
      </DocsSection>

      <DocsSection data-grid-demo="dashed-cross">
        <DocsSectionTitle>{t("Dashed Cross")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t("Inside a GridSystem with dashedGuides, crosses render dashed as well.")}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 -mx-4 -mb-4 overflow-x-auto p-4">
          <GridDashedGridWithCrossB76B6591Example />
        </div>
        <DemoShowCode code={GridDashedGridWithCrossB76B6591ExampleSource} />
      </DocsSection>

      <DocsSection data-grid-demo="dashed-page">
        <DocsSectionTitle>{t("Dashed GridPage")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t(
            "GridPage wraps the grid in a page-level background-200 surface and centers it horizontally — with dashedGuides the guides are drawn dashed.",
          )}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 -mx-4 -mb-4 overflow-x-auto p-4">
          <GridDashedGridWithGridPageFA2E79AFExample />
        </div>
        <DemoShowCode code={GridDashedGridWithGridPageFA2E79AFExampleSource} />
      </DocsSection>
      <ComponentApiReference componentName="grid" />
    </div>
  );
}
