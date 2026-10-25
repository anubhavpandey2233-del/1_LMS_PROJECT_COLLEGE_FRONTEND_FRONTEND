
import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { LineChart } from "@mui/x-charts";

const xLabels = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const margin = { right: 24 };

function LineChartData({ dashboardStats = {}, loading = false }) {
  const activeUsers = Number(dashboardStats.totalActiveUsers) || 0;
  const courses = Number(dashboardStats.totalCourses) || 0;
  const enrollments = Number(dashboardStats.totalEnrollments) || 0;
  const revenue = Number(dashboardStats.totalRevenue) || 0;

  // Temporary monthly values until the backend provides month-wise data.
  const repeatMonthly = (value) => Array(12).fill(value);

  return (
    <Paper
  sx={{
    p: 2,
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    overflow: "hidden",
    borderRadius: 3,
  }}
>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        Monthly LMS Statistics
      </Typography>

      {loading ? (
        <Typography sx={{ textAlign: "center", mt: 10 }}>
          Loading chart data...
        </Typography>
      ) : (
        <LineChart
          height={320}
          margin={{ top: 15, right: 25, bottom: 55, left: 60 }}
          series={[
            {
              data: repeatMonthly(activeUsers),
              label: "Active Users",
              color: "#0D9488",
              showMark: true,
            },
            {
              data: repeatMonthly(courses),
              label: "Courses",
              color: "#635BFF",
              showMark: true,
            },
            {
              data: repeatMonthly(enrollments),
              label: "Enrollments",
              color: "#F59E0B",
              showMark: true,
            },
            {
              data: repeatMonthly(revenue),
              label: "Revenue (₹)",
              color: "#EC4899",
              showMark: true,
              valueFormatter: (value) =>
                `₹${Number(value || 0).toLocaleString("en-IN")}`,
            },
          ]}
          xAxis={[
            {
              scaleType: "point",
              data: xLabels,
            },
          ]}
          yAxis={[
            {
              width: 60,
              valueFormatter: (value) =>
                Number(value).toLocaleString("en-IN"),
            },
          ]}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              position: {
                vertical: "bottom",
                horizontal: "middle",
              },
              labelStyle: {
                fontSize: 11,
              },
              itemMarkWidth: 8,
              itemMarkHeight: 8,
              padding: 5,
            },
          }}
        />
      )}
    </Paper>
  );
}

export default LineChartData;
