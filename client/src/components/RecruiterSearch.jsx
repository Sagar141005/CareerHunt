import { RiArrowRightSLine, RiCloseLine, RiSearchLine } from '@remixicon/react';
import React, { useEffect, useRef, useState } from 'react';
import api from '../api/axios';
import { SyncLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const RecruiterSearch = () => {
  const [input, setInput] = useState('');
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
      return;
    }

    if (typingTimeout) clearTimeout(typingTimeout);
    setSearched(true);
    setLoader(true);

    const timeout = setTimeout(async () => {
      try {
        const response = await api.get(`/job-posts/search?q=${input}`);
        setResults([
          ...(response.data.result.jobPosts || []),
          ...(response.data.result.applicants || []),
        ]);
      } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Failed to search';
        toast.error(msg);
      } finally {
        setShowResults(true);
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const jobResults = results.filter((item) => 'title' in item);
  const applicantResults = results.filter((item) => !('title' in item));

  return (
    <div className="flex flex-col items-center gap-2 mb-6 w-full max-w-4xl mx-auto">
      <div
        ref={searchRef}
        className="relative w-full">
        <div className="flex items-center bg-white dark:bg-gray-800 w-full h-14 rounded-xl px-4 shadow-md border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-400 transition">
          <RiSearchLine className="text-gray-400 dark:text-gray-400 mr-3" size={22} />
          <input
            value={input}
            onFocus={() => {
              if (input.trim() && results.length > 0) {
                setShowResults(true);
              }
            }}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow h-full text-gray-800 dark:text-gray-100 text-base placeholder-gray-400 dark:placeholder-gray-500 outline-none bg-transparent"
            type="text"
            placeholder="Search for talent or jobs" />
          {input && (
            <button
              onClick={() => setInput('')}
              aria-label="Clear search"
              className="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition p-1 rounded-full focus:outline-none cursor-pointer">
              <RiCloseLine size={22} />
            </button>
          )}
        </div>

        {input && showResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto border border-gray-200 dark:border-gray-700 animate-fadeIn duration-200">
            {loader ? (
              <div className="flex justify-center items-center py-6">
                <SyncLoader color="#3B82F6" size={12} />
              </div>
            ) : results.length === 0 && searched ? (
              <div className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No results found
              </div>
            ) : (
              <>
                {jobResults.length > 0 && (
                  <>
                    <h4 className="text-xs text-gray-500 dark:text-gray-400 px-6 pt-4 pb-2 border-b border-gray-100 dark:border-gray-700">
                      Jobs
                    </h4>
                    {jobResults.map((item, index) => (
                      <Link
                        to={`/applications/applicants/${item._id}`}
                        state={{ title: item.title }}
                        key={`job-${index}`}
                        className="group flex items-center justify-between px-6 py-3 hover:bg-blue-50 dark:hover:bg-blue-900 cursor-pointer transition-colors rounded-xl"
                        onClick={() => setShowResults(false)}>
                        <h4 className="text-gray-900 dark:text-gray-100 font-medium truncate">{item.title}</h4>
                        <RiArrowRightSLine
                          className="text-blue-600 dark:text-blue-400 group-hover:bg-blue-400 group-hover:text-white rounded-full bg-transparent"
                          size={22} />
                      </Link>
                    ))}
                  </>
                )}

                {applicantResults.length > 0 && (
                  <>
                    <h4 className="text-xs text-gray-500 dark:text-gray-400 px-6 pt-4 pb-2 border-t border-gray-100 dark:border-gray-700">
                      Applicants
                    </h4>
                    {applicantResults.map((item, index) => (
                      <Link
                        to={`/applications/applicant/${item._id}`}
                        key={`applicant-${index}`}
                        className="group flex items-center justify-between px-6 py-3 hover:bg-blue-50 dark:hover:bg-blue-900 cursor-pointer transition-colors rounded-xl"
                        onClick={() => setShowResults(false)}>
                        <h4 className="text-gray-900 dark:text-gray-100 font-medium truncate">{item.userId?.name}</h4>
                        <RiArrowRightSLine
                          className="text-blue-600 dark:text-blue-400 group-hover:bg-blue-400 group-hover:text-white rounded-full bg-transparent"
                          size={22} />
                      </Link>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterSearch;
