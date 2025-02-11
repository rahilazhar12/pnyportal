import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

function Jobslider() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/jobs/getjobs`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        setJobs(data); // Assuming the API response contains a "jobs" array
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  console.log(jobs);

  const settings = {
    dots: false,
    slidesToShow: Math.min(jobs.length, 4), // Show up to 4 slides but adapt to the number of jobs
    slidesToScroll: 1,
    autoplay: true,
    speed: 1500,
    autoplaySpeed: 3000,
    cssEase: "linear",
    infinite: jobs.length > 1, // Infinite loop only if there are more than one job
    initialSlide: 0,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(jobs.length, 3),
          slidesToScroll: 1,
          infinite: jobs.length > 1,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(jobs.length, 2),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const applyForJob = (job) => {
    const jobTitleWithoutSpaces = job.jobTitle.replace(/\s+/g, ""); // Remove spaces
    const jobIdLastTwoDigits = job._id.slice(-5); // Get last two digits of _id
    navigate(`/job_details/${jobTitleWithoutSpaces}-${jobIdLastTwoDigits}`, {
      state: { job },
    }); // Pass job data via state
  };

  return (
    <div className="slider-container px-4 py-2">
      <div className="flex p-4 justify-center font-bold text-2xl">
        <h1>Recommended Jobs</h1>
      </div>
      {jobs.length > 0 ? (
        <Slider {...settings}>
          {jobs.map((job) => (
            <div key={job._id} className="px-2">
              <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="p-5">
                  <button onClick={() => applyForJob(job)}>
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {job.jobTitle}
                    </h5>
                  </button>
                  <p className="mb-3 text-green-700 font-semibold dark:text-gray-400">
                    {job.jobLocation}
                  </p>
                  <p className="mb-3 text-green-700 font-semibold dark:text-gray-400">
                    {job.experienceLevel}
                  </p>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {job.postingDate}
                  </p>
                  <button
                    onClick={() => applyForJob(job)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Read more
                    <svg
                      className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-center">No jobs available at the moment</p>
      )}
    </div>
  );
}

export default Jobslider;
