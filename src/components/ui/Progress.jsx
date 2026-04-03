import React from "react";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef(({ className, value = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-muted",
      className,
    )}
    {...props}
  >
    <div
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ width: `${value}%` }}
    />
  </div>
));

Progress.displayName = "Progress";

export { Progress };
