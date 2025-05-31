import { RiArrowRightSLine, RiCloseLine } from '@remixicon/react';
import React, { useEffect, useRef, useState } from 'react'
import api from '../api/axios';
import { SyncLoader } from 'react-spinners';

const RecruiterSearch = () => {
    const [ input, setInput ] = useState("");
    const [ results, setResults ] = useState([]);
    const [ typingTimeout, setTypingTimeout ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ searched, setSearched ] = useState(false);
    const [ showResults, setShowResults ] = useState(false);

    const searchRef = useRef(null);

    useEffect(() => {
        if(!input.trim()) {
            setResults([]);
            setSearched(false);
            setLoading(false);
            return;
        }

        if(typingTimeout) clearTimeout(typingTimeout);
        setSearched(true);
        setLoading(true);

        const timeout = setTimeout( async() => {
            try {
                const response = await api.get(`/job-posts/search?q=${input}`);
                setResults([
                    ...(response.data.jobPosts || []),
                    ...(response.data.applicants || [])
                ]);
            } catch (error) {
                console.error(error.response?.data || error.message);
            } finally {
                setShowResults(true);
                setLoading(false);
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
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);

    const jobResults = results.filter(item => 'title' in item);
    const applicantResults = results.filter(item => !('title' in item));


  return (
    <div className='flex flex-col items-center gap-2 mb-6'>
            <div ref={searchRef} className='relative w-4xl'>
                <div className='flex items-center bg-white w-full h-12 p-3 rounded-xl'>
                    <input 
                    value={input}
                    onFocus={() => {
                        if (input.trim() && results.length > 0) {
                            setShowResults(true);
                        }
                    }}
                    onChange={(e) => setInput(e.target.value)}
                    className='bg-white w-full h-full p-3 rounded-xl outline-none' 
                    type="text" 
                    placeholder='Search for talent or jobs' />
                    {input ? <RiCloseLine onClick={() => setInput("")} /> : ""}
                </div>
                {input && showResults && (
                <div className='absolute top-full mt-2 w-full bg-white shadow-lg rounded-xl z-50 max-h-72 overflow-y-auto border border-gray-200'>
                    {loading ? (
                       <div className="flex justify-center items-center py-6">
                       <SyncLoader color="#63b3ed" loading={loading} size={12} />
                     </div>
                    ) : results.length === 0 && searched ? (
                        <div className='px-6 py-4 text-center text-sm text-gray-500'>No results found</div>
                    ) : (
                        <>
                        {jobResults.length > 0 && (
                            <>
                            <h4 className='text-xs text-gray-500 px-6 pt-4'>Jobs</h4>
                            {jobResults.map((item, index) => (
                                 <div
                                 key={`job-${index}`}
                                 className='px-8 py-3 rounded-xl hover:bg-neutral-200 cursor-pointer flex items-center justify-between group'>
                                     <h4 className='text-gray-800 font-medium'>{item.title}</h4>
                                     <RiArrowRightSLine
                                     className='group-hover:bg-blue-400 group-hover:text-white rounded-full bg-transparent text-blue-500' 
                                     size={22}/>
                                 </div>
                            ))}
                            </>
                        )}

                        {applicantResults.length > 0 && (
                            <>
                            <h4 className='text-xs text-gray-500 px-6 pt-4'>Applicants</h4>
                            {applicantResults.map((item, index) => (
                                 <div
                                 key={`applicant-${index}`}
                                 className='px-8 py-3 rounded-xl hover:bg-neutral-200 cursor-pointer flex items-center justify-between group'>
                                     <h4 className='text-gray-800 font-medium'>{item.userId?.name}</h4>
                                     <RiArrowRightSLine
                                     className='group-hover:bg-blue-400 group-hover:text-white rounded-full bg-transparent text-blue-500' 
                                     size={22}/>
                                 </div>
                            ))}
                            </>
                        )}
                    </>
                    )}
                </div>
                )}
            </div>
        </div>
  )
}

export default RecruiterSearch
