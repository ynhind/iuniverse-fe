import React, { useState } from "react";
import { cn } from "@/lib/utils";

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block ">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { isOpen, setIsOpen }),
      )}
    </div>
  );
};

const DropdownMenuTrigger = ({
  children,
  isOpen,
  setIsOpen,
  asChild,
  ...props
}) => {
  if (asChild) {
    return React.cloneElement(children, {
      onClick: () => setIsOpen(!isOpen),
      ...props,
    });
  }
  return (
    <button onClick={() => setIsOpen(!isOpen)} {...props}>
      {children}
    </button>
  );
};

const DropdownMenuContent = ({
  children,
  className,
  isOpen,
  setIsOpen,
  align = "start",
  ...props
}) => {
  return isOpen ? (
    <div
      className={cn(
        "absolute top-full mt-2 min-w-[200px] rounded-2xl bg-white border border-slate-200/50 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200",
        align === "end" ? "right-0" : "left-0",
        className,
      )}
      onClick={() => setIsOpen(false)}
      {...props}
    >
      {children}
    </div>
  ) : null;
};

const DropdownMenuLabel = ({ children, className, ...props }) => (
  <div
    className={cn(
      "text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

const DropdownMenuItem = ({ children, className, onClick, ...props }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-slate-100 focus:bg-slate-100 focus:outline-none flex items-center gap-2",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

const DropdownMenuSeparator = ({ className, ...props }) => (
  <div className={cn("my-1 -mx-1 h-px bg-slate-100 ", className)} {...props} />
);

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
};
