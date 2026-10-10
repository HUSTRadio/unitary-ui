// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { extractMainHtml } from "../scripts/lib/llm-html";

afterEach(() => {
  document.body.innerHTML = "";
});

const FULL_VALUE = "https://unitary.design/docs/runtime?theme=dark&token=<value>";

function renderMeasuredChart(measured: string, tooltip: string): void {
  document.body.innerHTML = `
    <nav>Outside navigation</nav>
    <main id="main-content">
      <h1>Charts and MiddleTruncate</h1>
      <h2>Visitor analytics</h2>
      <p>Visitors and pageviews over the last 6 months</p>
      <span data-slot="middle-truncate" data-value="">${measured}<span class="sr-only"></span></span>
      <div class="recharts-wrapper">
        <div class="recharts-legend-wrapper"><ul><li>visitors</li><li>pageviews</li></ul></div>
        <div class="recharts-tooltip-wrapper recharts-tooltip-wrapper-right">${tooltip}</div>
      </div>
      <h2>API</h2>
      <table><tbody><tr><td><code>value</code></td><td>Complete string</td></tr></tbody></table>
      <p>Use <code>.recharts-tooltip-wrapper</code> only for runtime tooltip markup.</p>
      <pre><div class="token-line"><span>const value = "complete";</span></div><div class="token-line"><span>return &lt;MiddleTruncate value={value} /&gt;;</span></div><button>Copy code</button></pre>
      <a href="/api">API reference</a>
    </main>
  `;
  const truncated = document.querySelector('[data-slot="middle-truncate"]')!;
  truncated.setAttribute("data-value", FULL_VALUE);
  truncated.setAttribute("title", FULL_VALUE);
  truncated.setAttribute("aria-label", FULL_VALUE);
  truncated.querySelector(".sr-only")!.textContent = FULL_VALUE;
}

function extractedFragment(html: string): DocumentFragment {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content;
}

describe("portable LLM HTML extraction", () => {
  it("normalizes different measured fragments and active tooltip payloads to identical semantic HTML without mutating the page", () => {
    const captures: string[] = [];
    for (const [measured, tooltip] of [
      [
        'h…<span aria-hidden="true">&gt;</span>',
        "<p>Mar</p><p>visitors</p><p>3245</p><p>pageviews</p><p>4932</p>",
      ],
      [
        'https://unitary…<span aria-hidden="true">token=&lt;value&gt;</span>',
        "<p>Apr</p><p>visitors</p><p>4032</p><p>pageviews</p><p>5781</p>",
      ],
    ]) {
      renderMeasuredChart(measured, tooltip);
      const original = document.body.innerHTML;
      const html = extractMainHtml();
      captures.push(html);
      expect(document.body.innerHTML).toBe(original);

      const fragment = extractedFragment(html);
      const truncated = fragment.querySelector('[data-slot="middle-truncate"]')!;
      expect(truncated.textContent).toBe(FULL_VALUE);
      expect(truncated.children).toHaveLength(0);
      expect(truncated.getAttribute("title")).toBe(FULL_VALUE);
      expect(truncated.getAttribute("aria-label")).toBe(FULL_VALUE);
      expect(fragment.querySelector(".recharts-tooltip-wrapper")).toBeNull();
      expect(fragment.querySelector(".recharts-legend-wrapper")?.textContent).toBe(
        "visitorspageviews",
      );
      expect(fragment.querySelector("h1")?.textContent).toBe("Charts and MiddleTruncate");
      expect([...fragment.querySelectorAll("h2")].map((heading) => heading.textContent)).toEqual([
        "Visitor analytics",
        "API",
      ]);
      expect(fragment.querySelector("table")?.textContent).toBe("valueComplete string");
      expect(fragment.querySelector("p code")?.textContent).toBe(".recharts-tooltip-wrapper");
      expect(fragment.querySelector("pre")?.textContent).toBe(
        'const value = "complete";\nreturn <MiddleTruncate value={value} />;',
      );
      expect(fragment.querySelector("a")?.textContent).toBe("API reference");
      expect(fragment.querySelector("button")).toBeNull();
    }
    expect(captures[0]).toBe(captures[1]);
  });

  it("keeps inline and preformatted code, prefix lookalikes and nodes outside the complete-value contract", () => {
    document.body.innerHTML = `
      <main id="main-content">
        <code><span data-slot="middle-truncate" data-value="source value">Source fragment</span><span class="recharts-tooltip-wrapper">Source tooltip</span></code>
        <pre>&lt;span data-slot="middle-truncate" data-value="code value"&gt;h…t&lt;/span&gt;\n&lt;div class="recharts-tooltip-wrapper"&gt;Code tooltip&lt;/div&gt;</pre>
        <div class="recharts-tooltip-wrapper-help">Tooltip documentation</div>
        <span data-slot="middle-truncate">No complete value</span>
        <span data-slot="other" data-value="other value">Other semantic content</span>
      </main>
    `;
    const original = document.body.innerHTML;
    const fragment = extractedFragment(extractMainHtml());
    expect(document.body.innerHTML).toBe(original);
    expect(fragment.querySelector("code")?.textContent).toBe("Source fragmentSource tooltip");
    expect(fragment.querySelector("code [data-value]")?.getAttribute("data-value")).toBe(
      "source value",
    );
    expect(fragment.querySelector("pre")?.textContent).toBe(
      '<span data-slot="middle-truncate" data-value="code value">h…t</span>\n<div class="recharts-tooltip-wrapper">Code tooltip</div>',
    );
    expect(fragment.querySelector(".recharts-tooltip-wrapper-help")?.textContent).toBe(
      "Tooltip documentation",
    );
    expect(
      fragment.querySelector('span[data-slot="middle-truncate"]:not([data-value])')?.textContent,
    ).toBe("No complete value");
    expect(fragment.querySelector('[data-slot="other"]')?.textContent).toBe(
      "Other semantic content",
    );
  });

  it("preserves the existing decoration, editor, video, introduction and empty-link removal rules", () => {
    document.body.innerHTML = `
      <main id="main-content">
        <h1>Motion and Illustrations</h1><p>Introduction guidance</p>
        <script type="application/json">{"runtime":"script"}</script><style>.runtime{color:red}</style>
        <svg><title>Decoration</title></svg><nav>Page navigation</nav><aside>Sidebar</aside><form>Form</form>
        <button>Play</button><input value="Runtime input"><select><option>Runtime choice</option></select><textarea>Runtime editor</textarea>
        <div data-slot="video">00:00</div><div data-token-demo>Token editor</div>
        <section data-motion-intro><h2>Viewport illustration</h2><div data-slot="lazy-load">Loading illustration</div><p>Playback guidance</p></section>
        <a href="/empty"><svg><title>Icon link</title></svg></a><a href="/reference">Reference</a>
        <pre>&lt;Video src="example.mp4" /&gt;</pre><pre>First unhighlighted line\nSecond unhighlighted line</pre>
      </main>
    `;
    const original = document.body.innerHTML;
    const fragment = extractedFragment(extractMainHtml());
    expect(document.body.innerHTML).toBe(original);
    expect(
      fragment.querySelector(
        "script, style, svg, nav, aside, form, button, input, select, textarea, [data-slot=video], [data-token-demo], [data-slot=lazy-load]",
      ),
    ).toBeNull();
    expect(fragment.querySelector("h1")?.textContent).toBe("Motion and Illustrations");
    expect(fragment.querySelector("[data-motion-intro]")?.textContent).toBe(
      "Viewport illustrationPlayback guidance",
    );
    expect([...fragment.querySelectorAll("a")].map((link) => link.textContent)).toEqual([
      "Reference",
    ]);
    expect([...fragment.querySelectorAll("pre")].map((pre) => pre.textContent)).toEqual([
      '<Video src="example.mp4" />',
      "First unhighlighted line\nSecond unhighlighted line",
    ]);
  });

  it("retains a real empty value instead of its measured or accessible fragments", () => {
    document.body.innerHTML =
      '<main id="main-content"><span data-slot="middle-truncate" data-value="">Measured text<span class="sr-only">Accessible text</span></span></main>';
    const fragment = extractedFragment(extractMainHtml());
    expect(fragment.querySelector('[data-slot="middle-truncate"]')?.textContent).toBe("");
  });

  it("returns no HTML when the main content is missing", () => {
    document.body.innerHTML = "<main><h1>Outside the documentation owner</h1></main>";
    const original = document.body.innerHTML;
    expect(extractMainHtml()).toBe("");
    expect(document.body.innerHTML).toBe(original);
  });
});
