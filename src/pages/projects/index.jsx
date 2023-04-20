import { Box } from "@mui/material"
import { LeftBox, RightBox } from "pages/shared/SplitContainer"
import PageContainer from "../shared/PageContainer"
import NewProjectsList from "./components/NewProjectsList"

// import Activity from "./components/Activity"
// import RecentProjects from "./components/RecentProjects"
const Projects = () => (
  <PageContainer>
    <Box sx={{ flexDirection: "row", display: "flex" }}>
      <LeftBox sx={{ px: 3, py: 1 }}>
        <NewProjectsList />
      </LeftBox>
      <RightBox sx={{ px: 3, py: 1 }}>{/* <ActivityStream /> */}</RightBox>
    </Box>
  </PageContainer>
)

export default Projects
