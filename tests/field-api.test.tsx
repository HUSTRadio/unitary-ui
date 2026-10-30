import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Field } from "../src/components/ui/field";

const render = (node: React.ReactElement) => renderToStaticMarkup(node);

describe("Field composition contract", () => {
  it("renders label, control, description and error in order", () => {
    const markup = render(
      <Field label="Workspace" htmlFor="workspace" description="Shown to teammates." error="Required.">
        <input id="workspace" />
      </Field>,
    );

    expect(markup).toMatch(/data-slot="field"/);
    const label = markup.indexOf('data-slot="field-label"');
    const control = markup.indexOf('id="workspace"');
    const description = markup.indexOf('data-slot="field-description"');
    const error = markup.indexOf('data-slot="field-error"');
    expect(label).toBeGreaterThan(-1);
    expect(control).toBeGreaterThan(label);
    expect(description).toBeGreaterThan(control);
    expect(error).toBeGreaterThan(description);
  });

  it("associates the label through htmlFor and never rewrites the child", () => {
    const markup = render(
      <Field label="Workspace" htmlFor="workspace" description="Shown to teammates.">
        <input id="workspace" />
      </Field>,
    );

    expect(markup).toContain('<label for="workspace"');
    // 不 clone 子元素：控件不会凭空获得 id / aria-describedby / aria-invalid。
    const control = markup.slice(markup.indexOf("<input"), markup.indexOf(">", markup.indexOf("<input")) + 1);
    expect(control).toBe('<input id="workspace"/>');
  });

  it("omits the error row for empty, null and false messages", () => {
    for (const error of ["", null, undefined, false]) {
      const markup = render(
        <Field label="Workspace" htmlFor="workspace" error={error}>
          <input id="workspace" />
        </Field>,
      );
      expect(markup).not.toContain('data-slot="field-error"');
    }
  });

  it("renders long error copy verbatim for wrapping", () => {
    const message = "This value must be unique across every workspace in the current organization.";
    const markup = render(
      <Field label="Workspace" htmlFor="workspace" error={message}>
        <input id="workspace" />
      </Field>,
    );

    expect(markup).toContain(message);
    // FieldError 自带 break-words，长文案由控件宽度决定换行。
    expect(markup).toContain("break-words");
  });

  it("keeps the label optional and skips the label element", () => {
    const markup = render(<Field>child</Field>);
    expect(markup).not.toContain('data-slot="field-label"');
    expect(markup).toContain("child");
  });

  it("aligns large fields with large controls", () => {
    const standard = render(
      <Field label="Workspace" description="Note." error="Required.">
        <input />
      </Field>,
    );
    const large = render(
      <Field label="Workspace" description="Note." error="Required." large>
        <input />
      </Field>,
    );

    expect(standard).toContain('data-size="default"');
    expect(large).toContain('data-size="large"');
    expect(large).toContain("text-base leading-6");
    expect(standard).toContain("text-copy-13 leading-5");
  });

  it("merges caller className onto the root and forwards div attributes", () => {
    const markup = render(
      <Field className="mt-4" data-testid="field-root" aria-label="Workspace field">
        <input />
      </Field>,
    );

    expect(markup).toMatch(/class="flex w-full min-w-0 flex-col mt-4"/);
    expect(markup).toContain('data-testid="field-root"');
    expect(markup).toContain('aria-label="Workspace field"');
  });

  it("does not own validation, state or ARIA wiring", async () => {
    const { readFile } = await import("node:fs/promises");
    const path = await import("node:path");
    const { fileURLToPath } = await import("node:url");
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
    const src = await readFile(path.join(root, "src/components/ui/field.tsx"), "utf8");
    // 只看代码：文档注释里会提到 aria-describedby/onChange 来说明“不接线”。
    const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

    expect(code).not.toMatch(/cloneElement|React\.Children\.map/);
    expect(code).not.toMatch(/aria-describedby|aria-invalid/);
    expect(code).not.toMatch(/useState|useReducer|onChange/);
    expect(code).not.toMatch(/zod|yup|valibot/);
    expect(code).toContain("FieldError");
  });
});
