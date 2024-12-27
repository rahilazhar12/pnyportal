import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2"; // Importing Bar chart from react-chartjs-2
import "chart.js/auto"; // Required for chart.js to work correctly
import Dashboardcardsapi from "../../pages/hooks/dashboardcards/Dashboardcardsapi";

// Chart component for displaying data in a bar chart
const DashboardChart = () => {
  // Using the custom hook to fetch data
  const data = Dashboardcardsapi();

  // Prepare the data for the chart
  const chartData = {
    labels: ["Total Companies", "Total Users", "PNY Alumni", "Jobs"], // Labels for the chart
    datasets: [
      {
        label: "Dashboard Data",
        data: [
          data.totalCompanies !== null ? data.totalCompanies : 15500, // Fake data for demonstration
          data.totalUsers !== null ? data.totalUsers : 66200, // Fake data for demonstration
          data.alumniCount !== null ? data.alumniCount : 44550, // Fake data for demonstration
          data.finance !== null ? data.jobs : 75000, // Fake data for demonstration
        ],
        backgroundColor: [
          "#1282c5", // Blue
          "#d4151b", // Red
          "#1282c5", // Blue
          "#d4151b", // Red
        ],
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true, // Ensures the chart is responsive
    maintainAspectRatio: false, // Prevents fixed aspect ratio
    scales: {
      y: {
        beginAtZero: true, // Starts the Y-axis at zero
      },
    },
  };

  return (
    <Paper
      elevation={3}
      style={{ padding: "20px", margin: "20px", height: "400px" }}
    >
      {" "}
      {/* Chart container */}
      <Typography variant="h6" style={{ marginBottom: "10px" }}>
        Dashboard Data Overview
      </Typography>
      <Bar data={chartData} options={chartOptions} />{" "}
      {/* Bar chart component */}
    </Paper>
  );
};

export default DashboardChart;
