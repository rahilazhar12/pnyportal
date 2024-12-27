import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  FormControl,
  Select,
  MenuItem,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
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
    navigate(`/job_details/${jobId}`);
  };

  return (
    <>
      <div className="p-6">
        {/* Job List Area Start */}
        <div className="job-listing-area pt-30 pb-30">
          <div className="container mx-auto">
            <div className="flex flex-wrap">
              {/* Left content */}
              <div className="w-full xl:w-1/4 lg:w-1/4 md:w-1/3">
                <div className="flex flex-col">
                  <div className="w-full">
                    <div className="small-section-tittle2 mb-12">
                      <div className="ion">
                        {" "}
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
                    {/* Select job items start */}

                    {/*  Select job items End*/}
                    {/* select-Categories start */}
                    <div className="select-Categories  ">
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
                          defaultChecked="checked active"
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
                    {/* select-Categories End */}
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
                        <MenuItem value="">Anywhere</MenuItem>
                        {jobLocations.map((location) => (
                          <MenuItem key={location} value={location}>
                            {location}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {/*  Select job items End*/}

                    {/* select-Categories End */}
                  </div>
                  {/* single three */}
                </div>
                {/* Job Category Listing End */}
              </div>
              {/* Right content */}
              <div className="w-full xl:w-3/4 lg:w-3/4 md:w-2/3">
                {/* Featured_job_start */}
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
                    {/* single-job-content */}
                    {filteredJobs.length > 0 ? (
                      filteredJobs.map((job) => (
                        <div className="single-job-items mb-8" key={job._id}>
                          <div className="job-items">
                            <div className="company-img">
                              <a href="#">
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
                              </a>
                            </div>
                            <div className="job-tittle job-tittle2">
                              <a href="#">
                                <h4>{job.jobTitle}</h4>
                              </a>
                              <ul className="list-none">
                                <li>{job.companyName}</li>
                                <li>
                                  <i className="fas fa-map-marker-alt" />
                                  {job.jobLocation}
                                </li>
                                <li>{job.maxPrice}</li>
                              </ul>
                            </div>
                          </div>
                          <div className="items-link items-link2 float-right">
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
                              onClick={() => applyForJob(job._id)} // Trigger the apply function on button click
                            >
                              Details
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div variant="body1">No jobs found</div>
                    )}

                    {/* Repeat similar sections for other job listings */}
                  </div>
                </section>
                {/* Featured_job_end */}
              </div>
            </div>
          </div>
        </div>
        {/* Job List Area End */}
        {/* Pagination Start */}
        {/* <div className="pagination-area pb-12 text-center">
          <div className="container mx-auto">
            <div className="row">
              <div className="w-full">
                <div className="single-wrap flex justify-center">
                  <nav aria-label="Page navigation example">
                    <ul className="pagination flex justify-start">
                      <li className="page-item active">
                        <a className="page-link" href="#">
                          01
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          02
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          03
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          <span className="ti-angle-right" />
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {/* Pagination End */}
      </div>
    </>
  );
};

export default Joblistingnew;
