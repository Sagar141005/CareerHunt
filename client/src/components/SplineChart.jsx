import { RiLineChartLine } from "@remixicon/react";
import React, { useState, useMemo } from "react";
import ReactApexChart from "react-apexcharts";

const getPastDates = (daysBack) => {
  const dates = [];
  const options = { day: "2-digit", month: "short" }; 
  for (let i = daysBack - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString("en-GB", options));
  }

  return dates;
};

const generateDummyData = (length) =>
  Array.from({ length }, () => Math.floor(Math.random() * 100));

  const jobData = [
    {
      id: 1,
      title: "Full Stack Developer",
      applications: 203,
      chartData: {
        applications: generateDummyData(30),
        shortlisted: generateDummyData(30),
        rejected: generateDummyData(30),
      },
    },
    {
      id: 2,
      title: "iOS Developer",
      applications: 121,
      chartData: {
        applications: generateDummyData(30),
        shortlisted: generateDummyData(30),
        rejected: generateDummyData(30),
      },
    },
    {
      id: 3,
      title: "UI/UX Designer",
      applications: 88,
      chartData: {
        applications: generateDummyData(30),
        shortlisted: generateDummyData(30),
        rejected: generateDummyData(30),
      },
    },
    {
      id: 4,
      title: "Front End Developer",
      applications: 194,
      chartData: {
        applications: generateDummyData(30),
        shortlisted: generateDummyData(30),
        rejected: generateDummyData(30),
      },
    },
    {
      id: 5,
      title: "Andriod Developer",
      applications: 48,
      chartData: {
        applications: generateDummyData(30),
        shortlisted: generateDummyData(30),
        rejected: generateDummyData(30),
      },
    },
    {
      id: 6,
      title: "Graphic Designer",
      applications: 60,
      chartData: {
        applications: generateDummyData(30),
        shortlisted: generateDummyData(30),
        rejected: generateDummyData(30),
      },
    },
  ];

const AreaChartWithFilter = () => {
  const [ timeRange, setTimeRange ] = useState("7"); 
  const [ selectedJobID, setSelectedJobID ] = useState(jobData[0].id)

  const labels = useMemo(() => getPastDates(Number(timeRange)), [timeRange]);
  const selectedJob = useMemo(() => {
    return jobData.find((job) => job.id === selectedJobID)
  }, [selectedJobID]);

  const series = useMemo(
    () => [
      {
        name: "Applications",
        data: selectedJob.chartData.applications.slice(-labels.length)
      },
      {
        name: "Shortlisted",
        data: selectedJob.chartData.shortlisted.slice(-labels.length)
      },
      {
        name: "Rejected",
        data: selectedJob.chartData.rejected.slice(-labels.length)
      }
    ],
    [selectedJob ,labels.length]
  );

  const chartOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: ["#FF5DCB", "#4AD588", "#E74C3C"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100]
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      x: { format: "dd MMM" }
    },
    legend: {
      position: "top",
      horizontalAlign: "left"
    },
    xaxis: {
      categories: labels,
      labels: { show: false },
      axisTicks: {
        show: false
      },
      tickAmount: 7
    },
    yaxis: {
      labels: {
        formatter: (val) => val
      }
    }
  };

  return (
    
    <div className="bg-transparent rounded-lg p-4 relative">
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold">Top Active Jobs</h3>
        <select
        className="text-blue-400 appearance-none p-1 text-sm font-medium"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
      </div>
      <ReactApexChart
        options={chartOptions}
        series={series}
        type="area"
        height={250}
      />
        <div className="mt-6 flex flex-col max-h-30 overflow-y-auto pr-4">
        {jobData.map((job) => (
          <div
            key={job.id}
            className={`flex justify-between items-center py-3 px-2 transition-all ${
              selectedJobID === job.id ? "bg-gray-100 rounded-lg" : ""
            }`}>
            <div>
              <div className="font-medium text-sm">{job.title}</div>
              <div className="text-xs text-gray-500">
                {job.applications} Applications
              </div>
            </div>
            <button
                onClick={() => setSelectedJobID(job.id)}
              className={`w-8 h-8 flex items-center justify-center cursor-pointer p-1 border border-blue-300 rounded-lg transition-colors ${
                selectedJobID === job.id
                  ? "bg-blue-400 text-white"
                  : "bg-transparent text-blue-500"
              }`}
            >
              <RiLineChartLine size={16} />
            </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AreaChartWithFilter;
