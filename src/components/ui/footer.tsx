import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { useMediaMatch } from "@/lib/use-page-scroll";
import { Collapse, CollapseContent, CollapseTrigger } from "./collapse";

export interface FooterLink {
  label: string;
  href: string;
  target?: string;
  rel?: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  /** Optional link columns. */
  columns?: FooterColumn[];
  /** Content rendered before (left of) the columns. */
  slotLeading?: ReactNode;
  /** Content rendered after (right of) the columns. */
  slotTrailing?: ReactNode;
  slotBottom?: ReactNode;
  columnsClassName?: string;
  collapseOnMobile?: boolean;
  /** Pin the footer to the bottom of the viewport. @default false */
  sticky?: boolean;
  className?: string;
}

/**
 * Generic footer. Container carries the visual contract: top border in
 * gray-alpha-400, py-8 vertical rhythm, text-copy-13 muted link text.
 * `sticky` pins the footer to the viewport bottom (sticky bottom-0).
 */
export function Footer({
  columns,
  slotLeading,
  slotTrailing,
  slotBottom,
  columnsClassName,
  collapseOnMobile = false,
  sticky = false,
  className,
}: FooterProps) {
  const desktop = useMediaMatch("(min-width: 768px)");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const links = (column: FooterColumn) => (
    <ul className="flex flex-col gap-2">
      {column.links.map((link) => (
        <li key={link.href + link.label}>
          <a
            href={link.href}
            target={link.target}
            rel={link.rel ?? (link.target === "_blank" ? "noopener noreferrer" : undefined)}
            className={cn(
              "text-copy-13 text-gray-900 hover:text-gray-1000 focus-ring",
              collapseOnMobile && "max-md:inline-flex max-md:min-h-11 max-md:items-center",
            )}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
  return (
    <footer data-slot="footer" className={cn(sticky && "sticky bottom-0", className)}>
      <div className="border-t border-gray-alpha-400 py-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {slotLeading ? <div data-slot="footer-leading">{slotLeading}</div> : null}
          {columns && columns.length > 0 ? (
            <div
              data-slot="footer-columns"
              className={cn(
                "grid grid-cols-2 gap-8 sm:grid-cols-3",
                collapseOnMobile && "max-md:grid-cols-1 max-md:w-full",
                columnsClassName,
              )}
            >
              {columns.map((column) => (
                <div key={column.title} data-slot="footer-column">
                  {collapseOnMobile ? (
                    <Collapse
                      size="bare"
                      open={desktop || !!expanded[column.title]}
                      onOpenChange={(open) =>
                        setExpanded((current) => ({ ...current, [column.title]: open }))
                      }
                    >
                      <h3 className="hidden pb-3 text-copy-13 font-medium text-gray-1000 md:block">
                        {column.title}
                      </h3>
                      <CollapseTrigger className="min-h-11 text-copy-13 md:hidden">
                        {column.title}
                      </CollapseTrigger>
                      <CollapseContent>{links(column)}</CollapseContent>
                    </Collapse>
                  ) : (
                    <>
                      <div className="text-copy-13 pb-3 font-medium text-gray-1000">
                        {column.title}
                      </div>
                      {links(column)}
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : null}
          {slotTrailing ? <div data-slot="footer-trailing">{slotTrailing}</div> : null}
        </div>
        {slotBottom ? (
          <div data-slot="footer-bottom" className="mt-8 border-t border-gray-alpha-400 pt-6">
            {slotBottom}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
