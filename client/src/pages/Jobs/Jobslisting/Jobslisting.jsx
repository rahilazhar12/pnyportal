import React, { useEffect, useState } from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const JobListingArea = () => {
  const { slug } = useParams();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [jobLocations, setJobLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedJobTypes, setSelectedJobTypes] = useState({
    fullTime: false,
    partTime: false,
    remote: false,
    freelance: false,
  });
  const [loadingJobId, setLoadingJobId] = useState(null); // Track the job being applied to

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/jobs/jobs-by-category/${slug}`
        );
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
          setFilteredJobs(data);
          const locations = Array.from(
            new Set(data.map((job) => job.jobLocation))
          );
          setJobLocations(locations);
        } else {
          console.error("Failed to fetch jobs:", response.status);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, [slug]);

  const handleLocationChange = (event) => {
    const selected = event.target.value;
    setSelectedLocation(selected);
    filterJobs(selected, selectedJobTypes);
  };

  const handleJobTypeChange = (event) => {
    const { name, checked } = event.target;
    setSelectedJobTypes((prev) => ({
      ...prev,
      [name]: checked,
    }));
    filterJobs(selectedLocation, { ...selectedJobTypes, [name]: checked });
  };

  const filterJobs = (location, jobTypes) => {
    let filtered = jobs;

    if (location) {
      filtered = filtered.filter((job) => job.jobLocation === location);
    }

    if (jobTypes.fullTime) {
      filtered = filtered.filter((job) => job.employmentType === "Full-time");
    }
    if (jobTypes.partTime) {
      filtered = filtered.filter((job) => job.employmentType === "Part-time");
    }
    if (jobTypes.remote) {
      filtered = filtered.filter((job) => job.employmentType === "Remote");
    }
    if (jobTypes.freelance) {
      filtered = filtered.filter((job) => job.employmentType === "Freelance");
    }

    setFilteredJobs(filtered);
  };

  const applyForJob = async (jobId) => {
    if (loadingJobId) return; // Prevent further clicks while loading

    setLoadingJobId(jobId); // Set loading state for this job

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/jobs/apply/${jobId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const result = await response.json();

      // Dismiss any active toasts before showing a new one
      toast.dismiss();

      if (response.ok) {
        toast.success("Application submitted successfully!");
        // navigate("/applications"); // You can enable navigation if needed
      } else {
        toast.error(result.message || "Failed to apply for the job.");
      }
    } catch (error) {
      console.error("Error applying for the job:", error);
      toast.dismiss(); // Ensure the previous toast is dismissed
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoadingJobId(null); // Reset the loading state once the request is completed
    }
  };

  return (
    <div className="job-listing-area bg-gray-100 pt-12 pb-12">
      <div className="container mx-auto px-4">
        <Grid container spacing={4}>
          {/* Left Content */}
          <Grid item xs={12} md={3}>
            <div className="mb-8">
              <Typography variant="h6" className="font-bold mb-4">
                Filter Jobs
              </Typography>
            </div>

            <div className="job-category-listing mb-8">
              {/* Job Type */}
              <div className="mb-8">
                <Typography variant="body1" className="font-semibold mb-4">
                  Job Type
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="fullTime"
                      checked={selectedJobTypes.fullTime}
                      onChange={handleJobTypeChange}
                    />
                  }
                  label="Full Time"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="partTime"
                      checked={selectedJobTypes.partTime}
                      onChange={handleJobTypeChange}
                    />
                  }
                  label="Part Time"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="remote"
                      checked={selectedJobTypes.remote}
                      onChange={handleJobTypeChange}
                    />
                  }
                  label="Remote"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="freelance"
                      checked={selectedJobTypes.freelance}
                      onChange={handleJobTypeChange}
                    />
                  }
                  label="Freelance"
                />
              </div>

              {/* Job Location */}
              <div className="mb-8">
                <Typography variant="body1" className="font-semibold mb-4">
                  Job Location
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={selectedLocation}
                    onChange={handleLocationChange}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select Location
                    </MenuItem>
                    <MenuItem value="">Anywhere</MenuItem>
                    {jobLocations.map((location) => (
                      <MenuItem key={location} value={location}>
                        {location}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </Grid>

          {/* Right Content */}
          <Grid item xs={12} md={9}>
            <section className="featured-job-area">
              <div className="flex justify-between items-center mb-8">
                <Typography variant="h6" className="font-bold">
                  {filteredJobs.length}{" "}
                  {filteredJobs.length === 1 ? "Job" : "Jobs"} found
                </Typography>
              </div>

              <Grid container spacing={2}>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <Grid item xs={12} key={job._id}>
                      <Card
                        className="hover:shadow-lg transition-shadow mb-6"
                        style={{ borderRadius: "12px", padding: "16px" }}
                      >
                        <CardContent
                          className="flex justify-between items-center"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          {/* Left content with job details */}
                          <div className="flex justify-between flex-row">
                            <img
                              src={`${import.meta.env.VITE_API_URL}/uploads/${
                                job.companyLogo
                              }`}
                              alt={job.companyName}
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "contain",
                                marginRight: "16px",
                                borderRadius: "0px",
                                border: "1px solid blue",
                                padding: "3px",
                              }}
                            />
                            <div
                              className="flex justify-between items-center"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <div
                                className="flex flex-col"
                                style={{ marginRight: "16px" }}
                              >
                                <Typography
                                  variant="h6"
                                  style={{
                                    fontWeight: "bold",
                                    color: "#1F2937",
                                  }}
                                >
                                  {job.jobTitle}
                                </Typography>
                                <div
                                  className="flex"
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginTop: "4px",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    style={{
                                      color: "#6B7280",
                                      marginRight: "16px",
                                    }}
                                  >
                                    <span>Company Name :</span>{" "}
                                    {job.companyName}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    style={{
                                      color: "#6B7280",
                                      marginRight: "16px",
                                    }}
                                  >
                                    <span>Salary:</span>
                                    {job.maxPrice}
                                  </Typography>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      color: "#9CA3AF",
                                    }}
                                  >
                                    <i
                                      className="fas fa-map-marker-alt"
                                      style={{ marginRight: "4px" }}
                                    ></i>
                                    <Typography
                                      variant="body2"
                                      style={{ color: "#6B7280" }}
                                    >
                                      <span>Location:</span>
                                      {job.jobLocation}
                                    </Typography>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right content with job type and time */}
                          <div style={{ textAlign: "right" }}>
                            <Button
                              variant="outlined"
                              style={{
                                borderColor: "#A78BFA",
                                color: "#A78BFA",
                                borderRadius: "50px",
                                padding: "6px 16px",
                                fontSize: "12px",
                                textTransform: "none",
                              }}
                              onClick={() => applyForJob(job._id)} // Trigger the apply function on button click
                              disabled={loadingJobId === job._id} // Disable the button while loading
                            >
                              {loadingJobId === job._id ? (
                                <CircularProgress size={24} />
                              ) : (
                                "Apply Now"
                              )}
                            </Button>
                            <Typography
                              variant="body2"
                              style={{ marginTop: "8px", color: "#9CA3AF" }}
                            >
                              {job.time}
                            </Typography>
                          </div>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Typography variant="body1">No jobs found</Typography>
                )}
              </Grid>
            </section>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default JobListingArea;
