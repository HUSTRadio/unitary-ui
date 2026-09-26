import { useState } from "react";
import { SidePanel, SidePanelClose, SidePanelDescription, SidePanelTitle } from "@/components/ui/side-panel";

export default function SidePanelExample() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button type="button" className="rounded-md border border-border px-4 py-2" onClick={() => setShow(true)}>
        Open details
      </button>
      <SidePanel show={show} onDismiss={() => setShow(false)}>
        <div className="flex items-center justify-between gap-4">
          <SidePanelTitle>Project details</SidePanelTitle>
          <SidePanelClose aria-label="Close details">Close</SidePanelClose>
        </div>
        <SidePanelDescription className="mt-3">
          Review project information without leaving the current page.
        </SidePanelDescription>
      </SidePanel>
    </>
  );
}
