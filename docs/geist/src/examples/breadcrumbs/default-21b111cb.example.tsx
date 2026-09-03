import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumbs";

export function BreadcrumbsDefault21B111CBExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Breadcrumb type="text">
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Dashboard</BreadcrumbItem>
        <BreadcrumbItem>Overview</BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb type="menu">
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Dashboard</BreadcrumbItem>
        <BreadcrumbItem>Overview</BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}
