import React from "react";
import Dashboardcardsapi from "../../pages/hooks/dashboardcards/Dashboardcardsapi";
import { FaBuilding, FaRegUser, FaUsers, FaBriefcase } from "react-icons/fa";
import { Link } from "react-router-dom";

// Main component for the dashboard cards
const Dashboardcards = () => {
  // Using the custom hook to fetch data
  const data = Dashboardcardsapi();

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Link to="/admin-dashboard/companies">
          <div className="bg-blue-500 p-4 rounded">
            <div className="flex items-center">
              <span class="p-2 mr-3 rounded border">
                <FaBuilding className="text-white text-2xl" />
              </span>

              <div className="ml-auto text-right">
                <p className="text-lg text-white mb-1">Total Companies</p>
                <span className="text-5xl text-white font-semibold">
                  {data.totalCompanies !== null ? data.totalCompanies : 0}
                </span>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/admin-dashboard/users">
          <div className="bg-green-500 p-4 rounded">
            <div className="flex items-center">
              <span className="p-2 mr-3 rounded border">
                <FaRegUser className="text-white text-2xl" />
              </span>
              <div className="ml-auto text-right">
                <p className="text-lg text-white mb-1">Total Users</p>
                <span className="text-5xl text-white font-semibold">
                  {data.totalUsers !== null ? data.totalUsers : 0}
                </span>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/admin-dashboard/aluminis">
          <div className="bg-yellow-500 p-4 rounded">
            <div className="flex items-center">
              <span className="p-2 mr-3 rounded border">
                <FaUsers className="text-white text-2xl" />
              </span>
              <div className="ml-auto text-right">
                <p className="text-lg text-white mb-1">Alumni Count</p>
                <span className="text-5xl text-white font-semibold">
                  {data.alumniCount !== null ? data.alumniCount : 0}
                </span>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/admin-dashboard/jobs">
          <div className="bg-red-500 p-4 rounded">
            <div className="flex items-center">
              <span className="p-2 mr-3 rounded border">
                <FaBriefcase className="text-white text-2xl" />
              </span>
              <div className="ml-auto text-right">
                <p className="text-lg text-white mb-1">Total Jobs</p>
                <span className="text-5xl text-white font-semibold">
                  {data.jobs !== null ? data.jobs : 0}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default Dashboardcards;
