// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readWebsiteLanguage, useWebsiteLanguage, WebsiteLanguageProvider } from "../website/src/language";
import { WEBSITE_COPY } from "../website/src/content";

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, "", "/");
  vi.spyOn(navigator, "language", "get").mockReturnValue("en-US");
});
afterEach(() => { vi.restoreAllMocks(); });

describe("website language", () => {
  it("prefers a valid URL language, then stored choice, then browser language", () => {
    expect(readWebsiteLanguage()).toBe("en-US");
    vi.spyOn(navigator, "language", "get").mockReturnValue("zh-TW");
    expect(readWebsiteLanguage()).toBe("zh-CN");
    localStorage.setItem("unitary-website-language", "en-US");
    expect(readWebsiteLanguage()).toBe("en-US");
    window.history.replaceState(null, "", "/?lang=zh-CN");
    expect(readWebsiteLanguage()).toBe("zh-CN");
    window.history.replaceState(null, "", "/?lang=invalid");
    expect(readWebsiteLanguage()).toBe("en-US");
  });
  it("switches and updates the URL even when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("Unavailable"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Unavailable"); });
    window.history.replaceState(null, "", "/?campaign=launch");
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    function Probe() {
      const { language, setLanguage } = useWebsiteLanguage();
      return <button onClick={() => setLanguage("zh-CN")}>{language}</button>;
    }
    try {
      act(() => root.render(<WebsiteLanguageProvider><Probe /></WebsiteLanguageProvider>));
      expect(container.textContent).toBe("en-US");
      act(() => container.querySelector("button")!.click());
      expect(container.textContent).toBe("zh-CN");
      expect(document.documentElement.lang).toBe("zh-CN");
      expect(new URL(window.location.href).searchParams.get("campaign")).toBe("launch");
      expect(new URL(window.location.href).searchParams.get("lang")).toBe("zh-CN");
    } finally { act(() => root.unmount()); container.remove(); }
  });
  it("keeps bilingual copy complete and the brand headline fixed", () => {
    expect(Object.keys(WEBSITE_COPY["zh-CN"]).sort()).toEqual(Object.keys(WEBSITE_COPY["en-US"]).sort());
    for (const copy of Object.values(WEBSITE_COPY)) {
      expect(copy.headings).toHaveLength(5);
      expect(copy.sections).toHaveLength(5);
      expect(copy.descriptions).toHaveLength(5);
      expect(copy.headings[0]).toBe("Create the One.");
    }
  });
});
