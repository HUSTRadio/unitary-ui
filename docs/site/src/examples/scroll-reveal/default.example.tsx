import { useState } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function ScrollRevealExample() {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  return (
    <div ref={setRoot} className="h-60 w-full overflow-y-auto border border-gray-alpha-400 p-4">
      <p className="min-h-64 text-copy-14">Scroll this container to reveal the next section.</p>
      {root ? (
        <ScrollReveal root={root}>
          <p className="rounded-md bg-gray-alpha-100 p-8">Revealed content stays visible.</p>
        </ScrollReveal>
      ) : null}
    </div>
  );
}
