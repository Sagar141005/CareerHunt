import React from "react";
import { MoonLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-neutral-950/50 backdrop-blur-sm transition-all">
      <MoonLoader color="#0164FC" size={40} />
    </div>
  );
};

export default Loader;
