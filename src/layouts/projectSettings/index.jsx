import { Box } from "@mui/material"
import PageContainer from "pages/shared/PageContainer"
import { SectionTitle } from "pages/shared/SectionTitle"
import { OneBox } from "pages/shared/SplitContainer"
import { Outlet } from "react-router-dom"
import SubnavTabs from "./components/SubnavTabs"

const ProjectSettingsLayout = props => {
  return (
    <PageContainer>
      <Box sx={{ flexDirection: "row", display: "flex" }}>
        <OneBox sx={{ pl: 3, pr: 2, pt: 1, pb: 0 }}>
          <SectionTitle variant="h6">Project Settings</SectionTitle>
          <SubnavTabs />
          <Outlet />
        </OneBox>
      </Box>
    </PageContainer>
  )
}

export default ProjectSettingsLayout
