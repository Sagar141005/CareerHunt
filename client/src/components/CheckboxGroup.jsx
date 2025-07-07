import React from "react";

const CheckboxGroup = ({ label, options, name, onChange, selected = [] }) => {
  return (
    <div className="flex flex-col gap-1">
      {/* Label: lighter in light mode, softer gray in dark mode */}
      <label className="text-sm text-neutral-600 dark:text-neutral-400">{label}</label>

      {options.map((option) => (
        <label key={option} className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-200">
          <input
            type="checkbox"
            value={option}
            name={name}
            checked={selected.includes(option)}
            onChange={onChange}
            className="accent-black dark:accent-indigo-500" 
          />
          {option}
        </label>
      ))}
    </div>
  );
};

export default CheckboxGroup;
