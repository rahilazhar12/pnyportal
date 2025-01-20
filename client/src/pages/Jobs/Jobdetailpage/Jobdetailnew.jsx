// JobPage.jsx
import React, { useState, useEffect } from "react";
import { FiHeart, FiShare2, FiSend } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { toast } from "react-toastify";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";
import ad from "../../../assets/img/logo/ad.jpg";

const JobPage = () => {
  const { id } = useParams(); // Getting the job ID from the slug in the URL
  const [activeTab, setActiveTab] = useState("JobDescription");
  const [showShareOptions, setShowShareOptions] = useState(false);
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

  const projectUrl = `https://pnycareer.com/job_details/${id}`; // Ensure URL is valid with no extra slashes
  const projectTitle = `${jobData.jobTitle}`;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:px-10 lg:px-24 bg-gray-200">
      {/* Left Section */}
      <div className="w-full md:w-2/3 bg-white shadow-lg rounded-lg px-6 py-4">
        {/* Sticky Section from Title to Tabs */}
        <div className="sticky top-12 bg-white  border-b border-gray-200">
          {/* Job Title and Company Logo */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between ">
            <div>
              <h1 className="text-2xl font-bold">{jobData.jobTitle}</h1>
              <p className="text-gray-600">{jobData.companyName}</p>
            </div>
            <img
              src={`${import.meta.env.VITE_API_URL}/uploads/${
                jobData.companyLogo
              }`}
              alt="Company Logo"
              className="h-28 w-28 block sm:mt-0"
            />
          </div>

          {/* Salary, Duration, and Hours */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 space-y-2 sm:space-y-0">
            <span className="text-lg font-semibold text-center sm:text-left">
              PKR {jobData.maxPrice} • {jobData.salaryType} •
              {jobData.experienceLevel}
            </span>
            <div className="flex items-center space-x-4">
              {/* <button className="p-2 border border-blue-500 rounded-full hover:bg-blue-200">
                <FiHeart className="w-5 h-5 text-blue-500" />
              </button> */}
              <button
                onClick={applyForJob}
                className="flex items-center bg-blue-500 text-white px-4 py-2 mt-3 rounded hover:bg-blue-600 space-x-2"
              >
                <FiSend className="w-5 h-5 rotate-45" />
                <span>Apply Now</span>
              </button>
            </div>
          </div>

          {/* Location, Date, and Work Type */}
          <div className="flex items-center text-gray-500 text-sm space-x-2">
            <HiOutlineLocationMarker className="w-4 h-4 text-gray-500" />
            <span>
              {jobData.jobLocation} - {jobData.postingDate}
            </span>
          </div>

          {/* Share Button */}
          <button
            className="mt-4 flex items-center text-gray-700 space-x-2 hover:text-blue-500"
            onClick={() => setShowShareOptions(!showShareOptions)}
          >
            <FiShare2 className="w-5 h-5" />
            <span>Share this project</span>
          </button>

          {/* Share Options */}
          {showShareOptions && (
            <div className="mt-2 flex space-x-3">
              <FacebookShareButton url={projectUrl} quote={projectTitle}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton url={projectUrl} title={projectTitle}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <LinkedinShareButton url={projectUrl} title={projectTitle}>
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
              <WhatsappShareButton url={projectUrl} title={projectTitle}>
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex space-x-4 border-b border-gray-200 mt-4">
            <button
              className={`text-sm font-bold px-4 py-2 ${
                activeTab === "JobDescription"
                  ? "text-blue-600 font-semibold border-b-2 border-blue-500"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("JobDescription")}
            >
              Job Description
            </button>
            <button
              className={`text-sm font-bold px-4 py-2 ${
                activeTab === "AboutCompany"
                  ? "text-blue-600 font-semibold border-b-2 border-blue-500"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("AboutCompany")}
            >
              About Company
            </button>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {jobData.skillsRequired.map((skills, index) => {
              const parsedSkills = JSON.parse(skills);
              return parsedSkills.map((skill, i) => (
                <span
                  key={`${index}-${i}`}
                  className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full border border-blue-300"
                >
                  {skill}
                </span>
              ));
            })}
          </div>
        </div>

        {/* Conditional Content */}
        <div className="mt-6">
          {activeTab === "JobDescription" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Project Detail</h2>
              <p className="text-gray-700 mb-4">{jobData.description}</p>

              {/* Additional Details Section */}
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Compensation</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-gray-700">
                  <div className="font-semibold">Location:</div>
                  <div>{jobData.jobLocation}</div>
                  <div className="font-semibold">Compensation:</div>
                  <div>PKR {jobData.maxPrice}</div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "AboutCompany" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">About Company</h2>
              <p className="text-gray-700">
              {jobData.about || "Company information is not available."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Section (Advertisements) */}
      <div className="w-full md:w-1/4 flex flex-col gap-4">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <a
            href="https://www.pnytrainings.com/digital-media-marketing-courses"
            target="_blank"
          >
            <img
              src={ad}
              alt="Ad 1"
              className="w-full object-cover rounded-md mb-2"
            />
          </a>
          <p className="text-gray-700 text-center">Digital Media Marketing</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4">
          <a
            href="https://www.pnytrainings.com/digital-media-marketing-courses"
            target="_blank"
          >
            <img
              src={ad}
              alt="Ad 1"
              className="w-full object-cover rounded-md mb-2"
            />
          </a>
          <p className="text-gray-700 text-center">Digital Media Marketing</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4">
          <a
            href="https://www.pnytrainings.com/digital-media-marketing-courses"
            target="_blank"
          >
            <img
              src={ad}
              alt="Ad 1"
              className="w-full object-cover rounded-md mb-2"
            />
          </a>
          <p className="text-gray-700 text-center">Digital Media Marketing</p>
        </div>
      </div>
    </div>
  );
};

export default JobPage;



