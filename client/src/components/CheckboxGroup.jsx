import React from "react";

const CheckboxGroup = ({ label, options, name, onChange, selected = [] }) => {
    return (
      <div className='flex flex-col gap-1'>
        <label className='text-sm text-neutral-400'>{label}</label>
        {options.map((option) => (
          <label key={option} className='flex items-center gap-2 text-sm'>
            <input
              type="checkbox"
              value={option}
              name={name}
              checked={selected.includes(option)}
              onChange={onChange}
              className="accent-black" 
            />
            {option}
          </label>
        ))}
      </div>
    );
  };
  
  export default CheckboxGroup;