const InputField = ({
  label,
  icon: Icon = null,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  half = false,
}) => (
  <div className={`space-y-1.5 ${half ? "col-span-1" : "col-span-2"}`}>
    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
      {label}
    </label>

    <div className={`relative ${Icon ? "group" : ""}`}>
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-blue-600 transition-colors">
          <Icon size={18} />
        </div>
      )}

      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className={`block w-full py-2.5 bg-neutral-50 dark:bg-neutral-800 
            border border-neutral-200 dark:border-neutral-700 rounded-lg 
            text-neutral-900 dark:text-white placeholder-neutral-400 
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 
            focus:border-blue-600 transition-all text-sm
            ${Icon ? "pl-10 pr-3" : "px-3"}`}
      />
    </div>
  </div>
);

export default InputField;
