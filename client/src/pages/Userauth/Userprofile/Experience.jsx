import React, { useState, useRef } from "react";
import Select from "react-select";
import ReactQuill from "react-quill";
import { MdEdit, MdDelete } from "react-icons/md";
import useExperience from "../../hooks/useExperience";
import {
  industryOptions,
  monthOptions,
  locationOptions,
  SALARY_RANGES,
  YEAR_OPTIONS,
} from "../../../constants/constants";

const teamManagementOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const Experience = () => {
  const {
    experienceRecords,
    loading,
    error,
    addExperienceRecord,
    updateExperienceRecord,
    deleteExperienceRecord,
  } = useExperience();

  const formRef = useRef(null);

  // Single record to be created/edited
  const [experienceRecord, setExperienceRecord] = useState({
    jobTitle: "",
    company: "",
    industry: "",
    location: "",
    salary: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    currentlyWorking: false,
    description: "",
    teamManagement: "",
  });

  const [editingRecord, setEditingRecord] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Show/hide full description
  const [showFullDescription, setShowFullDescription] = useState({});
  const toggleDescription = (id) => {
    setShowFullDescription((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Show/hide more experience records
  const [showMore, setShowMore] = useState(false);
  const displayedRecords = showMore
    ? experienceRecords
    : experienceRecords.slice(0, 2);

  // Hover effect for action icons
  const [hoveredRecordId, setHoveredRecordId] = useState(null);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExperienceRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name) => (selectedOption) => {
    setExperienceRecord((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  // Toggle form (Add new or cancel)
  const toggleForm = () => {
    setShowForm(!showForm);
    setEditingRecord(null);
    if (!showForm) {
      // Reset form when opening
      setExperienceRecord({
        jobTitle: "",
        company: "",
        industry: "",
        location: "",
        salary: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        currentlyWorking: false,
        description: "",
        teamManagement: "",
      });
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setExperienceRecord(record);
    setShowForm(true);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (experienceRecordId) => {
    const result = await deleteExperienceRecord(experienceRecordId);
    if (result.success) {
      alert("Record deleted successfully!");
    } else {
      alert(result.message || "Failed to delete record");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingRecord) {
      // Update existing
      const result = await updateExperienceRecord(
        editingRecord._id,
        experienceRecord
      );
      if (result.success) {
        alert("Experience record updated successfully!");
        toggleForm(); // Hide form
      } else {
        alert(result.message || "Error updating experience record");
      }
    } else {
      // Add new
      const result = await addExperienceRecord(experienceRecord);
      if (result.success) {
        alert("Experience record saved successfully!");
        toggleForm(); // Hide form
      } else {
        alert(result.message || "Error saving experience record");
      }
    }
  };

  const handleToggleShowMore = () => {
    setShowMore(!showMore);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto mt-6">
        <p>Loading experience records...</p>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto mt-6"
      ref={formRef}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-source-sans font-semibold">Experience</h3>
        <button
          onClick={toggleForm}
          className="text-blue-500 hover:text-blue-700"
        >
          <span className="text-2xl font-bold bg-gray-200 plusround">
            {showForm ? "-" : "+"}
          </span>
        </button>
      </div>

      {showForm && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {editingRecord ? "Edit Experience Record" : "Add Experience Record"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Job Title *
              </label>
              <input
                type="text"
                name="jobTitle"
                value={experienceRecord.jobTitle}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 shadow-sm p-2"
                required
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company *
              </label>
              <input
                type="text"
                name="company"
                value={experienceRecord.company}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 shadow-sm p-2"
                required
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Industry *
              </label>
              <Select
                options={industryOptions}
                value={industryOptions.find(
                  (opt) => opt.value === experienceRecord.industry
                )}
                onChange={handleSelectChange("industry")}
                maxMenuHeight={500}
                className="mt-1"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location *
              </label>
              <Select
                options={locationOptions}
                value={locationOptions.find(
                  (opt) => opt.value === experienceRecord.location
                )}
                onChange={handleSelectChange("location")}
                maxMenuHeight={500}
                className="mt-1"
                required
              />
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Salary <span>*</span>
              </label>
              <select
                type="text"
                name="salary"
                value={experienceRecord.salary}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 shadow-sm p-2"
              >
                <option>Chose any one</option>
                {SALARY_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            {/* Start/End Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <div className="flex space-x-4">
                  <select
                    name="startMonth"
                    required
                    value={experienceRecord.startMonth}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 shadow-sm p-2"
                  >
                    <option value="">Month</option>
                    {monthOptions.map((nat) => (
                      <option key={nat.value} value={nat.value}>
                        {nat.label}
                      </option>
                    ))}

                    {/* ...all months */}
                  </select>
                  <select
                    type="number"
                    required
                    name="startYear"
                    value={experienceRecord.startYear}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 shadow-sm p-2"
                    placeholder="Year"
                  >
                    <option>Year</option>
                    {YEAR_OPTIONS.map((nat) => (
                      <option key={nat.value} value={nat.value}>
                        {nat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* End Date (conditional) */}
              {!experienceRecord.currentlyWorking && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <div className="flex space-x-4">
                    <select
                      name="endMonth"
                      required
                      value={experienceRecord.endMonth}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 shadow-sm p-2"
                    >
                      <option value="">Month</option>
                      {monthOptions.map((nat) => (
                        <option key={nat.value} value={nat.value}>
                          {nat.label}
                        </option>
                      ))}
                    </select>
                    <select
                      type="number"
                      required
                      name="endYear"
                      value={experienceRecord.endYear}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 shadow-sm p-2"
                      placeholder="Year"
                    >
                      <option>Year</option>
                      {YEAR_OPTIONS.map((nat) => (
                        <option key={nat.value} value={nat.value}>
                          {nat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Currently Working */}
            <div className="flex items-center gap-5">
              <label className="text-sm font-medium text-gray-700">
                Are you currently working here?
              </label>
              <input
                type="checkbox"
                name="currentlyWorking"
                checked={experienceRecord.currentlyWorking}
                onChange={() =>
                  setExperienceRecord((prev) => ({
                    ...prev,
                    currentlyWorking: !prev.currentlyWorking,
                    endMonth: "",
                    endYear: "",
                  }))
                }
                className="mt-1"
              />
            </div>

            {/* Team Management */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Team Management
              </label>
              <Select
                options={teamManagementOptions}
                value={teamManagementOptions.find(
                  (opt) => opt.value === experienceRecord.teamManagement
                )}
                onChange={handleSelectChange("teamManagement")}
                className="mt-1"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <ReactQuill
                value={experienceRecord.description}
                onChange={(value) =>
                  setExperienceRecord((prev) => ({
                    ...prev,
                    description: value,
                  }))
                }
                className="mt-1 h-52"
                theme="snow"
                required
                modules={{
                  toolbar: [
                    ["bold", "italic", "underline"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["clean"],
                  ],
                }}
              />
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md mt-10 mb-5"
              >
                {editingRecord ? "Update Record" : "Add Record"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Displayed experience records (if not showing form) */}
      {!showForm && experienceRecords.length > 0 && (
        <div>
          {displayedRecords.map((record) => (
            <div
              key={record._id}
              className="relative mb-6 border-b pb-4"
              onMouseEnter={() => setHoveredRecordId(record._id)}
              onMouseLeave={() => setHoveredRecordId(null)}
            >
              <p className="text-black font-semibold font-source-sans text-[16px]">
                {record.jobTitle}
              </p>
              <p className="text-black font-source-sans">{record.company}</p>
              <p className="text-black font-source-sans">
                {record.startMonth} {record.startYear} - {record.endMonth}{" "}
                {record.endYear} | {record.location}
              </p>

              <div className="mt-3">
                <p
                  className={`font-source-sans text-justify ${
                    showFullDescription[record._id] ? "" : "line-clamp-3"
                  }`}
                  dangerouslySetInnerHTML={{ __html: record.description }}
                />
                <button
                  onClick={() => toggleDescription(record._id)}
                  className="text-blue-500 hover:text-blue-700 mt-2 font-source-sans"
                >
                  {record.description.split(" ").length > 50
                    ? showFullDescription[record._id]
                      ? "Read Less"
                      : "Read More"
                    : null}
                </button>
              </div>

              {/* Action Buttons (Edit / Delete) */}
              <div
                className={`absolute top-0 right-0 flex gap-2 ${
                  hoveredRecordId === record._id ? "opacity-100" : "opacity-0"
                }`}
              >
                <button
                  onClick={() => handleEdit(record)}
                  className="text-blue-500 hover:text-blue-700 plusround"
                >
                  <MdEdit className="text-center ml-1.5 text-2xl" />
                </button>
                <button
                  onClick={() => handleDelete(record._id)}
                  className="text-red-500 hover:text-red-700 plusround"
                >
                  <MdDelete className="text-center ml-1.5 text-2xl" />
                </button>
              </div>
            </div>
          ))}

          {/* Show More / Less Button */}
          {experienceRecords.length > 2 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleToggleShowMore}
                className="text-blue-500 hover:text-blue-700"
              >
                {showMore ? "Show Less" : "Show More"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* No records */}
      {!showForm && experienceRecords.length === 0 && (
        <div className="text-base font-source-sans">
          {error && <p>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Experience;
