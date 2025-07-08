import React, { useEffect, useState } from 'react'
import UserNavbar from '../components/UserNavbar'
import api from '../api/axios'
import JobCard from '../components/JobCard'
import Footer from '../components/Footer'
import { toast } from 'react-toastify'

const Saved = () => {
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/applications/saved/all')
        setJobs(response.data.jobs)
      } catch (error) {
        const msg = error.response?.data?.message || error.message || "Failed to fetch jobs.";
        toast.error(`Error: ${msg}`);
      }
    }

    fetchJobs()
  }, [])

  return (
    <div className="w-full flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-300 transition-colors duration-300">
      <UserNavbar />

      <main className="w-full flex-1 flex flex-col px-4 sm:px-6 lg:px-12 py-8 gap-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h2 className="text-3xl sm:text-4xl font-bold">Saved Jobs</h2>
          <p className="text-sm text-gray-600 dark:text-neutral-400 hidden lg:block">
            Sort by: <span className="text-black dark:text-gray-300 font-semibold">Most recent</span>
          </p>
        </div>

        <div className="w-full flex flex-wrap gap-4 justify-center lg:justify-start">
          {jobs?.length > 0 ? (
            jobs.map((job) => <JobCard key={job._id} job={job} />)
          ) : (
            <p className="text-lg text-gray-500 dark:text-gray-400 mt-8">
              No jobs available right now. Check back soon!
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Saved
