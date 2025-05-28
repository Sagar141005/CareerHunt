import React, { useState } from "react";

const acquisitionStats = [
    { label: "Applications", value: 64, color: "#FF5DCB" },
    { label: "Shortlisted", value: 18, color: "#4AD588" },
    { label: "On-hold", value: 10, color: "#FDBA48" },
    { label: "Rejected", value: 8, color: "#E74C3C" },
];

const HorizontalBar = () => {
    const [ timeRange, setTimeRange ] = useState("7")

  return (
    <div className="p-4 w-full max-w-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-gray-800">Acquisitions</h3>
        <select
        className="text-blue-400 appearance-none p-1 text-sm font-medium"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}>
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
                <span className="font-semibold text-gray-900">{item.value}</span>
            </div>
        ))}
      </div>
    </div>
  )
}

export default HorizontalBar
