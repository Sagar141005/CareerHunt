import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const useRecentApplications = ({ days, status }) => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const fetchApplications = async () => {
            try {
                const sinceDate = new Date();
                sinceDate.setDate(sinceDate.getDate() - Number(days));
                const since = sinceDate.toISOString();

                const params = new URLSearchParams();
                if (status) {
                    const statuses = Array.isArray(status) ? status : [status];
                    params.set('statusQuery', statuses.join(','));
                }
                params.set('since', since);

                const response = await api.get(`/job-posts/applications/all?${params.toString()}`);
                if (isMounted) {
                    setApplications(response.data.applications || []);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Error fetching job applications:", error);
                }
            }
        };

        fetchApplications();
        return () => { isMounted = false; };
    }, [days, JSON.stringify(status)]);

    return { applications };
};

export default useRecentApplications;
