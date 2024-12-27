import React from "react";

const ProgressBar = ({ percentage }) => {
  return (
    <div className="flex items-center mb-4">
      <div className="w-full bg-gray-300 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="ml-2">{Math.round(percentage)}%</span>
    </div>
  );
};

export default ProgressBar;
