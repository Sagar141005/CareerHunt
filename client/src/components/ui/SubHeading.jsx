import React from "react";

export default function Paragraph({
  children,
  className = "",
  size = "base",
  ...props
}) {
  const sizes = {
    base: "text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed mb-6",
    hero: "text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed mb-10",
  };

  return (
    <p className={`${sizes[size]} ${className}`} {...props}>
      {children}
    </p>
  );
}
