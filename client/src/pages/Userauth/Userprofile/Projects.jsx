import React, { useState, useRef, useEffect } from "react";
import { useProjects } from "../../hooks/useProjects";
import DeleteModal from "../../../components/Models/Deletemodel";
import { monthOptions, YEAR_OPTIONS } from "../../../constants/constants";
import { MdEdit, MdDelete } from "react-icons/md";

// Constants

const ASSOCIATIONS = [
  { value: "mba", label: "Masters in Business Administration at UCP" },
];

const Projects = () => {
  const { projects, saveProject, deleteProject } = useProjects();

  // Form states
  const [isOngoing, setIsOngoing] = useState(false);
  const [image, setImage] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [association, setAssociation] = useState("");
  const [description, setDescription] = useState("");
  const [hoveredRecordId, setHoveredRecordId] = useState(null);

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);

  // Delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Form visibility
  const [isFormVisible, setIsFormVisible] = useState(false);

  const formRef = useRef(null);

  const toggleFormVisibility = () => {
    setIsFormVisible((prev) => !prev);
  };

  const handleOngoingChange = () => {
    setIsOngoing((prev) => !prev);
    if (!isOngoing) {
      setEndMonth("");
      setEndYear("");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In production, you would handle file upload to the server.
      setImage(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setProjectName("");
    setProjectUrl("");
    setStartMonth("");
    setStartYear("");
    setEndMonth("");
    setEndYear("");
    setIsOngoing(false);
    setAssociation("");
    setDescription("");
    setImage(null);
    setIsEditing(false);
    setCurrentProjectId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericStartYear = startYear ? parseInt(startYear, 10) : undefined;
    const numericEndYear = endYear ? parseInt(endYear, 10) : undefined;

    const projectData = {
      name: projectName,
      projectUrl,
      startMonth,
      startYear: numericStartYear,
      endMonth: isOngoing ? undefined : endMonth,
      endYear: isOngoing ? undefined : numericEndYear,
      isOngoing,
      association,
      description,
      image,
    };

    const success = await saveProject(projectData, currentProjectId);
    if (success) {
      resetForm();
      setIsFormVisible(false);
    }
  };

  const handleEditClick = (project) => {
    setIsEditing(true);
    setCurrentProjectId(project._id);
    setProjectName(project.name);
    setProjectUrl(project.projectUrl);
    setStartMonth(project.startMonth);
    setStartYear(project.startYear?.toString() || "");
    setEndMonth(project.endMonth || "");
    setEndYear(project.endYear?.toString() || "");
    setIsOngoing(project.isOngoing);
    setAssociation(project.association || "");
    setDescription(project.description || "");
    setImage(project.image || null);
    setIsFormVisible(true);
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    const success = await deleteProject(projectToDelete._id);
    if (success) {
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  const handleCancelEdit = () => {
    resetForm();
    setIsFormVisible(false);
  };

  return (
    <div className="mt-6" ref={formRef}>
      <div className="bg-white rounded-lg shadow-md p-5 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-source-sans font-semibold">Projects</h3>
          <button
            onClick={toggleFormVisibility}
            className="text-blue-500 hover:text-blue-700"
          >
            <span className="text-2xl font-bold plusround">
              {isFormVisible ? "-" : "+"}
            </span>
          </button>
        </div>

        {isFormVisible && (
          <form onSubmit={handleSubmit}>
            {/* Image Upload */}
            {/* <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Project Image
              </label>
              <div
                className="w-full border-dashed border-2 border-blue-500 bg-blue-50 h-20 flex items-center justify-center text-gray-500 rounded cursor-pointer"
                onClick={() => document.getElementById("imageUpload").click()}
              >
                {image ? (
                  <img
                    src={image}
                    alt="Uploaded"
                    className="object-cover h-full w-full rounded"
                  />
                ) : (
                  <span>Click to upload image</span>
                )}
              </div>
              <input
                id="imageUpload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div> */}

            {/* Project Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Project Name
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </div>

            {/* Project URL */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Project URL
              </label>
              <input
                type="url"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project URL"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                required
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Date
                </label>
                <div className="flex space-x-2">
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={startMonth}
                    onChange={(e) => setStartMonth(e.target.value)}
                    required
                  >
                    <option value="">Month</option>
                    {monthOptions.map((nat) => (
                      <option key={nat.value} value={nat.value}>
                        {nat.label}
                      </option>
                    ))}
                  </select>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                    required
                  >
                    <option value="">Year</option>
                    {YEAR_OPTIONS.map((yr) => (
                      <option key={yr.value} value={yr.value}>
                        {yr.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {!isOngoing && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    End Date
                  </label>
                  <div className="flex space-x-2">
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={endMonth}
                      onChange={(e) => setEndMonth(e.target.value)}
                      required
                    >
                      <option value="">Month</option>
                      {monthOptions.map((nat) => (
                        <option key={nat.value} value={nat.value}>
                          {nat.label}
                        </option>
                      ))}
                    </select>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={endYear}
                      onChange={(e) => setEndYear(e.target.value)}
                      required
                    >
                      <option value="">Year</option>
                      {YEAR_OPTIONS.map((yr) => (
                        <option key={yr.value} value={yr.value}>
                          {yr.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Ongoing Checkbox */}
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                checked={isOngoing}
                onChange={handleOngoingChange}
              />
              <label className="ml-2 text-sm">Currently Ongoing</label>
            </div>

            {/* Association */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Associated With
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={association}
                onChange={(e) => setAssociation(e.target.value)}
                required
              >
                <option value="">Select association</option>
                {ASSOCIATIONS.map((assoc) => (
                  <option key={assoc.value} value={assoc.value}>
                    {assoc.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 transition-colors duration-200 px-3 py-2 rounded text-white hover:bg-blue-600"
              >
                {isEditing ? "Update Project" : "Save Project"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        {/* Display Projects */}
        <div>
          {!isFormVisible && projects.length > 0 ? (
            <ul className="space-y-6 list-none">
              {projects.map((project) => (
                <li
                  key={project._id}
                  className="rounded-lg py-4 border-b"
                  onMouseEnter={() => setHoveredRecordId(project._id)}
                  onMouseLeave={() => setHoveredRecordId(null)}
                >
                  <div className="flex flex-col">
                    <h4 className="text-base font-source-sans font-semibold">
                      {project.name}
                    </h4>
                    <p className="text-base font-source-sans text-blue-600 hover:text-blue-800">
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {project.projectUrl}
                      </a>
                    </p>
                    <p className="text-base text-black text-justify  font-source-sans">
                      {project.description}
                    </p>
                  </div>
                  <div
                    className={`relative justify-end -top-20 right-0 flex gap-2  ${
                      hoveredRecordId === project._id
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <button
                      onClick={() => handleEditClick(project)}
                      className="text-blue-500 hover:text-blue-700 plusround"
                    >
                      <MdEdit className="text-center ml-1.5 text-2xl" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(project)}
                      className="text-red-500 hover:text-red-700 plusround"
                    >
                      <MdDelete className="text-center ml-1.5 text-2xl" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-base font-source-sans">
              {!isFormVisible && "You have not added any projects yet"}
            </p>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onRequestClose={cancelDelete}
        onConfirmDelete={confirmDelete}
        projectToDelete={projectToDelete}
      />
    </div>
  );
};

export default Projects;
