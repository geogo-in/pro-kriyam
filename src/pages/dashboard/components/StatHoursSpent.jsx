import Box from "@mui/material/Box"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Echart from "./Echart"
import TextWithPopover from "./TextWithPopover"

import { Card } from "pages/shared/StyledCard"

const StatHoursSpent = ({ hoursSpent }) => {
  const option = {
    color: ["#8F68DC"],

    tooltip: {
      trigger: "axis",
    },
    responsive: false,
    // grid: { show: false },
    xAxis: {
      show: false,
      boundaryGap: false,
      type: "category",
      data: [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
        "Sat",
        "Sun",
      ],
    },
    yAxis: {
      show: false,
      type: "value",
    },
    grid: [
      {
        left: 0,
        right: 0,
        // bottom: 0,
      },
    ],
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260, 0, 100, 224, 218, 135, 147, 260, 150, 0, 50, 218, 135, 147, 260, 150, 230, 224, 218, 135, 147, 260, 147, 160],
        type: "line",
        smooth: false,
        showSymbol: false,
        areaStyle: {
          // color: "rgba(143,104,220, 0.2)",
          color: "rgba(203,176,227, 0.5)",
        },
        lineStyle: {
          // color: "#5E21D8",
        },
      },
    ],
  }
  return (
    <Card>
      <CardContent sx={{ px: 3, pb: 0.5 }}>
        <TextWithPopover text="Hours spent" popoverText="Number of working hours logged in last 30 days." />
        <Typography variant="h4" color={theme => theme.palette.primary.defaultText} sx={{ fontSize: "1.6rem", fontWeight: 500, marginTop: 1 }}>
          {hoursSpent}
        </Typography>
      </CardContent>
      <Box sx={{ height: 60, width: "100%", mt: "10px" }}>
        <Echart option={option} opts={{ height: 70 }} />
      </Box>
    </Card>
  )
}

export default StatHoursSpent
