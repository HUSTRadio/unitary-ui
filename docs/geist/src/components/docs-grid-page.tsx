import {
  Grid,
  GridCell,
  GridCross,
  GridPage as GridPageFrame,
  GridSystem,
} from "@/components/ui/grid";

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
 * Grid — 框架真实 Grid 系统的文档页（docs/geist 专用）。
 *
 * 直接演示 src/components/ui/grid 的现有 primitives 组合：
 * 空 guides、basic auto-flow、solid cells、三断点响应式 rows/columns、
 * 响应式 clipping、隐藏单轴 guides、叠放 cells、specific clipping、
 * cross、dashed cross 与 dashed GridPage。
 * 只使用现有 props，不新增“仅为 docs”的 Grid API；
 * 无辅助线的普通卡片列表推荐原生 CSS/Tailwind grid。
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
        <div data-slot="docs-local-scroll" className="mt-6 overflow-x-auto">
          <GridSystem>
            <Grid columns={6} rows={3} height={180} />
          </GridSystem>
        </div>
      </DocsSection>

      <DocsSection data-grid-demo="auto-flow">
        <DocsSectionTitle>{t("Basic Auto Flow")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t("Cells without explicit placement flow into the tracks in DOM order.")}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 overflow-x-auto">
          <GridSystem>
            <Grid columns={3} rows={2}>
              <GridCell>1</GridCell>
              <GridCell>2</GridCell>
              <GridCell>3</GridCell>
              <GridCell>4</GridCell>
              <GridCell>5</GridCell>
              <GridCell>6</GridCell>
            </Grid>
          </GridSystem>
        </div>
      </DocsSection>

      <DocsSection data-grid-demo="solid-cells">
        <DocsSectionTitle>{t("Solid Cells")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t("A solid cell paints over its area and hides the guide borders strictly inside its span.")}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 overflow-x-auto">
          <GridSystem>
            <Grid columns={3} rows={2}>
              <GridCell column="1/3" row="1" solid>
                A
              </GridCell>
              <GridCell>B</GridCell>
              <GridCell>C</GridCell>
              <GridCell>D</GridCell>
              <GridCell>E</GridCell>
              <GridCell>F</GridCell>
            </Grid>
          </GridSystem>
        </div>
      </DocsSection>

      <DocsSection data-grid-demo="responsive-breakpoints">
        <DocsSectionTitle>{demoText(language, "Responsive Breakpoints")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t("columns and rows accept responsive objects; give values for sm, md, and lg explicitly.")}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 overflow-x-auto">
          <GridSystem>
            <Grid columns={{ sm: 1, md: 2, lg: 3 }} rows={{ sm: 6, md: 3, lg: 2 }}>
              <GridCell>1</GridCell>
              <GridCell>2</GridCell>
              <GridCell>3</GridCell>
              <GridCell>4</GridCell>
              <GridCell>5</GridCell>
              <GridCell>6</GridCell>
            </Grid>
          </GridSystem>
        </div>
      </DocsSection>

      <DocsSection data-grid-demo="responsive-clipping">
        <DocsSectionTitle>{t("Responsive Clipping")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t(
            "Cell placement accepts responsive objects too — a solid cell clips the guides of every breakpoint layer it covers.",
          )}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 overflow-x-auto">
          <GridSystem>
            <Grid columns={{ sm: 1, md: 2, lg: 4 }} rows={{ sm: 4, md: 2, lg: 2 }}>
              <GridCell column={{ sm: "1", md: "1/3", lg: "1/3" }} row={{ sm: "1/3", md: 1 }} solid>
                Feature
              </GridCell>
              <GridCell>2</GridCell>
              <GridCell>3</GridCell>
              <GridCell>4</GridCell>
              <GridCell>5</GridCell>
              <GridCell>6</GridCell>
            </Grid>
          </GridSystem>
        </div>
      </DocsSection>

      <DocsSection data-grid-demo="hide-row-guides">
        <DocsSectionTitle>{t("Hiding Row Guides")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t('hideGuides="row" removes the horizontal guide borders.')}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 overflow-x-auto">
          <GridSystem>
            <Grid columns={3} rows={2} hideGuides="row" />
          </GridSystem>
        </div>
      </DocsSection>

      <DocsSection data-grid-demo="hide-column-guides">
        <DocsSectionTitle>{t("Hiding Column Guides")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t('hideGuides="column" removes the vertical guide borders.')}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 overflow-x-auto">
          <GridSystem>
            <Grid columns={3} rows={2} hideGuides="column" />
          </GridSystem>
        </div>
      </DocsSection>

      <DocsSection data-grid-demo="overlaying-cells">
        <DocsSectionTitle>{t("Overlaying Cells")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t("Cells can share tracks and overlap; stacking follows DOM order.")}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 overflow-x-auto">
          <GridSystem>
            <Grid columns={4} rows={3}>
              <GridCell column="1/3" row="1/3">A</GridCell>
              <GridCell column="2/5" row="2/4">B</GridCell>
            </Grid>
          </GridSystem>
        </div>
      </DocsSection>

      <DocsSection data-grid-demo="specific-clipping">
        <DocsSectionTitle>{t("Specific Clipping")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t('Use explicit line ranges ("a/b") to clip exactly the guides under a span.')}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 overflow-x-auto">
          <GridSystem>
            <Grid columns={3} rows={2}>
              <GridCell column="1/3" row="1" solid>
                1 + 2
              </GridCell>
              <GridCell>3</GridCell>
              <GridCell>4</GridCell>
              <GridCell column="2/4" row="2" solid>
                5 + 6
              </GridCell>
            </Grid>
          </GridSystem>
        </div>
      </DocsSection>

      <DocsSection data-grid-demo="cross">
        <DocsSectionTitle>{t("Cross")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">{t("GridCross marks an intersection of grid lines.")}</DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 overflow-x-auto">
          <GridSystem>
            <Grid columns={3} rows={2}>
              <GridCross column={2} row={1} />
              <GridCell>1</GridCell>
              <GridCell>2</GridCell>
              <GridCell>3</GridCell>
              <GridCell>4</GridCell>
              <GridCell>5</GridCell>
              <GridCell>6</GridCell>
            </Grid>
          </GridSystem>
        </div>
      </DocsSection>

      <DocsSection data-grid-demo="dashed-cross">
        <DocsSectionTitle>{t("Dashed Cross")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t("Inside a GridSystem with dashedGuides, crosses render dashed as well.")}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 overflow-x-auto">
          <GridSystem dashedGuides>
            <Grid columns={3} rows={2}>
              <GridCross column={1} row={2} />
              <GridCross column={3} row={2} />
              <GridCell>1</GridCell>
              <GridCell>2</GridCell>
              <GridCell>3</GridCell>
              <GridCell>4</GridCell>
              <GridCell>5</GridCell>
              <GridCell>6</GridCell>
            </Grid>
          </GridSystem>
        </div>
      </DocsSection>

      <DocsSection data-grid-demo="dashed-page">
        <DocsSectionTitle>{t("Dashed GridPage")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t("GridPage centers its content — combine it with dashedGuides for the blueprint look.")}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 overflow-x-auto">
          <GridPageFrame>
            <GridSystem dashedGuides>
              <Grid columns={4} rows={2} height={140} />
            </GridSystem>
          </GridPageFrame>
        </div>
      </DocsSection>
    </div>
  );
}
