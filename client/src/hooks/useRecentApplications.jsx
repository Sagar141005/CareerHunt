import React, { useEffect, useState } from 'react'
import api from '../api/axios';

const useRecentApplications = ({ days, status }) => {
    const [ applications, setApplications ] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const sinceDate = new Date();
                sinceDate.setDate(sinceDate.getDate() - days);
                const since = sinceDate.toISOString();

                const params = new URLSearchParams();
                if(status) {
                    const statuses = Array.isArray(status) ? status : [status];
                    params.append('statusQuery', statuses.join(','));
                }
                params.append('since', since);

                const response = await api.get(`/job-posts/applications/all?${params.toString()}`);
                setApplications(response.data.applications || []);
            } catch (error) {
                console.error("Error fetching job applications:", error);
            }
        }

        fetchApplications();
    }, [days, status]);
  return { applications };
}

export default useRecentApplications
