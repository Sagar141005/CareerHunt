import React from "react";
import { ClipLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-neutral-950 backdrop-blur-sm transition-all">
      <ClipLoader color="#0164FC" size={40} />
    </div>
  );
};

export default Loader;
