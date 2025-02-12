import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import { IoIosLock } from "react-icons/io";
import {
  SALARY_RANGES,
  Careerlevel,
  NATIONALITIES,
} from "../../../constants/constants";
import usePersonalInfo from "../../hooks/usePersonalInfo";
import ProfilePictureUploader from "../../../components/profilepictureuploader/ProfilePictureUploader";
import CityAreaSelector from "../../../components/cityareaselector/CityAreaSelector";

function Personal() {
  // Use the custom hook to manage form state & API logic
  const {
    formData,
    loading,
    message,
    isFetching,
    isProfilePictureValid,
    profilePicturePreview,
    getImageSrc,
    handleChange,
    handleFileChange,
    handleSubmit,
    setMessage,
  } = usePersonalInfo();

  const [isEditing, setIsEditing] = useState(false);

  if (isFetching) {
    return (
      <div className="bg-gray-50 min-h-screen flex justify-center items-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setMessage("");
  };

  return (
    <div className="bg-gray-50">
      {/* Header Section */}
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-600 text-black font-source-sans">
            Personal Information
          </h2>
          {formData.personalInfoId ? (
            <button
              className="plusround text-2xl font-bold"
              onClick={toggleEdit}
            >
              <MdEdit className="text-center ml-1.5" />
            </button>
          ) : (
            <button
              className="plusround text-2xl font-bold"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              {isEditing ? "-" : "+"}
            </button>
          )}
        </div>

        {/* Profile Display */}
        {!isEditing && formData.personalInfoId && (
          <div className="flex flex-col md:flex-row items-center mt-6 space-y-6 md:space-y-0 md:space-x-6">
            {/* Profile Image Container */}
            <div className="relative w-32 h-32 p-2 flex flex-col">
              <img
                src={getImageSrc()}
                alt="Profile"
                className="w-full h-full rounded-full object-cover shadow-md mx-auto"
              />
            </div>

            {/* Profile Details */}
            <div className="text-center md:text-left">
              {/* Name */}
              <h3 className="text-2xl text-gray-800 font-source-sans font-semibold">
                {formData.name || "N/A"}
              </h3>

              {/* Email */}
              <div className="text-[#212121] text-base md:text-lg font-source-sans font-normal flex justify-center md:justify-start items-center gap-1 mt-2">
                {formData.email || "N/A"} <IoIosLock />
              </div>

              {/* Mobile */}
              <div className="text-[#212121] text-base md:text-lg font-source-sans font-normal flex justify-center md:justify-start items-center gap-1 mt-1">
                {formData.mobile || "N/A"} <IoIosLock />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Editable Form Section */}
      {isEditing && (
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-6 p-6">
          <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
            {/* File Uploader */}
            <ProfilePictureUploader
              profilePicturePreview={profilePicturePreview}
              getImageSrc={getImageSrc}
              handleFileChange={handleFileChange}
              message={message}
            />

            {/* Name */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>

            {/* Email */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                required
                disabled={!!formData.personalInfoId}
                className="mt-1 block w-full border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>

            {/* Father Name */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                Father Name
              </label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName || ""}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>

            {/* Date of Birth */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob || ""}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>

            {/* Gender */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                Gender *
              </label>
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 mt-1">
                {["Male", "Female", "Transgender"].map((g) => (
                  <label className="flex items-center" key={g}>
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleChange}
                      required
                      className="form-radio text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">{g}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Marital Status */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                Marital Status <span className="text-red-500">*</span>
              </label>
              <select
                name="maritalstatus"
                value={formData.maritalstatus || ""}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 bg-white"
              >
                <option value="">Select Marital Status</option>
                <option value="Divorced">Divorced</option>
                <option value="Engaged">Engaged</option>
                <option value="Married">Married</option>
                <option value="Separated">Separated</option>
                <option value="Single">Single</option>
                <option value="Widow(er)">Widow(er)</option>
              </select>
            </div>

            {/* Nationality */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                Nationality <span className="text-red-500">*</span>
              </label>
              <select
                name="nationality"
                value={formData.nationality || ""}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 shadow-sm 
                  focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 bg-white"
              >
                <option value="">Select Nationality</option>
                {NATIONALITIES.map((nat) => (
                  <option key={nat.value} value={nat.value}>
                    {nat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* City & Area Sub-Component */}
            <CityAreaSelector
              city={formData.city}
              area={formData.area}
              handleChange={handleChange}
            />

            {/* CNIC */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                CNIC
              </label>
              <input
                type="number"
                name="cnic"
                value={formData.cnic || ""}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>

            {/* Mobile */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                Mobile *
              </label>
              <input
                type="number"
                name="mobile"
                value={formData.mobile || ""}
                onChange={handleChange}
                required
                disabled={!!formData.personalInfoId}
                className="mt-1 block w-full border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>

            {/* Career Level */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                Career Level
              </label>
              <select
                name="careerLevel"
                value={formData.careerLevel || ""}
                onChange={handleChange}
                required
                className="block w-full border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              >
                <option value="">Select Career Level</option>
                {Careerlevel.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            {/* Expected Salary */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                Expected Salary (PKR)
              </label>
              <select
                name="expectedSalary"
                value={formData.expectedSalary || ""}
                onChange={handleChange}
                required
                className="block w-full border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              >
                <option value="">Select Salary Range</option>
                {SALARY_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button & Error/Success Message */}
            <div className="col-span-2">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                disabled={loading || !isProfilePictureValid}
              >
                {loading
                  ? "Saving..."
                  : formData.personalInfoId
                  ? "Update"
                  : "Add"}
              </button>
            </div>

            {message && (
              <p
                className={`col-span-2 mt-4 text-sm  mb-4 p-4 bg-green-100 text-green-700 rounded${
                  message.toLowerCase().includes("success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

export default Personal;
