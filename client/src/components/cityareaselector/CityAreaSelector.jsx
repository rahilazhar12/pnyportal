import React from "react";
import { areasByCity } from "../../constants/constants";


export default function CityAreaSelector({ city, area, handleChange }) {
  const availableAreas = city ? areasByCity[city] || [] : [];

  return (
    <>
      {/* City */}
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
          <option value="Lahore">Lahore</option>
          <option value="Karachi">Karachi</option>
          <option value="Islamabad">Islamabad</option>
          {/* Add more cities as needed */}
        </select>
      </div>

      {/* Area */}
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">
          Area <span className="text-red-500">*</span>
        </label>
        <select
          name="area"
          value={area}
          onChange={handleChange}
          required
          disabled={!city}
          className="mt-1 block w-full border border-gray-300 shadow-sm 
             focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 bg-white"
        >
          <option value="">
            {city ? "Select Area" : "Select City First"}
          </option>
          {availableAreas.map((areaName) => (
            <option key={areaName} value={areaName}>
              {areaName}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
