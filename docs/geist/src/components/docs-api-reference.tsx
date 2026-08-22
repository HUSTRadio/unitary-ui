import { Link } from "react-router-dom";

import { getComponentApi, type ApiRow } from "../data/component-api";
import { useLanguage } from "../i18n/language";

function ApiTable({ rows }: { rows: ApiRow[] }) {
  const { language } = useLanguage();
  if (rows.length === 0) return null;

  return (
    <div className="mt-5 overflow-x-auto rounded-md border border-border">
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
    <section id="api-reference" className="mt-12 scroll-mt-8">
      <h2 className="text-heading-24 text-foreground">{title}</h2>
      <p className="mt-2 text-copy-14 text-muted-foreground">
        {language === "zh-CN"
          ? "此页只列出稳定公开表面；原生属性请参阅对应元素类型。"
          : "This page lists the stable public surface. Refer to the underlying element type for inherited native attributes."}
      </p>

      <div className="mt-6 rounded-md border border-border bg-background-200 px-4 py-3">
        <p className="text-label-13 text-muted-foreground">
          {language === "zh-CN" ? "导入" : "Import"}
        </p>
        <code
          className="mt-1 block overflow-x-auto font-mono text-label-13 text-foreground"
          translate="no"
        >
          {`import { ${api.exports.join(", ")} } from "@/components/ui/${componentName}"`}
        </code>
      </div>

      {api.extends ? (
        <p className="mt-4 text-copy-13 text-muted-foreground">
          <span className="text-foreground">
            {language === "zh-CN" ? "原生属性：" : "Native props: "}
          </span>
          <code translate="no">{api.extends}</code>
        </p>
      ) : null}

      {api.rows.length > 0 ? (
        <>
          <h3 className="mt-8 text-heading-16 text-foreground">
            {language === "zh-CN" ? "属性与回调" : "Props & callbacks"}
          </h3>
          <ApiTable rows={api.rows} />
        </>
      ) : (
        <p className="mt-5 text-copy-13 text-muted-foreground">
          {language === "zh-CN"
            ? "该组件通过其导出项和组合子组件提供 API。"
            : "This component exposes its API through the listed exports and composition slots."}
        </p>
      )}

      {api.notes?.map((note) => (
        <p key={note.en} className="mt-4 text-copy-13 text-muted-foreground">
          {language === "zh-CN" ? note.zh : note.en}
        </p>
      ))}
    </section>
  );
}

export function LifecycleAndHooksPage() {
  const { language } = useLanguage();
  const isZh = language === "zh-CN";
  return (
    <article className="max-w-3xl">
      <h1 className="text-heading-24 sm:text-heading-40 text-foreground">
        {isZh ? "生命周期与钩子" : "Lifecycle & Hooks"}
      </h1>
      <p className="mt-3 text-copy-20 text-muted-foreground">
        {isZh
          ? "公共组件用受控状态、意图明确的回调和可组合的子组件公开行为；不提供泛化的挂载或卸载钩子。"
          : "Public components expose behavior through controlled state, intent-named callbacks, and composable subcomponents; they do not provide generic mount or unmount hooks."}
      </p>

      <section className="mt-10">
        <h2 className="text-heading-24 text-foreground">
          {isZh ? "受控与非受控" : "Controlled & uncontrolled"}
        </h2>
        <p className="mt-3 text-copy-14 text-muted-foreground">
          {isZh
            ? "可控制组件会成对提供 value/open/checked 等状态属性与对应的 on…Change 回调。仅传 defaultValue/defaultOpen/defaultChecked 时，组件在内部保存初始状态。不要在同一状态上混用两种模式。"
            : "Controllable components pair state props such as value, open, or checked with matching on…Change callbacks. With only defaultValue, defaultOpen, or defaultChecked, the component owns its initial state. Do not mix modes for the same state."}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-heading-24 text-foreground">
          {isZh ? "回调契约" : "Callback contracts"}
        </h2>
        <ul className="mt-4 space-y-3 text-copy-14 text-muted-foreground">
          <li>
            {isZh
              ? "on…Change 表示用户或组件请求状态变化；父级受控时必须写回新状态。"
              : "on…Change means that the user or component requested a state change; controlled parents must write the next value back."}
          </li>
          <li>
            {isZh
              ? "onSelect、onConfirm、onCopy 等命名回调只表达对应意图，不替代通用生命周期事件。"
              : "Intent-named callbacks such as onSelect, onConfirm, and onCopy express only that intent; they do not replace generic lifecycle events."}
          </li>
          <li>
            {isZh
              ? "若点击处理器可取消后续行为，调用 event.preventDefault()。CopyButton 与 TextWithCopyButton 会尊重它。"
              : "Where a click handler can cancel the follow-up action, call event.preventDefault(). CopyButton and TextWithCopyButton honor it."}
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-heading-24 text-foreground">
          {isZh ? "组件特化 API" : "Component-specific APIs"}
        </h2>
        <p className="mt-3 text-copy-14 text-muted-foreground">
          {isZh
            ? "特化 API 与其上下文一起保留在组件页，例如 "
            : "Specialized APIs stay with their component documentation, for example "}
          <Link className="text-link underline underline-offset-4" to="/components/radio">
            Radio useRadio
          </Link>
          {isZh ? "、" : ", "}
          <Link className="text-link underline underline-offset-4" to="/components/toast">
            Toast useToasts
          </Link>
          {isZh
            ? " 与媒体事件。这样不会把组件特有的状态语义误写成全局生命周期。"
            : ", and media events. This keeps component-specific state semantics out of a fake global lifecycle."}
        </p>
      </section>
    </article>
  );
}
