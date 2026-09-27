import * as React from "react";

import { cn } from "@/lib/utils";

import styles from "./book.module.css";

type ResponsiveBookWidth = {
  sm: number;
  xs?: number;
  smd?: number;
  md?: number;
  lg?: number;
};

type BookWidth = number | ResponsiveBookWidth;

type BookProps = Omit<React.ComponentPropsWithoutRef<"div">, "color" | "title"> & {
  title: string;
  variant?: "simple" | "stripe";
  width?: BookWidth;
  color?: string;
  textColor?: string;
  icon?: React.ReactNode;
  illustration?: React.ReactNode;
  textured?: boolean;
};

type BookWidthProperties = React.CSSProperties & {
  "--book-width"?: number;
  "--xs-book-width"?: number;
  "--sm-book-width"?: number;
  "--smd-book-width"?: number;
  "--md-book-width"?: number;
  "--lg-book-width"?: number;
};

type BookColorProperties = React.CSSProperties & {
  "--book-color"?: string;
  "--book-text-color"?: string;
};

const DEFAULT_STRIPE_COLOR = "#f5b047";

/**
 * 默认封面标志：Unitary 品牌符号，路径与 brand/unitary-mark.svg 保持一致
 * （字形位于 1024 画布内的 128 偏移框，保留品牌留白比例）。
 */
function UnitaryMark() {
  return (
    <svg aria-hidden="true" data-slot="unitary-icon" height="16" viewBox="0 0 1024 1024" width="16">
      <g transform="translate(128 128)">
        <path
          d="M704.13 473.10L704.13 294.90L63.87 0L63.87 216.05L443.93 384.79L63.87 551.95L63.87 768Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

function DefaultBookIllustration() {
  return (
    <svg aria-hidden="true" fill="none" height="56" viewBox="0 0 36 56" width="36">
      <path
        clipRule="evenodd"
        d="M3.031 28C6.26 23.176 11.759 20 18 20s11.74 3.176 14.969 8C29.74 32.824 24.241 36 18 36S6.26 32.824 3.031 28Z"
        fill="#0070F3"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M32.969 28A17.917 17.917 0 0 0 36 18C36 8.059 27.941 0 18 0S0 8.059 0 18c0 3.7 1.116 7.14 3.031 10C6.26 23.176 11.759 20 18 20s11.74 3.176 14.969 8Z"
        fill="#45DEC4"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M32.969 28C29.74 32.824 24.241 36 18 36S6.26 32.824 3.031 28A17.917 17.917 0 0 0 0 38c0 9.941 8.059 18 18 18s18-8.059 18-18c0-3.7-1.116-7.14-3.031-10Z"
        fill="#E5484D"
        fillRule="evenodd"
      />
    </svg>
  );
}

function getWidthProperties(width: BookWidth): BookWidthProperties {
  if (typeof width === "number") {
    return { "--book-width": width };
  }

  return {
    "--xs-book-width": width.xs,
    "--sm-book-width": width.sm,
    "--smd-book-width": width.smd,
    "--md-book-width": width.md,
    "--lg-book-width": width.lg,
  };
}

const Book = React.forwardRef<HTMLDivElement, BookProps>(
  (
    {
      title,
      variant = "stripe",
      width = 196,
      color,
      textColor,
      icon,
      illustration,
      textured = false,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const resolvedColor = color ?? (variant === "stripe" ? DEFAULT_STRIPE_COLOR : undefined);
    const hasColor = resolvedColor !== undefined;
    const colorProperties: BookColorProperties = {
      "--book-color": resolvedColor,
      "--book-text-color": textColor,
    };

    return (
      <div
        ref={ref}
        className={cn(styles.perspective, className)}
        data-slot="book"
        data-textured={textured || undefined}
        data-variant={variant}
        style={{ ...getWidthProperties(width), ...style }}
        {...props}
      >
        <div
          className={cn(
            styles.rotateWrapper,
            styles[variant],
            hasColor && styles.color,
            textured && styles.textured,
          )}
          data-slot="book-rotate"
          style={colorProperties}
        >
          <div className={styles.book} data-slot="book-cover">
            {variant === "stripe" ? (
              <div aria-hidden="true" className={styles.stripeBlock} data-slot="book-stripe">
                <div className={styles.illustration} data-slot="book-illustration">
                  {illustration}
                </div>
                <div className={styles.bind} data-slot="book-bind" />
              </div>
            ) : null}

            <div className={styles.body} data-slot="book-body">
              <div aria-hidden="true" className={styles.bind} data-slot="book-bind" />
              <div className={styles.content} data-slot="book-content">
                <span className={cn("text-heading-14", styles.title)} data-slot="book-title">
                  {title}
                </span>
                {variant === "simple" ? (
                  <div className={styles.illustration} data-slot="book-illustration">
                    {illustration ?? <DefaultBookIllustration />}
                  </div>
                ) : (
                  (icon ?? <UnitaryMark />)
                )}
              </div>
            </div>

            {textured ? (
              <div aria-hidden="true" className={styles.texture} data-slot="book-texture" />
            ) : null}
          </div>
          <div aria-hidden="true" className={styles.pages} data-slot="book-pages" />
          <div aria-hidden="true" className={styles.back} data-slot="book-back" />
        </div>
      </div>
    );
  },
);
Book.displayName = "Book";

export { Book };
export type { BookProps, BookWidth, ResponsiveBookWidth };
