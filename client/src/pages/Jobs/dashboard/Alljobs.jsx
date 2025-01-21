import React, { useState, useEffect, startTransition } from "react";
import Loader from "../../../components/Loader/Loader";

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/jobs/getjobs`
      );
      const data = await response.json();

      startTransition(() => {
        setJobs(data);
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Pagination calculations
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100">
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4 text-center bg-gray-200 p-3">
            All Jobs
          </h1>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 text-center">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Title</th>
                  <th className="px-4 py-2 border-b">Posting Date</th>
                  <th className="px-4 py-2 border-b">Posted By</th>
                  <th className="px-4 py-2 border-b">Location</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentJobs.length > 0 ? (
                  currentJobs.map((job, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border-b">{job.jobTitle}</td>
                      <td className="px-4 py-2 border-b">{job.postingDate}</td>
                      <td className="px-4 py-2 border-b">{job.jobPostedBy}</td>
                      <td className="px-4 py-2 border-b">{job.jobLocation}</td>
                      <td className="px-4 py-2 border-b">
                        <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center px-4 py-2 border-b">
                      No jobs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`mx-1 px-3 py-1 border rounded ${
                      currentPage === pageNumber
                        ? "bg-blue-500 text-white"
                        : "bg-white text-blue-500 border-blue-500"
                    } hover:bg-blue-600 hover:text-white`}
                >
                  {pageNumber}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AllJobs;
