import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import BarChartData from "./BarChartData";
import LineChartData from "./LineChartData";
import PieChartData from "./PieChartData";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import AvatarGroup from "@mui/material/AvatarGroup";
import { PieChart } from "@mui/x-charts";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DataUsageSharpIcon from '@mui/icons-material/DataUsageSharp';
import LinearProgressData from "./LinearProgressData";



const stats = [
  {
    title: "Total active users",
    value: "18,765",
    change: "+2.6%",
    status: true,
    color: "green",
    data: [1, 4, 2, 5, 7, 2, 4, 6],
    dataColor: "black",
  },
  {
    title: "Total Products",
    value: "4,876",
    change: "+0.2%",
    status: true,
    color: "green",
    data: [8, 5, 2, 5, 9, 2, 8, 1],
    dataColor: "black",
  },
  {
    title: "Total Orders",
    value: "678",
    change: "-0.1%",
    status: false,
    color: "black",
    data: [1, 4, 2, 5, 7, 2, 4, 6],
    dataColor: "black",
  },
  {
    title: "Total Revenue Gauge",
    value: "1,234",
    change: "+1.0%",
    status: true,
    color: "green",
    data: [8, 5, 2, 5, 9, 2, 8, 1],
    dataColor: "black",
  },
];
const product = [
  {
    _id: 3,
    products_img: "../../../../public/assets/images/avatar/01.jpg",
    name: "ABCD",
    price: "$150",
    total_orders: "280",
    rank: "Top1",
    rankColor: "primary",
  },
  {
    _id: 4,
    products_img: "../../../../public/assets/images/avatar/02.jpg",
    name: "abcd",
    price: "$350",
    total_orders: "50",
    rank: "Top2",
    rankColor: "secondary",
  },
  {
    _id: 5,
    products_img: "../../../../public/assets/images/avatar/03.jpg",
    name: "xyz",
    price: "$150",
    total_orders: "200",
    rank: "Top3",
    rankColor: "error",
  },
  {
    _id: 6,
    products_img: "../../../../public/assets/images/avatar/04.jpg",
    name: "pqr",
    price: "$50",
    total_orders: "300",
    rank: "Top4",
    rankColor: "info",
  },
  {
    _id: 7,
    products_img: "../../../../public/assets/images/avatar/05.jpg",
    name: "ABCD",
    price: "$30",
    total_orders: "250",
    rank: "Top5",
    rankColor: "success",
  },
];
const latestproducts = [
  {
    _id: 1,
    products_img: "../../../../public/assets/images/avatar/06.jpg",
    name: "product name ",
    price: "$50",
    variant: 3,
    colors: ["#00C49F", "#FFBB28", "#FF8042", "#FFBB28"],
  },
  {
    _id: 2,
    products_img: "../../../../public/assets/images/avatar/07.jpg",
    name: "product name ",
    price: "$50",
    variant: 3,
    colors: ["#8B4513", "#D2B48C"],
  },
  {
    _id: 3,
    products_img: "../../../../public/assets/images/avatar/08.jpg",
    name: "product name ",
    price: "$97.14",
    variant: 3,
    oldPrice: "$97.14",
    discountPrice: "$85.21",
    colors: ["#00C49F", "#00BFFF", "#DC143C", "#FFBB28", "#DC143C"],
  },
  {
    _id: 4,
    products_img: "../../../../public/assets/images/avatar/09.jpg",
    name: "product name ",
    price: "$97",
    variant: 3,
    oldPrice: "$97",
    discountPrice: "$68.71",
    colors: ["#800080", "#4B0082"],
  },
  {
    _id: 5,
    products_img: "../../../../public/assets/images/avatar/10.jpg",
    name: "product name ",
    price: "$50",
    variant: 3,
    colors: ["#00008B"],
  },
];

const CostBreakdown = [
  { label: "Strategy", value: 20, color: "#15b79f" },
  { label: "Other", value: 35, color: "#f1f1f4" },
  { label: "Marketing", value: 60, color: "#635bff" },
  { label: "Outsourcing", value: 40, color: "#fb9c0c" },
];

const StatCard = ({ title, value, change, status, color, data, dataColor }) => {
  const [showHighlight, setShowHighlight] = React.useState(true);
  const [showTooltip, setShowTooltip] = React.useState(true);

  const handleHighlightChange = (event) => {
    setShowHighlight(event.target.checked);
  };

  const handleTooltipChange = (event) => {
    setShowTooltip(event.target.checked);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="subtitle2">{title}</Typography>
      <Grid container sx={{ alignItems: "end" }}>
        <Grid size={8}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {value}
          </Typography>
        </Grid>
        <Grid size={4}>
          <SparkLineChart
            plotType="bar"
            data={data}
            height={60}
            showHighlight={showHighlight}
            showTooltip={showTooltip}
            color={color}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", mt: 2, color: status ? "green" : "black" }}>
        {status ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
        <Typography sx={{ ml: 1 }}>{change} Last 7 Days</Typography>
      </Box>
    </Paper>
  );
};

const BestProduct = ({ data }) => (
  <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
    <Typography
      variant="subtitle1"
      sx={{ fontWeight: "bold", fontSize: "20px", mb: 2 }}
    >
      Best Product
    </Typography>

    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f4f6f8" }}>
            <TableCell sx={{ color: "#5e5656", fontSize: "16px" }}>
              Product Img
            </TableCell>
            <TableCell sx={{ color: "#5e5656", fontSize: "16px" }}>
              Name
            </TableCell>
            <TableCell sx={{ color: "#5e5656", fontSize: "16px" }}>
              Price
            </TableCell>
            <TableCell sx={{ color: "#5e5656", fontSize: "16px" }}>
              Total Orders
            </TableCell>
            <TableCell sx={{ color: "#5e5656", fontSize: "16px" }}>
              Rank
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((v) => (
            <TableRow
              key={v._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>
                <Avatar alt="Remy Sharp" src={v.products_img} />
              </TableCell>
              <TableCell>{v.name}</TableCell>
              <TableCell>{v.price}</TableCell>
              <TableCell>{v.total_orders}</TableCell>
              <TableCell>
                <Chip label={v.rank} color={v.rankColor} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

const LastestProduct = ({ data }) => (
  <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
    <Typography
      variant="subtitle1"
      sx={{ fontWeight: "bold", fontSize: "20px", mb: 2 }}
    >
      Lastest Product
    </Typography>

    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableBody>
          {data.map((v) => (
            <TableRow
              key={v._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell sx={{ borderBottom: 0 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", columnGap: 1 }}
                >
                  <Avatar
                    alt="Remy Sharp"
                    src={v.products_img}
                    variant="rounded"
                  />
                  <Box>
                    <Typography>{v.name}</Typography>
                    <Typography
                      variant="span"
                      sx={{
                        mr: 1,
                        color: v.discountPrice ? "red" : "gray",
                        textDecoration: v.discountPrice
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {v.price}
                    </Typography>
                    {v.discountPrice && (
                      <Typography variant="span" sx={{ color: "gray" }}>
                        {v.discountPrice}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </TableCell>

              <TableCell sx={{ borderBottom: 0 }}>
                <AvatarGroup
                  max={4}
                  sx={{
                    "& .MuiAvatar-circular": {
                      width: "20px",
                      height: "20px",
                      fontSize: "8px",
                    },
                  }}
                >
                  {v.colors.map((v1) => (
                    <Avatar
                      alt=" "
                      src=" "
                      sx={{ bgcolor: v1, width: "20px", height: "20px" }}
                    />
                  ))}
                </AvatarGroup>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);


const settings = {
  width: 200,
  height: 200,
  hideLegend: true,
};

function Dashboard() {
  return (
    <Box>
      <Grid container spacing={2}>
        {stats.map((v) => (
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <StatCard {...v} />
          </Grid>
        ))}

        <Grid size={12}>
          <BarChartData />
        </Grid>

        <Grid size={8}>
          <LineChartData />
        </Grid>
        <Grid size={4}>
          <PieChartData />
        </Grid>

        <Grid size={4}>
          <PieChartData />
        </Grid>
        <Grid size={8}>
          <LineChartData />
        </Grid>

        <Grid size={8}>
          <BestProduct data={product} />
        </Grid>
        <Grid size={4}>
          <LastestProduct data={latestproducts} />
        </Grid>

        <Grid size={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}> 
            <Box sx={{display: 'flex', alignItems : 'center', columnGap: 2, mb: 4}}>
               <Box sx={{ borderRadius: 8, p: 1, boxShadow: 3}}>
                <DataUsageSharpIcon />
              </Box>
              <Typography variant="h6">
                Conversions
              </Typography>
            </Box>

            <Grid container spacing={2}>
                <Grid size={4}>
                  <Typography variant="h3" sx={{color : "#15b79f", mb: 2}}>+5%</Typography>
                  <Typography variant="subtitle1" sx={{color : 'gray', mb: 10}}>increase in conversions compared to last year</Typography>
                  <Typography variant="subtitle1" sx={{color : 'gray'}}>This year is forecasted to increase in your conversion by 0.5% the end of the current year.</Typography>
                </Grid>
              <Grid size={7}>
                <LinearProgressData />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid size={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box sx={{ borderRadius: 8, p: 1.5, boxShadow: 3, mr: 2 }}>
                <AccountBalanceWalletIcon />
              </Box>
              <Box>
                <Typography
                  variant="Subtitle1"
                  sx={{ fontWeight: "500", fontSize: "18px" }}
                >
                  Cost breakdown
                </Typography>
                <Typography variant="subtitle2" sx={{ color: "gray" }}>
                  Based on selected period
                </Typography>
              </Box>
            </Box>

            <PieChart
              series={[
                { innerRadius: 70, outerRadius: 100, data: CostBreakdown },
              ]}
              {...settings}
              sx={{ mb: 3 }}
            />

            <Grid
              container
              spacing={2}
              sx={{ justifyContent: "space-between" }}
            >
              <Box>
                <Typography
                  sx={{
                    bgcolor: "#15b79f",
                    borderRadius: "2px",
                    height: "4px",
                    width: "16px",
                  }}
                />
                <Typography variant="span">Strategy</Typography>
                <Typography variant="h6">$14,859</Typography>

                <Typography
                  sx={{
                    bgcolor: "#635bff",
                    borderRadius: "2px",
                    height: "4px",
                    width: "16px",
                  }}
                />
                <Typography>Marketing</Typography>
                <Typography variant="h6">$45,120</Typography>
              </Box>
              <Box sx={{ justifyContent: "end" }}>
                <Typography
                  sx={{
                    bgcolor: "#fb9c0c",
                    borderRadius: "2px",
                    height: "4px",
                    width: "16px",
                  }}
                />
                <Typography>Outsourcing</Typography>
                <Typography variant="h6">$35,690</Typography>

                <Typography
                  sx={{
                    bgcolor: "#f1f1f4",
                    borderRadius: "2px",
                    height: "4px",
                    width: "16px",
                  }}
                />
                <Typography>Other</Typography>
                <Typography variant="h6">$25,486</Typography>
              </Box>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
