import { ProjectBanner } from "@/components/ui/project-banner";
import { TriangleAlert } from "lucide-react";

export function ProjectBannerError54A0E8C1Example() {
  return (
    <ProjectBanner
      callToAction={{
        label: "Add Credit Card",
        href: "/$",
      }}
      icon={<TriangleAlert />}
      label={
        <>
          Payment failed, update credit card information before your account is shut down
        </>
      }
      variant="error"
    />
  );
}
