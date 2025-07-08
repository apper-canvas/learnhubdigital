import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "medium", 
  disabled = false,
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-primary text-white hover:shadow-lg hover:scale-105 focus:ring-primary-500",
    secondary: "bg-white text-primary-600 border-2 border-primary-200 hover:border-primary-300 hover:shadow-md hover:scale-105 focus:ring-primary-500",
    accent: "bg-gradient-accent text-white hover:shadow-lg hover:scale-105 focus:ring-accent-500",
    outline: "border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-md hover:scale-105 focus:ring-gray-500",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500",
    danger: "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:scale-105 focus:ring-red-500"
  };

  const sizes = {
    small: "px-3 py-1.5 text-sm rounded-lg",
    medium: "px-4 py-2 text-sm rounded-lg",
    large: "px-6 py-3 text-base rounded-xl"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;