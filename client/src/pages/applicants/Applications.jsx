import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Applications = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/jobs/jobs/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }
        const data = await response.json();
        setApplications(data.applications || []);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [id]);

  const handleViewAndUpdateStatus = async (app) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/jobs/update-status/${app.applicant}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Open" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update application status");
      }

      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application._id === app._id ? { ...application, status: "Open" } : application
        )
      );
      
      navigate(`/user_profile/${app.applicant}`);
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  console.log(applications , 'app')
  return (
    <Box p={4}>
      <Typography variant="h4" align="center" gutterBottom>
        Job Applications
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">City</TableCell>
              <TableCell align="center">Contact</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Application Date</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app._id}>
                <TableCell align="center">{app.name}</TableCell>
                <TableCell align="center">{app.city}</TableCell>
                <TableCell align="center">{app.contact}</TableCell>
                <TableCell align="center">{app.email}</TableCell>
                <TableCell align="center">
                  {app.applicationDate
                    ? new Date(app.applicationDate).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell align="center">{app.status}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleViewAndUpdateStatus(app)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Applications;