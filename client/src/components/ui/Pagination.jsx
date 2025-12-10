import React from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-2 p-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white
                     hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg 
                     disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <RiArrowLeftSLine size={20} />
        </button>

        <span className="text-sm font-medium px-4 text-neutral-700 dark:text-neutral-300">
          Page{" "}
          <span className="font-bold text-neutral-900 dark:text-white">
            {currentPage}
          </span>{" "}
          of {totalPages}
        </span>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white
                     hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg 
                     disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <RiArrowRightSLine size={20} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
