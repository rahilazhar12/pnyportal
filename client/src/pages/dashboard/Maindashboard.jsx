import React from "react";
import Dashboardcards from "../../components/dashboardcards/Dashboardcards";
import DashboardChart from "../../components/dashboardchart/Dashboardchart";

const Maindashboard = () => {
  return (
    <>
      <Dashboardcards />

      <div className="grid grid-cols-1 lg:grid-cols-2 border-t mt-5 border-dotted border-black">
        <div>1</div>
        <div>
          <DashboardChart />
        </div>
      </div>
    </>
  );
};

export default Maindashboard;
