import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FiSend, FiShare2 } from "react-icons/fi";
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
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

const JobPage = () => {
  const location = useLocation();
  const jobData = location.state?.job; // Retrieve job data from state
  const { title } = useParams();
  const [loadingJobId, setLoadingJobId] = useState(null); // Track the job being applied to
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [activeTab, setActiveTab] = useState("JobDescription");

  if (!jobData) {
    return (
      <div className="p-6 text-center text-red-500">No Job Data Available</div>
    );
  }

  // Function to handle job application
  const applyForJob = async () => {
    if (loadingJobId) return; // Prevent multiple clicks while loading

    setLoadingJobId(jobData._id); // Set loading state for this job

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/jobs/apply/${
          jobData._id
        }`, // Use jobData._id from state
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const result = await response.json();
      toast.dismiss();

      if (response.ok) {
        toast.success("Application submitted successfully!");
      } else {
        toast.error(result.message || "Failed to apply for the job.");
      }
    } catch (error) {
      console.error("Error applying for the job:", error);
      toast.dismiss();
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoadingJobId(null); // Reset loading state
    }
  };

  // Social Share URL
  const projectUrl = `https://pnycareer.com/job_details/${jobData._id}`;
  const projectTitle = jobData.jobTitle;

  return (
    <>
      <Helmet>
        <title>
          {jobData.jobTitle.split(" ").slice(0, 10).join(" ").substring(0, 60)}
        </title>
        <meta
          name="description"
          content={jobData.jobDescription.split(" ").slice(0, 160).join(" ")}
        />
      </Helmet>

      <div className="flex flex-col md:flex-row gap-6 p-4 md:px-10 lg:px-24 bg-gray-200">
        {/* Left Section */}
        <div className="w-full md:w-2/3 bg-white shadow-lg rounded-lg px-6 py-4">
          {/* Job Title and Company Logo */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
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

          {/* Salary, Duration, and Work Type */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 space-y-2 sm:space-y-0 mt-2">
            <span className="text-lg font-semibold text-center sm:text-left">
              PKR {jobData.maxPrice} • {jobData.salaryType} •{" "}
              {jobData.experienceLevel}
            </span>
            <button
              onClick={applyForJob}
              className="flex items-center bg-blue-500 text-white px-4 py-2 mt-3 rounded hover:bg-blue-600 space-x-2"
              disabled={loadingJobId === jobData._id}
            >
              <FiSend className="w-5 h-5 rotate-45" />
              <span>
                {loadingJobId === jobData._id ? "Applying..." : "Apply Now"}
              </span>
            </button>
          </div>

          {/* Location, Date, and Work Type */}
          <div className="flex items-center text-gray-500 text-sm space-x-2">
            <HiOutlineLocationMarker className="w-4 h-4 text-gray-500" />
            <span>
              {jobData.jobLocation} - {jobData.postingDate} -{" "}
              {new Date(jobData.expirationDate) < new Date() ? (
                <span className="text-red-500 font-semibold">Expired</span>
              ) : (
                jobData.expirationDate
              )}
            </span>
          </div>

          {/* Share Button */}
          <button
            className="mt-4 flex items-center text-gray-700 space-x-2 hover:text-blue-500"
            onClick={() => setShowShareOptions(!showShareOptions)}
          >
            <FiShare2 className="w-5 h-5" />
            <span>Share this job</span>
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

          {/* Skills Section */}
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {jobData.skillsRequired.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full border border-blue-300"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Conditional Content */}
          <div className="mt-6">
            {activeTab === "JobDescription" && (
              <p
                className="text-gray-700 mb-4 text-sm"
                dangerouslySetInnerHTML={{ __html: jobData.description }}
              ></p>
            )}
            {activeTab === "AboutCompany" && (
              <div
                className="text-gray-700 space-y-4 text-sm"
                dangerouslySetInnerHTML={{
                  __html:
                    jobData.about || "Company information is not available.",
                }}
              ></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default JobPage;
