import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const useMonthlyGrowth = (status) => {
  const [percentage, setPercentage] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const queryParam = status ? `?statusQuery=${status}` : '';
        const response = await api.get(`/job-posts/applications/all${queryParam}`);
        const applications = response.data.applications;

        if (!applications || applications.length === 0) {
          setCurrentCount(0);
          setPercentage(0);
          return;
        }

        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

        let current = 0;
        let previous = 0;

        for (const app of applications) {
          const date = new Date(app.createdAt);
          if (isNaN(date.getTime())) continue;

          const month = date.getMonth();
          const year = date.getFullYear();

          if (month === thisMonth && year === thisYear) current++;
          else if (month === lastMonth && year === lastMonthYear) previous++;
        }

        const growth =
          previous === 0
            ? current > 0
              ? 100
              : 0
            : Math.round(((current - previous) / previous) * 100);

        setCurrentCount(current);
        setPercentage(growth);
      } catch (error) {
        console.error('Failed to fetch monthly growth:', error);
        setCurrentCount(0);
        setPercentage(0);
      }
    };

    fetchApplications();
  }, [status]);

  return { percentage, currentCount };
};

export default useMonthlyGrowth;
