import { Box, Button, Typography } from "@mui/material"
import { styled } from "@mui/system"
import { useGetActiveSprintQuery } from "@redux/services/redmineApi"
import NoTaskImg from "assets/images/no-task.png"
import { omitBy } from "lodash"
import Loading from "pages/shared/Loading"
import { OneBox } from "pages/shared/SplitContainer"
import { useEffect, useState } from "react"
import { Outlet, useParams } from "react-router-dom"
import PageContainer from "../shared/PageContainer"
import ActiveSprintContainer from "./components/ActiveSprintContainer"
import ScrumTitle from "./components/ScrumTitle"

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 4,
  backgroundColor: "#F1F5F9",
  paddingLeft: 20,
  paddingRight: 24,
  lineHeight: 2.0,
  color: "#000",
  marginRight: 12,
  marginLeft: 8,
  ...(theme.palette.mode === "dark") && {
    ":hover": {
      backgroundColor: "#F1F5F9",
    },
  }
}))

const ProjectSprint = () => {
  const { project_id } = useParams()
  const [columns, setColumns] = useState()
  const [filter, setFilter] = useState({ search: "", status_id: "", priority_id: "", category_id: "", assigned_to_ids: [], author_id: "", tracker_id: "", unassigned_issues: undefined })
  const { data: sprint, isLoading, error } = useGetActiveSprintQuery({ project_id, filter: omitBy(filter, i => !i) })

  useEffect(() => {
    if (sprint?.status === "Success") {
      const tasks = sprint.issue_status?.map(status => ({ [status.id]: { id: `${status.id}`, title: status.name, list: [...status.issues] } }))
      setColumns(Object.assign({}, ...tasks))
    }
  }, [sprint])

  return (
    <PageContainer>
      <Box sx={{ flexDirection: "row", display: "flex" }}>
        <OneBox sx={{ pl: 3, pr: 0, pt: 1, pb: 0 }}>
          <Box sx={{ marginTop: "0px" }} display="flex" flexDirection="column" flex={1} id="backlog-container">
            <ScrumTitle sprint={sprint} project_id={project_id} isLoading={isLoading} />
            {sprint?.status === "Error" ? (
              <>
                <Box sx={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center", height: "420px", justifyContent: "center" }}>
                  <img src={NoTaskImg} alt="There are no active sprints" width={180} />
                  <Typography variant="h6" sx={{ color: theme => theme.palette.mode === "light" ? theme.palette.primary.secondaryText : theme.palette.text.secondary }}>
                  {/* <Typography variant="h6" sx={{ color: theme => theme.palette.primary.secondaryText }}> */}
                    {sprint.message}
                  </Typography>
                  <Typography variant="body1" gutterBottom sx={{ color: theme => theme.palette.mode === "light" ? theme.palette.primary.secondaryText : theme.palette.text.secondary }}>
                    Start sprints in the Backlog
                  </Typography>
                </Box>
              </>
            ) : isLoading || !columns ? (
              <Box sx={{ mt: 3 }}>
                <Loading grid height={400} cols={3} />
              </Box>
            ) : error ? (
              "error"
            ) : (
              <ActiveSprintContainer {...{ columns, setColumns, filter, setFilter, project_id, sprint }} />
            )}
          </Box>
        </OneBox>
      </Box>

      <Outlet />
    </PageContainer>
  )
}

export default ProjectSprint
