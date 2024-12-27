import React from "react";

const TaskList = ({ tasks }) => (
  <div>
    {tasks.map((task, index) => (
      <div
        key={index}
        className={`flex justify-between items-center ${
          task.completed ? "text-green-600" : "text-gray-600"
        }`}
      >
        <span>{task.name}</span>
        {task.completed ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5 text-green-600"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5 text-red-600"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>
    ))}
  </div>
);

export default TaskList;
