import { CodeBlock } from "@/components/ui/code-block";
import { getComponentApi, type ApiRow } from "../data/component-api";
import { useLanguage } from "../i18n/language";
import { DocsBlock, DocsParagraph, DocsSection, DocsSectionTitle } from "./docs-typography";

function ApiTable({ rows }: { rows: ApiRow[] }) {
  const { language } = useLanguage();
  if (rows.length === 0) return null;
  const extensionOnly = rows.every((item) => item.origin === "extension");

  return (
    <>
      {extensionOnly ? (
        <DocsParagraph data-api-origin="extension">
          {language === "zh-CN" ? "本表 API 均为 Unitary 扩展。" : "All APIs in this table are Unitary extensions."}
        </DocsParagraph>
      ) : null}
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
                  {!extensionOnly && item.origin === "extension" ? (
                    <span data-slot="docs-api-extension-badge" className="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">
                      {language === "zh-CN" ? "框架扩展" : "Extension"}
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
    </>
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
          ? "组件的导入方式和 API 如下。* 表示必填属性。"
          : "Component imports and API are listed below. * marks a required prop."}
      </DocsParagraph>

      <DocsBlock>
        <p className="mb-2 text-label-13 text-muted-foreground">
          {language === "zh-CN" ? "导入" : "Import"}
        </p>
        <CodeBlock language="tsx" hideLineNumbers>
          {`import { ${api.exports.join(", ")} } from "${api.importPath ?? `@/components/ui/${componentName}`}"`}
        </CodeBlock>
      </DocsBlock>

      {api.extends ? (
        <DocsParagraph>
          <span className="text-foreground">
            {language === "zh-CN" ? "还支持以下类型中定义的属性：" : "Also accepts props defined by: "}
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
            ? "组合使用上面列出的组件，用法见本页示例。"
            : "Compose the components listed above. See this page’s examples for usage."}
        </DocsParagraph>
      )}

      {api.notes?.map((note) => (
        <DocsParagraph key={note.en}>{language === "zh-CN" ? note.zh : note.en}</DocsParagraph>
      ))}
    </DocsSection>
  );
}
