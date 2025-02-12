import React from "react";
import { locationOptions } from "../../constants/constants";

export default function CityAreaSelector({ city, area, handleChange }) {
  return (
    <>
      {/* City Dropdown */}
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">
          City <span className="text-red-500">*</span>
        </label>
        <select
          name="city"
          value={city}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 shadow-sm 
             focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 bg-white"
        >
          <option value="">Select City</option>
          {locationOptions.map((location) => (
            <option key={location.value} value={location.value}>
              {location.label}
            </option>
          ))}
        </select>
      </div>

      {/* Area Input */}
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">
          Area <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="area"
          value={area}
          onChange={handleChange}
          required
          placeholder="Enter Area"
          className="mt-1 block w-full border border-gray-300 shadow-sm 
             focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 bg-white"
        />
      </div>
    </>
  );
}