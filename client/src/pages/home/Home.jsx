import React, { useState } from "react";
import Featured from "./Featured";
import homebg from "../../assets/img/backgrounds/homebg.webp";
import { useSessionStorage } from "../../context/Sessionstorage";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Modal,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const Home = () => {
  const { user } = useSessionStorage();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [openResultsModal, setOpenResultsModal] = useState(false);
  const [jobs, setJobs] = useState([]); // Store search results

  // For responsive design
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClick = () => {
    if (user) {
      navigate("/new-profile");
    } else {
      setOpenModal(true); // Open login modal when user is not logged in
    }
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleLoginRedirect = () => {
    navigate("/login-users"); // Redirect to login page
  };

  // Define states for inputs and suggestions
  const [jobTitle, setJobTitle] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobTitleSuggestions, setJobTitleSuggestions] = useState([]);
  const [jobLocationSuggestions, setJobLocationSuggestions] = useState([]);

  const fetchJobTitleSuggestions = async (query) => {
    if (query) {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/jobs/suggestions?field=jobTitle&query=${query}`
      );
      const data = await response.json();
      setJobTitleSuggestions(data.length > 0 ? data : ["No results found"]);
    } else {
      setJobTitleSuggestions([]);
    }
  };

  const fetchJobLocationSuggestions = async (query) => {
    if (query) {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/jobs/suggestions?field=jobLocation&query=${query}`
      );
      const data = await response.json();
      setJobLocationSuggestions(data.length > 0 ? data : ["No results found"]);
    } else {
      setJobLocationSuggestions([]);
    }
  };

  const handleJobTitleChange = (e) => {
    const value = e.target.value;
    setJobTitle(value);
    fetchJobTitleSuggestions(value); // Fetch suggestions as user types
  };

  const handleJobLocationChange = (e) => {
    const value = e.target.value;
    setJobLocation(value);
    fetchJobLocationSuggestions(value); // Fetch suggestions as user types
  };

  // Fetch jobs based on the search
  const handleJobSearch = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/jobs/search?jobTitle=${jobTitle}&jobLocation=${jobLocation}`
      );
      const data = await response.json();
      setJobs(data.jobs);
      setOpenResultsModal(true); // Open modal with search results
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // Navigate to job details when clicking on a specific job
  const navigateToJobDetails = (jobId) => {
    navigate(`/job_details/${jobId}`);
  };

  return (
    <>
      <section
        className="relative h-screen bg-cover bg-center flex flex-col justify-center items-center text-center"
        style={{ backgroundImage: `url(${homebg})` }}
      >
        {/* Blurred Background Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-[1px]" />
        <div className="relative z-10 flex flex-col justify-center items-center h-full px-4 lg:px-16 text-center mb-17">
          <div className="tagline text-center text-3xl font-bold">
            <span>
              <span className="text-white font-source-sans">
                Find a career you
              </span>{" "}
              <span style={{ color: "#e63946" }} className="font-source-sans">
                love ❤️
              </span>{" "}
            </span>
          </div>

          <h1 className="text-2xl lg:text-5xl font-bold text-white mb-6 leading-tight font-source-sans">
            Shape Your Future <span className="text-4xl">&</span> Discover
            Opportunities with
            <br />
            PNY Career
          </h1>

          {/* Search Inputs Section */}
          <div className="flex flex-col md:flex-row md:flex-nowrap mt-4 space-y-4 md:space-y-0 md:space-x-4 w-full max-w-lg xl:max-w-3xl">
            {/* Job Title Input */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Job Title or Keyword"
                value={jobTitle}
                onChange={handleJobTitleChange}
                className="px-4 py-3 w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pb"
              />
              {jobTitle && (
                <ul className="absolute bg-white border border-gray-300 w-full z-10 max-h-40 overflow-y-auto">
                  {jobTitleSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        if (suggestion !== "No results found") {
                          setJobTitle(suggestion);
                        }
                        setJobTitleSuggestions([]);
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Location Input */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Location BD"
                value={jobLocation}
                onChange={handleJobLocationChange}
                className="px-4 py-3 w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pb"
              />
              {jobLocation && (
                <ul className="absolute bg-white border border-gray-300 w-full z-10 max-h-40 overflow-y-auto">
                  {jobLocationSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        if (suggestion !== "No results found") {
                          setJobLocation(suggestion);
                        }
                        setJobLocationSuggestions([]);
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Find Job Button */}
            <button
              onClick={handleJobSearch}
              className="px-8 py-3 bg-pb text-white font-semibold hover:bg-sr whitespace-nowrap w-full md:w-auto"
            >
              Find Job
            </button>
          </div>
        </div>
      </section>
      {/* Featured Section */}
      <Featured />

      {/* Job Results Modal */}
      <Modal open={openResultsModal} onClose={() => setOpenResultsModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isSmallScreen ? "90%" : "60%",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Job Search Results
          </Typography>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <Box
                key={job._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #ddd",
                  py: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {/* Display company logo */}
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${
                      job.companyLogo
                    }`} // Assuming companyLogo is available in job data
                    alt={`${job.companyName} logo`}
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: "cover",
                      borderRadius: "50%",
                      marginRight: 16,
                    }}
                  />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {job.jobTitle}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {job.companyName} - {job.jobLocation}
                    </Typography>
                  </Box>
                </Box>
                {/* Details Button */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigateToJobDetails(job._id)}
                >
                  Details
                </Button>
              </Box>
            ))
          ) : (
            <Typography>No jobs found for the specified criteria.</Typography>
          )}
        </Box>
      </Modal>

      {/* Other Modal for Login */}
      <Modal open={openModal} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isSmallScreen ? 300 : 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Login Required
          </Typography>
          <Typography variant="body1" color="textSecondary" mb={3}>
            You need to login first to build your resume.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLoginRedirect}
          >
            Go to Login
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Home;
