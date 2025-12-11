import React, { useEffect, useState } from "react";
import UserNavbar from "../../components/job-seeker/UserNavbar";
import {
  RiBriefcaseLine,
  RiMapPin2Line,
  RiMedalLine,
  RiSearch2Line,
  RiFilter3Line,
  RiCloseLine,
} from "@remixicon/react";
import Slider from "@mui/material/Slider";
import CheckboxGroup from "../../components/CheckboxGroup";
import api from "../../api/axios";
import JobCard from "../../components/job-seeker/JobCard";
import Footer from "../../components/Footer";
import { toast } from "react-hot-toast";
import InputField from "../../components/ui/InputField";
import Pagination from "../../components/ui/Pagination";

const FindJob = () => {
  const [jobs, setJobs] = useState([]);

  const [titleQuery, setTitleQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [typeQuery, setTypeQuery] = useState("");
  const [levelQuery, setLevelQuery] = useState("");
  const [range, setRange] = useState([0, 9000]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    employmentType: [],
    type: [],
    level: [],
    department: [],
  });

  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [headerCollapsed, setHeaderCollapsed] = useState(true);

  const employmentTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Temporary",
    "Freelance",
    "Internship",
  ];
  const workTypes = ["On-site", "Remote", "Hybrid"];
  const levels = ["Intern", "Junior", "Mid", "Senior", "Lead"];
  const departments = [
    "IT",
    "Design",
    "Hospitality",
    "Marketing",
    "Sales",
    "Finance",
    "Other",
  ];

  const handleSliderChange = (event, newValue) => {
    setRange(newValue);
  };

  const handleCheckboxChange = (field) => (event) => {
    const value = event.target.value;
    setFilters((prev) => {
      const selectedItems = prev[field];
      const updatedItems = selectedItems.includes(value)
        ? selectedItems.filter((item) => item !== value)
        : [...selectedItems, value];
      return { ...prev, [field]: updatedItems };
    });
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const queryParams = new URLSearchParams();

        if (filters.employmentType.length > 0)
          filters.employmentType.forEach((et) =>
            queryParams.append("employmentType", et)
          );
        if (filters.type.length > 0)
          filters.type.forEach((t) => queryParams.append("type", t));
        if (filters.level.length > 0)
          filters.level.forEach((l) => queryParams.append("level", l));
        if (filters.department.length > 0)
          filters.department.forEach((d) =>
            queryParams.append("department", d)
          );

        if (titleQuery) queryParams.append("title", titleQuery);
        if (locationQuery) queryParams.append("location", locationQuery);
        if (typeQuery) queryParams.append("typeQuery", typeQuery);
        if (levelQuery) queryParams.append("levelQuery", levelQuery);

        queryParams.append("minSalary", range[0]);
        queryParams.append("maxSalary", range[1]);

        queryParams.append("page", currentPage);
        queryParams.append("limit", jobsPerPage);

        const response = await api.get(
          `/applications/all?${queryParams.toString()}`
        );
        setJobs(response.data.jobs);
        setTotalPages(Math.ceil(response.data.total / jobsPerPage));
      } catch (error) {
        const msg =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch jobs.";
        toast.error(`Error: ${msg}`);
      }
    };

    fetchJobs();
  }, [
    filters,
    titleQuery,
    locationQuery,
    typeQuery,
    levelQuery,
    range,
    currentPage,
  ]);

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-200 transition-colors duration-300 flex flex-col">
      <UserNavbar />

      <div className="sticky top-16 z-30 bg-white/80 dark:bg-neutral-950/80 border-b border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="hidden md:flex items-center gap-3 w-full">
            <div className="flex-1">
              <InputField
                label=""
                name="titleQuery"
                value={titleQuery}
                onChange={(e) => setTitleQuery(e.target.value)}
                placeholder="Search job title..."
                icon={RiSearch2Line}
              />
            </div>

            <div className="flex-1">
              <InputField
                label=""
                name="locationQuery"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="City or Remote"
                icon={RiMapPin2Line}
              />
            </div>

            <div className="w-[140px]">
              <InputField
                label=""
                name="typeQuery"
                value={typeQuery}
                onChange={(e) => setTypeQuery(e.target.value)}
                placeholder="Type"
                icon={RiBriefcaseLine}
              />
            </div>

            <div className="w-[140px]">
              <InputField
                label=""
                name="levelQuery"
                value={levelQuery}
                onChange={(e) => setLevelQuery(e.target.value)}
                placeholder="Level"
                icon={RiMedalLine}
              />
            </div>

            <div className="w-[280px] bg-neutral-100 dark:bg-neutral-800 px-4 py-1.5 rounded-lg border border-transparent transition-all flex flex-col justify-center">
              <div className="flex justify-between items-center text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                <span className="font-medium">Salary</span>
                <span>
                  ${range[0]} - ${range[1]}
                </span>
              </div>
              <Slider
                value={range}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                min={0}
                max={25000}
                size="small"
                sx={{
                  padding: "5px 0",
                  color: "#0164FC",
                  "& .MuiSlider-rail": {
                    backgroundColor: "#cbd5e1",
                    opacity: 0.5,
                  },
                  "& .MuiSlider-track": { border: "none" },
                  "& .MuiSlider-thumb": {
                    width: 12,
                    height: 12,
                    backgroundColor: "#fff",
                    border: "2px solid #0164FC",
                    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
                      boxShadow: "inherit",
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="flex md:hidden items-center justify-between gap-3">
            <button
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 rounded-xl font-medium active:scale-95 transition-transform"
              onClick={() => setHeaderCollapsed(!headerCollapsed)}
            >
              <RiSearch2Line size={18} />
              <span>Search</span>
            </button>
            <button
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
              onClick={() => setFilterSidebarOpen(true)}
            >
              <RiFilter3Line size={18} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {headerCollapsed === false && (
          <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-4 space-y-3">
            <InputField
              label=""
              name="titleQuery"
              value={titleQuery}
              onChange={(e) => setTitleQuery(e.target.value)}
              placeholder="Job Title"
              icon={RiSearch2Line}
            />

            <InputField
              label=""
              name="locationQuery"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Location"
              icon={RiMapPin2Line}
            />

            <div className="flex gap-3">
              <div className="flex-1">
                <InputField
                  label=""
                  name="typeQuery"
                  value={typeQuery}
                  onChange={(e) => setTypeQuery(e.target.value)}
                  placeholder="Type"
                  icon={RiBriefcaseLine}
                />
              </div>

              <div className="flex-1">
                <InputField
                  label=""
                  name="levelQuery"
                  value={levelQuery}
                  onChange={(e) => setLevelQuery(e.target.value)}
                  placeholder="Level"
                  icon={RiMedalLine}
                />
              </div>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
              <div className="flex justify-between items-center text-xs text-neutral-500 mb-2">
                <span>Salary Range</span>
                <span>
                  ${range[0]} - ${range[1]}
                </span>
              </div>
              <Slider
                value={range}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                min={0}
                max={25000}
                size="small"
                sx={{ color: "#0164FC" }}
              />
            </div>
          </div>
        )}
      </div>

      {filterSidebarOpen && (
        <>
          <div
            onClick={() => setFilterSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          ></div>
          <aside className="fixed top-0 right-0 w-[80%] max-w-sm h-full bg-white dark:bg-neutral-900 shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
            <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                Filters
              </h3>
              <button
                onClick={() => setFilterSidebarOpen(false)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
              >
                <RiCloseLine size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <CheckboxGroup
                label="Employment Type"
                options={employmentTypes}
                name="employmentType"
                selected={filters.employmentType}
                onChange={handleCheckboxChange("employmentType")}
              />
              <div className="w-full h-px bg-neutral-100 dark:bg-neutral-800"></div>
              <CheckboxGroup
                label="Work Mode"
                options={workTypes}
                name="type"
                selected={filters.type}
                onChange={handleCheckboxChange("type")}
              />
              <div className="w-full h-px bg-neutral-100 dark:bg-neutral-800"></div>
              <CheckboxGroup
                label="Level"
                options={levels}
                name="level"
                selected={filters.level}
                onChange={handleCheckboxChange("level")}
              />
              <div className="w-full h-px bg-neutral-100 dark:bg-neutral-800"></div>
              <CheckboxGroup
                label="Department"
                options={departments}
                name="department"
                selected={filters.department}
                onChange={handleCheckboxChange("department")}
              />
            </div>

            <div className="p-5 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
              <button
                onClick={() =>
                  setFilters({
                    employmentType: [],
                    type: [],
                    level: [],
                    department: [],
                  })
                }
                className="w-full py-3 mb-3 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setFilterSidebarOpen(false)}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
              >
                Show Results
              </button>
            </div>
          </aside>
        </>
      )}

      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8 px-4 sm:px-6 py-8">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-40 max-h-[calc(100vh-10rem)] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <RiFilter3Line size={18} /> Filters
              </h3>
              <button
                onClick={() =>
                  setFilters({
                    employmentType: [],
                    type: [],
                    level: [],
                    department: [],
                  })
                }
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-6">
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
          </div>
        </aside>

        <main className="flex-1 flex flex-col">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                Recommended Jobs
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base max-w-xl">
                Found{" "}
                <span className="font-bold text-neutral-900 dark:text-white">
                  {jobs.length}
                </span>{" "}
                open positions based on your criteria
              </p>
            </div>
          </div>

          {jobs.length > 0 ? (
            <div className="w-full flex items-center gap-4 flex-wrap justify-center lg:justify-start">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="w-full flex items-center justify-center py-20">
              <div className="flex flex-col items-center text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900/50 p-8">
                <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-4">
                  <RiBriefcaseLine size={32} className="text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  No jobs found
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs">
                  Try adjusting your search terms or filters to find what you're
                  looking for.
                </p>
              </div>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default FindJob;
