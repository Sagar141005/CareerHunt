import React from "react";
import { Link } from "react-router-dom";

export default function Button({
  children,
  onClick,
  icon: Icon,
  variant = "primary",
  className = "",
  ...props
}) {
  const baseStyles =
    "px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 justify-center hover:scale-[1.02] transition-all group cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700",
    black:
      "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const classes = `${baseStyles} ${variants[variant]} ${className}`;

  const isLinkChild =
    React.isValidElement(children) &&
    (children.type === Link || children.type === "a");

  if (isLinkChild) {
    return (
      <div className={classes} {...props}>
        {React.cloneElement(children, {
          className: "w-full h-full flex items-center justify-center",
        })}
        {Icon && <Icon size={14} className="mb-[1px]" />}
      </div>
    );
  }

  return (
    <button onClick={onClick} className={classes} {...props}>
      {children}
      {Icon && <Icon size={14} className="mb-[1px]" />}
    </button>
  );
}
