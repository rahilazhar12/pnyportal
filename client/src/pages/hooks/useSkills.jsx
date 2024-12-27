// src/hooks/useSkills.js
import { useState, useEffect } from "react";
import { experienceOptions } from "../../constants/constants";


export const useSkills = () => {
  const [skills, setSkills] = useState([]);
  const [hoveredRecordId, setHoveredRecordId] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingSkills, setDeletingSkills] = useState({});

  /**
   * Fetch existing skills from the API.
   */
  const fetchSkills = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/profile/skills`,
        {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      setSkills(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching skills:", error);
      setSkills([]);
    }
  };

  /**
   * Runs once when component mounts to load the initial skills.
   */
  useEffect(() => {
    fetchSkills();
  }, []);

  /**
   * Handles selection of experience from the dropdown.
   */
  const handleExperienceChange = (selectedOption) => {
    setSelectedExperience(selectedOption);
  };

  /**
   * Submits a new skill to the server.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSkill || !selectedExperience) {
      alert("Please enter a skill and select experience level.");
      return;
    }
    setIsLoading(true);

    const newSkill = {
      skill: selectedSkill,
      experience: selectedExperience.value,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/profile/skills`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ skills: [newSkill] }),
        }
      );

      if (!response.ok) throw new Error("Failed to add skill.");

      await fetchSkills();
      setIsFormVisible(false);
      setSelectedSkill("");
      setSelectedExperience(null);
    } catch (error) {
      console.error("Error adding skill:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Allows user to edit an existing skill (populates the form with skill data).
   */
  const handleEditClick = (skill) => {
    setEditingSkill(skill);
    setSelectedSkill(skill.skill);
    setSelectedExperience(
      experienceOptions.find((opt) => opt.value === skill.experience)
    );
    setIsFormVisible(true);
  };

  /**
   * Saves the changes made to an existing skill.
   */
  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedSkill || !selectedExperience || !editingSkill) {
      alert("Please enter a skill and select experience level.");
      return;
    }
    setIsLoading(true);

    const updatedSkill = {
      skill: selectedSkill,
      experience: selectedExperience.value,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/profile/skills/${editingSkill._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedSkill),
        }
      );

      if (!response.ok) throw new Error("Failed to update skill.");

      await fetchSkills();
      setEditingSkill(null);
      setSelectedSkill("");
      setSelectedExperience(null);
    } catch (error) {
      console.error("Error updating skill:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Deletes a skill by its id.
   */
  const handleDeleteClick = async (skillId) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;

    setDeletingSkills((prev) => ({ ...prev, [skillId]: true }));
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/profile/skills/${skillId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to delete skill.");

      await fetchSkills();
    } catch (error) {
      console.error("Error deleting skill:", error);
    } finally {
      setDeletingSkills((prev) => ({ ...prev, [skillId]: false }));
    }
  };

  /**
   * Toggles the visibility of the form.
   */
  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return {
    skills,
    hoveredRecordId,
    selectedSkill,
    selectedExperience,
    editingSkill,
    isFormVisible,
    isLoading,
    deletingSkills,
    setSelectedSkill,
    setSelectedExperience,
    setHoveredRecordId,
    handleExperienceChange,
    handleSubmit,
    handleEditClick,
    handleSave,
    handleDeleteClick,
    toggleFormVisibility,
    experienceOptions,
  };
};
