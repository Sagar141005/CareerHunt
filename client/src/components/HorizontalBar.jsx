import React, { useMemo, useState } from "react";
import useRecentApplications from "../hooks/useRecentApplications";

const acquisitionStats = [
    { label: "Applications", value: 64, color: "#3B82F6" },
    { label: "Shortlisted", value: 18, color: "#22C55E" },
    { label: "On-hold", value: 10, color: "#FACC15" },
    { label: "Rejected", value: 8, color: "#FF6B6B" },
];

const HorizontalBar = () => {
    const [ timeRange, setTimeRange ] = useState(7);

    const { applications } = useRecentApplications({ days: timeRange });

    const acquisitionStats = useMemo(() => {

    const counts = {
      "Applications": applications.length,
      "Shortlisted": applications.filter(app => app.status === 'Shortlisted').length,
      "On-hold": applications.filter(app => app.status === "On-hold").length,
      "Rejected": applications.filter(app => app.status === "Rejected").length
    }

    const maxCount = Math.max(...Object.values(counts));

    if (maxCount === 0) {
      return [{
        label: "No Applications",
        value: 100,
        rawCount: 0,
        color: "#D1D5DB",
      }];
    }

    return Object.entries(counts).map(([label, count]) => ({
      label,
      value: maxCount > 0 ? (count / maxCount) * 100 : 0,
      rawCount: count,
      color:
        label === "Applications" ? "#3B82F6" :
        label === "Shortlisted" ? "#22C55E" :
        label === "On-hold" ? "#FACC15" :
        "#EF4444",
    }));
  }, [applications]);

  return (
    <div className="p-4 w-full max-w-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-gray-800">Acquisitions</h3>
        <select
        className="text-blue-400 appearance-none p-1 text-sm font-medium"
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
      </div>

      <div className="flex w-full h-2.5 rounded-2xl overflow-hidden mb-4 bg-gray-10">
        {acquisitionStats.map((item, index) => (
            <div
            key={index}
            className="h-full"
            style={{
                width: `${item.value}%`,
                backgroundColor: item.color
            }}>
            </div>
        ))}
      </div>

      <div className="flex flex-col space-y-2 text-sm">
        {acquisitionStats.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span
                    className="w-4 h-2.5 rounded-2xl"
                    style={{ backgroundColor: item.color}}></span>
                    <span className="text-gray-700">{item.label}</span>
                </div>
                <span className="font-semibold text-gray-900">{item.rawCount}</span>
            </div>
        ))}
      </div>
    </div>
  )
}

export default HorizontalBar
