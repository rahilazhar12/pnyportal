import React, { useState, useEffect } from "react";

const AdminProfile = () => {
  const [formData, setFormData] = useState({
    id: "defaultMemberId", // Replace with actual ID or get it dynamically
    name: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/members/getmembers`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();

        if (response.ok) {
          setFormData({ ...formData, name: data.name });
        } else {
          setMessage(data.message || "Failed to fetch member details.");
        }
      } catch (error) {
        setMessage("An error occurred while fetching member details.");
      }
    };

    fetchMemberDetails();
  }, [formData.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/members/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Member details updated successfully!");
      } else {
        setMessage(data.message || "Failed to update member details.");
      }
    } catch (error) {
      setMessage("An error occurred while updating member details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-6">
      <div className="max-w-xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Edit Member Details
        </h1>
        <p className="text-gray-500 mb-6">
          Update the member's details below. Only the name and password can be changed.
        </p>

        {message && (
          <div
            className={`${
              message.includes("successfully") ? "bg-green-100" : "bg-red-100"
            } text-center text-sm text-gray-700 p-3 rounded mb-4`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-600 mb-2"
              htmlFor="password"
            >
              New Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Updating..." : "Update Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
