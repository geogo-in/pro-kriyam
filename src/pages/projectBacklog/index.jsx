import AddIcon from "@mui/icons-material/Add"
import { Box, Button } from "@mui/material"
import { styled } from "@mui/material/styles"
import CreateIssue from "pages/projectIssues/components/CreateIssue"
import CustomDialog from "pages/shared/CustomDialog"
import { SectionTitle } from "pages/shared/SectionTitle"
import { OneBox } from "pages/shared/SplitContainer"
import { useState } from "react"
import { Outlet, useParams } from "react-router-dom"
import PageContainer from "../shared/PageContainer"
import BacklogContainer from "./components/BacklogContainer"
export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 4,
  backgroundColor: "#F1F5F9",
  paddingLeft: 20,
  paddingRight: 24,
  lineHeight: 2.0,
  color: "#000",
  marginRight: 12,
}))

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
