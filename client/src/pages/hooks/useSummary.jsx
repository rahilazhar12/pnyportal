import { useState, useEffect } from "react";

/**
 * Custom hook to manage summary fetching, creation, and updates.
 */
export default function useSummary() {
  const [summary, setSummary] = useState(null);
  const [summaryId, setSummaryId] = useState(null);
  const [loading, setLoading] = useState(true);      // For initial fetch
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/profile/getsummary`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch summary");
        }

        if (data.success && data.summaries.length > 0) {
          const fetchedSummary = data.summaries[0];
          setSummaryId(fetchedSummary._id);
          setSummary(fetchedSummary.content);
        } else {
          setSummary(null);
          setSummaryId(null);
        }
      } catch (err) {
        console.error("Failed to fetch summary:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, []);

  const saveSummary = async (content) => {
    // Decide whether to create or update
    const url = summaryId
      ? `${import.meta.env.VITE_API_URL}/api/v1/profile/updatesummary`
      : `${import.meta.env.VITE_API_URL}/api/v1/profile/summary`;
    const method = summaryId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content,
          summaryId, // only used if updating
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save summary");
      }

      setSummary(content);
      // If it was a new summary, store the newly created ID
      if (!summaryId) {
        setSummaryId(data.summary._id);
      }

      return { success: true };
    } catch (err) {
      console.error("Failed to save summary:", err);
      return { success: false, error: err.message };
    }
  };

  return {
    summary,
    summaryId,
    loading,
    error,
    setSummary,
    setSummaryId,
    saveSummary,
  };
}
