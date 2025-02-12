import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const UserApplication = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/jobs/applications`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }
        const data = await response.json();
        setApplications(data.applications);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const applyForJob = (job) => {
    const jobTitleWithoutSpaces = job.jobTitle.replace(/\s+/g, ""); // Remove spaces
    const jobIdLastTwoDigits = job._id.slice(-5); // Get last two digits of _id
    navigate(`/job_details/${jobTitleWithoutSpaces}-${jobIdLastTwoDigits}`, {
      state: { job },
    }); // Pass job data via state
  };

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="p-6  mx-auto">
      <h2 className="text-2xl font-bold mb-4">Job Applications</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company Name</TableCell>
              <TableCell>Job Title</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app._id}>
                <TableCell>{app.job.companyName}</TableCell>
                <TableCell>{app.job.jobTitle}</TableCell>
                <TableCell>{app.job.jobLocation}</TableCell>
                <TableCell>
                  {app.job.minPrice} - {app.job.maxPrice} {app.job.salaryType}
                </TableCell>
                <TableCell>{app.job.experienceLevel}</TableCell>
                <TableCell>{app.status}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => applyForJob(job)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserApplication;
