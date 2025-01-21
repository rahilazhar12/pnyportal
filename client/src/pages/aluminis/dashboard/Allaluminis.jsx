import React, { useState, useEffect, startTransition } from "react";
import Loader from "../../../components/Loader/Loader";

const AllAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const alumniPerPage = 10;

  const fetchAlumni = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/get-all-pnyalumini`
      );
      const data = await response.json();

      startTransition(() => {
        setAlumni(data);
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching alumni:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  // Pagination calculations
  const indexOfLastAlumni = currentPage * alumniPerPage;
  const indexOfFirstAlumni = indexOfLastAlumni - alumniPerPage;
  const currentAlumni = alumni.slice(indexOfFirstAlumni, indexOfLastAlumni);
  const totalPages = Math.ceil(alumni.length / alumniPerPage);

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
            All Alumni
          </h1>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 text-center">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b">Course Name</th>
                  <th className="px-4 py-2 border-b">Batch No</th>
                  <th className="px-4 py-2 border-b">City</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentAlumni.length > 0 ? (
                  currentAlumni.map((person, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border-b">{person.name}</td>
                      <td className="px-4 py-2 border-b">{person.email}</td>
                      <td className="px-4 py-2 border-b">{person.courseName}</td>
                      <td className="px-4 py-2 border-b">{person.batchNo}</td>
                      <td className="px-4 py-2 border-b">{person.city}</td>
                      <td className="px-4 py-2 border-b">
                        <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center px-4 py-2 border-b">
                      No alumni found.
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

export default AllAlumni;
