import AddIcon from "@mui/icons-material/Add"
import { Box, Button } from "@mui/material"
import { styled } from "@mui/material/styles"
import { omitBy } from "lodash"
import CreateIssue from "pages/projectIssues/components/CreateIssue"
import CustomDialog from "pages/shared/CustomDialog"
import Loading from "pages/shared/Loading"
import { SectionTitle } from "pages/shared/SectionTitle"
import { OneBox } from "pages/shared/SplitContainer"
import { useState } from "react"
import { Outlet, useParams } from "react-router-dom"
import { useGetIssuesQuery } from "@redux/services/issueApi"
import { useGetProjectByIdQuery } from "@redux/services/projectApi"
import PageContainer from "../shared/PageContainer"
import IssueList from "./components/IssueList"
import IssueListToolbar from "./components/IssueListToolbar"

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 4,
  backgroundColor: "#F1F5F9",
  paddingLeft: 20,
  paddingRight: 24,
  lineHeight: 2.0,
  color: "#000",
  marginRight: 12,
}))
export const ScrollableGrid = styled(Box)(({ theme }) => ({
  height: "calc( 100vh - 186px )",
  width: "100%",
  overflow: "auto",
  "&::-webkit-scrollbar": {
    width: 6,
    height: 16,
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#DFDFDF",
    borderRadius: "1px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },
}))
export default function ProjectIssues() {
  const { project_id } = useParams()
  const { data: project, isLoading: projectLoading } = useGetProjectByIdQuery(project_id)
  const [filter, setFilter] = useState({ offset: 0, search: "", status_id: "", priority_id: "", category_id: "", assigned_to_id: "", author_id: "", tracker_id: "" })
  const { data, isLoading, error } = useGetIssuesQuery({ project_id: project?.id, ...omitBy(filter, i => !i) }, { refetchOnMountOrArgChange: true, skip: !project?.id })
  const [open, setOpen] = useState(false)
  const handleCreateIssue = () => {
    setOpen(!open)
  }

  const handleSearch = e => {
    if (e.keyCode === 13) {
      setFilter({ ...filter, search: e.target.value })
    }
  }

  const handleFilter = e => {
    setFilter({ ...filter, [e.target.name]: e.target.value })
  }

  return (
    <PageContainer>
      <Box sx={{ flexDirection: "row", display: "flex" }}>
        <OneBox sx={{ pl: 3, pr: 0, pt: 1, pb: 0 }}>
          <SectionTitle variant="h6">
            Issues
            <Box>
              <StyledButton disableElevation startIcon={<AddIcon />} onClick={handleCreateIssue}>
                Create issue
              </StyledButton>
              <CustomDialog back open={open} onClose={handleCreateIssue}>
                <CreateIssue project_id={project_id} onClose={handleCreateIssue} />
              </CustomDialog>
            </Box>
          </SectionTitle>
          {isLoading || projectLoading ? (
            <Loading listing2 />
          ) : error ? (
            "error"
          ) : (
            <Box pt={0}>
              {data && (
                <>
                  <IssueListToolbar {...data} {...{ project_id, filter, onFilter: handleFilter, onSearch: handleSearch }} />
                  <ScrollableGrid>
                    <IssueList issues={data.issues} project_id={project_id} />
                  </ScrollableGrid>
                </>
              )}
            </Box>
          )}
        </OneBox>
      </Box>
      <Outlet />
    </PageContainer>
  )
}
