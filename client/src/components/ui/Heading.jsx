import React from "react";

export default function Heading({
  children,
  gradientText,
  size = "hero",
  className = "",
  ...props
}) {
  const sizes = {
    hero: "text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6",
    xl: "text-4xl md:text-5xl font-extrabold tracking-tight mb-6",
    lg: "text-3xl font-bold mb-4",
  };

  const color = "text-neutral-900 dark:text-white";

  return (
    <h1 className={`${sizes[size]} ${color} ${className}`} {...props}>
      {gradientText ? (
        <>
          {children.split("::")[0]}
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-transparent bg-clip-text">
            {children.split("::")[1]}
          </span>
        </>
      ) : (
        children
      )}
    </h1>
  );
}
