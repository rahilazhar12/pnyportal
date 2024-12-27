import React from "react";

export default function ProfilePictureUploader({
  getImageSrc,
  handleFileChange,
  message,
}) {
  return (
    <div className="col-span-1">
      <label className="block text-sm font-medium text-gray-700">
        Profile Picture
      </label>

      <div className="relative w-24 h-24 mt-2">
        {/* Profile Image */}
        <img
          src={getImageSrc()} // The preview image
          alt="Profile Preview"
          className="w-full h-full rounded-full object-cover shadow-md cursor-pointer"
          onClick={() =>
            document.getElementById("profilePictureInput").click()
          }
        />

        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 rounded-full transition-opacity duration-300 cursor-pointer"
          onClick={() =>
            document.getElementById("profilePictureInput").click()
          }
        >
          <span className="text-white text-center text-sm font-medium">
            Click to change
          </span>
        </div>
      </div>

      <input
        id="profilePictureInput"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {message === "Please select an image with a size of 50KB or less." && (
        <p className="text-red-600 text-sm mt-2">{message}</p>
      )}
    </div>
  );
}
