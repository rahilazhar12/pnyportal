import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FormControl,
  Select,
  MenuItem,
  Typography,
  Button,
} from "@mui/material";

import "../../../assets/css/style.css";

const Joblistingnew = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

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

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 20; // Show 20 jobs per page

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

  // Helper function to filter jobs
  const filterJobs = (location, jobTypes) => {
    let updated = [...jobs];

    if (location) {
      updated = updated.filter((job) => job.jobLocation === location);
    }

    if (jobTypes.fullTime) {
      updated = updated.filter((job) => job.employmentType === "Full-time");
    }
    if (jobTypes.partTime) {
      updated = updated.filter((job) => job.employmentType === "Part-time");
    }
    if (jobTypes.remote) {
      updated = updated.filter((job) => job.employmentType === "Remote");
    }
    if (jobTypes.freelance) {
      updated = updated.filter((job) => job.employmentType === "Freelance");
    }

    // Once we filter, set current page back to 1
    setFilteredJobs(updated);
    setCurrentPage(1);
  };

  // Location filter change
  const handleLocationChange = (event) => {
    const selected = event.target.value;
    setSelectedLocation(selected);
    filterJobs(selected, selectedJobTypes);
  };

  // Job type checkbox change
  const handleJobTypeChange = (event) => {
    const { name, checked } = event.target;
    const updatedJobTypes = { ...selectedJobTypes, [name]: checked };
    setSelectedJobTypes(updatedJobTypes);
    filterJobs(selectedLocation, updatedJobTypes);
  };

  // Apply / see details
  // const applyForJob = async (jobId) => {
  //   navigate(`/job_details/${jobId}`);
  // };

  const applyForJob = (job) => {
    const jobTitleWithoutSpaces = job.jobTitle.replace(/\s+/g, ""); // Remove spaces
    const jobIdLastTwoDigits = job._id.slice(-5); // Get last two digits of _id
    navigate(`/job_details/${jobTitleWithoutSpaces}-${jobIdLastTwoDigits}`, { state: { job } }); // Pass job data via state
  };
  

  // --- CALCULATE DISPLAYED JOBS (pagination) ---
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const displayedJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // --- TOTAL PAGES ---
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // --- HANDLE PAGE CHANGE ---
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="p-6">
        {/* Job List Area Start */}
        <div className="job-listing-area pt-30 pb-30">
          <div className="container mx-auto">
            <div className="flex flex-wrap">
              {/* Left content (Filters) */}
              <div className="w-full xl:w-1/4 lg:w-1/4 md:w-1/3">
                <div className="flex flex-col">
                  <div className="w-full">
                    <div className="small-section-tittle2 mb-12">
                      <div className="ion">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          width="20px"
                          height="12px"
                        >
                          <path
                            fillRule="evenodd"
                            fill="rgb(27, 207, 107)"
                            d="M7.778,12.000 L12.222,12.000 L12.222,10.000 L7.778,10.000 L7.778,12.000 ZM-0.000,-0.000 L-0.000,2.000 L20.000,2.000 L20.000,-0.000 L-0.000,-0.000 ZM3.333,7.000 L16.667,7.000 L16.667,5.000 L3.333,5.000 L3.333,7.000 Z"
                          />
                        </svg>
                      </div>
                      <h4>Filter Jobs</h4>
                    </div>
                  </div>
                </div>
                {/* Job Category Listing start */}
                <div className="job-category-listing mb-12">
                  {/* single one */}
                  <div className="single-listing">
                    {/* Filter by Job Type */}
                    <div className="select-Categories">
                      <div className="small-section-tittle2 pb-10">
                        <h4>Job Type</h4>
                      </div>
                      <label className="container">
                        Full Time
                        <input
                          type="checkbox"
                          name="fullTime"
                          checked={selectedJobTypes.fullTime}
                          onChange={handleJobTypeChange}
                        />
                        <span className="checkmark" />
                      </label>
                      <label className="container">
                        Part Time
                        <input
                          type="checkbox"
                          name="partTime"
                          checked={selectedJobTypes.partTime}
                          onChange={handleJobTypeChange}
                        />
                        <span className="checkmark" />
                      </label>
                      <label className="container">
                        Remote
                        <input
                          type="checkbox"
                          name="remote"
                          checked={selectedJobTypes.remote}
                          onChange={handleJobTypeChange}
                        />
                        <span className="checkmark" />
                      </label>
                      <label className="container">
                        Freelance
                        <input
                          type="checkbox"
                          name="freelance"
                          checked={selectedJobTypes.freelance}
                          onChange={handleJobTypeChange}
                        />
                        <span className="checkmark" />
                      </label>
                    </div>
                  </div>
                  {/* single two */}
                  <div className="single-listing">
                    <div className="small-section-tittle2 pb-4">
                      <h4>Job Location</h4>
                    </div>
                    <FormControl fullWidth>
                      <Select
                        value={selectedLocation}
                        onChange={handleLocationChange}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Select Location
                        </MenuItem>
                        {/* Option to clear location filter */}
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
                {/* Job Category Listing End */}
              </div>

              {/* Right content (Jobs) */}
              <div className="w-full xl:w-3/4 lg:w-3/4 md:w-2/3">
                <section className="featured-job-area">
                  <div className="container mx-auto">
                    {/* Count of Job list Start */}
                    <div className="row">
                      <div className="w-full">
                        <div className="count-job mb-12">
                          <Typography variant="h6" className="font-bold">
                            {filteredJobs.length}{" "}
                            {filteredJobs.length === 1 ? "Job" : "Jobs"} found
                          </Typography>
                        </div>
                      </div>
                    </div>
                    {/* Count of Job list End */}

                    {/* Single-job-content (use displayedJobs) */}
                    {displayedJobs.length > 0 ? (
                      displayedJobs.map((job) => (
                        <div className="single-job-items mb-8 " key={job._id} >
                          <div className="job-items">
                            <div className="company-img">
                              <button>
                                <img
                                  className="border"
                                  src={`${
                                    import.meta.env.VITE_API_URL
                                  }/uploads/${job.companyLogo}`}
                                  alt={job.companyName}
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "contain",
                                  }}
                                />
                              </button>
                            </div>
                            <div className="job-tittle job-tittle2">
                              <button onClick={() => applyForJob(job)}>
                                <h4 className="font-bold text-xl mb-2 mt-2">{job.jobTitle}</h4>
                              </button>
                              <ul className="list-none">
                                {/* <li>{job.companyName}</li>
                                <li>
                                  <i className="fas fa-map-marker-alt" />
                                  {job.jobLocation}
                                </li>
                                <li>{job.maxPrice}</li> */}
                               <li className="text-black">{job.jobDescription}</li>

                              </ul>
                              

                            </div>
                          </div>
                          <div className="items-link items-link2 float-left">
                            <Button
                              variant="outlined"
                              style={{
                                borderColor: "#A78BFA",
                                color: "#A78BFA",
                                borderRadius: "50px",
                                padding: "10px 34px",
                                fontSize: "12px",
                                textTransform: "none",
                              }}
                              onClick={() => applyForJob(job)}
                            >
                              Details
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div>No jobs found</div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
        {/* Job List Area End */}

        {/* Pagination Start */}
        {totalPages > 1 && (
          <div className="pagination-area pb-12 text-center">
            <div className="container mx-auto">
              <div className="single-wrap flex justify-center">
                <nav aria-label="Page navigation example">
                  <ul className="pagination flex">
                    {/* Previous Button */}
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <a
                        className="page-link"
                        href="#!"
                        onClick={() =>
                          currentPage > 1 && handlePageChange(currentPage - 1)
                        }
                      >
                        <span className="ti-angle-left" />
                      </a>
                    </li>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <li
                          key={page}
                          className={`page-item ${
                            page === currentPage ? "active" : ""
                          }`}
                        >
                          <a
                            className="page-link"
                            href="#!"
                            onClick={() => handlePageChange(page)}
                          >
                            {page < 10 ? `0${page}` : page}
                          </a>
                        </li>
                      )
                    )}

                    {/* Next Button */}
                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                    >
                      <a
                        className="page-link"
                        href="#!"
                        onClick={() =>
                          currentPage < totalPages &&
                          handlePageChange(currentPage + 1)
                        }
                      >
                        <span className="ti-angle-right" />
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        )}
        {/* Pagination End */}
      </div>
    </>
  );
};

export default Joblistingnew;
