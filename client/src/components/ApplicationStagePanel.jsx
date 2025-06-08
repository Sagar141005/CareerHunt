import React, { useState } from 'react';

const ApplicationStagePanel = ({ title, jobs = [], children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="border rounded-lg shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3 flex justify-between items-center bg-gray-100 hover:bg-gray-200"
      >
        <span className="font-medium capitalize text-gray-800">{title} ({jobs.length})</span>
        <span>{open ? '▲' : '▼'}</span>
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
