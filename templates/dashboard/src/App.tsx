import { useEffect, useRef, useState } from "react";
import { HashRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import {
  Badge,
  Button,
  ButtonLink,
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetTitle,
  Input,
  LineChart,
  Navbar,
  NumberedPagination,
  ResponsiveDrawer,
  ResponsiveDrawerBody,
  ResponsiveDrawerClose,
  ResponsiveDrawerContent,
  ResponsiveDrawerDescription,
  ResponsiveDrawerFooter,
  ResponsiveDrawerHeader,
  ResponsiveDrawerTitle,
  SearchInput,
  Select,
  SelectItem,
  SidebarNav,
  SiteNavigation,
  Switch,
  Table,
  TableBody,
  TableCell,
  SwitchControl,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
  ThemeSwitcher,
} from "@hustradio/unitary-ui";
import { Layers } from "lucide-react";
import { copy, navigation } from "./content";
import { activity, projects, selectProjects, workspace, type Project } from "./data";
import { LanguageSwitcher, useLocale } from "./locale";

export default function App() {
  return (
    <HashRouter>
      <Dashboard />
    </HashRouter>
  );
}

function Dashboard() {
  const { locale } = useLocale();
  const text = copy[locale];
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Project | null>(null);
  const [workspaceName, setWorkspaceName] = useState(workspace.initialName);
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);
  const detailTrigger = useRef<HTMLButtonElement | null>(null);
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    main.current?.focus();
    setSelected(null);
  }, [pathname]);
  const navItems = navigation.map((item) => ({ label: text[item.id], to: `#${item.to}` }));
  const result = selectProjects(projects, query, status, sort, page);
  const showDetails = (item: Project, button: HTMLButtonElement) => {
    detailTrigger.current = button;
    setSelected(item);
  };
  const projectTable = (items: Project[]) => (
    <TableRoot tabIndex={0} role="region" aria-label={text.projects}>
      <Table colorScheme="interactive">
        <TableHeader>
          <TableRow>
            <TableHead>{text.name}</TableHead>
            <TableHead>{text.owner}</TableHead>
            <TableHead>{text.status}</TableHead>
            <TableHead align="right">{text.resources}</TableHead>
            <TableHead>{text.updated}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Button
                  typeName="button"
                  type="tertiary"
                  size="small"
                  onClick={(event) => showDetails(item, event.currentTarget)}
                >
                  {item.name}
                </Button>
              </TableCell>
              <TableCell>{item.owner}</TableCell>
              <TableCell>
                <Badge>{text[item.status]}</Badge>
              </TableCell>
              <TableCell align="right">{item.resources}</TableCell>
              <TableCell className="whitespace-nowrap">
                {new Intl.DateTimeFormat(locale, { timeZone: "UTC" }).format(
                  new Date(`${item.updated}T00:00:00Z`),
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableRoot>
  );
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
          <Link to="/" className="mr-auto flex items-center gap-2 text-heading-20 focus-ring">
            <Layers className="size-5" aria-hidden />
            {workspace.brand}
          </Link>
          <SiteNavigation
            className="lg:hidden"
            label={text.navigation}
            desktopBreakpoint={1024}
            items={navigation.map((item) => ({
              id: item.id,
              label: text[item.id],
              href: `#${item.to}`,
            }))}
            activeHref={`#${pathname}`}
          />
          <LanguageSwitcher />
          <ThemeSwitcher compact />
        </div>
      </Navbar>
      <div className="template-container lg:grid lg:grid-cols-[var(--template-sidebar-width)_minmax(0,1fr)]">
        <aside className="hidden border-r border-border py-8 pr-4 lg:block">
          <SidebarNav
            groups={[{ id: "workspace", label: text.workspace, items: navItems }]}
            activeTo={`#${pathname}`}
            onNavigate={(to) => {
              window.location.hash = to;
            }}
          />
        </aside>
        <main
          id="main-content"
          ref={main}
          tabIndex={-1}
          className="min-w-0 py-8 outline-none lg:pl-8"
        >
          <p className="mb-5 text-copy-13 text-muted-foreground">{text.sample}</p>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <h1 className="text-heading-32">{text.title}</h1>
                  <p className="mt-3 text-copy-16 text-muted-foreground">{text.lead}</p>
                  <dl className="my-8 grid gap-4 sm:grid-cols-3">
                    {[
                      [
                        text.activeProjects,
                        projects.filter((item) => item.status === "active").length,
                      ],
                      [text.resources, projects.reduce((sum, item) => sum + item.resources, 0)],
                      [text.members, new Set(projects.map((item) => item.owner)).size],
                    ].map(([label, value]) => (
                      <div className="template-panel" key={label}>
                        <dt className="text-copy-13 text-muted-foreground">{label}</dt>
                        <dd className="mt-3 text-heading-32">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <section className="template-panel">
                    <h2 className="mb-5 text-heading-20">{text.activity}</h2>
                    <LineChart
                      data={activity.map((item) => ({
                        month: item.month,
                        [text.completed]: item.completed,
                      }))}
                      index="month"
                      categories={[text.completed]}
                      xAxisLabel={text.month}
                      valueFormatter={(value) => new Intl.NumberFormat(locale).format(value)}
                    />
                  </section>
                  <section className="mt-8">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <h2 className="text-heading-20">{text.recent}</h2>
                      <ButtonLink href="#/projects" type="secondary" size="small">
                        {text.allProjects}
                      </ButtonLink>
                    </div>
                    {projectTable(projects.slice(0, 3))}
                  </section>
                </>
              }
            />
            <Route
              path="/projects"
              element={
                <>
                  <h1 className="text-heading-32">{text.projects}</h1>
                  <p className="mt-3 text-copy-16 text-muted-foreground">{text.projectLead}</p>
                  <div className="my-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="min-w-0">
                      <label htmlFor="project-search" className="mb-2 block text-label-13">
                        {text.search}
                      </label>
                      <SearchInput
                        id="project-search"
                        value={query}
                        onChange={(event) => {
                          setQuery(event.target.value);
                          setPage(1);
                        }}
                      />
                    </div>
                    <Select
                      label={text.status}
                      value={status}
                      onValueChange={(value) => {
                        setStatus(value);
                        setPage(1);
                      }}
                    >
                      {["all", "active", "paused", "archived"].map((value) => (
                        <SelectItem key={value} value={value}>
                          {text[value as "all"]}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      label={text.sort}
                      value={sort}
                      onValueChange={(value) => {
                        setSort(value);
                        setPage(1);
                      }}
                    >
                      <SelectItem value="newest">{text.newest}</SelectItem>
                      <SelectItem value="name">{text.alphabetical}</SelectItem>
                    </Select>
                  </div>
                  <p className="mb-3 text-copy-13 text-muted-foreground" role="status">
                    {result.total} {text.result}
                  </p>
                  {result.items.length ? (
                    projectTable(result.items)
                  ) : (
                    <div className="template-panel text-center">
                      <p className="text-copy-16">{text.empty}</p>
                      <Button
                        typeName="button"
                        type="secondary"
                        className="mt-4"
                        onClick={() => {
                          setQuery("");
                          setStatus("all");
                          setPage(1);
                        }}
                      >
                        {text.clear}
                      </Button>
                    </div>
                  )}
                  <NumberedPagination
                    className="mt-6"
                    totalPages={result.totalPages}
                    page={result.page}
                    onPageChange={setPage}
                  />
                </>
              }
            />
            <Route
              path="/settings"
              element={
                <>
                  <h1 className="text-heading-32">{text.settings}</h1>
                  <p className="mt-3 text-copy-16 text-muted-foreground">{text.settingsLead}</p>
                  <form
                    className="mt-8"
                    onSubmit={(event) => {
                      event.preventDefault();
                      setSaved(true);
                    }}
                  >
                    <Fieldset>
                      <FieldsetTitle>{text.workspace}</FieldsetTitle>
                      <FieldsetContent>
                        <Input
                          label={text.workspaceName}
                          value={workspaceName}
                          required
                          onChange={(event) => {
                            setWorkspaceName(event.target.value);
                            setSaved(false);
                          }}
                        />
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <h2 className="text-label-14">{text.notifications}</h2>
                            <p className="mt-2 text-copy-13 text-muted-foreground">
                              {text.notificationLead}
                            </p>
                          </div>
                          <Switch
                            name="weekly-digest"
                            aria-label={text.notifications}
                            value={notifications ? "on" : "off"}
                            onValueChange={(value) => {
                              setNotifications(value === "on");
                              setSaved(false);
                            }}
                          >
                            <SwitchControl value="on" label={text.on} />
                            <SwitchControl value="off" label={text.off} />
                          </Switch>
                        </div>
                      </FieldsetContent>
                      <FieldsetFooter>
                        <div className="flex flex-wrap items-center gap-4">
                          <Button typeName="submit">{text.save}</Button>
                          {saved && (
                            <p role="status" className="text-copy-14">
                              {text.saved}
                            </p>
                          )}
                        </div>
                      </FieldsetFooter>
                    </Fieldset>
                  </form>
                </>
              }
            />
            <Route
              path="*"
              element={
                <>
                  <h1 className="text-heading-32">{text.notFound}</h1>
                  <ButtonLink className="mt-6" href="#/">
                    {text.home}
                  </ButtonLink>
                </>
              }
            />
          </Routes>
        </main>
      </div>
      <ResponsiveDrawer
        open={selected !== null}
        onOpenChange={(value) => {
          if (!value) setSelected(null);
        }}
      >
        <ResponsiveDrawerContent
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            detailTrigger.current?.focus();
          }}
        >
          <ResponsiveDrawerHeader>
            <ResponsiveDrawerTitle>{selected?.name ?? text.details}</ResponsiveDrawerTitle>
            <ResponsiveDrawerDescription>{text.detailsLead}</ResponsiveDrawerDescription>
          </ResponsiveDrawerHeader>
          <ResponsiveDrawerBody>
            {selected && (
              <dl className="grid grid-cols-2 gap-4 text-copy-14">
                <dt>{text.owner}</dt>
                <dd>{selected.owner}</dd>
                <dt>{text.status}</dt>
                <dd>{text[selected.status]}</dd>
                <dt>{text.resources}</dt>
                <dd>{selected.resources}</dd>
              </dl>
            )}
          </ResponsiveDrawerBody>
          <ResponsiveDrawerFooter>
            <ResponsiveDrawerClose asChild>
              <Button typeName="button" type="secondary">
                {text.close}
              </Button>
            </ResponsiveDrawerClose>
          </ResponsiveDrawerFooter>
        </ResponsiveDrawerContent>
      </ResponsiveDrawer>
    </>
  );
}
