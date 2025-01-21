import React, { useState, useEffect, startTransition } from "react";
import { FaWhatsapp } from "react-icons/fa";
import Loader from "../../../components/Loader/Loader";

const AllUsers = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const fetchCompanies = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/get-all-users`
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
      setCurrentPage(1); // Reset to the first page when filtering
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

  const formatPhoneNumber = (number) => {
    return "+92" + number.replace(/^0/, "");
  };

  // Pagination calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredCompanies.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredCompanies.length / usersPerPage);

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
            All Users
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
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b">Location</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                  <th className="px-4 py-2 border-b">WhatsApp</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border-b">{user.name}</td>
                      <td className="px-4 py-2 border-b">{user.email}</td>
                      <td className="px-4 py-2 border-b">{user.city}</td>
                      <td className="px-4 py-2 border-b">
                        <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                          Details
                        </button>
                      </td>
                      <td className="px-4 py-2 flex justify-center">
                        <a
                          href={`https://wa.me/${formatPhoneNumber(
                            user.contact
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-500 hover:text-green-700"
                        >
                          <FaWhatsapp size={20} />
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center px-4 py-2 border-b">
                      No Users found.
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

export default AllUsers;
