import { Box, Grid, Typography } from "@mui/material"
import { fDate } from "utils/formatDate"

export default function ReportDetails({ sprint }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start" gap={2} mt={2}>
      {sprint.aasm_state === "completed" && (
        <Typography variant="button" sx={{ padding: "1px 7px", borderRadius: 0.8, background: "#5243aa", color: "white" }}>
          Completed
        </Typography>
      )}
      <Grid container spacing={1} maxWidth="30rem">
        <Grid container item spacing={3}>
          <>
            <Grid item xs={2}>
              {/* <Typography variant="body2" color="grey"> */}
              <Typography sx={{color: theme => theme.palette.mode === "light" ? "grey" : theme.palette.text.secondary}} variant="body2" color="grey">
                Started
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">{sprint?.started_at ? fDate(sprint.started_at) : "-"}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">(Planned {sprint?.start_date ? fDate(sprint.start_date) : "-"})</Typography>
            </Grid>
          </>
        </Grid>
        <Grid container item spacing={3}>
          <>
            <Grid item xs={2}>
              {/* <Typography variant="body2" color="grey"> */}
              <Typography sx={{color: theme => theme.palette.mode === "light" ? "grey" : theme.palette.text.secondary}} variant="body2" color="grey">
                Ended
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">{sprint?.ended_at ? fDate(sprint.ended_at) : "-"}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">(Planned {sprint?.end_date ? fDate(sprint.end_date) : "-"})</Typography>
            </Grid>
          </>
        </Grid>
      </Grid>
    </Box>
  )
}
