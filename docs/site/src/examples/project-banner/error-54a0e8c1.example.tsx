import { ProjectBanner } from "@/components/ui/project-banner";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";

export function ProjectBannerError54A0E8C1Example() {
  const [requested, setRequested] = useState(false);

  return (
    <ProjectBanner
      callToAction={
        requested
          ? undefined
          : { label: "Update Payment Method", onClick: () => setRequested(true) }
      }
      icon={<TriangleAlert />}
      label={
        <>
          {requested
            ? "Payment method update requested"
            : "Payment failed, update credit card information before your account is shut down"}
        </>
      }
      variant="error"
    />
  );
}
