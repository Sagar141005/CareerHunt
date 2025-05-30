import React, { useEffect, useState } from 'react'
import RecruiterPannel from '../components/RecruiterPannel'
import CurrentDate from '../components/CurrentDate'
import { RiArrowRightSLine, RiCloseLine } from '@remixicon/react'
import api from '../api/axios';
import { SyncLoader } from 'react-spinners'

const Applications = () => {
    const [ input, setInput ] = useState("");
    const [ results, setResults ] = useState([]);
    const [ typingTimeout, setTypingTimeout ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ searched, setSearched ] = useState(false);

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
                setLoading(false);
            }
        }, 400);

        setTypingTimeout(timeout);

        return () => clearTimeout(timeout);
    }, [input]);
    
    const jobResults = results.filter(item => 'title' in item);
    const applicantResults = results.filter(item => !('title' in item));

  return (
    <div className='w-full h-screen bg-[#F2F2F2] flex gap-6 overflow-hidden'>
      <RecruiterPannel />
    <div className='flex-1'>
        <div className='flex items-baseline justify-between'>
          <h2 className='text-xl font-bold py-8'>Applications</h2>
          <CurrentDate />
        </div>
        <div className='flex flex-col items-center gap-2 mb-6'>
            <div className='relative w-4xl'>
                <div className='flex items-center bg-white w-full h-12 p-3 rounded-xl'>
                    <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className='bg-white w-full h-full p-3 rounded-xl outline-none' 
                    type="text" 
                    placeholder='Search for talent or jobs' />
                    {input ? <RiCloseLine onClick={() => setInput("")} /> : ""}
                </div>
                {input && (
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
        

        <div className='flex items-center justify-around  overflow-hidden transition-all ease-in duration-300'>
            <div className='w-4xl h-72 bg-white rounded-xl overflow-y-auto'>
                <div className='px-8 py-3 rounded-xl hover:bg-neutral-200 hover:cursor-pointer flex items-center justify-between group'>
                    <h4 className='text-md font-medium text-gray-800'>iOS Developer</h4>
                    <RiArrowRightSLine className='bg-neutral-100 text-neutral-600 rounded-full group-hover:bg-neutral-300 group-hover:text-black' size={25} />
                </div>
                <div className='px-8 py-3 rounded-xl hover:bg-neutral-200 hover:cursor-pointer flex items-center justify-between group'>
                    <h4 className='text-md font-medium text-gray-800'>Full Stack Developer</h4>
                    <RiArrowRightSLine className='bg-neutral-100 text-neutral-600 rounded-full group-hover:bg-neutral-300 group-hover:text-black' size={25} />
                </div>
                <div className='px-8 py-3 rounded-xl hover:bg-neutral-200 hover:cursor-pointer flex items-center justify-between group'>
                    <h4 className='text-md font-medium text-gray-800'>UI/UX Designer</h4>
                    <RiArrowRightSLine className='bg-neutral-100 text-neutral-600 rounded-full group-hover:bg-neutral-300 group-hover:text-black' size={25} />
                </div>
                <div className='px-8 py-3 rounded-xl hover:bg-neutral-200 hover:cursor-pointer flex items-center justify-between group'>
                    <h4 className='text-md font-medium text-gray-800'>Personal Assistant</h4>
                    <RiArrowRightSLine className='bg-neutral-100 text-neutral-600 rounded-full group-hover:bg-neutral-300 group-hover:text-black' size={25} />
                </div>
                <div className='px-8 py-3 rounded-xl hover:bg-neutral-200 hover:cursor-pointer flex items-center justify-between group'>
                    <h4 className='text-md font-medium text-gray-800'>Data Science Analyst</h4>
                    <RiArrowRightSLine className='bg-neutral-100 text-neutral-600 rounded-full group-hover:bg-neutral-300 group-hover:text-black' size={25} />
                </div>
                <div className='px-8 py-3 rounded-xl hover:bg-neutral-200 hover:cursor-pointer flex items-center justify-between group'>
                    <h4 className='text-md font-medium text-gray-800'>Data Base Expert</h4>
                    <RiArrowRightSLine className='bg-neutral-100 text-neutral-600 rounded-full group-hover:bg-neutral-300 group-hover:text-black' size={25} />
                </div>
            </div>
            </div>        
        </div>
    </div>
  )
}

export default Applications
