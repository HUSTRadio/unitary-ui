import { ProjectBanner } from "@hustradio/unitary-ui";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";

export function ProjectBannerSuccessC88A0B90Example() {
  const [enabled, setEnabled] = useState(true);

  return (
    <ProjectBanner
      callToAction={enabled ? { label: "Disable", onClick: () => setEnabled(false) } : undefined}
      icon={<ShieldCheck className="shrink-0" />}
      label={
        <>
          Attack Challenge Mode is {enabled ? "enabled" : "disabled"} for this project
        </>
      }
      variant="success"
    />
  );
}
