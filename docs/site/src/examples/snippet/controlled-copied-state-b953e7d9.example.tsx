"use client";

import { useCallback, useRef, useState } from "react";
import { Snippet } from "@/components/ui/snippet";
import type { JSX } from "react";

const COPY_TEXT = `# About
Template for a full-featured Next.js AI chatbot

# Requirements
This template uses the Vercel AI Gateway to access multiple AI models through a unified interface. The default model is OpenAI GPT-4.1 Mini, with support for Anthropic, Google, and xAI models.`;

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
