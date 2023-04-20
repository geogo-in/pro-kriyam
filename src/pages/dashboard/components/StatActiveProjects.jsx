import Box from "@mui/material/Box"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import { Card } from "pages/shared/StyledCard"
import Echart from "./Echart"
import TextWithPopover from "./TextWithPopover"

const StatActiveProjects = ({ totalProjects }) => {
  const option = {
    color: ["#59c4e6", "#edafda", "#516b91", "#93b7e3", "#a5e7f0", "#cbb0e3"],
    tooltip: {
      show: true,
      trigger: "axis",
      axisPointer: {
        // Use axis to trigger tooltip
        type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
      },
    },
    grid: {
      left: "-28px",
      right: "0px",
      top: "0",
      bottom: "15%",
      containLabel: true,
    },
    xAxis: {
      show: false,
      type: "value",
      boundaryGap: false,
    },
    yAxis: {
      show: false,
      type: "category",
      data: ["Projects"],
    },
    series: [
      {
        name: "Active",
        type: "bar",
        stack: "total",
        label: {
          show: false,
        },
        emphasis: {
          focus: "series",
        },
        data: [23],
      },
      {
        name: "Inactive",
        type: "bar",
        stack: "total",
        label: {
          show: false,
        },
        emphasis: {
          focus: "series",
        },
        data: [1],
      },
      {
        name: "Closed",
        type: "bar",
        stack: "total",
        label: {
          show: false,
        },
        emphasis: {
          focus: "series",
        },
        data: [0],
      },
    ],
  }

  return (
    <Card>
      <CardContent sx={{ px: 3, pb: 0.5 }}>
        <TextWithPopover text="Active projects" popoverText="Number of projects, which is active right now." />
        <Typography variant="h4" color={theme => theme.palette.primary.defaultText} sx={{ fontSize: "1.6rem", fontWeight: 500, marginTop: 1, mb: "16px" }}>
          {totalProjects}
        </Typography>
      </CardContent>
      <Box sx={{ height: 55, width: "100%", mt: "0px" }}>
        <Echart option={option} opts={{ height: 70 }} />
      </Box>
    </Card>
  )
}

export default StatActiveProjects
