// apiService.js
export const fetchJobsByCategory = async (apiName) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/jobs/jobs-by-category/${encodeURIComponent(apiName)}`
      );
      if (!response.ok) {
        throw new Error(`Error fetching jobs for category ${apiName}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  