import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { LineChart } from "@mui/x-charts";
import React from "react";

const Fruits = [
  4000, 3000, 2000, 2780, 1890, 2390, 3490, 2400, 1398, 9800, 3908, 4800, 3800,
];
const Vegitables = [
  2400, 1398, 9800, 3908, 4800, 3800, 4300, 4000, 3000, 2000, 2780, 1890, 2390,
];
const DayFruits = [
  4000, 3000, 2000, 2780, 1890, 2390, 3490, 2400, 1398, 9800, 3908, 4800, 3800,
];
const OrganicItems = [
  2400, 1398, 9800, 3908, 4800, 3800, 4300, 4000, 3000, 2000, 2780, 1890, 2390,
];
const xLabels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const margin = { right: 24 };

function LineChartData(props) {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 , height : 400}}>
      <LineChart
        series={[
          { data: Fruits, label: "Fruits" },
          { data: Vegitables, label: "Vegitables" },
          { data: DayFruits, label: "DayFruits" },
          { data: OrganicItems, label: "OrganicItems" }
        ]}
        xAxis={[{ scaleType: "point", data: xLabels, height: 28 }]}
        yAxis={[{ width: 50 }]}
        margin={margin}
      />
    </Paper>
  );
}

export default LineChartData;
