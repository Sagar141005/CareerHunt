import { RiLineChartLine } from "@remixicon/react";
import React, { useState, useEffect, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import api from "../api/axios";

const getPastDates = (days) => {
  const options = { day: "2-digit", month: "short" };
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return date.toLocaleDateString("en-GB", options);
  });
};

const initChartData = (labels) =>
  Object.fromEntries(labels.map((label) => [label, 0]));

const AreaChartWithFilter = () => {
  const [timeRange, setTimeRange] = useState(7);
  const [selectedJobID, setSelectedJobID] = useState(null);
  const [jobPosts, setJobPosts] = useState([]);

  const labels = useMemo(() => getPastDates(timeRange), [timeRange]);

  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - timeRange);
        const res = await api.get(
          `/job-posts/applications/chart?since=${sinceDate.toISOString()}`
        );
        setJobPosts(res.data.jobPosts || []);
      } catch (error) {
        console.error("Error fetching charts");
      }
    };
    fetchJobPosts();
  }, [timeRange]);

  const jobMap = useMemo(() => {
    const grouped = jobPosts.map((job) => {
      const data = {
        id: job._id,
        title: job.title,
        applications: initChartData(labels),
        shortlisted: initChartData(labels),
        rejected: initChartData(labels),
        totalApps: job.applications?.length || 0,
      };
      job.applications?.forEach((app) => {
        const dateLabel = new Date(app.dateApplied).toLocaleDateString(
          "en-GB",
          { day: "2-digit", month: "short" }
        );
        if (data.applications[dateLabel] !== undefined) {
          const status = app.status?.toLowerCase();
          if (status === "shortlisted") data.shortlisted[dateLabel]++;
          else if (status === "rejected") data.rejected[dateLabel]++;
          else data.applications[dateLabel]++;
        }
      });
      return data;
    });
    if (!selectedJobID && grouped.length > 0) setSelectedJobID(grouped[0].id);
    return grouped;
  }, [jobPosts, labels, selectedJobID]);

  const selectedJob = useMemo(
    () => jobMap.find((j) => j.id === selectedJobID),
    [jobMap, selectedJobID]
  );

  const series = useMemo(() => {
    if (!selectedJob) return [];
    return [
      {
        name: "Applications",
        data: labels.map((l) => selectedJob.applications[l]),
      },
      {
        name: "Shortlisted",
        data: labels.map((l) => selectedJob.shortlisted[l]),
      },
      { name: "Rejected", data: labels.map((l) => selectedJob.rejected[l]) },
    ];
  }, [selectedJob, labels]);

  const isDark = document.documentElement.classList.contains("dark");

  const chartOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "inherit",
    },
    colors: ["#0164FC", "#10B981", "#EF4444"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    grid: { borderColor: isDark ? "#333" : "#f3f3f3", strokeDashArray: 4 },
    xaxis: {
      categories: labels,
      labels: { style: { colors: isDark ? "#9ca3af" : "#6b7280" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: isDark ? "#9ca3af" : "#6b7280" } } },
    theme: { mode: isDark ? "dark" : "light" },
    legend: { show: true, position: "top", horizontalAlign: "right" },
  };

  return (
    <div className="flex flex-col h-full min-h-80">
      <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-white dark:bg-neutral-900">
        <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2 text-sm sm:text-base">
          <RiLineChartLine
            className="text-blue-600 dark:text-blue-400"
            size={20}
          />{" "}
          Application Activity
        </h3>
        <select
          className="bg-transparent text-xs font-semibold text-neutral-500 dark:text-neutral-400 cursor-pointer focus:outline-none border-none p-0"
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
      </div>

      <div className="flex flex-col md:flex-row flex-1 min-h-0 bg-white dark:bg-neutral-900">
        <div
          className="
            w-full md:w-64 
            h-36 md:h-auto 
            border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 
            overflow-y-auto p-3 space-y-1 custom-scrollbar shrink-0
        "
        >
          {jobMap.length === 0 && (
            <p className="text-center text-xs text-neutral-400 mt-10">
              No active jobs
            </p>
          )}
          {jobMap.map((job) => (
            <button
              key={job.id}
              onClick={() => setSelectedJobID(job.id)}
              className={`w-full text-left px-3 py-3 rounded-xl transition-all flex items-center justify-between group ${
                selectedJobID === job.id
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
            >
              <div className="truncate pr-2">
                <p className="text-sm font-bold truncate">{job.title}</p>
                <p className="text-[10px] opacity-70 mt-0.5">
                  {job.totalApps} Applicants
                </p>
              </div>
              {selectedJobID === job.id && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></div>
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 p-4 min-w-0 min-h-[250px] md:min-h-0">
          {jobPosts.length > 0 ? (
            <ReactApexChart
              options={chartOptions}
              series={series}
              type="area"
              height="100%"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-neutral-400 text-sm">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AreaChartWithFilter;
