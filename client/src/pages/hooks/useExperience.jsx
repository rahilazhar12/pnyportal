import { useState, useEffect } from "react";

/**
 * Custom hook to manage experience records (fetch, create, update, delete).
 */
export default function useExperience() {
  const [experienceRecords, setExperienceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all experience records on mount
  useEffect(() => {
    fetchExperienceRecords();
  }, []);

  const fetchExperienceRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/profile/experience`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error fetching experience records");
      }
      setExperienceRecords(data.data || []);
    } catch (err) {
      console.error("Error fetching experience records:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addExperienceRecord = async (newRecord) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/profile/experience`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experienceRecords: [newRecord] }),
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error saving experience record");
      }
      // If successful, refetch or directly update state:
      // setExperienceRecords((prev) => [...prev, data.record]); 
      await fetchExperienceRecords();
      return { success: true };
    } catch (err) {
      console.error("Error adding experience record:", err);
      return { success: false, message: err.message };
    }
  };

  const updateExperienceRecord = async (recordId, updatedRecord) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/profile/experience/${recordId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedRecord),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error updating experience record");
      }
      await fetchExperienceRecords();
      return { success: true };
    } catch (err) {
      console.error("Error updating experience record:", err);
      return { success: false, message: err.message };
    }
  };

  const deleteExperienceRecord = async (recordId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/profile/experience/${recordId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete record");
      }
      // Optionally refetch or update local state
      await fetchExperienceRecords();
      return { success: true };
    } catch (err) {
      console.error("Error deleting experience record:", err);
      return { success: false, message: err.message };
    }
  };

  return {
    experienceRecords,
    loading,
    error,
    fetchExperienceRecords,
    addExperienceRecord,
    updateExperienceRecord,
    deleteExperienceRecord,
  };
}
