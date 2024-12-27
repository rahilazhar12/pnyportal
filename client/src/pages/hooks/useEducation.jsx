// src/hooks/useEducation.js
import { useState, useEffect, useRef } from "react";

export const useEducation = () => {
  const [educationRecords, setEducationRecords] = useState([]);
  
  const [displayedRecords, setDisplayedRecords] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [hoveredRecordId, setHoveredRecordId] = useState(null);

  const [editingRecord, setEditingRecord] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // State for the form inputs
  const [educationRecord, setEducationRecord] = useState({
    degreeTitle: "",
    fieldOfStudy: [],
    location: "",
    institution: "",
    completionYear: "",
    cgpa: "",
  });

  // CGPA logic
  const [showCgpaFields, setShowCgpaFields] = useState(false);
  const [cgpaInput, setCgpaInput] = useState({ cgpa: "", cgpaOutOf: "" });
  const [dynamicCgpaOptions, setDynamicCgpaOptions] = useState([]);

  const formRef = useRef(null);

  // Fetch education data from your API
  const fetchEducationRecords = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/profile/education`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok && data.data) {
        setEducationRecords(data.data);
        // Initially display up to 2 records
        const initialRecords = data.data.slice(0, 2);
        setDisplayedRecords(initialRecords);
        // If the total is more than 2, we can show "Show More" button
        setShowMore(data.length);
      }
    } catch (error) {
      console.error("Error fetching education records:", error);
    }
  };

  useEffect(() => {
    fetchEducationRecords();
  }, []);

  // Dynamically build CGPA dropdown options based on CGPA out of value
  useEffect(() => {
    if (cgpaInput.cgpaOutOf) {
      const step = 0.1;
      const max = parseFloat(cgpaInput.cgpaOutOf);
      const options = [];

      for (let val = 1.0; val <= max; val += step) {
        options.push({
          value: val.toFixed(1),
          label: val.toFixed(1),
        });
      }

      setDynamicCgpaOptions(options);
    }
  }, [cgpaInput.cgpaOutOf]);

  // Generic handleChange for text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEducationRecord((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handler for (react-select) single selects
  const handleSelectChange = (name) => (selectedOption) => {
    setEducationRecord((prevState) => ({
      ...prevState,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleToggleForm = () => {
    setShowForm(!showForm);
    setEditingRecord(null);
  };

  const handleToggleShowMore = () => {
    if (showMore) {
      // Show only the first 2 records
      setDisplayedRecords(educationRecords.slice(0, 2));
    } else {
      // Show all records
      setDisplayedRecords(educationRecords);
    }
    setShowMore(!showMore);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setEducationRecord(record);
    setShowForm(true);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDelete = async (educationRecordId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this record?")) return;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/profile/education/${educationRecordId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        // Remove from local state
        setEducationRecords((prev) => prev.filter((rec) => rec._id !== educationRecordId));
        // Re-fetch if desired, or just remove from local
        await fetchEducationRecords();
        alert("Record deleted successfully");
      } else {
        throw new Error("Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting education record:", error);
      alert("Failed to delete record");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalRecord = { ...educationRecord };

    // If CGPA fields are shown and valid, attach them
    if (showCgpaFields && cgpaInput.cgpa && cgpaInput.cgpaOutOf) {
      finalRecord.cgpa = cgpaInput.cgpa;
      finalRecord.cgpaOutOf = cgpaInput.cgpaOutOf;
    } else {
      delete finalRecord.cgpa;
      delete finalRecord.cgpaOutOf;
    }

    try {
      if (editingRecord) {
        // Update existing record
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/profile/education/${editingRecord._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(finalRecord),
          }
        );
        const data = await response.json();
        if (response.ok) {
          alert("Education record updated successfully!");
          await fetchEducationRecords();
          resetForm();
        } else {
          alert(data.message || "Error updating education record");
        }
      } else {
        // Create new record
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/profile/education`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ educationRecords: [finalRecord] }),
        });
        const data = await response.json();
        if (response.ok) {
          alert("Education record saved successfully!");
          await fetchEducationRecords();
          resetForm();
        } else {
          alert(data.message || "Error saving education record");
        }
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error saving or updating education record");
    }
  };

  const resetForm = () => {
    setEducationRecord({
      degreeTitle: "",
      fieldOfStudy: [],
      location: "",
      institution: "",
      completionYear: "",
      cgpa: "",
    });
    setCgpaInput({ cgpa: "", cgpaOutOf: "" });
    setShowForm(false);
    setEditingRecord(null);
  };

  return {
    educationRecords,
    displayedRecords,
    showMore,
    hoveredRecordId,
    showForm,
    editingRecord,
    educationRecord,
    showCgpaFields,
    cgpaInput,
    dynamicCgpaOptions,
    formRef,
    setHoveredRecordId,
    setShowCgpaFields,
    setCgpaInput,
    handleChange,
    handleSelectChange,
    handleToggleForm,
    handleToggleShowMore,
    handleEdit,
    handleDelete,
    handleSubmit,
    resetForm,
    setEducationRecord
  };
};
