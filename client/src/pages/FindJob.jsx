import React, { useEffect, useState } from 'react'
import UserNavbar from '../components/UserNavbar'
import { RiBriefcaseLine, RiMapPin2Line, RiMedalLine, RiSearch2Line } from '@remixicon/react'
import Slider from '@mui/material/Slider';
import CheckboxGroup from '../components/CheckboxGroup'
import api from '../api/axios'
import JobCard from '../components/JobCard';

const FindJob = () => {
    const [ jobs, setJobs ] = useState([]);

    const [ titleQuery, setTitleQuery ] = useState('');
    const [ locationQuery, setLocationQuery ] = useState('');
    const [ typeQuery, setTypeQuery ] = useState('');
    const [ levelQuery, setLevelQuery ] = useState('');
    const [range, setRange] = useState([1200, 20000]);

    const [filters, setFilters] = useState({
        employmentType: [],
        type: [],
        level: [],
        department: []
      });

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

            return {
                ...prev,
                [field]: updatedItems
            }
        })
    }


    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const queryParams = new URLSearchParams();

                if(filters.employmentType.length > 0) {
                    filters.employmentType.forEach(et => queryParams.append('employmentType', et));
                  }
                  if(filters.type.length > 0) {
                    filters.type.forEach(t => queryParams.append('type', t));
                  }
                  if(filters.level.length > 0) {
                    filters.level.forEach(l => queryParams.append('level', l));
                  }
                  if(filters.department.length > 0) {
                    filters.department.forEach(d => queryParams.append('department', d));
                  }

                if(titleQuery) queryParams.append('title', titleQuery);
                if(locationQuery) queryParams.append('location', locationQuery);
                if(typeQuery) queryParams.append('typeQuery', typeQuery);
                if(levelQuery) queryParams.append('levelQuery', levelQuery);

                queryParams.append('minSalary', range[0]);
                queryParams.append('maxSalary', range[1]);

                const response = await api.get(`/applications/all?${queryParams.toString()}`);
                setJobs(response.data.jobs);
            } catch (error) {
                console.error(error.response?.data || error.message);
            }
        }

        fetchJobs();
    }, [filters, titleQuery, locationQuery, typeQuery, levelQuery, range])

  return (
    <div className='w-full min-h-screen bg-[##F9F9F9] overflow-hidden'>
      <UserNavbar />
      <div className='w-full h-24 bg-[#141414] text-white flex items-center justify-center gap-8'>
        <div className='flex items-center justify-center gap-4 border-r-[1px] border-r-[#555455]'>
            <div className='h-8 w-8 flex items-center justify-center border border-[#555455] rounded-full'>
                <RiSearch2Line size={18} />
            </div>
            <input 
            className='text-md pt-1 focus:outline-none' 
            type="text" 
            placeholder='Job'
            value={titleQuery}
            onChange={(e) => setTitleQuery(e.target.value)} />
        </div>
        <div className='flex items-center justify-center gap-4 border-r-[1px] border-r-[#555455]'>
            <div className='h-8 w-8 flex items-center justify-center border border-[#555455] rounded-full'>
                <RiMapPin2Line size={18} />
            </div>
            <input 
            className='text-md pt-1 focus:outline-none' 
            type="text" 
            placeholder='Location' 
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}/>
        </div>
        <div className='flex items-center justify-center gap-4 border-r-[1px] border-r-[#555455]'>
            <div className='h-8 w-8 flex items-center justify-center border border-[#555455] rounded-full'>
                <RiBriefcaseLine size={18} />
            </div>
            <input 
            className='text-md pt-1 focus:outline-none' 
            type="text" 
            placeholder='Type' 
            value={typeQuery}
            onChange={(e) => setTypeQuery(e.target.value)} />
        </div>
        <div className='flex items-center justify-center gap-4 border-r-[1px] border-r-[#555455]'>
            <div className='h-8 w-8 flex items-center justify-center border border-[#555455] rounded-full'>
                <RiMedalLine size={18} />
            </div>
            <input 
            className='text-md pt-1 focus:outline-none' 
            type="text" 
            placeholder='Level' 
            value={levelQuery}
            onChange={(e) => setLevelQuery(e.target.value)}/>
        </div>
        <div className='flex flex-col text-white gap-2 min-w-[300px]'>
            <div className='w-20 flex items-center'>
                <h3 className='text-md text-nowrap pr-20'>Salary Range</h3>
                <div className='flex items-center gap-1'>
                    <div className="flex items-center gap-1 justify-center">
                        <span className="text-xs pt-1">$</span>
                        <input 
                        onWheel={(e) => e.target.blur()}
                        readOnly 
                        className='w-[50px] text-right text-sm pt-1 focus:outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' 
                        type="number" 
                        value={range[0]}
                        />
                    </div>
                    <span className='w-4 text-center px-1'>–</span>
                    <div className="flex items-center gap-1 justify-center">
                        <span className="text-xs pt-1">$</span>
                        <input 
                        onWheel={(e) => e.target.blur()}
                        readOnly 
                        className='w-[50px] text-left text-sm pt-1 focus:outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' 
                        type="number" 
                        value={range[1]}
                        />
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
                      backgroundColor: '#555455',
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#4299e1',
                    },
                    '& .MuiSlider-valueLabel': {
                      backgroundColor: '#555455',
                      color: '#fff',
                    },
                }}
                />
        </div>
      </div>
      <div className='w-full h-screen flex items-center justify-center gap-12 px-8 py-10'>
            <div className='w-72 h-full flex flex-col gap-4 p-4 border-r-[2px] border-r-neutral-300'>
                <div className='flex items-center justify-between py-2'>
                    <h3 className='text-xl font-medium'>Filters</h3>
                    <button
                    onClick={() =>
                        setFilters({
                        employmentType: [],
                        type: [],
                        level: [],
                        department: [],
                        })
                    }
                    className="text-sm text-blue-600 rounded-lg cursor-pointer">
                        Clear All
                    </button>
                </div>
                <CheckboxGroup
                label="Employment Type"
                options={employmentTypes}
                name="employmentType"
                selected={filters.employmentType}
                onChange={handleCheckboxChange("employmentType")}
                />
                <CheckboxGroup
                label="Work Mode"
                options={workTypes}
                name="type"
                selected={filters.type}
                onChange={handleCheckboxChange("type")}
                />
                <CheckboxGroup
                label="Level"
                options={levels}
                name="level"
                selected={filters.level}
                onChange={handleCheckboxChange("level")}
                />
                <CheckboxGroup
                label="Department"
                options={departments}
                name="department"
                selected={filters.department}
                onChange={handleCheckboxChange("department")}
                />
            </div>
            <div className='w-full h-full flex flex-col gap-6 overflow-y-auto'>
                <div className='flex justify-between items-baseline'>
                    <h2 className='text-4xl font-bold'>Recommended Jobs</h2>
                    <p className='text-sm text-neutral-500'>Sort by: <span className='text-black'>Most recent</span></p>
                </div>
                <div className='w-full flex items-center gap-4 flex-wrap'>
                    {jobs.length > 0 ? (
                        jobs.map((job) => <JobCard key={job._id} job={job} />)
                    ) : (
                        <p className="text-lg text-gray-500 mt-8">No jobs available right now. Check back soon!</p>
                    )}
                </div>
            </div>
      </div>
    </div>
  )
}

export default FindJob
