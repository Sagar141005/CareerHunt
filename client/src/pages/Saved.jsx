import React, { useEffect, useState } from 'react'
import UserNavbar from '../components/UserNavbar'
import api from '../api/axios'
import JobCard from '../components/JobCard'
import Footer from '../components/Footer'
import { toast } from 'react-toastify'

const Saved = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/applications/saved/all')
        setJobs(response.data.jobs)
      } catch (error) {
        const status = error.response?.status;
        if (status !== 404) {
          const msg = error.response?.data?.message || error.message || "Failed to fetch jobs.";
          toast.error(`Error: ${msg}`);
        }
      }
    }

    fetchJobs()
  }, [])

  const totalPages = Math.ceil(jobs.length / jobsPerPage)
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob)

  return (
    <div className="w-full flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-300 transition-colors duration-300">
      <UserNavbar />

      <main className="w-full flex-1 flex flex-col px-4 sm:px-6 lg:px-12 pt-8 gap-6">
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

        {totalPages >= 1 && (
          <div className="w-full flex justify-center mt-12 mb-4 px-4">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-lg px-4 py-2 shadow-sm">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm rounded-md font-medium transition-all bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed">
                Prev
              </button>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm rounded-md font-medium transition-all bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Saved
