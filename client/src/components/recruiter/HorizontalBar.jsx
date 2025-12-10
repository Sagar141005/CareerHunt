import React, { useMemo, useState } from "react";
import useRecentApplications from "../../hooks/useRecentApplications";
import { RiFilter3Line } from "@remixicon/react";

const HorizontalBar = () => {
  const [timeRange, setTimeRange] = useState(7);
  const { applications } = useRecentApplications({ days: timeRange });

  const stats = useMemo(() => {
    const total = applications.length || 1;
    const counts = {
      Applied: applications.length,
      Shortlisted: applications.filter((app) => app.status === "Shortlisted")
        .length,
      Interview: applications.filter((app) => app.status === "On-hold").length,
      Rejected: applications.filter((app) => app.status === "Rejected").length,
    };

    return [
      {
        label: "Applied",
        count: counts.Applied,
        color: "bg-blue-500",
        percent: 100,
      },
      {
        label: "Shortlisted",
        count: counts.Shortlisted,
        color: "bg-emerald-500",
        percent: (counts.Shortlisted / total) * 100,
      },
      {
        label: "On Hold",
        count: counts.Interview,
        color: "bg-amber-400",
        percent: (counts.Interview / total) * 100,
      },
      {
        label: "Rejected",
        count: counts.Rejected,
        color: "bg-red-500",
        percent: (counts.Rejected / total) * 100,
      },
    ];
  }, [applications]);

  return (
    <div className="h-full flex flex-col">
      <div className="-mx-6 -mt-6 px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
        <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <RiFilter3Line
            className="text-blue-600 dark:text-blue-400"
            size={20}
          />
          Funnel
        </h3>

        <select
          className="bg-transparent text-xs font-semibold text-neutral-500 dark:text-neutral-400 cursor-pointer focus:outline-none"
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
        </select>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-6">
        {stats.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-xs font-semibold mb-2 text-neutral-600 dark:text-neutral-300">
              <span>{item.label}</span>
              <span>{item.count}</span>
            </div>

            <div className="w-full h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${item.color}`}
                style={{ width: `${item.percent}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalBar;
