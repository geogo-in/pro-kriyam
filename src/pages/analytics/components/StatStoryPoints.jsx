import TabPanelUnstyled from "@mui/base/TabPanelUnstyled"
import TabsListUnstyled from "@mui/base/TabsListUnstyled"
import TabsUnstyled from "@mui/base/TabsUnstyled"
import Box from "@mui/material/Box"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import { LineCard as Card } from "pages/shared/StyledCard"
import Echart from "./Echart"
import StyledTab from "./StyledTab"
import TextWithPopover from "./TextWithPopover"

const StatStoryPoints = ({ storyPoints }) => {
  const echartOptionsForMembers = {
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        name: "Story points resolved by:",
        type: "pie",
        radius: [10, 70],
        center: ["50%", "50%"],
        roseType: "area",
        itemStyle: {
          borderRadius: 6,
        },
        data: [
          { value: 40, name: "Avishek" },
          { value: 38, name: "Dipanjan" },
          { value: 32, name: "Subhodip" },
          { value: 30, name: "Kaushik" },
          { value: 18, name: "Aditi" },
        ],
      },
    ],
  }

  return (
    <Card>
      <CardContent sx={{ px: 3 }}>
        <TextWithPopover text="Story points delivered" popoverText="Sum of story points delivered in last 30 days" />
        <Typography variant="h4" color={theme => theme.palette.primary.defaultText} sx={{ fontSize: "1.6rem", fontWeight: 500, marginTop: 1 }}>
          {storyPoints}
        </Typography>
        <br />
        <TabsUnstyled defaultValue={0}>
          <TabsListUnstyled>
            <StyledTab>
              <TextWithPopover
                showBorder={false}
                text="Leaderboard"
                popoverText="This chart shows the top 5 members who has resolved most number of story points in last 30 days"
                fontSize="0.75rem"
              />
            </StyledTab>
          </TabsListUnstyled>
          <TabPanelUnstyled value={0}>
            <Box sx={{ height: 170, mt: 1 }}>
              <Echart option={echartOptionsForMembers} />
            </Box>
          </TabPanelUnstyled>
        </TabsUnstyled>
      </CardContent>
    </Card>
  )
}

export default StatStoryPoints
