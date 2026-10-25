import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { PieChart } from "@mui/x-charts";

const enrollmentDistribution = [
  { id: 0, label: "Enrolled", value: 70, color: "#16A34A" },
  { id: 1, label: "Pending", value: 20, color: "#F59E0B" },
  { id: 2, label: "Cancelled", value: 10, color: "#EF4444" },
];

function PieChartData() {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 3,
        width: "100%",
        minWidth: 0,
        minHeight: 360,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Typography variant="h6" fontWeight="bold">
        Enrollment Status
      </Typography>

      <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
        Enrolled students and pending enrollments
      </Typography>

      <PieChart
        height={280}
        series={[
          {
            data: enrollmentDistribution,
            innerRadius: 45,
            outerRadius: 85,
            paddingAngle: 3,
            cornerRadius: 4,
            arcLabel: "value",
            arcLabelMinAngle: 15,
          },
        ]}
        slotProps={{
          legend: {
            position: {
              vertical: "bottom",
              horizontal: "middle",
            },
            labelStyle: {
              fontSize: 11,
            },
          },
        }}
      />
    </Paper>
  );
}

export default PieChartData;