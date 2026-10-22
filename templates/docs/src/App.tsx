import { useEffect, useMemo, useRef, useState } from "react";
import {
  HashRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Button,
  ButtonLink,
  CommandMenu,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
  Footer,
  Navbar,
  Pagination,
  SidebarNav,
  SiteNavigation,
  ThemeSwitcher,
} from "@hustradio/unitary-ui";
import { BookOpen, Search } from "lucide-react";
import { copy, documents, searchDocuments, site } from "./content";
import { DocumentBody, documentOutline } from "./markdown";
import { LanguageSwitcher, useLocale } from "./locale";

export default function App() {
  return (
    <HashRouter>
      <Docs />
    </HashRouter>
  );
}

function Docs() {
  const { locale } = useLocale();
  const text = copy[locale];
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const main = useRef<HTMLElement>(null);
  const current = documents.find((document) => `/${document.id}` === pathname);
  const currentIndex = documents.findIndex((document) => document === current);
  const outline = useMemo(() => documentOutline(current?.content[locale] ?? ""), [current, locale]);
  useEffect(() => {
    setSearchOpen(false);
    main.current?.focus();
    window.scrollTo(0, 0);
  }, [pathname]);
  useEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [pathname, hash, locale]);
  useEffect(() => {
    document.title = `${current?.title[locale] ?? site.title[locale]} · ${site.brand}`;
  }, [current, locale]);
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);
  const groups = (["guides", "support"] as const).map((group) => ({
    id: group,
    label: text[group],
    items: documents
      .filter((document) => document.group === group)
      .map((document) => ({ label: document.title[locale], to: `#/${document.id}` })),
  }));
  const navItems = documents.map((document) => ({
    id: document.id,
    label: document.title[locale],
    href: `#/${document.id}`,
  }));
  const rail = (index: number) =>
    documents[index]
      ? { title: documents[index].title[locale], href: `#/${documents[index].id}` }
      : undefined;
  const searchResults = searchDocuments(query, locale);
  return (
    <>
      <a
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          main.current?.focus();
        }}
        className="template-skip focus-ring rounded-md bg-background px-4 py-2"
      >
        {text.skip}
      </a>
      <Navbar height="h-auto">
        <div className="template-container flex min-h-16 flex-wrap items-center gap-2 py-2">
          <Link
            to="/introduction"
            className="mr-auto flex items-center gap-2 text-heading-20 focus-ring"
          >
            <BookOpen className="size-5" aria-hidden />
            {site.brand}
          </Link>
          <SiteNavigation
            className="lg:hidden"
            label={text.navigation}
            desktopBreakpoint={1024}
            items={navItems}
            activeHref={`#${pathname}`}
          />
          <Button
            typeName="button"
            type="tertiary"
            size="small"
            aria-label={text.search}
            onClick={() => {
              setQuery("");
              setSearchOpen(true);
            }}
          >
            <Search aria-hidden />
            <span className="hidden sm:inline">{text.search}</span>
          </Button>
          <LanguageSwitcher />
          <ThemeSwitcher compact />
        </div>
      </Navbar>
      <div className="template-container lg:grid lg:grid-cols-[var(--template-sidebar-width)_minmax(0,1fr)]">
        <aside className="hidden border-r border-border py-8 pr-4 lg:block">
          <SidebarNav
            groups={groups}
            activeTo={`#${pathname}`}
            onNavigate={(to) => navigate(to.slice(1))}
          />
        </aside>
        <main
          id="main-content"
          ref={main}
          tabIndex={-1}
          className="min-w-0 py-8 outline-none lg:pl-8"
        >
          <Routes>
            <Route path="/" element={<Navigate replace to="/introduction" />} />
            <Route
              path="/:documentId"
              element={
                current ? (
                  <>
                    <div className="min-w-0 xl:grid xl:grid-cols-[minmax(0,1fr)_180px] xl:gap-6">
                      <article className="template-document min-w-0 max-w-[var(--template-reading-width)]">
                        <DocumentBody source={current.content[locale]} />
                      </article>
                      <aside className="mt-8 xl:mt-0" aria-label={text.contents}>
                        <div className="sticky top-24">
                          <h2 className="mb-3 text-label-14">{text.contents}</h2>
                          <ul className="space-y-3">
                            {outline.map((heading) => (
                              <li key={heading.id} className={heading.depth === 3 ? "pl-3" : ""}>
                                <Link
                                  className="focus-ring text-copy-13 text-muted-foreground hover:text-foreground"
                                  to={`${pathname}#${heading.id}`}
                                >
                                  {heading.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </aside>
                    </div>
                    <Pagination
                      className="mt-12 border-t border-border pt-6"
                      previous={rail(currentIndex - 1)}
                      next={rail(currentIndex + 1)}
                    />
                  </>
                ) : (
                  <>
                    <h1 className="text-heading-32">{text.notFound}</h1>
                    <ButtonLink className="mt-6" href="#/introduction">
                      {text.home}
                    </ButtonLink>
                  </>
                )
              }
            />
          </Routes>
          <Footer
            className="mt-12"
            slotBottom={<p className="text-copy-13 text-muted-foreground">{text.footer}</p>}
          />
        </main>
      </div>
      <CommandMenu open={searchOpen} setOpen={setSearchOpen}>
        <CommandMenuInput
          aria-label={text.search}
          placeholder={text.searchPlaceholder}
          value={query}
          onValueChange={setQuery}
        />
        <CommandMenuList>
          {searchResults.length ? (
            searchResults.map((document) => (
              <CommandMenuItem
                key={document.id}
                value={`${document.title[locale]} ${document.content[locale]}`}
                onSelect={() => {
                  navigate(`/${document.id}`);
                  setSearchOpen(false);
                }}
              >
                {document.title[locale]}
              </CommandMenuItem>
            ))
          ) : (
            <p role="status" className="p-4 text-copy-14">
              {text.noResults}
            </p>
          )}
        </CommandMenuList>
      </CommandMenu>
    </>
  );
}
