import React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "gradient-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      destructive: "bg-destructive text-destructive-foreground",
      outline: "border border-input bg-background text-foreground",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
          variants[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";

export { Badge };
