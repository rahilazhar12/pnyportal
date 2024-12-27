import React, { useState, useEffect, startTransition } from "react";
import { FaFacebook, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import Loader from "../../../components/Loader/Loader";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Grid,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AllCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [openModal, setOpenModal] = useState(false);

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

  const handleApprovalChange = async (userid, isUserApproved) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/company/approve-company/${userid}`,
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

  const handleCityChange = (event) => {
    const city = event.target.value.toLowerCase();
    startTransition(() => {
      setSelectedCity(city);
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

  const handleOpenModal = (company) => {
    setSelectedCompany(company);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCompany(null);
    setOpenModal(false);
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
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company, index) => (
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

          <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="company-details-modal"
            aria-describedby="company-details-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "90%",
                maxWidth: 600,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                outline: "none",
              }}
            >
              <IconButton
                onClick={handleCloseModal}
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>
              <Typography id="company-details-modal" variant="h6" gutterBottom>
                {selectedCompany?.name}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    NTN Number:
                  </Typography>
                  <Typography>{selectedCompany?.ntnnumber || "N/A"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Location:
                  </Typography>
                  <Typography>{selectedCompany?.city || "N/A"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Contact:
                  </Typography>
                  <Typography>
                    {formatPhoneNumber(selectedCompany?.personincontact) ||
                      "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Approval Status:
                  </Typography>
                  <Typography>
                    {selectedCompany?.isApproved ? "Approved" : "Not Approved"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Social Links:
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    {selectedCompany?.facebook && (
                      <a
                        href={selectedCompany.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaFacebook size={24} color="#4267B2" />
                      </a>
                    )}
                    {selectedCompany?.linkedin && (
                      <a
                        href={selectedCompany.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaLinkedin size={24} color="#0077b5" />
                      </a>
                    )}
                    {selectedCompany?.personincontact && (
                      <a
                        href={`https://wa.me/${formatPhoneNumber(
                          selectedCompany.personincontact
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaWhatsapp size={24} color="#25D366" />
                      </a>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Modal>
        </>
      )}
    </div>
  );
};

export default AllCompanies;
