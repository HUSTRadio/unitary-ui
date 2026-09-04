import { ProjectBanner } from "@/components/ui/project-banner";
import { ShieldCheck } from "lucide-react";

export function ProjectBannerSuccessC88A0B90Example() {
  return (
    <ProjectBanner
      callToAction={{
        label: "Disable",
        href: "/",
      }}
      icon={<ShieldCheck className="shrink-0" />}
      label={<>Attack Challenge Mode is enabled for this project</>}
      variant="success"
    />
  );
}
