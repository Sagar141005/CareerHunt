import React from "react";
import { RiStarFill } from "@remixicon/react";

const Review = ({ rating, text, name, role, image }) => {
  return (
    <div className="bg-white dark:bg-gray-800 lg:h-60 h-48 lg:w-2xl w-md rounded-xl flex flex-col justify-between px-4 transition-colors duration-300">
      {/* Stars */}
      <div className="flex items-center lg:mt-8 mt-4 text-amber-300">
        {[
          ...Array.from({ length: rating }, (_, idx) => (
            <RiStarFill
              key={idx}
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
            />
          )),
        ]}
      </div>

      {/* Review Text */}
      <p className="lg:text-base text-sm text-gray-700 dark:text-gray-300">
        {text}
      </p>

      {/* Reviewer Info */}
      <div className="flex items-center gap-3 mb-4">
        <img
          className="h-10 w-10 rounded-full size-fit border border-gray-200 dark:border-gray-600"
          src={image}
          alt={name}
          loading="lazy"
        />
        <div>
          <h3 className="text-[#1A1C1F] dark:text-gray-100 font-bold lg:text-lg text-md">
            {name}
          </h3>
          <h3 className="text-[#1A1C1F] dark:text-gray-400 font-light lg:text-md text-sm">
            {role}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Review;
