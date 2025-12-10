import { RiUploadCloud2Line, RiUser3Line } from "@remixicon/react";

const ImageUploader = ({ label, image, name, onChange, isRound = false }) => (
  <div className="flex flex-col gap-3">
    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
      {label}
    </span>
    <div className="flex items-center gap-4">
      <div
        className={`shrink-0 w-20 h-20 border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 overflow-hidden flex items-center justify-center ${
          isRound ? "rounded-full" : "rounded-xl"
        }`}
      >
        {image ? (
          <img
            src={image}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <RiUser3Line className="text-neutral-400" size={32} />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
          <RiUploadCloud2Line size={18} />
          <span>Upload New</span>
          <input
            type="file"
            name={name}
            accept="image/*"
            onChange={onChange}
            className="hidden"
          />
        </label>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Recommended: 400x400px, JPG or PNG.
        </p>
      </div>
    </div>
  </div>
);

export default ImageUploader;
