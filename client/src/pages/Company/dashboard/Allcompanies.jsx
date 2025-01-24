import React, { useState, useEffect, startTransition } from "react";
import { FaFacebook, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import Loader from "../../../components/Loader/Loader";

const AllCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const companiesPerPage = 10; // Number of companies per page

  const fetchCompanies = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/company/get-all-companies`
      );
      const data = await response.json();

      startTransition(() => {
        setCompanies(data);
        setFilteredCompanies(data);

        const uniqueCities = [
          ...new Set(data.map((company) => company.city.toLowerCase())),
        ];
        setCities(uniqueCities);
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching companies:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCityChange = (event) => {
    const city = event.target.value.toLowerCase();
    startTransition(() => {
      setSelectedCity(city);
      setCurrentPage(1); // Reset to first page on city filter change
      if (city === "") {
        setFilteredCompanies(companies);
      } else {
        const filtered = companies.filter(
          (company) => company.city.toLowerCase() === city
        );
        setFilteredCompanies(filtered);
      }
    });
  };

  const handleApprovalChange = async (userid, isUserApproved) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/company/approve-company/${userid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: isUserApproved }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        fetchCompanies();
      } else {
        console.error("Error updating approval status:", data);
      }
    } catch (error) {
      console.error("Error updating approval status:", error);
    }
  };

  const formatPhoneNumber = (number) => {
    if (!number) return "";
    return "+92" + number.replace(/^0/, "");
  };

  const handleOpenModal = (company) => {
    setSelectedCompany(company);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCompany(null);
    setOpenModal(false);
  };

  // Pagination logic
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = filteredCompanies.slice(
    indexOfFirstCompany,
    indexOfLastCompany
  );

  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-4">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`px-3 py-1 rounded ${
              currentPage === number
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100">
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4 text-center bg-gray-200 p-3">
            All Companies
          </h1>

          <div className="mb-4">
            <label
              htmlFor="city-filter"
              className="block text-lg font-medium mb-2"
            >
              Filter by City:
            </label>
            <select
              id="city-filter"
              value={selectedCity}
              onChange={handleCityChange}
              className="px-3 py-2 border rounded w-full"
            >
              <option value="">All Cities</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>
                  {city.charAt(0).toUpperCase() + city.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 text-center">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">NTN Number</th>
                  <th className="px-4 py-2 border-b">Location</th>
                  <th className="px-4 py-2 border-b">Social Links</th>
                  <th className="px-4 py-2 border-b">Approval Status</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCompanies.length > 0 ? (
                  currentCompanies.map((company, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border-b">{company.name}</td>
                      <td className="px-4 py-2 border-b">
                        {company.ntnnumber}
                      </td>
                      <td className="px-4 py-2 border-b">{company.city}</td>
                      <td className="px-4 py-2 border-b">
                        <div className="flex justify-center items-center space-x-2">
                          {company.facebook && (
                            <a
                              href={company.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600"
                            >
                              <FaFacebook size={20} />
                            </a>
                          )}
                          {company.linkedin && (
                            <a
                              href={company.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-700"
                            >
                              <FaLinkedin size={20} />
                            </a>
                          )}
                          {company.personincontact && (
                            <a
                              href={`https://wa.me/${formatPhoneNumber(
                                company.personincontact
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600"
                            >
                              <FaWhatsapp size={20} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2 border-b">
                        <select
                          value={company.isApproved}
                          onChange={(e) =>
                            handleApprovalChange(company._id, e.target.value)
                          }
                          className="px-2 py-1 border rounded"
                        >
                          <option value="true">Approved</option>
                          <option value="false">Not Approved</option>
                        </select>
                      </td>

                      <td className="px-4 py-2 border-b">
                        <button
                          onClick={() => handleOpenModal(company)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center px-4 py-2 border-b">
                      No companies found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {renderPagination()}

          {/* MODAL FOR COMPANY DETAILS */}
          {openModal && selectedCompany && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              {/* Modal content container */}
              <div className="bg-white w-11/12 md:w-1/2 lg:w-1/3 p-6 rounded shadow-lg relative">
                {/* Close button */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
                <h2 className="text-2xl font-bold mb-4">Company Details</h2>
                <div className="space-y-2">
                  <p>
                    <strong>Name:</strong> {selectedCompany.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedCompany.email}
                  </p>
                  <p>
                    <strong>NTN Number:</strong> {selectedCompany.ntnnumber}
                  </p>
                  <p>
                    <strong>City:</strong> {selectedCompany.city}
                  </p>
                  <p>
                    <strong>Contact Person:</strong>{" "}
                    {selectedCompany.personincontact}
                  </p>
                  {/* Add more fields as needed */}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllCompanies;
