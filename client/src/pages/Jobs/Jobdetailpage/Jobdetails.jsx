import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./Jobdetail.css";

const Jobdetails = () => {
  const { id } = useParams(); // Getting the job ID from the slug in the URL
  const [jobData, setJobData] = useState(null); // State to store API data
  const [loadingJobId, setLoadingJobId] = useState(null); // Track the job being applied to
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Function to fetch job data from the API
    const fetchJobData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/jobs/getjobs/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch job data");
        }
        const data = await response.json(); // Convert the response to JSON
        setJobData(data.job[0]); // Set the fetched data
      } catch (error) {
        setError(error.message); // Handle any errors
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchJobData();
  }, [id]); // Run this effect whenever the 'id' changes

  if (loading) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error if there's an issue with fetching
  }

  if (!jobData) {
    return <div>No Job Data Available</div>; // Fallback if no data is available
  }

  const applyForJob = async () => {
    if (loadingJobId) return; // Prevent further clicks while loading

    setLoadingJobId(id); // Set loading state for this job

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/jobs/apply/${id}`,
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
    <>
      <div>
        <div className="slider-area">
          <div
            className="single-slider section-overly h-96 md:h-128 lg:h-144 flex items-center"
            style={{ backgroundImage: "url(../src/assets/img/hero/about.jpg)" }}
          >
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex justify-center">
                <div className="text-center">
                  <div className="hero-cap">
                    <h2 className="text-xl md:text-3xl lg:text-4xl">
                      UI/UX Designer
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="job-post-company pt-28 pb-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row justify-between">
              {/* Left Content */}
              <div className="w-full lg:w-7/12 mb-12 lg:mb-0">
                {/* job single */}
                <div className="single-job-items mb-12">
                  <div className="job-items flex">
                    <div className="company-img company-img-details">
                      <a href="#">
                        <img
                          className="border"
                          src={`${import.meta.env.VITE_API_URL}/uploads/${
                            jobData.companyLogo
                          }`}
                          alt={jobData.companyName}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "contain",
                          }}
                        />
                      </a>
                    </div>
                    <div className="job-tittle text-justify">
                      <p>{jobData.description}</p>
                    </div>
                  </div>
                </div>
                {/* job single End */}
                <div className="job-post-details">
                  {/* <div className="post-details1 mb-12">
                    
                    <div className="small-section-tittle">
                      <h4 className="text-lg md:text-xl lg:text-2xl">
                        Job Description
                      </h4>
                    </div>
                    <p className="text-base md:text-lg">
                      {jobData.description}
                    </p>
                  </div> */}
                  <div className="post-details2 mb-12">
                    {/* Small Section Tittle */}
                    <div className="small-section-tittle">
                      <h4 className="text-lg md:text-xl lg:text-2xl">
                        Required Skills, and Abilities
                      </h4>
                    </div>
                    <ul className="list-disc pl-4 md:pl-6">
                      {jobData.skillsRequired.map((skills, index) => {
                        // Parse the string into an array
                        const parsedSkills = JSON.parse(skills);

                        return (
                          // Create separate <li> for each skill
                          parsedSkills.map((skill, i) => (
                            <li key={`${index}-${i}`}>{skill}</li>
                          ))
                        );
                      })}
                    </ul>
                  </div>

                  {/* <div className="post-details2 mb-12">
                   
                    <div className="small-section-tittle">
                      <h4 className="text-lg md:text-xl lg:text-2xl">
                        Education + Experience
                      </h4>
                    </div>
                    <ul className="list-disc pl-4 md:pl-6">
                      <li>3 or more years of professional design experience</li>
                      <li>Direct response email experience</li>
                      <li>Ecommerce website design experience</li>
                      <li>Familiarity with mobile and web apps preferred</li>
                      <li>Experience using Invision is a plus</li>
                    </ul>
                  </div> */}
                </div>
              </div>
              {/* Right Content */}
              <div className="w-full lg:w-4/12">
                <div className="post-details3 mb-12">
                  {/* Small Section Title */}
                  <div className="small-section-tittle">
                    <h4 className="text-lg md:text-xl lg:text-2xl md:mb-4">
                      Job Overview
                    </h4>
                  </div>
                  <ul>
                    <li>
                      Posted date : <span>{jobData.postingDate}</span>
                    </li>
                    <li>
                      Location : <span>{jobData.jobLocation}</span>
                    </li>
                    {/* <li>
                      Vacancy : <span>{jobData.vacancy}</span>
                    </li> */}
                    <li>
                      Job nature : <span>{jobData.employmentType}</span>
                    </li>
                    <li>
                      Salary : <span>{jobData.maxPrice}</span>
                    </li>
                    {/* <li>
                      Application date : <span>{jobData.applicationDate}</span>
                    </li> */}
                  </ul>
                  <div className="apply-btn2">
                    <button onClick={applyForJob} href="#" className="btn">
                      Apply Now
                    </button>
                  </div>
                </div>

                <div className="post-details4 mb-12">
                  <div className="small-section-tittle">
                    <h4 className="text-lg md:text-xl lg:text-2xl md:mb-4">
                      Company Information
                    </h4>
                  </div>
                  {/* <span className="text-lg md:text-xl">Colorlib</span> */}
                  {/* <p className="text-base md:text-lg">
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout.
                  </p> */}
                  <ul>
                    <li>
                      Name: <span>{jobData.companyName}</span>
                    </li>
                    {/* <li>
                      Web : <span>colorlib.com</span>
                    </li> */}
                    <li>
                      Email: <span>{jobData.jobPostedBy}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Jobdetails;
