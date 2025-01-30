import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";

const CompanySettings = () => {
  const [company, setCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch company information on load
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/company/companies`, {
      method: "GET",
      credentials: "include", // Send cookies with the request
    })
      .then((res) => res.json())
      .then((data) => setCompany(data))
      .catch((error) => console.error("Error fetching company data:", error));
  }, []);

  // Handle opening the modal and setting initial form data
  const openEditModal = () => {
    setFormData({ ...company });
    setMessage({ type: "", text: "" }); // Clear previous messages
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/company/updateprofile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Send cookies with the request
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.company) {
          setCompany(data.company);
          setMessage({
            type: "success",
            text: "Company profile updated successfully!",
          });
        } else {
          setMessage({
            type: "error",
            text: data.message || "Failed to update profile.",
          });
        }
      })
      .catch(() => {
        setMessage({
          type: "error",
          text: "An error occurred while updating the profile.",
        });
      });
  };

  const handleQuillChange = (value) => {
    setFormData((prev) => ({ ...prev, about: value }));
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1672423154405-5fd922c11af2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50   "></div>
      <div className="container mx-auto p-8 relative z-10">
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center">
          Company Settings
        </h1>
        {company ? (
          <div className="bg-white bg-opacity-70 backdrop-blur-lg p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-700">
                {company.name}
              </h2>
              <button
                onClick={openEditModal}
                className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                Edit Profile
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 font-medium">Email</p>
                <p className="text-base font-semibold text-gray-800">
                  {company.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">NTN Number</p>
                <p className="text-base font-semibold text-gray-800">
                  {company.ntnnumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Person in Contact
                </p>
                <p className="text-base font-semibold text-gray-800">
                  {company.personincontact}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">City</p>
                <p className="text-base font-semibold text-gray-800">
                  {company.city}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Website</p>
                <p className="text-base font-semibold text-blue-600 underline">
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {company.website}
                  </a>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Facebook</p>
                <p className="text-base font-semibold text-blue-600 underline">
                  <a
                    href={company.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {company.facebook}
                  </a>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">LinkedIn</p>
                <p className="text-base font-semibold text-blue-600 underline">
                  <a
                    href={company.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {company.linkedin}
                  </a>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">CNIC</p>
                <p className="text-base font-semibold text-gray-800">
                  {company.cnic}
                </p>
              </div>
              <div className="col-span-2 text-justify">
                <p className="text-xl text-black font-medium text-center">
                  About
                </p>
                <p className="text-gray-700 font-semibold text-sm"
                dangerouslySetInnerHTML={{
                  __html: company.about
                }}>
                  
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-white">
            Loading company information...
          </p>
        )}

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-lg shadow-lg w-11/12 max-w-2xl p-6 relative">
              <h2 className="text-2xl font-bold text-gray-700 mb-6">
                Edit Company Info
              </h2>

              {message.text && (
                <div
                  className={`mb-4 p-4 rounded-md ${
                    message.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="max-h-[60vh] overflow-y-auto px-4 py-4"
              >
                <div className="grid gap-4">
                  {[
                    { label: "Company Name", name: "name", type: "text" },
                    { label: "NTN Number", name: "ntnnumber", type: "text" },
                    { label: "Email", name: "email", type: "email" },
                    {
                      label: "Person in Contact",
                      name: "personincontact",
                      type: "text",
                    },
                    { label: "City", name: "city", type: "text" },
                    { label: "Website", name: "website", type: "url" },
                    { label: "Facebook", name: "facebook", type: "url" },
                    { label: "LinkedIn", name: "linkedin", type: "url" },
                    { label: "CNIC", name: "cnic", type: "text" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="text-sm font-medium text-gray-600">
                        {field.label}
                      </label>
                      <input
                        disabled={
                          field.name === "ntnnumber" || field.name === "cnic"
                        }
                        type={field.type}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        placeholder={`Enter ${field.label}`}
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>

                {/* Separate About Section */}
                {/* React Quill Editor */}
                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-600">
                    About
                  </label>
                  <ReactQuill
                    value={formData.about || ""}
                    onChange={handleQuillChange}
                    className="h-52"
                  />
                </div>

                <div className="mt-12 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 text-gray-600 bg-gray-100 rounded-md shadow hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-white bg-blue-600 rounded-md shadow hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySettings;
