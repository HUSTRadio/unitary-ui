import { ProjectBanner } from "@/components/ui/project-banner";
import { ShieldCheck } from "lucide-react";

export function ProjectBannerDefault21B111CBExample() {
  return (
    <ProjectBanner
      callToAction={{
        label: "Disable",
        href: "/",
      }}
      icon={<ShieldCheck className="shrink-0" />}
      label={<>Attack Challenge Mode is enabled for this project</>}
    />
  );
}
