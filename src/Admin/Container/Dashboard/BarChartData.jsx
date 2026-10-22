import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts";
import React from "react";

function BarChartData(props) {
  const Fruits = [
    4000, 3000, 2000, 2780, 1890, 2390, 3490, 2400, 1398, 9800, 3908, 4800,
    3800,
  ];
  const Vegitables = [
    2400, 1398, 9800, 3908, 4800, 3800, 4300, 4000, 3000, 2000, 2780, 1890,
    2390,
  ];
  const DayFruits = [
    4000, 3000, 2000, 2780, 1890, 2390, 3490, 2400, 1398, 9800, 3908, 4800,
    3800,
  ];
  const OrganicItems = [
    2400, 1398, 9800, 3908, 4800, 3800, 4300, 4000, 3000, 2000, 2780, 1890,
    2390,
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

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 , height: 400}}>
      <Typography variant="h6"> Sell of diferent Categroy</Typography>
      <Typography variant="subtitle1" sx={{ color: "gray" }}>
        (43%) than last year
      </Typography>

       <BarChart
            sx={{pb:4}}
                series={[
                    { data: Fruits, label: 'Fruits', stack: 'total' },
                    { data: Vegitables, label: 'Vegitables',stack: 'total' },
                    { data: DayFruits, label: 'DayFruits',  stack: 'total' },
                    { data: OrganicItems, label: 'OrganicItems', stack: 'total' }
                ]}
                xAxis={[{ data: xLabels, height: 28}]}
                yAxis={[{ width: 50}]}
            />
    </Paper>
  );
}

export default BarChartData;
