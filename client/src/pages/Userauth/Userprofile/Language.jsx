import React, { useState } from "react";
import Select from "react-select";
import { useLanguages } from "../../hooks/useLanguages";
import { MdEdit, MdDelete } from "react-icons/md";

const proficiencyOptions = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Expert", label: "Expert" },
];

const countryOptions = [
  { value: "USA", label: "United States" },
  { value: "CAN", label: "Canada" },
  { value: "GBR", label: "United Kingdom" },
  { value: "AUS", label: "Australia" },
  { value: "IND", label: "India" },
  { value: "GER", label: "Germany" },
  { value: "FRA", label: "France" },
  { value: "ITA", label: "Italy" },
  { value: "BRA", label: "Brazil" },
  { value: "JPN", label: "Japan" },
  { value: "PAK", label: "Pakistan" },
];

const Language = () => {
  const { languages, addLanguage, updateLanguage, deleteLanguage } =
    useLanguages();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedProficiency, setSelectedProficiency] = useState(null);
  const [editingLanguage, setEditingLanguage] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [deletingLanguageId, setDeletingLanguageId] = useState(null); // Track which language is being deleted
  const [hoveredRecordId, setHoveredRecordId] = useState(null);

  const handleCountryChange = (option) => setSelectedCountry(option);
  const handleProficiencyChange = (option) => setSelectedProficiency(option);

  const resetForm = () => {
    setSelectedCountry(null);
    setSelectedProficiency(null);
    setEditingLanguage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCountry || !selectedProficiency) {
      return alert("Please select both country and proficiency.");
    }

    const languageData = {
      country: selectedCountry.value,
      proficiency: selectedProficiency.value,
    };

    if (editingLanguage) {
      await updateLanguage(editingLanguage._id, languageData);
    } else {
      await addLanguage(languageData);
    }

    resetForm();
    setIsFormVisible(false);
  };

  const handleEditClick = (language) => {
    setEditingLanguage(language);
    setSelectedCountry(
      countryOptions.find((opt) => opt.value === language.country)
    );
    setSelectedProficiency(
      proficiencyOptions.find((opt) => opt.value === language.proficiency)
    );
    setIsFormVisible(true);
  };

  const handleDeleteClick = async (languageId) => {
    setDeletingLanguageId(languageId);
    await deleteLanguage(languageId);
    setDeletingLanguageId(null); // Reset deleting state after completion
  };

  const toggleFormVisibility = () => {
    // If currently editing, reset form before toggling
    if (editingLanguage) {
      resetForm();
    }
    setIsFormVisible((prev) => !prev);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 max-w-3xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-source-sans font-semibold">Languages</h3>
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
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select a Country <span className="text-red-500">*</span>
            </label>
            <Select
              options={countryOptions}
              value={selectedCountry}
              onChange={handleCountryChange}
              placeholder="Choose a country..."
              className="basic-single"
              classNamePrefix="select"
              isSearchable
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Proficiency <span className="text-red-500">*</span>
            </label>
            <Select
              options={proficiencyOptions}
              value={selectedProficiency}
              onChange={handleProficiencyChange}
              placeholder="Select proficiency..."
              className="basic-single"
              classNamePrefix="select"
              required
            />
          </div>

          <div className="mb-4 flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              {editingLanguage ? "Save Changes" : "Add Language"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6">
        {languages.length === 0 ? (
          <p className="text-base font-source-sans">No languages added yet.</p>
        ) : (
          <div>
            {languages.map((lang) => (
              <div
                key={lang._id}
                className="flex items-center mb-2 justify-between"
                onMouseEnter={() => setHoveredRecordId(lang._id)}
                onMouseLeave={() => setHoveredRecordId(null)}
              >
                <span className="text-base font-source-sans">
                  {lang.country} ({lang.proficiency})
                </span>

                <div
                    className={`relative justify-end -top-2 right-0 flex gap-2  ${
                      hoveredRecordId === lang._id
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                  <button
                    onClick={() => handleEditClick(lang)}
                    className="text-blue-500 hover:text-blue-700 plusround"
                  >
                    <MdEdit className="text-center ml-1.5 text-2xl" />
                  </button>
                  {deletingLanguageId === lang._id ? (
                    <span className="text-gray-500">Deleting...</span>
                  ) : (
                    <button
                      onClick={() => handleDeleteClick(lang._id)}
                      className="text-red-500 hover:text-red-700 plusround"
                    >
                      <MdDelete className="text-center ml-1.5 text-2xl" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Language;
