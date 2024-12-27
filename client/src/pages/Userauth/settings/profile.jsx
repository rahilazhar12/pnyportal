import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Modal,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useSessionStorage } from "../../../context/Sessionstorage";
import useUserData from "../../hooks/useUserData";

const Settinguser = () => {
  const { user, loading, fetchUserData } = useUserData();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    city: "",
    password: "",
    batchNo: "",
    courseName: "",
    profilePicture: null,
  });
  const { role } = useSessionStorage();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Update formData when user data is fetched
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        contact: user.contact || "",
        city: user.city || "",
        password: "", // Leave password empty for security
        batchNo: user.batchNo || "",
        courseName: user.courseName || "",
        profilePicture: user.profilePicture || null,
      });
    }
  }, [user]);

  const handleEditModalToggle = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === "profilePicture" ? files[0] : value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    setIsSaving(true); // Start loader
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/edit-user`,
        {
          method: "PUT",
          body: data,
          credentials: "include",
        }
      );
      const result = await response.json();

      if (response.ok) {
        setAlertMessage("Profile updated successfully!");
        setAlertOpen(true);
        fetchUserData(); // Refresh user data
        setIsEditModalOpen(false);
      } else {
        console.error(
          "Error updating profile:",
          result.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSaving(false); // Stop loader
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const logouthandler = () => {
    // Add your logout logic here
    console.log("User logged out");
    navigate("/");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <section className="relative pt-36 pb-24">
        <img
          src="https://pagedone.io/asset/uploads/1705471739.png"
          alt="cover-image"
          className="w-full absolute top-0 left-0 z-0 h-60 object-cover"
        />
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-center relative z-10 mb-2.5">
            <img
              src={
                formData.profilePicture
                  ? `${import.meta.env.VITE_API_URL}/${formData.profilePicture}`
                  : "https://i.pinimg.com/736x/3f/94/70/3f9470b34a8e3f526dbdb022f9f19cf7.jpg"
              }
              alt="user-avatar-image"
              className="border-4 border-solid border-white w-52 rounded-full h-52"
            />
          </div>
          <div className="flex flex-col sm:flex-row max-sm:gap-5 items-center justify-between mb-5">
            <ul className="flex items-center gap-5">
              <li>
                <Link
                  to="/"
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <span className="font-medium text-base leading-7 text-gray-400">
                    Home
                  </span>
                </Link>
              </li>
              <li className="font-bold">Profile</li>
            </ul>
            <div className="flex items-center gap-4">
              <button
                onClick={handleEditModalToggle}
                className="border border-solid border-indigo-600 bg-indigo-600 py-3 px-4 text-sm font-semibold text-white whitespace-nowrap shadow-sm transition-all duration-500 hover:bg-indigo-700 hover:border-indigo-700"
              >
                Edit Profile
              </button>
            </div>
          </div>
          <h3 className="text-center font-manrope font-bold text-3xl leading-10 text-gray-900 mb-3">
            {formData.name}
          </h3>
          <h3 className="text-center font-manrope font-bold text-xl leading-10 text-gray-900 mb-3">
            {formData.contact}
          </h3>
          <p className="font-normal text-base leading-7 text-gray-500 text-center mb-8">
            {formData.email}
          </p>
        </div>
      </section>
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleAlertClose}
      >
        <Alert onClose={handleAlertClose} severity="success">
          {alertMessage}
        </Alert>
      </Snackbar>

      {/* Edit Modal */}
      <Modal open={isEditModalOpen} onClose={handleEditModalToggle}>
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 4,
            mx: "auto",
            mt: 5,
            maxWidth: 600,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Edit Profile
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={2}>
              {[
                {
                  label: "Name",
                  name: "name",
                  value: formData.name,
                },
                {
                  label: "Contact",
                  name: "contact",
                  value: formData.contact,
                },
                {
                  label: "Email",
                  name: "email",
                  value: formData.email,
                },
                {
                  label: "Password",
                  name: "password",
                  value: formData.password,
                },
                {
                  label: "City",
                  name: "city",
                  value: formData.city,
                },
                ...(role !== "User"
                  ? [
                      {
                        label: "Batch No",
                        name: "batchNo",
                        value: formData.batchNo,
                      },
                      {
                        label: "Course Name",
                        name: "courseName",
                        value: formData.courseName,
                      },
                    ]
                  : []),
              ].map((field, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <TextField
                    label={field.label}
                    name={field.name}
                    value={field.value}
                    onChange={handleFormChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Upload Picture
                  <input
                    type="file"
                    hidden
                    name="profilePicture"
                    onChange={handleFormChange}
                  />
                </Button>
              </Grid>
            </Grid>
            <Box textAlign="center" sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSaving} // Disable button while saving
                startIcon={
                  isSaving && (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                  )
                }
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default Settinguser;
