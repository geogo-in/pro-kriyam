import AddIcon from "@mui/icons-material/Check"
import { Box, Dialog, Grid, LinearProgress } from "@mui/material"
import { useGetProjectByIdQuery } from "@redux/services/projectApi"
import SprintClose from "pages/projectBacklog/components/SprintClose"
import { SectionTitle } from "pages/shared/SectionTitle"
import { StyledTooltip } from "pages/shared/StyledTooltip"
import React, { useState } from "react"
import { fDate } from "utils/formatDate"
import { StyledButton } from ".."

export default function ScrumTitle({ sprint, project_id, isLoading }) {
  const { data: project } = useGetProjectByIdQuery(project_id)

  const [closeSprint, setCloseSprint] = useState(false)

  const handleCloseSprint = () => {
    setCloseSprint(!closeSprint)
  }

  if (project?.project_type?.name !== "Scrum") return <></>

  return (
    <SectionTitle variant="h6">
      <Grid container spacing={1}>
        <Grid item lg={4} sx={{ flexDirection: "row", display: "flex", alignItems: "center" }}>
          {sprint?.status !== "Error" && !isLoading ? (
            <StyledTooltip title={`Started at: ${fDate(sprint.start_date)} & Due on: ${fDate(sprint.end_date)}. ${sprint.goals && `Goals: ${sprint.goals}`}`}>
              <span>Active Sprint Board: {sprint.name}</span>
            </StyledTooltip>
          ) : (
            <>Active Sprint Board</>
          )}
        </Grid>
        <Grid item lg={4}>
          {sprint?.status !== "Error" && !isLoading && <LinearProgress />}
        </Grid>
        <Grid item lg={4}>
          {sprint?.status !== "Error" && !isLoading && (
            <Box sx={{ flexDirection: "row", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <StyledButton onClick={handleCloseSprint} disableElevation startIcon={<AddIcon />}>
                Complete sprint
              </StyledButton>
            </Box>
          )}
        </Grid>
      </Grid>
      <Dialog open={closeSprint} onClose={handleCloseSprint}>
        <SprintClose {...sprint} onClose={handleCloseSprint} />
      </Dialog>
    </SectionTitle>
  )
}
