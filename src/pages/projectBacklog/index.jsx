import AddIcon from "@mui/icons-material/Add"
import { Box } from "@mui/material"
import { StyledButton } from "pages/projectIssues"
import CreateIssue from "pages/projectIssues/components/CreateIssue"
import CustomDialog from "pages/shared/CustomDialog"
import { SectionTitle } from "pages/shared/SectionTitle"
import { OneBox } from "pages/shared/SplitContainer"
import { useState } from "react"
import { Outlet, useParams } from "react-router-dom"
import PageContainer from "../shared/PageContainer"
import BacklogContainer from "./components/BacklogContainer"

const ProjectBacklog = props => {
  const { project_id } = useParams()
  const [open, setOpen] = useState(false)
  const handleCreateIssue = () => {
    setOpen(!open)
  }

  return (
    <PageContainer>
      <Box sx={{ flexDirection: "row", display: "flex" }}>
        <OneBox sx={{ pl: 3, pr: 0, pt: 1, pb: 0 }}>
          <SectionTitle variant="h6">
            Project Backlog
            <Box>
              <StyledButton disableElevation startIcon={<AddIcon />} onClick={handleCreateIssue}>
                Create issue
              </StyledButton>
              <CustomDialog back open={open} onClose={handleCreateIssue}>
                <CreateIssue project_id={project_id} onClose={handleCreateIssue} />
              </CustomDialog>
            </Box>
          </SectionTitle>
          <Box sx={{ marginTop: "0px" }} display="flex" flexDirection="column" flex={1} id="backlog-container">
            <BacklogContainer {...{ project_id }} />
          </Box>
        </OneBox>
      </Box>
      <Outlet />
    </PageContainer>
  )
}

export default ProjectBacklog
