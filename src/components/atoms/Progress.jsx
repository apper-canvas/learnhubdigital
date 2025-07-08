import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Progress = forwardRef(({ 
  className, 
  value = 0, 
  max = 100,
  showText = false,
  size = "medium",
  ...props 
}, ref) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizes = {
    small: "h-2",
    medium: "h-3",
    large: "h-4"
  };

  return (
    <div className="w-full space-y-2">
      {showText && (
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        ref={ref}
        className={cn(
          "w-full bg-gray-200 rounded-full overflow-hidden",
          sizes[size],
          className
        )}
        {...props}
      >
        <div
          className="bg-gradient-primary h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

Progress.displayName = "Progress";

export default Progress;