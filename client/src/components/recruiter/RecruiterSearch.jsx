import {
  RiArrowRightLine,
  RiCloseLine,
  RiSearchLine,
  RiBriefcaseLine,
  RiUser3Line,
  RiLoader4Line,
} from "@remixicon/react";
import React, { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";

const RecruiterSearch = () => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [loader, setLoader] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    if (!input.trim()) {
      setResults([]);
      setSearched(false);
      setLoader(false);
      setShowResults(false);
      return;
    }

    if (typingTimeout) clearTimeout(typingTimeout);
    setSearched(true);
    setLoader(true);
    setShowResults(true);

    const timeout = setTimeout(async () => {
      try {
        const response = await api.get(`/job-posts/search?q=${input}`);
        setResults([
          ...(response.data.result.jobPosts || []),
          ...(response.data.result.applicants || []),
        ]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoader(false);
      }
    }, 400);

    setTypingTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [input]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const jobResults = results.filter((item) => "title" in item);
  const applicantResults = results.filter((item) => !("title" in item));

  return (
    <div
      className="w-full max-w-3xl mx-auto mb-8 relative z-50"
      ref={searchRef}
    >
      <div
        className={`flex items-center gap-3 px-4 h-14 bg-white dark:bg-neutral-900 border transition-all duration-200 ${
          showResults && input
            ? "rounded-t-2xl border-neutral-200 dark:border-neutral-800 border-b-transparent"
            : "rounded-2xl border-neutral-200 dark:border-neutral-800"
        } focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/10 shadow-sm`}
      >
        <RiSearchLine
          className={`shrink-0 transition-colors ${
            input ? "text-blue-600" : "text-neutral-400"
          }`}
          size={20}
        />
        <input
          value={input}
          onFocus={() => {
            if (input.trim()) setShowResults(true);
          }}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow h-full bg-transparent text-sm font-medium text-neutral-900 dark:text-white placeholder-neutral-400 outline-none"
          type="text"
          placeholder="Search candidates, jobs, or keywords..."
        />

        {loader ? (
          <RiLoader4Line className="animate-spin text-neutral-400" size={20} />
        ) : input ? (
          <button
            onClick={() => {
              setInput("");
              setShowResults(false);
            }}
            className="p-1 rounded-full text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-600 transition-colors"
          >
            <RiCloseLine size={20} />
          </button>
        ) : null}
      </div>
      {showResults && input && (
        <div className="absolute top-14 left-0 right-0 bg-white dark:bg-neutral-900 border border-t-0 border-neutral-200 dark:border-neutral-800 rounded-b-2xl shadow-xl overflow-hidden max-h-[60vh] overflow-y-auto custom-scrollbar z-50">
          {loader && results.length === 0 && (
            <div className="p-4 text-center text-sm text-neutral-400">
              Searching...
            </div>
          )}

          {!loader && results.length === 0 && searched && (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <div className="w-12 h-12 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-3 text-neutral-400">
                <RiSearchLine size={24} />
              </div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                No results found
              </p>
              <p className="text-xs text-neutral-500">
                We couldn't find any jobs or candidates matching "{input}"
              </p>
            </div>
          )}

          {!loader && results.length > 0 && (
            <div className="pb-2">
              {jobResults.length > 0 && (
                <div>
                  <h4 className="sticky top-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm px-4 py-2 text-xs font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800">
                    Job Posts
                  </h4>
                  <div className="py-1">
                    {jobResults.map((item, index) => (
                      <Link
                        to={`/applications/applicants/${item._id}`}
                        key={`job-${index}`}
                        onClick={() => setShowResults(false)}
                        className="group flex items-center justify-between px-4 py-3 mx-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <RiBriefcaseLine size={16} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                              {item.company || "Your Company"}
                            </p>
                          </div>
                        </div>
                        <RiArrowRightLine
                          size={16}
                          className="text-neutral-300 dark:text-neutral-600 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {applicantResults.length > 0 && (
                <div
                  className={
                    jobResults.length > 0
                      ? "border-t border-neutral-100 dark:border-neutral-800 mt-1"
                      : ""
                  }
                >
                  <h4 className="sticky top-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm px-4 py-2 text-xs font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800">
                    Candidates
                  </h4>
                  <div className="py-1">
                    {applicantResults.map((item, index) => (
                      <Link
                        to={`/applications/applicant/${item._id}`}
                        key={`applicant-${index}`}
                        onClick={() => setShowResults(false)}
                        className="group flex items-center justify-between px-4 py-3 mx-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="relative w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 overflow-hidden border border-neutral-200 dark:border-neutral-700">
                            {item.userId?.profilePic ? (
                              <img
                                src={item.userId.profilePic}
                                alt={item.userId.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <RiUser3Line
                                size={16}
                                className="text-neutral-400"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                              {item.userId?.name || "Unknown Candidate"}
                            </h4>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                              Applied •{" "}
                              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </p>
                          </div>
                        </div>
                        <RiArrowRightLine
                          size={16}
                          className="text-neutral-300 dark:text-neutral-600 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecruiterSearch;
