
import React from "react";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: theme.palette.mode === "dark" ? "#33334d" : "#eeeeF8",
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#635bff",
  },
}));

function LinearProgressData({
  dashboardStats = {},
  loading = false,
}) {
  const activeUsers = Number(dashboardStats.totalActiveUsers) || 0;
  const courses = Number(dashboardStats.totalCourses) || 0;
  const enrollments = Number(dashboardStats.totalEnrollments) || 0;
  const revenue = Number(dashboardStats.totalRevenue) || 0;

  const stats = [
    {
      label: "Active Users",
      value: activeUsers,
      color: "#0D9488",
      isRevenue: false,
    },
    {
      label: "Courses",
      value: courses,
      color: "#635BFF",
      isRevenue: false,
    },
    {
      label: "Enrollments",
      value: enrollments,
      color: "#F59E0B",
      isRevenue: false,
    },
    {
      label: "Revenue",
      value: revenue,
      color: "#EC4899",
      isRevenue: true,
    },
  ];

  const maxValue = Math.max(...stats.map((item) => item.value), 1);

  const formatNumber = (value) =>
    Number(value || 0).toLocaleString("en-IN");

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
        LMS Performance Overview
      </Typography>

      {loading ? (
        <Typography sx={{ py: 4, textAlign: "center" }}>
          Loading statistics...
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {stats.map((item) => (
            <Box key={item.label}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                  gap: 2,
                }}
              >
                <Typography variant="body2" fontWeight={600}>
                  {item.label}
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  {item.isRevenue
                    ? `₹${formatNumber(item.value)}`
                    : formatNumber(item.value)}
                </Typography>
              </Box>

              <BorderLinearProgress
                variant="determinate"
                value={Math.min((item.value / maxValue) * 100, 100)}
                sx={{
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: item.color,
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}

export default LinearProgressData;
