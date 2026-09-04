import { CodeBlock } from "@/components/ui/code-block";
import { getComponentApi, type ApiRow } from "../data/component-api";
import { useLanguage } from "../i18n/language";
import { DocsBlock, DocsParagraph, DocsSection, DocsSectionTitle } from "./docs-typography";

function ApiTable({ rows }: { rows: ApiRow[] }) {
  const { language } = useLanguage();
  if (rows.length === 0) return null;

  return (
    <div
      data-slot="docs-local-scroll"
      className="overflow-x-auto rounded-md border border-border"
    >
      <table className="w-full min-w-[640px] text-left">
        <thead className="border-b border-border">
          <tr className="text-label-13 text-foreground">
            <th className="px-3 py-2 font-medium">{language === "zh-CN" ? "名称" : "Name"}</th>
            <th className="px-3 py-2 font-medium">{language === "zh-CN" ? "类型" : "Type"}</th>
            <th className="px-3 py-2 font-medium">
              {language === "zh-CN" ? "说明" : "Description"}
            </th>
            <th className="px-3 py-2 font-medium">{language === "zh-CN" ? "默认值" : "Default"}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.name} className="border-b border-border last:border-0">
              <td className="px-3 py-2 align-top text-label-13 text-foreground">
                <code translate="no">{item.name}</code>
                {item.required ? <span className="ml-1 text-destructive">*</span> : null}
                {item.origin === "extension" ? (
                  <span className="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">
                    {language === "zh-CN" ? "框架扩展" : "Extension"}
                  </span>
                ) : null}
                {item.deprecated ? (
                  <span className="ml-2 text-label-12 text-muted-foreground">
                    {language === "zh-CN" ? "已弃用" : "Deprecated"}
                  </span>
                ) : null}
              </td>
              <td
                className="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground"
                translate="no"
              >
                {item.type}
              </td>
              <td className="px-3 py-2 align-top text-copy-13 text-muted-foreground">
                {language === "zh-CN" ? item.descriptionZh : item.description}
              </td>
              <td
                className="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground"
                translate="no"
              >
                {item.defaultValue ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ComponentApiReference({ componentName }: { componentName: string }) {
  const { language } = useLanguage();
  const api = getComponentApi(componentName);
  if (!api) return null;
  const title = language === "zh-CN" ? "API 参考" : "API Reference";

  return (
    <DocsSection id="api-reference" className="scroll-mt-8">
      <DocsSectionTitle>{title}</DocsSectionTitle>
      <DocsParagraph>
        {language === "zh-CN"
          ? "此页只列出稳定公开表面；原生属性请参阅对应元素类型。"
          : "This page lists the stable public surface. Refer to the underlying element type for inherited native attributes."}
      </DocsParagraph>

      <DocsBlock>
        <p className="mb-2 text-label-13 text-muted-foreground">
          {language === "zh-CN" ? "导入" : "Import"}
        </p>
        <CodeBlock language="tsx" hideLineNumbers>
          {`import { ${api.exports.join(", ")} } from "@/components/ui/${componentName}"`}
        </CodeBlock>
      </DocsBlock>

      {api.extends ? (
        <DocsParagraph>
          <span className="text-foreground">
            {language === "zh-CN" ? "原生属性：" : "Native props: "}
          </span>
          <code className="break-all" translate="no">{api.extends}</code>
        </DocsParagraph>
      ) : null}

      {api.rows.length > 0 ? (
        <DocsSection>
          <h3 className="text-heading-16 text-foreground">
            {language === "zh-CN" ? "属性与回调" : "Props & callbacks"}
          </h3>
          <DocsBlock>
            <ApiTable rows={api.rows} />
          </DocsBlock>
        </DocsSection>
      ) : (
        <DocsParagraph>
          {language === "zh-CN"
            ? "该组件通过其导出项和组合子组件提供 API。"
            : "This component exposes its API through the listed exports and composition slots."}
        </DocsParagraph>
      )}

      {api.notes?.map((note) => (
        <DocsParagraph key={note.en}>{language === "zh-CN" ? note.zh : note.en}</DocsParagraph>
      ))}
    </DocsSection>
  );
}

