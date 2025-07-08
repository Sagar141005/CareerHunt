import React, { useEffect, useState } from 'react'
import UserNavbar from '../components/UserNavbar'
import { RiBriefcaseLine, RiMapPin2Line, RiMedalLine, RiSearch2Line, RiFilter3Line, RiCloseLine } from '@remixicon/react'
import Slider from '@mui/material/Slider';
import CheckboxGroup from '../components/CheckboxGroup'
import api from '../api/axios'
import JobCard from '../components/JobCard';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';

const FindJob = () => {
  const [jobs, setJobs] = useState([]);

  const [titleQuery, setTitleQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [typeQuery, setTypeQuery] = useState('');
  const [levelQuery, setLevelQuery] = useState('');
  const [range, setRange] = useState([0, 9000]);

  const [filters, setFilters] = useState({
    employmentType: [],
    type: [],
    level: [],
    department: []
  });

  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [headerCollapsed, setHeaderCollapsed] = useState(true);

  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Freelance', 'Internship'];
  const workTypes = ['On-site', 'Remote', 'Hybrid'];
  const levels = ['Intern', 'Junior', 'Mid', 'Senior', 'Lead'];
  const departments = ['IT', 'Design', 'Hospitality', 'Marketing', 'Sales', 'Finance', 'Other'];

  const handleSliderChange = (event, newValue) => {
    setRange(newValue);
  };

  const handleCheckboxChange = (field) => (event) => {
    const value = event.target.value;
    setFilters((prev) => {
      const selectedItems = prev[field];
      const updatedItems = selectedItems.includes(value)
        ? selectedItems.filter((item) => item !== value)
        : [...selectedItems, value]
      return { ...prev, [field]: updatedItems }
    })
  }

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const queryParams = new URLSearchParams();

        if (filters.employmentType.length > 0)
          filters.employmentType.forEach(et => queryParams.append('employmentType', et));
        if (filters.type.length > 0)
          filters.type.forEach(t => queryParams.append('type', t));
        if (filters.level.length > 0)
          filters.level.forEach(l => queryParams.append('level', l));
        if (filters.department.length > 0)
          filters.department.forEach(d => queryParams.append('department', d));

        if (titleQuery) queryParams.append('title', titleQuery);
        if (locationQuery) queryParams.append('location', locationQuery);
        if (typeQuery) queryParams.append('typeQuery', typeQuery);
        if (levelQuery) queryParams.append('levelQuery', levelQuery);

        queryParams.append('minSalary', range[0]);
        queryParams.append('maxSalary', range[1]);

        const response = await api.get(`/applications/all?${queryParams.toString()}`);
        setJobs(response.data.jobs);
      } catch (error) {
        const msg = error.response?.data?.message || error.message || "Failed to fetch jobs.";
        toast.error(`Error: ${msg}`);
      }
    }

    fetchJobs();
  }, [filters, titleQuery, locationQuery, typeQuery, levelQuery, range]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-20 dark:from-gray-900 dark:to-gray-800 dark:text-gray-300 transition-colors duration-300 overflow-hidden">
      <UserNavbar />

      {/* Responsive Header */}
      <div className="bg-gradient-to-r from-sky-700 to-blue-700 dark:bg-[#141414] dark:bg-none text-white px-4 py-3 flex items-center justify-between">
        {/* Title */}
        <div className="hidden md:flex items-center gap-6 flex-wrap max-w-7xl mx-auto w-full">
          {/* Job input */}
          <div className="flex items-center gap-3 border-r border-white/30 pr-4 flex-1 min-w-[120px] max-w-[200px]">
            <div className="h-8 w-10 flex items-center justify-center border border-white/30 rounded-full">
              <RiSearch2Line size={18} />
            </div>
            <input
              className="text-md pt-1 focus:outline-none w-full bg-transparent placeholder-white/70 text-white truncate"
              type="text"
              placeholder="Job"
              value={titleQuery}
              onChange={(e) => setTitleQuery(e.target.value)} />
          </div>
          {/* Location input */}
          <div className="flex items-center gap-3 border-r border-white/30 pr-4 flex-1 min-w-[120px] max-w-[200px]">
            <div className="h-8 w-10 flex items-center justify-center border border-white/30 rounded-full">
              <RiMapPin2Line size={18} />
            </div>
            <input
              className="text-md pt-1 focus:outline-none w-full bg-transparent placeholder-white/70 text-white truncate"
              type="text"
              placeholder="Location"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)} />
          </div>
          {/* Type input */}
          <div className="flex items-center gap-3 border-r border-white/30 pr-4 flex-1 min-w-[120px] max-w-[200px]">
            <div className="h-8 w-10 flex items-center justify-center border border-white/30 rounded-full">
              <RiBriefcaseLine size={18} />
            </div>
            <input
              className="text-md pt-1 focus:outline-none w-full bg-transparent placeholder-white/70 text-white truncate"
              type="text"
              placeholder="Type"
              value={typeQuery}
              onChange={(e) => setTypeQuery(e.target.value)} />
          </div>
          {/* Level input */}
          <div className="flex items-center gap-3 border-r border-white/30 pr-4 flex-1 min-w-[120px] max-w-[200px]">
            <div className="h-8 w-10 flex items-center justify-center border border-white/30 rounded-full">
              <RiMedalLine size={18} />
            </div>
            <input
              className="text-md pt-1 focus:outline-none w-full bg-transparent placeholder-white/70 text-white truncate"
              type="text"
              placeholder="Level"
              value={levelQuery}
              onChange={(e) => setLevelQuery(e.target.value)} />
          </div>
          {/* Salary Range */}
          <div className="flex flex-col gap-2 min-w-[300px] max-w-[400px] flex-1">
            <div className="w-full flex items-center justify-between">
              <h3 className="text-md text-white whitespace-nowrap">Salary Range</h3>
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1 justify-center">
                  <span className="text-xs pt-1 text-white">$</span>
                  <input
                    onWheel={(e) => e.target.blur()}
                    readOnly
                    className="w-[50px] text-right text-sm pt-1 focus:outline-none appearance-none bg-transparent text-white"
                    type="number"
                    value={range[0]} />
                </div>
                <span className="w-4 text-center px-1 text-white">–</span>
                <div className="flex items-center gap-1 justify-center">
                  <span className="text-xs pt-1 text-white">$</span>
                  <input
                    onWheel={(e) => e.target.blur()}
                    readOnly
                    className="w-[60px] text-left text-sm pt-1 focus:outline-none appearance-none bg-transparent text-white"
                    type="number"
                    value={range[1]} />
                </div>
              </div>
            </div>
            <Slider
              value={range}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              min={0}
              max={25000}
              sx={{
                '& .MuiSlider-rail': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#ffffff',
                },
                '& .MuiSlider-valueLabel': {
                  backgroundColor: '#4299e1',
                  color: '#fff',
                },
              }} />
          </div>
        </div>

        {/* Mobile Header (collapsed) */}
        <div className="flex md:hidden items-center justify-between w-full max-w-7xl mx-auto">
          <button
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition cursor-pointer"
            onClick={() => setHeaderCollapsed(!headerCollapsed)}>
            <RiSearch2Line size={20} />
            <span>Search Filters</span>
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition cursor-pointer"
            onClick={() => setFilterSidebarOpen(true)}>
            <RiFilter3Line size={20} />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Collapsible mobile search inputs */}
      {headerCollapsed === false && (
        <div className="md:hidden bg-gradient-to-r from-sky-700 to-blue-700 dark:bg-[#141414] dark:bg-none px-4 py-4 space-y-4 max-w-7xl mx-auto">
          {/* Job input */}
          <div className="flex items-center gap-3 border border-white/30 rounded-md p-2">
            <RiSearch2Line size={18} className="text-white" />
            <input
              className="text-md pt-1 focus:outline-none w-full bg-transparent placeholder-white/70 text-white"
              type="text"
              placeholder="Job"
              value={titleQuery}
              onChange={(e) => setTitleQuery(e.target.value)} />
          </div>
          {/* Location input */}
          <div className="flex items-center gap-3 border border-white/30 rounded-md p-2">
            <RiMapPin2Line size={18} className="text-white" />
            <input
              className="text-md pt-1 focus:outline-none w-full bg-transparent placeholder-white/70 text-white"
              type="text"
              placeholder="Location"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)} />
          </div>
          {/* Type input */}
          <div className="flex items-center gap-3 border border-white/30 rounded-md p-2">
            <RiBriefcaseLine size={18} className="text-white" />
            <input
              className="text-md pt-1 focus:outline-none w-full bg-transparent placeholder-white/70 text-white"
              type="text"
              placeholder="Type"
              value={typeQuery}
              onChange={(e) => setTypeQuery(e.target.value)} />
          </div>
          {/* Level input */}
          <div className="flex items-center gap-3 border border-white/30 rounded-md p-2">
            <RiMedalLine size={18} className="text-white" />
            <input
              className="text-md pt-1 focus:outline-none w-full bg-transparent placeholder-white/70 text-white"
              type="text"
              placeholder="Level"
              value={levelQuery}
              onChange={(e) => setLevelQuery(e.target.value)} />
          </div>
          {/* Salary Range */}
          <div className="flex flex-col gap-2">
            <h3 className="text-md text-white">Salary Range</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 justify-center">
                <span className="text-xs pt-1 text-white">$</span>
                <input
                  onWheel={(e) => e.target.blur()}
                  readOnly
                  className="w-[50px] text-right text-sm pt-1 focus:outline-none appearance-none bg-transparent text-white"
                  type="number"
                  value={range[0]} />
              </div>
              <span className="w-4 text-center px-1 text-white">–</span>
              <div className="flex items-center gap-1 justify-center">
                <span className="text-xs pt-1 text-white">$</span>
                <input
                  onWheel={(e) => e.target.blur()}
                  readOnly
                  className="w-[60px] text-left text-sm pt-1 focus:outline-none appearance-none bg-transparent text-white"
                  type="number"
                  value={range[1]} />
              </div>
            </div>
            <Slider
              value={range}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              min={0}
              max={25000}
              sx={{
                '& .MuiSlider-rail': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#ffffff',
                },
                '& .MuiSlider-valueLabel': {
                  backgroundColor: '#4299e1',
                  color: '#fff',
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Filter Sidebar Drawer for mobile */}
      {filterSidebarOpen && (
        <>
          <div
            onClick={() => setFilterSidebarOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40">
            </div>
          <aside className="fixed top-0 right-0 w-72 h-full bg-white dark:bg-gray-900 dark:text-gray-300 shadow-lg z-50 p-4 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-medium">Filters</h3>
              <button onClick={() => setFilterSidebarOpen(false)} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer">
                <RiCloseLine size={24} />
              </button>
            </div>
            <button
              onClick={() => setFilters({
                employmentType: [],
                type: [],
                level: [],
                department: [],
              })}
              className="mb-4 text-sm text-blue-600 dark:text-blue-400 rounded-lg cursor-pointer transition">
              Clear All
            </button>
            <CheckboxGroup
              label="Employment Type"
              options={employmentTypes}
              name="employmentType"
              selected={filters.employmentType}
              onChange={handleCheckboxChange('employmentType')} />
            <CheckboxGroup
              label="Work Mode"
              options={workTypes}
              name="type"
              selected={filters.type}
              onChange={handleCheckboxChange('type')} />
            <CheckboxGroup
              label="Level"
              options={levels}
              name="level"
              selected={filters.level}
              onChange={handleCheckboxChange('level')} />
            <CheckboxGroup
              label="Department"
              options={departments}
              name="department"
              selected={filters.department}
              onChange={handleCheckboxChange('department')} />
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="w-full flex flex-col lg:flex-row gap-12 pr-6 pl-2 py-10">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 border-r border-gray-300 dark:border-gray-700 p-4 sticky top-20 gap-4 h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-300">Filters</h3>
            <button
              onClick={() => setFilters({
                employmentType: [],
                type: [],
                level: [],
                department: [],
              })}
              className="text-sm text-blue-600 dark:text-blue-400 rounded-lg cursor-pointer transition">
              Clear All
            </button>
          </div>
          <CheckboxGroup
            label="Employment Type"
            options={employmentTypes}
            name="employmentType"
            selected={filters.employmentType}
            onChange={handleCheckboxChange('employmentType')} />
          <CheckboxGroup
            label="Work Mode"
            options={workTypes}
            name="type"
            selected={filters.type}
            onChange={handleCheckboxChange('type')} />
          <CheckboxGroup
            label="Level"
            options={levels}
            name="level"
            selected={filters.level}
            onChange={handleCheckboxChange('level')} />
          <CheckboxGroup
            label="Department"
            options={departments}
            name="department"
            selected={filters.department}
            onChange={handleCheckboxChange('department')} />
        </aside>

        {/* Job Listings */}
        <main className="flex-1 flex flex-col sm:w-full gap-6 overflow-y-auto max-h-[calc(100vh-5rem)] pr-4 sm:px-6">
          <div className="flex justify-between items-start">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-300">Recommended Jobs</h2>
            <p className="text-sm text-gray-600 dark:text-neutral-400 hidden lg:block">
              Sort by: <span className="text-black dark:text-gray-300 font-semibold">Most recent</span>
            </p>
          </div>
          <div className="w-full flex items-center gap-4 flex-wrap justify-center lg:justify-start">
            {jobs.length > 0 ? (
              jobs.map((job) => <JobCard key={job._id} job={job} />)
            ) : (
              <p className="text-lg text-gray-500 dark:text-gray-400">No jobs found.</p>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default FindJob;
