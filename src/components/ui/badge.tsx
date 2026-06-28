import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "success" | "warning" | "destructive" | "outline" }>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors",
        variant === "default" && "border-transparent bg-primary text-primary-foreground",
        variant === "success" && "border-transparent bg-success/15 text-success",
        variant === "warning" && "border-transparent bg-warning/15 text-warning",
        variant === "destructive" && "border-transparent bg-destructive/15 text-destructive",
        variant === "outline" && "text-foreground",
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";

export { Badge };
