import TabPanelUnstyled from "@mui/base/TabPanelUnstyled"
import TabsListUnstyled from "@mui/base/TabsListUnstyled"
import TabsUnstyled from "@mui/base/TabsUnstyled"
import Box from "@mui/material/Box"
import CardContent from "@mui/material/CardContent"

import Typography from "@mui/material/Typography"
import Echart from "./Echart"
import StyledTab from "./StyledTab"
import TextWithPopover from "./TextWithPopover"

import { Card } from "pages/shared/StyledCard"

const StatIssuesResolved = ({ issuesResolved }) => {
  const echartOptionsForProjects = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      type: "scroll",
      orient: "vertical",
      right: 10,
      top: 15,
      bottom: 10,
    },
    series: [
      {
        name: "Issues resolved in:",
        type: "pie",
        radius: ["20%", "90%"],
        center: ["30%", "52%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "ConnectE" },
          { value: 735, name: "Fieldtrack" },
          { value: 580, name: "ScoutLive" },
          { value: 484, name: "OneNDF" },
          { value: 300, name: "EGIS" },
        ],
      },
    ],
  }
  const echartOptionsForMembers = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      type: "scroll",
      orient: "vertical",
      right: 10,
      top: 15,
      bottom: 10,
    },
    series: [
      {
        name: "Issues resolved by:",
        type: "pie",
        radius: ["20%", "90%"],
        center: ["30%", "52%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 23, name: "Avishek" },
          { value: 43, name: "Subhodip" },
          { value: 32, name: "Kaushik" },
          { value: 29, name: "Dipanjan" },
          { value: 18, name: "Aditi" },
        ],
      },
    ],
  }

  return (
    <Card>
      <CardContent sx={{ px: 3 }}>
        <TextWithPopover text="Issues resolved" popoverText="Number of issues resolved in last 30 days" />
        <Typography variant="h4" color={theme => theme.palette.primary.defaultText} sx={{ fontSize: "1.6rem", fontWeight: 500, marginTop: 1 }}>
          {issuesResolved}
        </Typography>
        <br />
        <TabsUnstyled defaultValue={0}>
          <TabsListUnstyled>
            <StyledTab>
              <TextWithPopover
                showBorder={false}
                text="In different projects"
                popoverText="This chart shows the number of issues resolved in different projects over last 30 days"
                fontSize="0.75rem"
              />
            </StyledTab>
            <StyledTab>
              <TextWithPopover
                showBorder={false}
                text="By these members"
                popoverText="This chart shows the number of issues resolved in different projects over last 30 days"
                fontSize="0.75rem"
              />
            </StyledTab>
          </TabsListUnstyled>
          <TabPanelUnstyled value={0}>
            <Box sx={{ height: 170, mt: 1 }}>
              <Echart option={echartOptionsForProjects} />
            </Box>
          </TabPanelUnstyled>
          <TabPanelUnstyled value={1}>
            <Box sx={{ height: 170, mt: 1 }}>
              <Echart option={echartOptionsForMembers} />
            </Box>
          </TabPanelUnstyled>
        </TabsUnstyled>
      </CardContent>
    </Card>
  )
}

export default StatIssuesResolved
