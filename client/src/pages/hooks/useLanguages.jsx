import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "";

export function useLanguages() {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all languages
  const fetchLanguages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/profile/languages`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();
      if (Array.isArray(data)) {
        setLanguages(data);
      } else {
        setLanguages([]);
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
      toast.error("Failed to fetch languages. Please try again later.");
      setLanguages([]);
    } finally {
      setLoading(false);
    }
  };

  // Add a new language
  const addLanguage = async (language) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/profile/languages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ languages: [language] }),
      });

      if (!response.ok) {
        throw new Error("Failed to add language.");
      }

      toast.success("Language added successfully!");
      await fetchLanguages();
    } catch (error) {
      console.error("Error adding language:", error);
      toast.error("Failed to add language. Please try again.");
    }
  };

  // Update an existing language
  const updateLanguage = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/profile/languages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update language.");
      }

      toast.success("Language updated successfully!");
      await fetchLanguages();
    } catch (error) {
      console.error("Error updating language:", error);
      toast.error("Failed to update language. Please try again.");
    }
  };

  // Delete a language
  const deleteLanguage = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/profile/languages/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete language.");
      }

      toast.success("Language deleted successfully!");
      setLanguages((prev) => prev.filter((lang) => lang._id !== id));
    } catch (error) {
      console.error("Error deleting language:", error);
      toast.error("Failed to delete language. Please try again.");
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  return { languages, loading, addLanguage, updateLanguage, deleteLanguage };
}
