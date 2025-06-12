import { RiArrowDownSLine, RiArrowUpSLine } from '@remixicon/react';
import React, { useState } from 'react';

const ApplicationStagePanel = ({ title, jobs = [], children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-lg shadow-lg">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3 flex justify-between items-center rounded-lg bg-gray-100 hover:bg-gray-200">
        <span className="font-medium capitalize text-gray-800 flex items-center gap-2">
          {title}
          <span className="bg-blue-200 text-blue-700 text-sm font-semibold h-7 w-7 flex items-center justify-center rounded-full">
            {jobs.length}
          </span>
        </span>
        <span className='text-sm font-light'>{open ? <RiArrowUpSLine /> : <RiArrowDownSLine />}</span>
      </button>

      {open && (
        <div className="p-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default ApplicationStagePanel;
