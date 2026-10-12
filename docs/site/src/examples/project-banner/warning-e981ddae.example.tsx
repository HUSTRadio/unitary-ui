import { ProjectBanner } from "@hustradio/unitary-ui";
import { Tooltip } from "@hustradio/unitary-ui";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

export function ProjectBannerWarningE981DDAEExample() {
  const [restored, setRestored] = useState(false);

  return (
    <ProjectBanner
      callToAction={restored ? undefined : { label: "Undo Rollback", onClick: () => setRestored(true) }}
      icon={<RotateCcw />}
      label={
        restored ? (
          <>Rollback restored</>
        ) : (
          <>
            This project was rolled back by{" "}
            <Tooltip
              className="underline decoration-dashed underline-offset-[5px]"
              text="Yesterday for project marketing-website"
            >
              @johnphamous
            </Tooltip>
          </>
        )
      }
      variant="warning"
    />
  );
}
