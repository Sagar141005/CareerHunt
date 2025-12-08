import React from "react";
import { RiLoader4Line, RiQuillPenAiLine } from "@remixicon/react";
const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  onEnhance,
  loading,
}) => (
  <div className="col-span-2 space-y-1.5">
    <div className="flex justify-between items-center">
      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
        {label}
      </label>
      {onEnhance && (
        <button
          onClick={onEnhance}
          disabled={loading}
          className="text-xs flex items-center gap-1.5 text-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50 font-semibold"
        >
          {loading ? (
            <RiLoader4Line className="animate-spin" size={14} />
          ) : (
            <RiQuillPenAiLine size={14} />
          )}
          AI Enhance
        </button>
      )}
    </div>
    <textarea
      name={name}
      rows={5}
      value={value || ""}
      onChange={onChange}
      className="w-full p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm text-neutral-900 dark:text-white placeholder-neutral-400 resize-none leading-relaxed"
      placeholder={placeholder}
    />
  </div>
);

export default TextAreaField;
