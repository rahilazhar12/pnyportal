// src/hooks/useJobPreferences.js
import { useState, useEffect } from "react";

export const useJobPreferences = () => {
  const [jobPreferences, setJobPreferences] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editPreferences, setEditPreferences] = useState({
    title: "",
    salary: "",
    skills: [],
    relocation: false,
    relocationPreference: "",
    preferredLocations: [],
  });
  const [notification, setNotification] = useState("");

  // Helpers to transform between react-select (CreatableSelect) and arrays of strings
  const toSelectOptions = (arr) =>
    arr.map((item) => ({ label: item, value: item }));
  const toStringArray = (options) => options.map((option) => option.value);

  // Fetch existing job preferences on component mount
  const fetchJobPreferences = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/profile/jobpref`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (response.status === 404) {
        // No job preferences found for the user
        setJobPreferences(null);
        setEditPreferences({
          title: "",
          salary: "",
          skills: [],
          relocation: false,
          relocationPreference: "",
          preferredLocations: [],
        });
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Determine if data is an array or object
      let preferenceData = null;
      if (Array.isArray(data) && data.length > 0) {
        preferenceData = data[0];
      } else if (
        data &&
        typeof data === "object" &&
        Object.keys(data).length > 0
      ) {
        preferenceData = data;
      }

      if (preferenceData) {
        setJobPreferences(preferenceData);
        setEditPreferences({
          ...preferenceData,
          skills: toSelectOptions(preferenceData.skills || []),
          preferredLocations: toSelectOptions(
            preferenceData.preferredLocations || []
          ),
        });
      } else {
        setJobPreferences(null);
        setEditPreferences({
          title: "",
          salary: "",
          skills: [],
          relocation: false,
          relocationPreference: "",
          preferredLocations: [],
        });
      }
    } catch (err) {
      console.error("Error fetching job preferences:", err);
      // no UI error state, just log
    }
  };

  useEffect(() => {
    fetchJobPreferences();
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setEditPreferences(
      jobPreferences
        ? {
            ...jobPreferences,
            skills: toSelectOptions(jobPreferences.skills || []),
            preferredLocations: toSelectOptions(
              jobPreferences.preferredLocations || []
            ),
          }
        : {
            title: "",
            salary: "",
            skills: [],
            relocation: false,
            relocationPreference: "",
            preferredLocations: [],
          }
    );
    setIsEditing(false);
  };

  const handleSave = async () => {
    const payload = {
      title: editPreferences.title.trim(),
      salary: editPreferences.salary.trim(),
      skills: toStringArray(editPreferences.skills),
      relocation: editPreferences.relocation,
      relocationPreference: editPreferences.relocation
        ? editPreferences.relocationPreference
        : "",
      preferredLocations:
        editPreferences.relocation &&
        editPreferences.relocationPreference === "Near"
          ? toStringArray(editPreferences.preferredLocations)
          : [],
    };

    try {
      let response;
      if (jobPreferences && jobPreferences._id) {
        // Update existing
        response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/profile/jobpref/${
            jobPreferences._id
          }`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
          }
        );
      } else {
        // Create new
        response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/profile/jobpref`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
          }
        );
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save job preferences.");
      }

      const data = await response.json();
      setJobPreferences(data);
      setNotification(
        jobPreferences && jobPreferences._id
          ? "Job preferences updated successfully!"
          : "Job preferences saved successfully!"
      );
      setIsEditing(false);
      setTimeout(() => setNotification(""), 3000);
    } catch (err) {
      console.error("Error saving job preferences:", err);
      // Just log to console, no UI error state
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "relocation" && !checked) {
      // If uncheck 'relocation', reset relevant fields
      setEditPreferences({
        ...editPreferences,
        relocation: false,
        relocationPreference: "",
        preferredLocations: [],
      });
    } else if (name === "relocationPreference" && value === "Anywhere") {
      // If user picks 'Anywhere', clear preferredLocations
      setEditPreferences({
        ...editPreferences,
        relocationPreference: "Anywhere",
        preferredLocations: [],
      });
    } else {
      setEditPreferences({
        ...editPreferences,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  // Handlers for react-select
  const handleSkillsChange = (selectedOptions) => {
    setEditPreferences({
      ...editPreferences,
      skills: selectedOptions || [],
    });
  };

  const handlePreferredLocationsChange = (selectedOptions) => {
    setEditPreferences({
      ...editPreferences,
      preferredLocations: selectedOptions || [],
    });
  };

  return {
    jobPreferences,
    editPreferences,
    isEditing,
    notification,
    handleEdit,
    handleCancel,
    handleSave,
    handleChange,
    handleSkillsChange,
    handlePreferredLocationsChange,
  };
};
