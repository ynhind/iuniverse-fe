import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const Accordion = ({
  children,
  type = "single",
  defaultValue = [],
  className,
  ...props
}) => {
  const initialOpen = Array.isArray(defaultValue)
    ? defaultValue.reduce((acc, val) => ({ ...acc, [val]: true }), {})
    : {};
  const [openItems, setOpenItems] = useState(initialOpen);

  const toggleItem = (value) => {
    if (type === "single") {
      setOpenItems(
        Object.keys(openItems).length > 0 && openItems[value]
          ? {}
          : { [value]: true },
      );
    } else {
      setOpenItems((prev) => ({
        ...prev,
        [value]: !prev[value],
      }));
    }
  };

  return (
    <div className={cn("w-full space-y-4", className)} {...props}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { openItems, toggleItem }),
      )}
    </div>
  );
};

const AccordionItem = ({
  value,
  children,
  openItems,
  toggleItem,
  className,
}) => (
  <div
    className={cn(
      "glass border-none shadow-md shadow-slate-200/30 rounded-2xl px-2 overflow-hidden transition-all",
      openItems?.[value] && "shadow-lg",
      className,
    )}
  >
    {React.Children.map(children, (child) =>
      React.cloneElement(child, {
        value,
        isOpen: openItems?.[value],
        toggleItem,
      }),
    )}
  </div>
);

const AccordionTrigger = ({
  value,
  isOpen,
  toggleItem,
  children,
  className,
}) => (
  <button
    onClick={() => toggleItem(value)}
    className={cn(
      "flex w-full items-center justify-between p-6 text-left font-medium hover:no-underline [&[data-state=open]>svg]:rotate-180",
      "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className,
    )}
    data-state={isOpen ? "open" : "closed"}
  >
    <span className="flex items-center gap-3 flex-1">{children}</span>
    <ChevronDown
      className={cn(
        "h-4 w-4 shrink-0 transition-transform duration-200",
        isOpen ? "rotate-180" : "",
      )}
    />
  </button>
);

const AccordionContent = ({ isOpen, children, className }) =>
  isOpen ? (
    <div className={cn("px-6 pb-6 pt-0", className)}>{children}</div>
  ) : null;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
