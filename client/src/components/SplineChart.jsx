import { RiLineChartLine } from "@remixicon/react";
import React, { useState, useEffect, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import api from "../api/axios";
import { toast } from "react-toastify";

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
        const since = sinceDate.toISOString();
        const res = await api.get(`/job-posts/applications/chart?since=${since}`);
        setJobPosts(res.data.jobPosts);
      } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Error fetching job posts';
        toast.error(msg);
      }
    };
    fetchJobPosts();
  }, [timeRange]);

  const jobMap = useMemo(() => {
    const grouped = {};
    const labelSet = new Set(labels);

    for (const job of jobPosts) {
      const jobId = job._id;
      grouped[jobId] = {
        id: jobId,
        title: job.title,
        chartData: {
          applications: initChartData(labels),
          shortlisted: initChartData(labels),
          rejected: initChartData(labels),
        },
      };

      for (const app of job.applications || []) {
        const dateLabel = new Date(app.dateApplied).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        });

        if (!labelSet.has(dateLabel)) continue;

        const status = app.status?.toLowerCase();
        const data = grouped[jobId].chartData;

        switch (status) {
          case "shortlisted":
            data.shortlisted[dateLabel]++;
            break;
          case "rejected":
            data.rejected[dateLabel]++;
            break;
          default:
            data.applications[dateLabel]++;
        }
      }
    }

    const result = Object.values(grouped);
    if (!selectedJobID && result.length > 0) {
      setSelectedJobID(result[0].id);
    }
    return result;
  }, [jobPosts, labels, selectedJobID]);

  const selectedJob = useMemo(
    () => jobMap.find((job) => job.id === selectedJobID),
    [jobMap, selectedJobID]
  );

  const series = useMemo(() => {
    if (!selectedJob) return [];
    const { chartData } = selectedJob;
    return [
      { name: "Applications", data: labels.map((l) => chartData.applications[l]) },
      { name: "Shortlisted", data: labels.map((l) => chartData.shortlisted[l]) },
      { name: "Rejected", data: labels.map((l) => chartData.rejected[l]) },
    ];
  }, [selectedJob, labels]);

  const isDark = document.documentElement.classList.contains("dark");

  const chartOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: isDark ? "#E5E7EB" : "#111827", 
    },
    colors: isDark
      ? ["#60A5FA", "#4ADE80", "#F87171"] 
      : ["#3B82F6", "#22C55E", "#FF6B6B"], 
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      shared: true,
      intersect: false,
      x: { format: "dd MMM" },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      labels: {
        colors: isDark ? "#E5E7EB" : "#111827",
      },
    },
    xaxis: {
      categories: labels,
      labels: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: isDark ? "#9CA3AF" : "#6B7280" },
        formatter: (val) => val,
      },
    },
  };

  return (
    <div className="bg-transparent dark:bg-transparent rounded-lg p-4 relative flex flex-col h-[500px]">
      <div className="flex justify-between items-center mb-2 py-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Top Active Jobs</h3>
        <select
          className="text-blue-500 dark:text-blue-400 bg-transparent appearance-none p-1 text-sm font-medium"
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
      </div>

      {jobPosts.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
          No job posts yet
        </div>
      ) : (
        <>
          <div className="flex-shrink-0">
            <ReactApexChart
              options={chartOptions}
              series={series}
              type="area"
              height={250} />
          </div>

          <div className="flex-grow overflow-y-auto pr-4 mt-6 min-h-0">
            {jobMap.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJobID(job.id)}
                className={`flex justify-between items-center py-3 px-2 transition-all cursor-pointer 
                  ${
                    selectedJobID === job.id
                      ? "bg-gray-100 dark:bg-gray-700 rounded-lg"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}>
                <div>
                  <div className="font-medium text-sm text-gray-800 dark:text-white">{job.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {Object.values(job.chartData.applications).reduce((a, b) => a + b, 0)} Applications
                  </div>
                </div>
                <button
                  className={`w-8 h-8 flex items-center justify-center p-1 border rounded-lg transition-colors
                    ${
                      selectedJobID === job.id
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-transparent text-blue-500 dark:text-blue-400 border-blue-300 dark:border-blue-500"
                    }`}>
                  <RiLineChartLine size={16} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AreaChartWithFilter;
