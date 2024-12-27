import { useState, useEffect } from "react";

const useProfileCompletion = () => {
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [noData, setNoData] = useState(false);

  // Define allSchemas at the top for global access within the hook
  const allSchemas = [
    "PersonalInfo",
    "Summary",
    "Experience",
    "Education",
    "JobPreference",
    "Language",
    "Projects",
    "Skills",
  ];

  const calculateCompletion = (foundSchemas) => {
    const completedTasks = allSchemas.filter((schema) =>
      foundSchemas.includes(schema)
    ).length;
    return (completedTasks / allSchemas.length) * 100;
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/profile/profileexistance`,
          {
            method: "GET",
            credentials: "include", // Include cookies for cross-origin requests
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.schemas?.length) {
          const foundSchemas = data.schemas;
          setCompletionPercentage(calculateCompletion(foundSchemas));
          setTasks(
            allSchemas.map((schema) => ({
              name: schema,
              completed: foundSchemas.includes(schema),
            }))
          );
          setNoData(false);
        } else {
          setNoData(true);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setNoData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  return { completionPercentage, loading, tasks, noData };
};

export default useProfileCompletion;
