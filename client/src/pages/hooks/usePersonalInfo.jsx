import { useState, useEffect } from "react";

export default function usePersonalInfo() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    fatherName: "",
    dob: "",
    gender: "",
    cnic: "",
    maritalstatus: "",
    nationality: "",
    city: "",
    area: "",
    mobile: "",
    careerLevel: "",
    expectedSalary: "",
    personalInfoId: "",
    profilePicture: null,
  });

  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [prevBlobURL, setPrevBlobURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [isProfilePictureValid, setIsProfilePictureValid] = useState(true);

  // Fetch existing personal info on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/profile/personal`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            // No personal info found
            setIsFetching(false);
            return;
          }
          throw new Error("Failed to fetch personal information");
        }

        const data = await response.json();
        const personalInfo = data.personalInfo;

        setFormData((prevData) => ({
          ...prevData,
          ...personalInfo,
          personalInfoId: personalInfo._id || "",
        }));

        setProfilePicturePreview(
          personalInfo.profilePicture || "profile-placeholder.png"
        );
      } catch (error) {
        setMessage(error.message || "Failed to fetch personal information");
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, []);

  // Cleanup previous Blob URL if it changes or on unmount
  useEffect(() => {
    return () => {
      if (prevBlobURL) {
        URL.revokeObjectURL(prevBlobURL);
      }
    };
  }, [prevBlobURL]);

  // Handles any form field change (including city/area reset logic)
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "city") {
      // Reset area when city changes
      setFormData((prev) => ({ ...prev, city: value, area: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle profile picture changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file size exceeds 5MB
      if (file.size > 5 * 1024 * 1024) {
        setMessage("Please select an image with a size of 5MB or less.");
        setIsProfilePictureValid(false);
        return;
      }
      // Revoke old blob URL
      if (prevBlobURL) {
        URL.revokeObjectURL(prevBlobURL);
      }
      const newBlobURL = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, profilePicture: file }));
      setProfilePicturePreview(newBlobURL);
      setPrevBlobURL(newBlobURL);
      setMessage("");
      setIsProfilePictureValid(true);
    }
  };

  // Build FormData payload
  const buildFormData = (formDataState) => {
    const fd = new FormData();
    for (const key in formDataState) {
      if (formDataState[key]) {
        fd.append(key, formDataState[key]);
      }
    }
    return fd;
  };

  // Submit or Update personal info
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formDataPayload = buildFormData(formData);
      const isUpdate = formData.personalInfoId !== "";
      const url = isUpdate
        ? `${import.meta.env.VITE_API_URL}/api/v1/profile/updatepersonal`
        : `${import.meta.env.VITE_API_URL}/api/v1/profile/personal`;
      const method = isUpdate ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataPayload,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to submit personal information."
        );
      }

      const data = await response.json();
      const updatedPersonalInfo = data.personalInfo;

      setFormData((prev) => ({
        ...prev,
        ...updatedPersonalInfo,
        personalInfoId: updatedPersonalInfo._id || "",
      }));

      // Revoke the old Blob URL
      if (prevBlobURL) {
        URL.revokeObjectURL(prevBlobURL);
        setPrevBlobURL(null);
      }

      setProfilePicturePreview(
        updatedPersonalInfo.profilePicture || "profile-placeholder.png"
      );
      setMessage(
        data.message ||
          (isUpdate
            ? "Personal information updated successfully."
            : "Personal information added successfully.")
      );

      // Instead of a full page reload, we can simply refetch or rely on local state:
      // Optionally refetch here if needed:
      // await fetchData();
      // For now, let's just set isEditing to false and let local state do the job.
    } catch (error) {
      setMessage(error.message || "Failed to submit personal information.");
    } finally {
      setLoading(false);
    }
  };

  // Helper: get correct image URL
  const getImageSrc = () => {
    if (!profilePicturePreview) {
      return "profile-placeholder.png";
    }
    if (profilePicturePreview.startsWith("blob:")) {
      return profilePicturePreview;
    }
    if (
      profilePicturePreview.startsWith("http://") ||
      profilePicturePreview.startsWith("https://")
    ) {
      return profilePicturePreview;
    }
    // Otherwise, prepend server URL
    return `${import.meta.env.VITE_API_URL}/${profilePicturePreview}`;
  };

  return {
    formData,
    setFormData,
    loading,
    message,
    isFetching,
    isProfilePictureValid,
    profilePicturePreview,
    getImageSrc,
    handleChange,
    handleFileChange,
    handleSubmit,
    setMessage,
  };
}
