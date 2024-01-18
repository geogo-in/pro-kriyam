import { Box, MenuItem, Stack, Typography } from "@mui/material"
import { useGetClosedSprintsQuery } from "@redux/services/redmineApi"
import { SleekSelectWithIcon } from "pages/shared/CustomTextField"
import Loading from "pages/shared/Loading"
import PageContainer from "pages/shared/PageContainer"
import { SectionTitle } from "pages/shared/SectionTitle"
import { OneBox } from "pages/shared/SplitContainer"
import { useEffect, useState } from "react"
import { Outlet, useNavigate, useParams } from "react-router-dom"
import { PATH_DASHBOARD } from "routes/paths"
import ReportDetails from "./components/ReportDetails"
import StorypointBreakdown from "./components/StorypointBreakdown"

export default function ProjectSprintReport() {
  const { project_id, sprint_id } = useParams()
  const [sprint, setSprint] = useState()
  const { data: closedSprints, isLoading, error } = useGetClosedSprintsQuery({ project_id })

  const navigate = useNavigate()

  useEffect(() => {
    if (closedSprints) {
      // Load report for sprint with corresponding sprint_id if sprint_id is not undefined or null
      // Else load first sprint in the fetched list
      let sp
      if (sprint_id) {
        sp = closedSprints.find(sp => sp.id == sprint_id) // not using `strict equality` !important
        // sp maybe undefined if wrong `sprint_id` is passed
      }
      // got a sprint
      if (sp) {
        setSprint(sp)
        navigate(`${PATH_DASHBOARD.projects.root}/${project_id}/report/${sprint_id}`, { replace: true })
      } else {
        setSprint(closedSprints[0])
        navigate(`${PATH_DASHBOARD.projects.root}/${project_id}/report/${closedSprints[0].id}`, { replace: true })
      }
    }
  }, [closedSprints, sprint_id])

  const handleChangeSprint = e => {
    let sp = closedSprints.find(sp => sp.name === e.target.value) // sp cannot be undefined
    setSprint(sp)
    navigate(`${PATH_DASHBOARD.projects.root}/${project_id}/report/${sp.id}`)
  }

  return (
    <PageContainer>
      <Box sx={{ flexDirection: "row", display: "flex" }}>
        <OneBox sx={{ pl: 3, pr: 0, pt: 1, pb: 0 }}>
          {isLoading ? (
            <Loading listing2 />
          ) : error ? (
            "Error"
          ) : closedSprints.length === 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center", height: "420px", justifyContent: "center" }}>
              <Typography variant="h6" sx={{ color: theme => theme.palette.primary.secondaryText }}>
                There are no closed sprints
              </Typography>
            </Box>
          ) : (
            sprint && (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SectionTitle variant="h6">Sprint Report</SectionTitle>
                  <SleekSelectWithIcon value={sprint.name} onChange={handleChangeSprint} minWidth={150}>
                    {closedSprints.map(sp => (
                      <MenuItem key={sp.id} value={sp.name}>
                        {sp.name}
                      </MenuItem>
                    ))}
                  </SleekSelectWithIcon>
                </Box>

                <Stack direction="column">
                  <ReportDetails sprint={sprint} />
                  <StorypointBreakdown projectId={project_id} sprintId={sprint.id} />
                </Stack>
              </>
            )
          )}
        </OneBox>
      </Box>
      <Outlet />
    </PageContainer>
  )
}
