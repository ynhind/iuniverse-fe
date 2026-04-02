import React, { useState } from "react";
import { cn } from "@/lib/utils";

const Tabs = ({ defaultValue, onValueChange, className, children }) => {
  const [value, setValue] = useState(defaultValue);

  const handleValueChange = (newValue) => {
    setValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div className={className}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { value, onValueChange: handleValueChange }),
      )}
    </div>
  );
};

const TabsList = ({ className, children, ...props }) => (
  <div
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-xl glass p-1",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

const TabsTrigger = ({
  value: triggerValue,
  children,
  value: activeValue,
  onValueChange,
  className,
  ...props
}) => (
  <button
    onClick={() => onValueChange?.(triggerValue)}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      activeValue === triggerValue
        ? "bg-white shadow-sm text-primary"
        : "text-muted-foreground hover:text-foreground",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

const TabsContent = ({
  value: contentValue,
  children,
  value: activeValue,
  className,
  ...props
}) =>
  activeValue === contentValue ? (
    <div
      className={cn(
        "mt-2 animate-in fade-in slide-in-from-bottom-2 duration-500",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ) : null;

export { Tabs, TabsList, TabsTrigger, TabsContent };
