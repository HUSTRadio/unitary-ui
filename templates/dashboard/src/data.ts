export const workspace = { brand: "Orbit", initialName: "Product team", pageSize: 5 };
export type ProjectStatus = "active" | "paused" | "archived";
export type Project = {
  id: string;
  name: string;
  owner: string;
  status: ProjectStatus;
  resources: number;
  updated: string;
};
export const projects: Project[] = [
  {
    id: "atlas",
    name: "Atlas",
    owner: "Alex",
    status: "active",
    resources: 24,
    updated: "2026-09-30",
  },
  {
    id: "beacon",
    name: "Beacon",
    owner: "Sam",
    status: "active",
    resources: 18,
    updated: "2026-09-29",
  },
  {
    id: "canvas",
    name: "Canvas",
    owner: "Taylor",
    status: "paused",
    resources: 12,
    updated: "2026-09-28",
  },
  {
    id: "delta",
    name: "Delta",
    owner: "Alex",
    status: "active",
    resources: 32,
    updated: "2026-09-27",
  },
  {
    id: "echo",
    name: "Echo",
    owner: "Jordan",
    status: "archived",
    resources: 8,
    updated: "2026-09-26",
  },
  {
    id: "flux",
    name: "Flux",
    owner: "Sam",
    status: "active",
    resources: 16,
    updated: "2026-09-25",
  },
  {
    id: "grove",
    name: "Grove",
    owner: "Taylor",
    status: "paused",
    resources: 9,
    updated: "2026-09-24",
  },
  {
    id: "harbor",
    name: "Harbor",
    owner: "Jordan",
    status: "active",
    resources: 21,
    updated: "2026-09-23",
  },
  { id: "ion", name: "Ion", owner: "Alex", status: "active", resources: 14, updated: "2026-09-22" },
  {
    id: "jade",
    name: "Jade",
    owner: "Sam",
    status: "archived",
    resources: 6,
    updated: "2026-09-21",
  },
  {
    id: "kite",
    name: "Kite",
    owner: "Taylor",
    status: "active",
    resources: 11,
    updated: "2026-09-20",
  },
  {
    id: "lumen",
    name: "Lumen",
    owner: "Jordan",
    status: "active",
    resources: 27,
    updated: "2026-09-19",
  },
];
export const activity = [
  { month: "04", completed: 18 },
  { month: "05", completed: 32 },
  { month: "06", completed: 28 },
  { month: "07", completed: 47 },
  { month: "08", completed: 56 },
  { month: "09", completed: 68 },
];

export function selectProjects(
  items: Project[],
  query: string,
  status: string,
  sort: string,
  page: number,
  pageSize = workspace.pageSize,
) {
  const needle = query.trim().toLocaleLowerCase();
  const filtered = items.filter(
    (item) =>
      (status === "all" || item.status === status) &&
      `${item.name} ${item.owner}`.toLocaleLowerCase().includes(needle),
  );
  filtered.sort((a, b) =>
    sort === "name" ? a.name.localeCompare(b.name) : b.updated.localeCompare(a.updated),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  return {
    items: filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    total: filtered.length,
    totalPages,
    page: currentPage,
  };
}
