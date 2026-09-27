import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function DocsPageTitle({
  className,
  style: _style,
  ...props
}: ComponentProps<"h1">): ReactNode {
  return <h1 {...props} data-slot="docs-prose-title" className={cn("docs-prose-title", className)} />;
}

export function DocsPageLead({
  className,
  style: _style,
  ...props
}: ComponentProps<"p">): ReactNode {
  return <p {...props} data-slot="docs-prose-lead" className={cn("docs-prose-lead", className)} />;
}

export function DocsSection({
  className,
  style: _style,
  ...props
}: ComponentProps<"section">): ReactNode {
  return (
    <section {...props} data-slot="docs-prose-section" className={cn("docs-prose-section", className)} />
  );
}

export function DocsSectionTitle({
  className,
  style: _style,
  ...props
}: ComponentProps<"h2">): ReactNode {
  return <h2 {...props} data-slot="docs-prose-heading" className={cn("docs-prose-heading", className)} />;
}

export function DocsBlock({
  className,
  style: _style,
  ...props
}: ComponentProps<"div">): ReactNode {
  return <div {...props} data-slot="docs-prose-block" className={cn("docs-prose-block", className)} />;
}

export function DocsParagraph({
  className,
  style: _style,
  ...props
}: ComponentProps<"p">): ReactNode {
  return <p {...props} data-slot="docs-prose-paragraph" className={cn("docs-prose-paragraph", className)} />;
}

export function DocsList({
  className,
  style: _style,
  ...props
}: ComponentProps<"ul">): ReactNode {
  return <ul {...props} data-slot="docs-prose-list" className={cn("docs-prose-list", className)} />;
}
