import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { PieChart } from "@mui/x-charts";
import React from "react";

const orderDistribution = [
  { label: "Delivered", value: 70, color: "green" },
  { label: "Padding", value: 20, color: "orange" },
  { label: "Cancelled", value: 10, color: "red" },
];

const settings = {
  margin: { right: 5 },
  width: 200,
  height: 200,
};

function PieChartData(props) {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: 400 }}>
      <Typography variant="h6">Orders Status distribution</Typography>
      <Typography variant="subtitle1" sx={{ color: "gray" }}>
        (43%) than last year
      </Typography>

      <PieChart
      sx={{pt:6}}
        series={[
          {
            innerRadius: 50,
            outerRadius: 100,
            data: orderDistribution,
            arcLabel: "value",
          },
        ]}
        {...settings}
      />
    </Paper>
  );
}

export default PieChartData;
