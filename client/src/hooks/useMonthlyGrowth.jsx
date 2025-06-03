import React, { useEffect, useState } from 'react'
import api from '../api/axios'

const useMonthlyGrowth = (status) => {
    const [ percentage, setPercentage ] = useState(0);
    const [ currentCount, setCurrentCount ] = useState(0);    

    useEffect(() => {
        const fetchApplications = async() => {
            try {
                const queryParam = status ? `?status=${status}` : '';
                const response = await api.get(`/job-posts/all${queryParam}`);
                const applications = response.data.applications;

                if (!applications || applications.length === 0) {
                    setCurrentCount(0);
                    setPercentage(0);
                    return;
                  }

                const now = new Date();
                const thisMonth = now.getMonth();
                const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
                const thisYear = now.getFullYear();
                const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

                const currentMonthApps = applications.filter(app => {
                    const date = new Date(app.createdAt);
                    return date.getMonth() === thisMonth && date.getFullYear() === thisYear; 
                });

                const previousMonthApps = applications.filter(app => {
                    const date = new Date(app.createdAt);
                    return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
                });

                const current = currentMonthApps.length;
                const previous = previousMonthApps.length;

                const growth = previous === 0 
                ? current > 0 ? 100 : 0
                : Math.round(((current - previous) / previous) * 100);

                setCurrentCount(current);
                setPercentage(growth);
            } catch (error) {
                console.error("Failed to fetch monthly growth:", error);
            }
        }


        fetchApplications();
    }, [status])

    
  return { percentage, currentCount };
}

export default useMonthlyGrowth
