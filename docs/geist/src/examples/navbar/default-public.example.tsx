import { Navbar } from "@/components/ui/navbar";

export default function NavbarExample() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-background">
      <Navbar scrollBehavior="static" className="flex items-center px-5">
        <span className="font-semibold">Unitary</span>
        <span className="ml-auto text-sm text-muted-foreground">Workspace</span>
      </Navbar>
      <div className="border-t border-border p-6 text-sm text-muted-foreground">
        Page content begins below the header.
      </div>
    </div>
  );
}
