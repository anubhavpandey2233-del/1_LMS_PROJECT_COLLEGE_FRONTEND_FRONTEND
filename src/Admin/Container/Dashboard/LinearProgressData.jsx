import React from "react";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#635bff",
    ...theme.applyStyles("dark", {
      backgroundColor: "#c3c0ff",
    }),
  },
}));

const ProgressData = [
  { lable: "Direct calls", value: 30, price: "$35,690" },
  { lable: "Quote requests", value: 20, price: "$35,690" },
  { lable: "Ads", value: 45, price: "$35,690" },
  { lable: "Affiliate links", value: 5, price: "$35,690" },
  { lable: "Email campaigns", value: 25, price: "$35,690" },
  { lable: "Other", value: 10, price: "$35,690" },
];

function LinearProgressData(props) {
  return (
    <Box>
      <Typography sx={{ mb: 1 }}>{ProgressData[0].lable}</Typography>
      <Box>
        <BorderLinearProgress
          variant="determinate"
          value={ProgressData[0].value}
        />
        <Typography>{ProgressData[0].price}</Typography>
      </Box>
    </Box>
  );
}

export default LinearProgressData;
