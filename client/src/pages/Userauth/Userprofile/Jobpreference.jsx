// src/components/JobPreferences.jsx
import React from "react";
import CreatableSelect from "react-select/creatable";
import { MdEdit } from "react-icons/md";

// Import the custom hook
import { useJobPreferences } from "../../hooks/useJobPreferences";
// Import salary ranges constant
import { SALARY_RANGES } from "../../../constants/constants";

const JobPreferences = () => {
  // Use your environment variable or pass as prop
  const API_URL = import.meta.env.VITE_API_URL;

  const {
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
  } = useJobPreferences(API_URL);

  return (
    <div className="bg-white rounded-lg shadow-md p-5 max-w-2xl mx-auto mt-10 font-source-sans">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-black">Job Preferences</h2>

        {/* If not editing and no existing preferences, show plus sign */}
        {!isEditing && !jobPreferences && (
          <button
            onClick={handleEdit}
            className="flex items-center plusround justify-center  text-2xl font-bold rounded-full transition"
            aria-label={
              isEditing ? "Close Job Preferences" : "Add Job Preferences"
            }
          >
            +
          </button>
        )}

        {/* If not editing but preferences exist, show edit icon */}
        {!isEditing && jobPreferences && (
          <div className="flex space-x-4">
            <button onClick={handleEdit} className="text-2xl font-bold plusround">
              <MdEdit className="text-center ml-1.5" />
            </button>
          </div>
        )}

        {/* If editing and jobPreferences is null, show minus sign */}
        {isEditing && jobPreferences === null && (
          <button
            onClick={handleCancel}
            className="flex items-center  w-10 h-10 plusround justify-center  text-2xl rounded-full transition"
            aria-label="Close Job Preferences"
          >
            -
          </button>
        )}
      </div>

      {notification && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">{notification}</div>
      )}

      {/* View Mode (display preferences) */}
      {!isEditing && jobPreferences ? (
        <div className="space-y-4">
          <p className="text-black text-base">Help us match you with your next job</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-black">Desired Job Title</h3>
              <p className="text-black mb-3">{jobPreferences.title}</p>

              <h3 className="text-lg font-semibold text-black">Desired Salary</h3>
              <p className="text-black mb-3">{jobPreferences.salary}</p>

              <h3 className="text-lg font-semibold text-black">Desired Skills</h3>
              <p className="text-black mb-3">{jobPreferences.skills.join(", ")}</p>
            </div>
          </div>
        </div>
      ) : (
        // If not editing and no preferences exist
        !isEditing &&
        jobPreferences === null && (
          <div className="text-base mt-4">No job preferences found.</div>
        )
      )}

      {/* Edit Mode (render the form) */}
      {isEditing && (
        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          <div>
            <div>Help us match you with your next job</div>
            <label htmlFor="title" className="mb-2">
              Desired Job Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={editPreferences.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., MERN Stack Developer"
            />
          </div>

          <div>
            <label htmlFor="salary" className="block text-gray-700 mb-2">
              Desired Salary (PKR) <span className="text-red-500">*</span>
            </label>
            <select
              id="salary"
              name="salary"
              value={editPreferences.salary}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Salary Range</option>
              {SALARY_RANGES.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="skills" className="block text-gray-700 font-semibold mb-2">
              Skills
            </label>
            <CreatableSelect
              isMulti
              onChange={handleSkillsChange}
              value={editPreferences.skills}
              placeholder="e.g., React, NodeJS, JavaScript"
              classNamePrefix="react-select"
            />
          </div>

          <div className="flex items-center">
            <input
              id="relocation"
              name="relocation"
              type="checkbox"
              checked={editPreferences.relocation}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="relocation" className="ml-3 block text-gray-700 font-semibold">
              I am willing to relocate
            </label>
          </div>

          {editPreferences.relocation && (
            <div className="mt-4 space-y-4">
              <div>
                <span className="block text-gray-700 font-semibold mb-2">Relocation Preference</span>
                <div className="flex items-center space-x-6">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="relocationPreference"
                      value="Anywhere"
                      checked={editPreferences.relocationPreference === "Anywhere"}
                      onChange={handleChange}
                      required
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">Anywhere</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="relocationPreference"
                      value="Near"
                      checked={editPreferences.relocationPreference === "Near"}
                      onChange={handleChange}
                      required
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">Near</span>
                  </label>
                </div>
              </div>

              {editPreferences.relocationPreference === "Near" && (
                <div>
                  <label
                    htmlFor="preferredLocations"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Preferred Locations
                  </label>
                  <CreatableSelect
                    isMulti
                    onChange={handlePreferredLocationsChange}
                    value={editPreferences.preferredLocations}
                    placeholder="e.g., Lahore, Islamabad"
                    classNamePrefix="react-select"
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default JobPreferences;
