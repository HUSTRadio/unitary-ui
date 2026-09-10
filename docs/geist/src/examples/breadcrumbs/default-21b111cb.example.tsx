import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumbs";

export function BreadcrumbsDefault21B111CBExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Breadcrumb type="text">
        <BreadcrumbItem href="#/">Home</BreadcrumbItem>
        <BreadcrumbItem href="#/components">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="#/components/breadcrumbs">Overview</BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb type="menu">
        <BreadcrumbItem href="#/">Home</BreadcrumbItem>
        <BreadcrumbItem href="#/components">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="#/components/breadcrumbs">Overview</BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}
