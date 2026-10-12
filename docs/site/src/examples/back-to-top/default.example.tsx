import { useRef, useState } from "react";
import { BackToTop } from "@hustradio/unitary-ui";

export default function BackToTopExample() {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  return (
    <div className="w-full">
      <div ref={setTarget} className="h-60 overflow-y-auto border border-gray-alpha-400 p-4">
        <h3 ref={heading} tabIndex={-1} className="text-heading-16">
          Section start
        </h3>
        <p className="min-h-[40rem] text-copy-14">Scroll down to reveal the return control.</p>
      </div>
      {target ? (
        <BackToTop target={target} focusTarget={heading.current} threshold={120}>
          Back to top
        </BackToTop>
      ) : null}
    </div>
  );
}
