import React, { useEffect, useState } from 'react'
import UserNavbar from '../components/UserNavbar'
import api from '../api/axios'
import JobCard from '../components/JobCard';
import { Link } from 'react-router-dom';
import ApplicationStagePanel from '../components/ApplicationStagePanel'

const MyApplications = () => {
  const [ applications, setApplications ] = useState([]);

  useEffect(() => {
      const fetchJobs = async () => {
          try {
              const response = await api.get('/applications/applied/all');
              setApplications(response.data.jobs);
          } catch (error) {
              console.error(error.response?.data || error.message);
          }
      }
  
      fetchJobs();
  }, [])

  const grouped = {
    applied: [],
    shortlisted: [],
    interview: [],
    rejected: [],
    hired: [],
  };

  applications.forEach(app => {
    const statusKey = app.status?.toLowerCase();
    grouped[statusKey]?.push(app);
  });

  const stages = [
    { key: 'applied', label: 'Applied' },
    { key: 'shortlisted', label: 'Shortlisted' },
    { key: 'interview', label: 'Interview' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'hired', label: 'Hired' },
  ];

  const hasApplications = stages.some(({ key }) => grouped[key]?.length > 0);

  return (
    <div className='w-full min-h-screen relative bg-[##F9F9F9] overflow-y-hidden'>
      <UserNavbar />
      <div className='w-full h-full px-12 py-8 flex flex-col gap-6'>
        <div className='flex justify-between items-baseline'>
            <h2 className='text-4xl font-bold'>My Applications</h2>
            <p className='text-sm text-neutral-500'>Sort by: <span className='text-black'>Most recent</span></p>
        </div>
        <div className="space-y-6">
          {!hasApplications ? (
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-gray-500'>
              <p className='mb-6 text-xl'>You haven't applied to any jobs yet.</p>
              <Link to='/jobs' className='px-7 py-5 bg-blue-600 text-white rounded-xl hover:bg-blue-700'>Browse Jobs</Link>
            </div>
          ): (
            stages.map(({ key, label }) =>
            grouped[key]?.length > 0 ? (
              <ApplicationStagePanel key={key} title={label} jobs={grouped[key]}>
                {grouped[key].map(job => (
                  <JobCard job={{...job ,...job.jobPostId}} key={job._id} />
                ))}
              </ApplicationStagePanel>
            ) : null
          )
          )}
        </div>
      </div>
    </div>
  )
}

export default MyApplications

// <div className='px-6 py-2 flex flex-col gap-8'>
// <div className='flex flex-col gap-6'>
//   <h3 className='text-2xl font-semibold text-neutral-600'>✨ Applied</h3>
//   <div className='w-full flex items-center gap-4 flex-wrap'>
//     {jobs.length > 0 ? (
//         jobs.map((job) => <JobCard key={job._id} job={job} />)
//     ) : (
//         <p className="text-lg text-gray-500 mt-8">No jobs available right now. Check back soon!</p>
//     )}
//   </div>
// </div>
// <div className='flex flex-col gap-6'>
//   <h3 className='text-2xl font-semibold text-neutral-600'>✨ Shortlist</h3>
//   <div className='w-full flex items-center gap-4 flex-wrap'>
//     {jobs.length > 0 ? (
//         jobs.map((job) => <JobCard key={job._id} job={job} />)
//     ) : (
//         <p className="text-lg text-gray-500 mt-8">No jobs available right now. Check back soon!</p>
//     )}
//   </div>
// </div>
// <div className='flex flex-col gap-6'>
//   <h3 className='text-2xl font-semibold text-neutral-600'>✨ Interview</h3>
//   <div className='w-full flex items-center gap-4 flex-wrap'>
//     {jobs.length > 0 ? (
//         jobs.map((job) => <JobCard key={job._id} job={job} />)
//     ) : (
//         <p className="text-lg text-gray-500 mt-8">No jobs available right now. Check back soon!</p>
//     )}
//   </div>
// </div>
// <div className='flex flex-col gap-6'>
//   <h3 className='text-2xl font-semibold text-neutral-600'>✨ Rejected</h3>
//   <div className='w-full flex items-center gap-4 flex-wrap'>
//     {jobs.length > 0 ? (
//         jobs.map((job) => <JobCard key={job._id} job={job} />)
//     ) : (
//         <p className="text-lg text-gray-500 mt-8">No jobs available right now. Check back soon!</p>
//     )}
//   </div>
// </div>
// <div className='flex flex-col gap-6'>
//   <h3 className='text-2xl font-semibold text-neutral-600'>✨ Hired</h3>
//   <div className='w-full flex items-center gap-4 flex-wrap'>
//     {jobs.length > 0 ? (
//         jobs.map((job) => <JobCard key={job._id} job={job} />)
//     ) : (
//         <p className="text-lg text-gray-500 mt-8">No jobs available right now. Check back soon!</p>
//     )}
//   </div>
// </div>
// </div>