"use client";

import { useCallback, useRef, useState } from "react";
import { ContextCardTrigger } from "@/components/ui/context-card";
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
    void navigator.clipboard.writeText(COPY_TEXT);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1000);
  }, []);

  return (
    <ContextCardTrigger
      content={<div className="text-copy-13-mono w-96 whitespace-pre-line">{COPY_TEXT}</div>}
      side="top"
    >
      {/* <div> since we don't want to wrap a button around a button */}
      <div
        role="button"
        tabIndex={0}
        aria-label="copy content"
        onClick={handleCopy}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCopy();
          }
        }}
        className="cursor-pointer"
      >
        <Snippet copied={copied} text="Copy install prompt" prompt={false} width="300px" />
      </div>
    </ContextCardTrigger>
  );
}
