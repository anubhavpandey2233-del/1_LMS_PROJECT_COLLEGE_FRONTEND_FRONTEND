
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { PieChart } from "@mui/x-charts";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DataUsageSharpIcon from "@mui/icons-material/DataUsageSharp";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";

import CategoryChart from "./CategoryChart";
import LineChartData from "./LineChartData";
// import PieChartData from "./PieChartData";
import LinearProgressData from "./LinearProgressData";

const courseData = [
  { _id: 1, name: "React JS", category: "Web Development", students: 120, rank: "Popular", rankColor: "primary" },
  { _id: 2, name: "Node.js", category: "Backend Development", students: 85, rank: "Active", rankColor: "success" },
  { _id: 3, name: "JavaScript", category: "Programming", students: 75, rank: "Active", rankColor: "info" },
  { _id: 4, name: "HTML & CSS", category: "Frontend Development", students: 60, rank: "Active", rankColor: "secondary" },
  { _id: 5, name: "MongoDB", category: "Database", students: 45, rank: "Active", rankColor: "warning" },
];

const recentEnrollments = [
  { _id: 1, name: "React JS", category: "Web Development", status: "Enrolled", statusColor: "success" },
  { _id: 2, name: "Node.js", category: "Backend Development", status: "Enrolled", statusColor: "success" },
  { _id: 3, name: "JavaScript", category: "Programming", status: "In Progress", statusColor: "primary" },
  { _id: 4, name: "HTML & CSS", category: "Frontend Development", status: "In Progress", statusColor: "info" },
  { _id: 5, name: "MongoDB", category: "Database", status: "Enrolled", statusColor: "success" },
];

const CostBreakdown = [
  { label: "Courses", value: 35, color: "#15b79f" },
  { label: "Enrollments", value: 25, color: "#635bff" },
  { label: "Revenue", value: 25, color: "#fb9c0c" },
  { label: "Other", value: 15, color: "#f1f1f4" },
];

const StatCard = ({ title, value, change, status, color, data }) => (
  <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
    <Typography variant="subtitle2">{title}</Typography>

    <Grid container sx={{ alignItems: "end" }}>
      <Grid size={8}>
        <Typography variant="h4" sx={{ fontWeight: "bold", overflowWrap: "anywhere" }}>
          {value}
        </Typography>
      </Grid>
      <Grid size={4}>
        <SparkLineChart
          plotType="bar"
          data={data}
          height={60}
          showHighlight
          showTooltip
          color={color}
        />
      </Grid>
    </Grid>

    <Box sx={{ display: "flex", alignItems: "center", mt: 2, color: status ? "green" : "text.secondary" }}>
      {status ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
      <Typography sx={{ ml: 1, fontSize: 13 }}>{change || "Current total"}</Typography>
    </Box>
  </Paper>
);

const BestProduct = ({ data }) => (
  <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
    <Typography variant="subtitle1" sx={{ fontWeight: "bold", fontSize: 20, mb: 2 }}>
      Popular Courses
    </Typography>
    <TableContainer>
      <Table sx={{ minWidth: 450 }} aria-label="popular courses">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f4f6f8" }}>
            <TableCell>Course</TableCell>
            <TableCell>Category</TableCell>
            <TableCell align="right">Students</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((course) => (
            <TableRow key={course._id}>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar variant="rounded" sx={{ bgcolor: "#e8eaff", color: "#635bff" }}>
                    <MenuBookOutlinedIcon />
                  </Avatar>
                  <Typography fontWeight={500}>{course.name}</Typography>
                </Box>
              </TableCell>
              <TableCell>{course.category}</TableCell>
              <TableCell align="right">{course.students}</TableCell>
              <TableCell>
                <Chip label={course.rank} color={course.rankColor} size="small" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

const LastestProduct = ({ data }) => (
  <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
    <Typography variant="subtitle1" sx={{ fontWeight: "bold", fontSize: 20, mb: 2 }}>
      Recent Enrollments
    </Typography>
    <TableContainer>
      <Table aria-label="recent enrollments">
        <TableBody>
          {data.map((enrollment) => (
            <TableRow key={enrollment._id}>
              <TableCell sx={{ borderBottom: 0, px: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar variant="rounded" sx={{ bgcolor: "#e7f7f3", color: "#0d9488" }}>
                    <SchoolOutlinedIcon />
                  </Avatar>
                  <Box>
                    <Typography fontWeight={500}>{enrollment.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {enrollment.category}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell align="right" sx={{ borderBottom: 0, px: 0 }}>
                <Chip label={enrollment.status} color={enrollment.statusColor} size="small" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

function Dashboard() {
  const [dashboardStats, setDashboardStats] = useState({
    totalActiveUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchDashboardStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError("");

        const response = await fetch(
          "http://localhost:5000/api/v2/dashboard/stats",
          { signal: controller.signal }
        );
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch dashboard statistics");
        }

        setDashboardStats({
          totalActiveUsers: Number(result.data?.totalActiveUsers) || 0,
          totalCourses: Number(result.data?.totalCourses) || 0,
          totalEnrollments: Number(result.data?.totalEnrollments) || 0,
          totalRevenue: Number(result.data?.totalRevenue) || 0,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Dashboard stats error:", error);
          setStatsError("Unable to load live dashboard statistics.");
        }
      } finally {
        if (!controller.signal.aborted) setStatsLoading(false);
      }
    };

    fetchDashboardStats();
    return () => controller.abort();
  }, []);

  const formatNumber = (value) => Number(value || 0).toLocaleString("en-IN");

  const stats = [
    {
      title: "Total Active Users",
      value: statsLoading ? "..." : formatNumber(dashboardStats.totalActiveUsers),
      change: "Registered active users",
      status: true,
      color: "#0d9488",
      data: [1, 4, 2, 5, 7, 2, 4, 6],
    },
    {
      title: "Total Courses",
      value: statsLoading ? "..." : formatNumber(dashboardStats.totalCourses),
      change: "Courses in the platform",
      status: true,
      color: "#635bff",
      data: [2, 5, 3, 6, 4, 7, 5, 8],
    },
    {
      title: "Total Enrollments",
      value: statsLoading ? "..." : formatNumber(dashboardStats.totalEnrollments),
      change: "Student course enrollments",
      status: true,
      color: "#f59e0b",
      data: [1, 3, 2, 6, 4, 5, 7, 8],
    },
    {
      title: "Total Revenue",
      value: statsLoading ? "..." : `₹${formatNumber(dashboardStats.totalRevenue)}`,
      change: "Revenue recorded",
      status: true,
      color: "#ec4899",
      data: [2, 4, 3, 5, 6, 4, 7, 8],
    },
  ];

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      {statsError && (
        <Typography color="error" sx={{ mb: 2 }}>
          {statsError}
        </Typography>
      )}

      <Grid container spacing={2}>
        {stats.map((stat) => (
          <Grid key={stat.title} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...stat} />
          </Grid>
        ))}

        <Grid size={12}>
          <CategoryChart dashboardStats={dashboardStats} loading={statsLoading} />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <LineChartData dashboardStats={dashboardStats} loading={statsLoading} />
        </Grid>

        {/* <Grid size={{ xs: 12, md: 4 }}>
          <PieChartData />
        </Grid> */}

        <Grid size={{ xs: 12, md: 8 }}>
          <BestProduct data={courseData} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <LastestProduct data={recentEnrollments} />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 2, mb: 4 }}>
              <Box sx={{ borderRadius: 2, p: 1, boxShadow: 2 }}>
                <DataUsageSharpIcon />
              </Box>
              <Box>
                <Typography variant="h6">Learning Progress</Typography>
                <Typography variant="body2" color="text.secondary">
                  Course activity overview
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="h3" sx={{ color: "#15b79f", mb: 2 }}>
                  {statsLoading ? "..." : formatNumber(dashboardStats.totalEnrollments)}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "gray", mb: 3 }}>
                  Total course enrollments recorded on the platform.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Keep track of learner participation and course activity.
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }}>
                <LinearProgressData dashboardStats={dashboardStats} loading={statsLoading} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box sx={{ borderRadius: 2, p: 1.5, boxShadow: 2, mr: 2 }}>
                <AccountBalanceWalletIcon />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, fontSize: 18 }}>
                  Platform Overview
                </Typography>
                <Typography variant="subtitle2" sx={{ color: "gray" }}>
                  Course and enrollment summary
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <PieChart
                series={[
                  {
                    innerRadius: 55,
                    outerRadius: 85,
                    data: CostBreakdown,
                  },
                ]}
                width={200}
                height={200}
                hideLegend
                sx={{ mb: 3, maxWidth: "100%" }}
              />
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              {CostBreakdown.map((item) => (
                <Box key={item.label}>
                  <Box sx={{ bgcolor: item.color, borderRadius: 1, height: 4, width: 20, mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="h6">
                    {item.label === "Courses"
                      ? formatNumber(dashboardStats.totalCourses)
                      : item.label === "Enrollments"
                        ? formatNumber(dashboardStats.totalEnrollments)
                        : item.label === "Revenue"
                          ? `₹${formatNumber(dashboardStats.totalRevenue)}`
                          : formatNumber(dashboardStats.totalActiveUsers)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
