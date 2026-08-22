import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface FooterLink {
  label: string;
  href: string;
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
  sticky = false,
  className,
}: FooterProps) {
  return (
    <footer
      data-slot="footer"
      className={cn(sticky && "sticky bottom-0", className)}
    >
      <div className="border-t border-gray-alpha-400 py-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {slotLeading ? (
            <div data-slot="footer-leading">{slotLeading}</div>
          ) : null}
          {columns && columns.length > 0 ? (
            <div
              data-slot="footer-columns"
              className="grid grid-cols-2 gap-8 sm:grid-cols-3"
            >
              {columns.map((column) => (
                <div key={column.title} data-slot="footer-column">
                  <div className="text-copy-13 pb-3 font-medium text-gray-1000">
                    {column.title}
                  </div>
                  <ul className="flex flex-col gap-2">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          className="text-copy-13 text-gray-900 hover:text-gray-1000"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}
          {slotTrailing ? (
            <div data-slot="footer-trailing">{slotTrailing}</div>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
