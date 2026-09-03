import { ProjectBanner } from "@/components/ui/project-banner";
import { Tooltip } from "@/components/ui/tooltip";
import { RotateCcw } from "lucide-react";

export function ProjectBannerWarningE981DDAEExample() {
  return (
    <ProjectBanner
      callToAction={{
        label: "Undo Rollback",
        onClick: () => {
          alert("Button clicked");
        },
      }}
      icon={<RotateCcw />}
      label={
        <>
          This project was rolled back by{" "}
          <Tooltip
            className="underline decoration-dashed underline-offset-[5px]"
            text="Yesterday for project marketing-website"
          >
            @johnphamous
          </Tooltip>
        </>
      }
      variant="warning"
    />
  );
}
