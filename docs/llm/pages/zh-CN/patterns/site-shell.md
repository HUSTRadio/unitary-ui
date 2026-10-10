# 官网壳层

> Route: `/patterns/site-shell`

# 官网壳层与滚动配方

四种可复制的布局配方，复用同一组官网导航与页脚契约。切换尺寸可检查桌面目录、移动折叠和自然滚动；内容与品牌由站点提供。

usePageScroll(threshold = 80, target?) 返回 scrolled、direction 与 0–1 的 progress。scrolled 按绝对位置判断；direction 累计移动达到阈值才改变。target 省略或为 null 时观察文档，否则观察指定容器；初始化会读取恢复的滚动位置。

选择模板内容门户编辑式官网大学门户企业叙事

[在独立页面查看当前模板](#/patterns/site-shell?preview=portal)

复制源码后替换链接、搜索服务、语言路由、社交信息和备案内容。模板不包含外部站点品牌素材或后台服务。auto-hide 使用视口固定定位，页面需要预留顶栏高度。

```tsx
import { useEffect, useRef, useState } from "react";
import { scrollIntoViewWithMotion } from "@/lib/scroll-animation";
import {
  BackToTop,
  Footer,
  I18nProvider,
  Navbar,
  ScrollReveal,
  Scroller,
  SiteNavigation,
  type SiteNavigationItem,
} from "@/lib";

export interface WebsiteShellProps {
  variant?: "portal" | "editorial" | "university" | "corporate";
  language?: "zh-CN" | "en-US";
}

export function WebsiteShell({ variant = "portal", language = "en-US" }: WebsiteShellProps) {
  const [locale, setLocale] = useState(language);
  useEffect(() => setLocale(language), [language]);
  const chinese = locale === "zh-CN";
  const words = chinese
    ? {
        brand: "Unitary",
        nav: "网站导航",
        research: "研究",
        company: "机构",
        news: "动态",
        resources: "资源",
        overview: "研究概览",
        projects: "研究项目",
        about: "关于我们",
        team: "团队",
        title: "探索值得分享的新想法",
        lead: "让内容、导航与滚动共同服务于阅读。",
        start: "开始探索",
        search: "站内搜索",
        close: "关闭搜索",
        query: "输入关键词",
        language: "语言",
        contact: "联系我们",
        privacy: "隐私政策",
        copyright: "示例站点 · 用你的真实信息替换",
        top: "返回顶部",
        previous: "上一项",
        next: "下一项",
        stories: "专题",
        topic: "内容主题",
        read: "查看内容",
        visitors: "访客",
        alumni: "校友",
        donate: "捐赠",
        story: "连接现在与未来",
        description: "桌面保留内容侧边的粘性说明；手机自然排列，保留原生滚动。",
      }
    : {
        brand: "Unitary",
        nav: "Site navigation",
        research: "Research",
        company: "Company",
        news: "News",
        resources: "Resources",
        overview: "Research overview",
        projects: "Projects",
        about: "About us",
        team: "Team",
        title: "Explore ideas worth sharing",
        lead: "Content, navigation, and scrolling work together for reading.",
        start: "Explore",
        search: "Site search",
        close: "Close search",
        query: "Enter keywords",
        language: "Language",
        contact: "Contact us",
        privacy: "Privacy policy",
        copyright: "Example site · Replace with your real details",
        top: "Back to top",
        previous: "Previous",
        next: "Next",
        stories: "Stories",
        topic: "Content topic",
        read: "Read story",
        visitors: "Visitors",
        alumni: "Alumni",
        donate: "Donate",
        story: "Connect the present and the future",
        description:
          "A sticky introduction on desktop becomes normal flow on phones, preserving native scrolling.",
      };
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);
  const searchTrigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (searchOpen) searchInput.current?.focus();
  }, [searchOpen]);
  const [query, setQuery] = useState("");
  const [slide, setSlide] = useState(0);
  const [main, setMain] = useState<HTMLElement | null>(null);
  const heroTitles = [words.title, words.story, words.research];
  const sectionId = `site-${variant}-main`;
  const storyId = `site-${variant}-stories`;
  const items: SiteNavigationItem[] = [
    {
      id: "research",
      label: words.research,
      groups: [
        {
          title: words.resources,
          links: [
            { label: words.overview, href: `#${sectionId}`, description: words.lead },
            { label: words.projects, href: `#${storyId}` },
          ],
        },
      ],
      featured: (
        <div className="rounded-lg bg-gray-alpha-100 p-5">
          <strong>{words.story}</strong>
          <p className="mt-2 text-copy-13">{words.description}</p>
        </div>
      ),
    },
    {
      id: "company",
      label: words.company,
      groups: [
        {
          title: words.company,
          links: [
            { label: words.about, href: `#${storyId}` },
            { label: words.team, href: `#${storyId}` },
          ],
        },
      ],
    },
    { id: "news", label: words.news, href: `#${storyId}` },
  ];
  const results = items
    .flatMap(
      (item) =>
        item.groups?.flatMap((group) => group.links) ?? [
          { label: item.label, href: item.href ?? "#" },
        ],
    )
    .filter((link) => link.label.toLowerCase().includes(query.trim().toLowerCase()));
  const footerColumns = [words.research, words.company, words.resources].map((title) => ({
    title,
    links: [
      { label: words.overview, href: `#${sectionId}` },
      { label: words.projects, href: `#${storyId}` },
    ],
  }));
  const corporate = variant === "corporate";
  const university = variant === "university";
  return (
    <I18nProvider locale={chinese ? "zh-CN" : "en"}>
      <div
        data-slot="website-shell"
        data-variant={variant}
        lang={locale}
        className="min-w-0 bg-background-100 text-foreground"
        onClickCapture={(event) => {
          if (
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            event.button !== 0
          )
            return;
          const link = (event.target as HTMLElement).closest("a");
          const href = link?.getAttribute("href");
          if (!href?.startsWith(`#site-${variant}-`)) return;
          const destination = document.getElementById(href.slice(1));
          if (!destination) return;
          event.preventDefault();
          requestAnimationFrame(() => {
            destination.focus({ preventScroll: true });
            scrollIntoViewWithMotion(destination);
          });
        }}
      >
        <a
          href={`#${sectionId}`}
          className="sr-only fixed focus:not-sr-only focus:z-50 focus:bg-background-100 focus:p-3"
        >
          {words.start}
        </a>
        <Navbar
          height={university ? "h-auto" : "h-20"}
          scrollBehavior={corporate ? "auto-hide" : "pinned"}
          variant={corporate ? "transparent" : "solid"}
          solidOnScroll={corporate}
          forceVisible={navigationOpen || searchOpen}
        >
          {university ? (
            <div className="hidden justify-end gap-6 border-b border-gray-alpha-400 px-6 py-2 text-copy-13 md:flex">
              {[words.visitors, words.alumni, words.donate].map((text) => (
                <a key={text} href={`#${storyId}`} className="min-h-7 focus-ring">
                  {text}
                </a>
              ))}
            </div>
          ) : null}
          <div className="mx-auto flex min-h-20 max-w-7xl items-center gap-3 px-4 md:px-8">
            <a href={`#${sectionId}`} className="mr-auto min-w-0 text-heading-20 focus-ring">
              {words.brand}
            </a>
            <SiteNavigation
              items={items}
              label={words.nav}
              desktopBreakpoint={corporate || university ? 1280 : 1024}
              onOpenChange={setNavigationOpen}
              mobileActions={
                <div className="grid gap-3">
                  <a
                    href={`#${storyId}`}
                    className="min-h-11 rounded-md bg-foreground p-3 text-center text-background-100"
                  >
                    {words.start}
                  </a>
                  <a className="min-h-11 p-3 text-center focus-ring" href={`#${sectionId}`}>
                    {words.contact}
                  </a>
                </div>
              }
            />
            <button
              ref={searchTrigger}
              type="button"
              className="min-h-11 rounded-md px-3 text-copy-13 focus-ring"
              aria-expanded={searchOpen}
              aria-controls={`site-${variant}-search`}
              onClick={() => setSearchOpen(!searchOpen)}
            >
              {searchOpen ? words.close : words.search}
            </button>
          </div>
          {searchOpen ? (
            <form
              id={`site-${variant}-search`}
              role="search"
              className="max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain border-t border-gray-alpha-400 bg-background-100 p-4"
              onSubmit={(event) => event.preventDefault()}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  setSearchOpen(false);
                  searchTrigger.current?.focus();
                }
              }}
            >
              <label className="mx-auto block max-w-3xl text-copy-14">
                {words.query}
                <input
                  ref={searchInput}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="mt-2 min-h-11 w-full rounded-md border border-gray-alpha-400 bg-background-100 px-3 focus-ring"
                />
              </label>
              <div className="mx-auto mt-3 max-w-3xl text-copy-13">
                <p role="status">
                  {results.length} {chinese ? "项匹配的导航结果" : "matching navigation results"}
                </p>
                <ul>
                  {results.map((link, index) => (
                    <li key={`${link.href}-${index}`}>
                      <a
                        className="inline-flex min-h-11 items-center focus-ring"
                        href={link.href}
                        onClick={() => setSearchOpen(false)}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </form>
          ) : null}
        </Navbar>
        {corporate ? <div className="h-20" aria-hidden /> : null}
        <main ref={setMain} id={sectionId} tabIndex={-1} className="scroll-mt-36 outline-none">
          <section
            className={`mx-auto grid max-w-7xl content-center gap-8 px-6 py-20 md:px-10 ${corporate ? "min-h-[75svh]" : "min-h-[28rem]"}`}
            aria-roledescription={university ? "carousel" : undefined}
            aria-label={words.stories}
          >
            <h1
              className={`max-w-4xl text-heading-40 ${variant === "editorial" ? "font-serif" : ""}`}
            >
              {university ? heroTitles[slide] : words.title}
            </h1>
            <p className="max-w-xl text-copy-16 text-muted-foreground">{words.lead}</p>
            <a
              href={`#${storyId}`}
              className="w-fit min-h-11 rounded-md border border-gray-alpha-400 px-4 py-3 text-copy-14 focus-ring"
            >
              {words.start}
            </a>
            {university ? (
              <div className="flex items-center gap-4">
                <button
                  className="min-h-11 rounded-md border border-gray-alpha-400 px-4 focus-ring"
                  onClick={() => setSlide((slide + 2) % 3)}
                >
                  {words.previous}
                </button>
                <span aria-live="polite">{slide + 1} / 3</span>
                <button
                  className="min-h-11 rounded-md border border-gray-alpha-400 px-4 focus-ring"
                  onClick={() => setSlide((slide + 1) % 3)}
                >
                  {words.next}
                </button>
              </div>
            ) : null}
          </section>
          <section
            id={storyId}
            tabIndex={-1}
            className="mx-auto max-w-7xl scroll-mt-36 border-t border-gray-alpha-400 px-6 py-16 outline-none md:px-10"
          >
            <h2 className="mb-8 text-heading-28">{words.stories}</h2>
            {corporate ? (
              <div className="grid items-start gap-10 lg:grid-cols-2">
                <div className="lg:sticky lg:top-28">
                  <h3 className="text-heading-24">{words.story}</h3>
                  <p className="mt-4 text-copy-16">{words.description}</p>
                </div>
                <div className="grid gap-12">
                  {[1, 2, 3].map((index) => (
                    <ScrollReveal key={index}>
                      <article className="flex min-h-80 flex-col justify-end rounded-xl bg-gray-alpha-100 p-8">
                        <h3 className="text-heading-24">
                          {words.topic} {index}
                        </h3>
                        <p className="mt-4 text-copy-14">{words.lead}</p>
                      </article>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            ) : variant === "portal" ? (
              <Scroller
                height="auto"
                withButtons
                className="[&_button]:min-h-11 [&_button]:min-w-11"
                childrenContainerClassName="snap-x snap-proximity pb-4"
              >
                {[1, 2, 3, 4].map((index) => (
                  <article
                    key={index}
                    className="min-h-60 w-[min(80vw,20rem)] shrink-0 snap-start rounded-lg border border-gray-alpha-400 p-6 last:snap-end"
                  >
                    <h3 className="text-heading-20">
                      {words.topic} {index}
                    </h3>
                    <p className="my-4 text-copy-14">{words.lead}</p>
                    <a
                      className="inline-flex min-h-11 items-center focus-ring"
                      href={`#${sectionId}`}
                    >
                      {words.read}
                    </a>
                  </article>
                ))}
              </Scroller>
            ) : (
              <div className="grid gap-8 md:grid-cols-2">
                {[1, 2, 3, 4].map((index) => (
                  <ScrollReveal key={index}>
                    <article className="min-h-56 border-b border-gray-alpha-400 py-6">
                      <h3 className="text-heading-24">
                        {words.topic} {index}
                      </h3>
                      <p className="mt-4 text-copy-16 text-muted-foreground">{words.lead}</p>
                    </article>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </section>
        </main>
        <Footer
          className="mx-auto max-w-7xl px-6 md:px-10"
          columns={footerColumns}
          columnsClassName="grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          collapseOnMobile={corporate}
          slotLeading={
            <div>
              <strong className="text-heading-20">{words.brand}</strong>
              {university ? (
                <address className="mt-4 text-copy-13 not-italic">
                  {words.contact}
                  <br />
                  hello@example.com
                </address>
              ) : null}
            </div>
          }
          slotBottom={
            <div className="flex flex-wrap items-center justify-between gap-4 text-copy-13">
              <span>{words.copyright}</span>
              <a href={`#${sectionId}`} className="min-h-11 content-center focus-ring">
                {words.privacy}
              </a>
              <label>
                {words.language}
                <select
                  className="ml-2 min-h-11 bg-background-100"
                  value={locale}
                  onChange={(event) => setLocale(event.target.value as "zh-CN" | "en-US")}
                >
                  <option value="zh-CN">中文</option>
                  <option value="en-US">English</option>
                </select>
              </label>
            </div>
          }
        />
        <div className="flex justify-end px-6 py-4">
          <BackToTop focusTarget={main}>{words.top}</BackToTop>
        </div>
      </div>
    </I18nProvider>
  );
}
```
