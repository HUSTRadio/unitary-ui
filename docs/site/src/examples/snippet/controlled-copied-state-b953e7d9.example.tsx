"use client";

import { useCallback, useRef, useState } from "react";
import { Snippet } from "@hustradio/unitary-ui";
import type { JSX } from "react";

const COPY_TEXT = `# About
Unitary UI — a React component library built on the Vercel Geist design language

# Requirements
Install the package, import the stylesheet, and keep components on the semantic token layer so light and dark themes stay consistent across the library.`;

export function SnippetControlledCopiedStateB953E7D9Example(): JSX.Element {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleCopy = useCallback(() => {
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1000);
  }, []);

  return (
    <Snippet
      copied={copied}
      copyText={COPY_TEXT}
      onCopy={handleCopy}
      text="Copy install prompt"
      prompt={false}
      width="300px"
    />
  );
}
