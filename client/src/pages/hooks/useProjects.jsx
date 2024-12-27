import { useState, useEffect } from "react";
import { toast } from "react-toastify";


export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all projects
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/profile/project`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(`Error fetching projects: ${data.message || response.statusText}`);
      } else {
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Fetch Projects Error:", error);
      toast.error("An unexpected error occurred while fetching projects.");
    } finally {
      setLoading(false);
    }
  };

  // Create or update a project
  const saveProject = async (projectData, projectId = null) => {
    try {
      let response;
      if (projectId) {
        // Update existing project
        response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/profile/project/${projectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(projectData),
        });
      } else {
        // Create new project
        const payload = { projects: [projectData] };
        response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/profile/project`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      }

      const result = await response.json();
      if (!response.ok) {
        toast.error(`Error saving/updating project: ${result.message || response.statusText}`);
        return false;
      }

      toast.success(projectId ? "Project updated successfully!" : "Project saved successfully!");
      await fetchProjects();
      return true;
    } catch (error) {
      console.error("Save/Update Project Error:", error);
      toast.error("An unexpected error occurred while saving the project.");
      return false;
    }
  };

  // Delete a project
  const deleteProject = async (projectId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/profile/project/${projectId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) {
        toast.error(`Error deleting project: ${result.message || response.statusText}`);
        return false;
      }

      toast.success("Project deleted successfully!");
      setProjects((prev) => prev.filter((proj) => proj._id !== projectId));
      return true;
    } catch (error) {
      console.error("Delete Project Error:", error);
      toast.error("An unexpected error occurred while deleting the project.");
      return false;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return { projects, loading, saveProject, deleteProject };
}
