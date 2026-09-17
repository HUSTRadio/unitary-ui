import * as React from "react";

import { EditMenu } from "@/components/ui/edit-menu";

const INITIAL_TEXT =
  "Select any words in this sentence to reveal the floating edit capsule above the selection.";

export function EditMenuDefault3F2A9C71Example() {
  const textRef = React.useRef<HTMLParagraphElement>(null);
  const [text, setText] = React.useState(INITIAL_TEXT);
  const [log, setLog] = React.useState<string | null>(null);

  const selectAll = React.useCallback(() => {
    const node = textRef.current;
    if (!node) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, []);

  return (
    <div className="w-full max-w-[420px] space-y-3">
      <EditMenu
        onCut={(selected) => {
          setText((current) => current.replace(selected, "").trim());
          setLog(`Cut ${selected.length} characters.`);
        }}
        onCopy={(selected) => setLog(`Copied ${selected.length} characters.`)}
        onPaste={() => {
          void navigator.clipboard
            .readText()
            .then((value) => setLog(value ? `Pasted: ${value}` : "Clipboard is empty."))
            .catch(() => setLog("Clipboard read is blocked."));
        }}
        onSelectAll={selectAll}
        onLookUp={(selected) => setLog(`Looking up “${selected}”.`)}
        onShare={(selected) => setLog(`Sharing “${selected}”.`)}
      >
        <p ref={textRef} className="text-copy-14 leading-6 text-foreground">
          {text}
        </p>
      </EditMenu>
      <p className="text-copy-13 text-gray-900">
        {log ?? "Long-press or drag to select text, then use the capsule actions."}
      </p>
    </div>
  );
}
