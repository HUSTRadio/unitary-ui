import { useState } from "react";
import { BottomSheet } from "@hustradio/unitary-ui";
import { SubFrame } from "@hustradio/unitary-ui";

export default function SubFrameExample() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex w-full flex-col gap-4">
      <SubFrame className="flex h-80 flex-col justify-end gap-3 rounded-xl border border-border bg-background p-5">
        <span className="text-sm text-muted-foreground">
          This frame owns the overlay: the sheet opens inside it instead of covering the whole page.
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-fit rounded-md border border-border px-3 py-2 text-sm text-foreground"
        >
          Open the sheet inside the frame
        </button>
        <BottomSheet open={open} onOpenChange={setOpen} detents={[0.6]}>
          <div className="flex flex-col gap-2 px-6 pt-2 pb-8">
            <h4 className="text-label-16 font-medium text-foreground">Inside the frame</h4>
            <p className="text-copy-14 text-muted-foreground">Drag or dismiss it; it never leaves the frame.</p>
          </div>
        </BottomSheet>
      </SubFrame>
    </div>
  );
}
