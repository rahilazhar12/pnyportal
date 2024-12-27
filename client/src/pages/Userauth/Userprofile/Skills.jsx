// src/components/Skills.jsx
import React from "react";
import Select from "react-select";
import { MdEdit, MdDelete } from "react-icons/md";
import { useSkills } from "../../hooks/useSkills";

const Skills = () => {
  const {
    skills,
    hoveredRecordId,
    selectedSkill,
    selectedExperience,
    editingSkill,
    isFormVisible,
    isLoading,
    deletingSkills,
    setSelectedSkill,
    setHoveredRecordId,
    handleExperienceChange,
    handleSubmit,
    handleEditClick,
    handleSave,
    handleDeleteClick,
    toggleFormVisibility,
    experienceOptions,
  } = useSkills();

  return (
    <div className="bg-white rounded-lg shadow-md p-5 max-w-3xl mx-auto mt-6">
      <h3 className="text-2xl font-source-sans font-semibold flex justify-between items-center mb-4">
        <span>Skills</span>

        <button onClick={toggleFormVisibility} className="plusround text-2xl font-bold  ">
          <span>
            {isFormVisible ? "-" : "+"}
          </span>
        </button>

      </h3>

      {isFormVisible && (
        <form onSubmit={editingSkill ? handleSave : handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Skill Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              placeholder="Enter skill name..."
              className="border rounded w-full py-2 px-3"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Experience Level <span className="text-red-500">*</span>
            </label>
            <Select
              options={experienceOptions}
              value={selectedExperience}
              onChange={handleExperienceChange}
              placeholder="Select experience level..."
              className="basic-single"
              classNamePrefix="select"
              required
            />
          </div>

          <div className="mb-4 flex justify-end">
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-gray-200 rounded-full border-t-gray-400 animate-spin"></div>
            ) : (
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                {editingSkill ? "Save Changes" : "Add Skill"}
              </button>
            )}
          </div>
        </form>
      )}

      {!isFormVisible && (
        <div className="mt-6">
          {skills.length === 0 ? (
            <p className="text-base font-source-sans">No skills added yet.</p>
          ) : (
            skills.map((skill) => (
              <div
                key={skill._id}
                className="flex items-center mb-2 justify-between"
                onMouseEnter={() => setHoveredRecordId(skill._id)}
                onMouseLeave={() => setHoveredRecordId(null)}
              >
                <span className="text-base font-source-sans">
                  {skill.skill} ({skill.experience})
                </span>

                <div
                  className={`flex ${hoveredRecordId === skill._id ? "opacity-100" : "opacity-0"}`}
                >
                  <button
                    onClick={() => handleEditClick(skill)}
                    className="text-blue-500 hover:text-blue-700 plusround"
                  >
                    <MdEdit className="text-center ml-1.5 text-2xl" />
                  </button>

                  {deletingSkills[skill._id] ? (
                    <div className="w-4 h-4 border-2 border-gray-200 rounded-full border-t-gray-400 animate-spin"></div>
                  ) : (
                    <button
                      className="plusround"
                      onClick={() => handleDeleteClick(skill._id)}
                    >
                      <MdDelete className="text-center ml-1.5 text-2xl " />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Skills;
