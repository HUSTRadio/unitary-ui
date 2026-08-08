import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-[12px] font-medium leading-6 whitespace-nowrap transition-[color,box-shadow] focus-ring aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "bg-destructive text-destructive-foreground focus-visible:ring-destructive/20 [a&]:hover:bg-destructive/90",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
        // Status semantics — bound to semantic tokens, never raw hex.
        success: "bg-success text-success-foreground [a&]:hover:bg-success/90",
        info: "bg-info text-info-foreground [a&]:hover:bg-info/90",
        progress: "bg-progress text-progress-foreground [a&]:hover:bg-progress/90",
        warning: "bg-warning text-warning-foreground [a&]:hover:bg-warning/90",
        danger: "bg-danger text-danger-foreground [a&]:hover:bg-danger/90",
        urgent: "bg-urgent text-urgent-foreground [a&]:hover:bg-urgent/90",
        // Soft status surfaces for dense / secondary contexts.
        "success-soft": "bg-success-soft text-success [a&]:hover:bg-success-soft/80",
        "info-soft": "bg-info-soft text-info [a&]:hover:bg-info-soft/80",
        "progress-soft": "bg-progress-soft text-progress [a&]:hover:bg-progress-soft/80",
        "warning-soft": "bg-warning-soft text-warning [a&]:hover:bg-warning-soft/80",
        "danger-soft": "bg-danger-soft text-danger [a&]:hover:bg-danger-soft/80",
        "urgent-soft": "bg-urgent-soft text-urgent [a&]:hover:bg-urgent-soft/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
