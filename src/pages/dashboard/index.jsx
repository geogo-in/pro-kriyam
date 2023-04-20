import { Box } from "@mui/material"
import { LeftBox, RightBox } from "pages/shared/SplitContainer"
import PageContainer from "../shared/PageContainer"
import ActiveSprints from "./components/ActiveSprints"
// import ActivityStream from "./components/ActivityStream"
import StarredProjects from "./components/StarredProjects"

const Dashboard = () => (
  <PageContainer>
    <Box sx={{ flexDirection: "row", display: "flex" }}>
      <LeftBox sx={{ px: 3, py: 1 }}>
        <StarredProjects />
        <ActiveSprints />
      </LeftBox>
      <RightBox sx={{ px: 3, py: 1 }}>{/* <ActivityStream /> */}</RightBox>
    </Box>
  </PageContainer>
)
export default Dashboard
