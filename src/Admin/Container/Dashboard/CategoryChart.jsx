
import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

const CategoryChart = ({
  dashboardStats = {},
  loading = false,
}) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const formatNumber = (value) =>
    Number(value || 0).toLocaleString("en-IN");

  // Monthly data should come from the backend API.
  // Current totals are repeated until monthly data is available.
  const data = months.map((month) => ({
    month,
    activeUsers: Number(dashboardStats.totalActiveUsers) || 0,
    courses: Number(dashboardStats.totalCourses) || 0,
    enrollments: Number(dashboardStats.totalEnrollments) || 0,
    revenue: Number(dashboardStats.totalRevenue) || 0,
  }));

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Typography variant="h6" fontWeight="bold">
        Monthly LMS Statistics
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 0.5, mb: 2 }}
      >
        Monthly overview of users, courses, enrollments and revenue
      </Typography>

      {loading ? (
        <Typography sx={{ py: 8, textAlign: "center" }}>
          Loading chart data...
        </Typography>
      ) : (
        <Box sx={{ width: "100%", minWidth: 0 }}>
          <BarChart
            dataset={data}
            xAxis={[
              {
                scaleType: "band",
                dataKey: "month",
                label: "Months",
                tickLabelStyle: {
                  fontSize: 12,
                },
              },
            ]}
            yAxis={[
              {
                min: 0,
                width: 75,
                valueFormatter: (value) => formatNumber(value),
              },
            ]}
            series={[
              {
                dataKey: "activeUsers",
                label: "Active Users",
                color: "#0D9488",
                valueFormatter: (value) => formatNumber(value),
              },
              {
                dataKey: "courses",
                label: "Courses",
                color: "#635BFF",
                valueFormatter: (value) => formatNumber(value),
              },
              {
                dataKey: "enrollments",
                label: "Enrollments",
                color: "#F59E0B",
                valueFormatter: (value) => formatNumber(value),
              },
              {
                dataKey: "revenue",
                label: "Revenue",
                color: "#EC4899",
                valueFormatter: (value) => `₹${formatNumber(value)}`,
              },
            ]}
            height={380}
            borderRadius={5}
            grid={{ horizontal: true }}
            margin={{
              left: 15,
              right: 20,
              top: 25,
              bottom: 35,
            }}
            slotProps={{
              legend: {
                position: {
                  vertical: "bottom",
                  horizontal: "middle",
                },
              },
            }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default CategoryChart;
