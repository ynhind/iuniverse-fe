import React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-normal ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

    const variants = {
      default: "bg-primary text-primary-foreground shadow-sm hover:opacity-90",
      outline:
        "border border-input bg-background hover:bg-muted hover:text-muted-foreground",
      ghost: "hover:bg-muted hover:text-foreground",
      secondary: "bg-muted text-foreground hover:bg-muted/80",
    };

    const sizes = {
      default: "h-10 px-6 py-2",
      sm: "h-9 px-4 rounded-lg",
      lg: "h-12 px-8 rounded-2xl",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
