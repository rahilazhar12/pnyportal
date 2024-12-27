import { useState, useEffect } from "react";

// Custom hook to fetch dashboard data using fetch API
const Dashboardcardsapi = () => {
  const [data, setData] = useState({
    totalCompanies: null,
    totalUsers: null,
    alumniCount: null,
    jobs: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, usersRes, alumniRes, jobs] = await Promise.all([
          fetch(
            `${import.meta.env.VITE_API_URL}/api/v1/company/get-all-companies`
          ).then((res) => res.json()),
          fetch(
            `${import.meta.env.VITE_API_URL}/api/v1/users/get-all-users`
          ).then((res) => res.json()),
          fetch(
            `${import.meta.env.VITE_API_URL}/api/v1/users/get-all-pnyalumini`
          ).then((res) => res.json()),
          fetch(`${import.meta.env.VITE_API_URL}/api/v1/jobs/getjobs`).then(
            (res) => res.json()
          ),
        ]);

        setData({
          totalCompanies: companiesRes.length, // Adjusted to use length
          totalUsers: usersRes.length,
          alumniCount: alumniRes.length,
          jobs: jobs.length,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return data;
};

export default Dashboardcardsapi;
