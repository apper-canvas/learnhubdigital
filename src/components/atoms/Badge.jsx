import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "medium",
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-primary-100 text-primary-700 border-primary-200",
    secondary: "bg-secondary-100 text-secondary-700 border-secondary-200",
    accent: "bg-accent-100 text-accent-700 border-accent-200",
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    error: "bg-red-100 text-red-700 border-red-200",
    gray: "bg-gray-100 text-gray-700 border-gray-200"
  };

  const sizes = {
    small: "px-2 py-0.5 text-xs",
    medium: "px-2.5 py-1 text-sm",
    large: "px-3 py-1.5 text-base"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;