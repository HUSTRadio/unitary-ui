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
          <GridSystem unstable_useContainer>
            <Grid columns={6} rows={3} height={180} />
          </GridSystem>
        </div>
      </DocsSection>

      <DocsSection data-grid-demo="auto-flow">
        <DocsSectionTitle>{t("Basic Auto Flow")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t("Cells without explicit placement flow into the tracks in DOM order.")}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 -mx-4 -mb-4 overflow-x-auto p-4">
          <GridSystem unstable_useContainer>
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
        <div data-slot="docs-local-scroll" className="mt-6 -mx-4 -mb-4 overflow-x-auto p-4">
          <GridSystem unstable_useContainer>
            {/* A 跨 2 列 + B..H 共 7 个 = 9 个格位，正好铺满 3×3；
                rows 也必须写 3，否则第 3 行整行没有辅助线。 */}
            <Grid columns={3} rows={3}>
              <GridCell column="1/3" row="1" solid>
                A
              </GridCell>
              <GridCell>B</GridCell>
              <GridCell>C</GridCell>
              <GridCell>D</GridCell>
              <GridCell>E</GridCell>
              <GridCell>F</GridCell>
              <GridCell>G</GridCell>
              <GridCell>H</GridCell>
            </Grid>
          </GridSystem>
        </div>
      </DocsSection>

      <DocsSection data-grid-demo="responsive-breakpoints">
        <DocsSectionTitle>{demoText(language, "Responsive Breakpoints")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t("columns and rows accept responsive objects; give values for sm, md, and lg explicitly.")}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 -mx-4 -mb-4 overflow-x-auto p-4">
          <GridSystem unstable_useContainer>
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
        <div data-slot="docs-local-scroll" className="mt-6 -mx-4 -mb-4 overflow-x-auto p-4">
          <GridSystem unstable_useContainer>
            {/* rows 要给“该断点下内容实际占用的行数”，否则辅助线只画到一半、底部几行没有网格线：
                sm 1 列 → Feature 占 2 行 + 其余 5 格各 1 行 = 7；md 2 列 → 4；lg 4 列 → 2。 */}
            <Grid columns={{ sm: 1, md: 2, lg: 4 }} rows={{ sm: 7, md: 4, lg: 2 }}>
              <GridCell column={{ sm: "1", md: "1/3", lg: "1/3" }} row={{ sm: "1/3", md: 1 }} solid>
                Feature
              </GridCell>
              {/* 编号按“格位”算：Feature 占了前两个格位（1、2），所以其余从 3 起，
                  与 specific-clipping 的 1 + 2 / 3 / 4 / 5 + 6 同一套规则。 */}
              <GridCell>3</GridCell>
              <GridCell>4</GridCell>
              <GridCell>5</GridCell>
              <GridCell>6</GridCell>
              <GridCell>7</GridCell>
            </Grid>
          </GridSystem>
        </div>
      </DocsSection>

      <DocsSection data-grid-demo="hide-row-guides">
        <DocsSectionTitle>{t("Hiding Row Guides")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t('hideGuides="row" removes the horizontal guide borders.')}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 -mx-4 -mb-4 overflow-x-auto p-4">
          <GridSystem unstable_useContainer>
            <Grid columns={12} rows={3} height="preserve-aspect-ratio" hideGuides="row" />
          </GridSystem>
        </div>
      </DocsSection>

      <DocsSection data-grid-demo="hide-column-guides">
        <DocsSectionTitle>{t("Hiding Column Guides")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t('hideGuides="column" removes the vertical guide borders.')}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 -mx-4 -mb-4 overflow-x-auto p-4">
          <GridSystem unstable_useContainer>
            <Grid columns={12} rows={3} height="preserve-aspect-ratio" hideGuides="column" />
          </GridSystem>
        </div>
      </DocsSection>

      <DocsSection data-grid-demo="overlaying-cells">
        <DocsSectionTitle>{t("Overlaying Cells")}</DocsSectionTitle>
        <DocsParagraph className="max-w-xl">
          {t("Cells can share tracks and overlap; stacking follows DOM order.")}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 -mx-4 -mb-4 overflow-x-auto p-4">
          <GridSystem unstable_useContainer>
            {/* 必须显式给 height：不给 height 时行高是 auto，跨行单元格的内容高度
                会被均摊到它跨越的每一行（约 52px），小于单元格的 cell-padding(40px)，
                文字就被 padding-top 顶到行线上。
                315 / 3 行 = 105px，与本页其它示例的自动行高（cell-padding×2 + 文本行高）
                一致；行高一致，标签才会像其它示例那样落在所在行的垂直中部。 */}
            <Grid columns={4} rows={3} height={315}>
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
        <div data-slot="docs-local-scroll" className="mt-6 -mx-4 -mb-4 overflow-x-auto p-4">
          <GridSystem unstable_useContainer>
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
        <div data-slot="docs-local-scroll" className="mt-6 -mx-4 -mb-4 overflow-x-auto p-4">
          <GridSystem unstable_useContainer>
            <Grid columns={3} rows={2}>
              {/* 标上该网格的全部交点：4 条列线（columns+1）× 3 条行线（rows+1）= 12 个。
                  十字以交点为中心跨骑网格线（inset 为负），最外圈的会探出网格盒，
                  由 docs-local-scroll 的 padding 留出可见空间。 */}
              {[1, 2, 3, 4].flatMap((column) =>
                [1, 2, 3].map((row) => (
                  <GridCross key={`${column}-${row}`} column={column} row={row} />
                )),
              )}
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
        <div data-slot="docs-local-scroll" className="mt-6 -mx-4 -mb-4 overflow-x-auto p-4">
          <GridSystem dashedGuides unstable_useContainer>
            <Grid columns={3} rows={2}>
              {/* 与 Cross 示例对齐：同样标上全部 12 个交点，这里用于对比虚线渲染 */}
              {[1, 2, 3, 4].flatMap((column) =>
                [1, 2, 3].map((row) => (
                  <GridCross key={`${column}-${row}`} column={column} row={row} />
                )),
              )}
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
          {t(
            "GridPage wraps the grid in a page-level background-200 surface and centers it horizontally — with dashedGuides the guides are drawn dashed.",
          )}
        </DocsParagraph>
        <div data-slot="docs-local-scroll" className="mt-6 -mx-4 -mb-4 overflow-x-auto p-4">
          <GridPageFrame>
            <GridSystem dashedGuides unstable_useContainer>
              <Grid columns={4} rows={2} height={140} />
            </GridSystem>
          </GridPageFrame>
        </div>
      </DocsSection>
    </div>
  );
}
