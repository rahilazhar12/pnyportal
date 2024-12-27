// src/components/Education.jsx
import React from "react";
import Select from "react-select";
import Creatable from "react-select/creatable";
import { MdEdit, MdDelete } from "react-icons/md";
import { useEducation } from "../../hooks/useEducation";
import {
  degreeOptions,
  CGPA_OUT_OF_OPTIONS,
  YEAR_OPTIONS,
  locationOptions,
} from "../../../constants/constants";

const Education = () => {
  // Hook usage
  const {
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
    setEducationRecord
  } = useEducation();

  

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto mt-6">
      {/* Header + Toggle Button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold font-source-sans">Education</h3>
        <button
          onClick={handleToggleForm}
          className="text-blue-500 hover:text-blue-700"
        >
          <span className="text-2xl font-bold plusround">
            {showForm ? "-" : "+"}
          </span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div ref={formRef}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Degree Title *
              </label>
              <Select
                options={degreeOptions}
                value={degreeOptions.find(
                  (option) => option.value === educationRecord.degreeTitle
                )}
                onChange={(selectedOption) =>
                  handleSelectChange("degreeTitle")(selectedOption)
                }
                placeholder="Select Degree Title"
                className="mt-1"
                required
              />
            </div>

            <div>
              <label>Field of Study *</label>
              <Creatable
                isMulti
                value={educationRecord.fieldOfStudy.map((val) => ({
                  value: val,
                  label: val,
                }))}
                onChange={(selectedOptions) =>
                  setEducationRecord((prev) => ({
                    ...prev,
                    fieldOfStudy: selectedOptions.map((opt) => opt.value),
                  }))
                }
                placeholder="Enter Field of Study"
                noOptionsMessage={() => null}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location *
              </label>
              <Select
                options={locationOptions}
                value={locationOptions.find(
                  (option) => option.value === educationRecord.location
                )}
                onChange={handleSelectChange("location")}
                className="mt-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Institution *
              </label>
              <input
                type="text"
                name="institution"
                value={educationRecord.institution}
                onChange={handleChange}
                placeholder="Institute"
                className="mt-1 block w-full border border-gray-300 shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Completion Year *
              </label>
              <Select
                options={YEAR_OPTIONS}
                value={YEAR_OPTIONS.find(
                  (option) => option.value === educationRecord.completionYear
                )}
                onChange={(selectedOption) =>
                  setEducationRecord((prevState) => ({
                    ...prevState,
                    completionYear: selectedOption.value,
                  }))
                }
                placeholder="Select Completion Year"
                className="mt-1"
                required
              />
            </div>

            {/* CGPA Section */}
            {showCgpaFields && (
              <div className="flex space-x-2">
                {/* Out Of Dropdown */}
                <Select
                  options={CGPA_OUT_OF_OPTIONS}
                  placeholder="Out of"
                  value={CGPA_OUT_OF_OPTIONS.find(
                    (opt) => opt.value === Number(cgpaInput.cgpaOutOf)
                  )}
                  onChange={(selectedOption) =>
                    setCgpaInput((prev) => ({
                      ...prev,
                      cgpaOutOf: selectedOption.value,
                    }))
                  }
                  className="w-1/2"
                />

                {/* CGPA Dropdown */}
                <Select
                  options={dynamicCgpaOptions}
                  placeholder="Select CGPA"
                  value={dynamicCgpaOptions.find(
                    (opt) => opt.value === cgpaInput.cgpa
                  )}
                  onChange={(selectedOption) =>
                    setCgpaInput((prev) => ({
                      ...prev,
                      cgpa: selectedOption.value,
                    }))
                  }
                  className="w-1/2"
                />
              </div>
            )}

            <div className="font-source-sans">
              <button
                type="button"
                onClick={() => setShowCgpaFields(!showCgpaFields)}
                className="text-[#4688f1]"
              >
                {showCgpaFields ? "Remove CGPA" : "Add CGPA"}
              </button>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md"
              >
                {editingRecord ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Education Records List */}
      <div className="mt-6 font-source-sans">
        {/* Only display records if form is hidden */}
        {!showForm && displayedRecords.length > 0 ? (
          displayedRecords.map((record, index) => (
            <div
              key={record._id || index}
              onMouseEnter={() => setHoveredRecordId(record._id)}
              onMouseLeave={() => setHoveredRecordId(null)}
              className="relative mb-6 border-b pb-4"
            >
              <h4 className="font-semibold text-base">{record.institution}</h4>
              <p className="text-black text-base">{record.degreeTitle}</p>
              <p className="text-black text-base flex flex-wrap gap-2">
                {record.fieldOfStudy.map((item, idx) => (
                  <span key={idx}>
                    {item}
                    {idx < record.fieldOfStudy.length - 1 && ","}
                  </span>
                ))}
              </p>
              <p className="text-black text-base">{record.completionYear}</p>

              {/* Edit / Delete Icons */}
              <div
                className={`relative justify-end -top-20 right-0 flex gap-2  ${
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
          ))
        ) : (
          <p className="text-base">{!showForm && "No Education found."}</p>
        )}

        {/* Show More / Show Less Button */}
        {educationRecords.length > 2 && (
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
    </div>
  );
};

export default Education;
