import { RiArrowDownSLine, RiArrowUpSLine } from '@remixicon/react';
import React, { useState } from 'react';

const ApplicationStagePanel = ({ title, jobs = [], children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="w-full rounded-lg shadow-lg dark:border-[#2e2e2e] dark:shadow-none overflow-hidden">
      {/* Toggle Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3 flex justify-between items-center bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222222] transition-colors duration-200 cursor-pointer">
        <span className="font-medium capitalize text-gray-800 dark:text-gray-100 flex items-center gap-2">
          {title}
          <span className="bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-sm font-semibold h-7 w-7 flex items-center justify-center rounded-full">
            {jobs.length}
          </span>
        </span>
        <span className='text-gray-700 dark:text-gray-300 text-lg sm:text-xl'>
          {open ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
        </span>
      </button>

      {/* Panel Content */}
      {open && (
        <div className="w-full sm:p-6 bg-gray-50 dark:bg-[#121212]">
          <div className="flex flex-wrap sm:justify-center py-4 gap-4 w-full overflow-x-hidden">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationStagePanel;
