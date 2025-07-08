import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import Label from "@/components/atoms/Label";

const FilterSelect = forwardRef(({ 
  className,
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <select
        ref={ref}
        value={value}
        onChange={onChange}
        className={cn(
          "flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all duration-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});

FilterSelect.displayName = "FilterSelect";

export default FilterSelect;