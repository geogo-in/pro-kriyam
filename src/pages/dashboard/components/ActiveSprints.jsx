import { Box, Grid } from "@mui/material"
import Chip from "@mui/material/Chip"
import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress"
import { styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import { Link } from "react-router-dom"
import { useGetActiveSprintsQuery } from "@redux/services/redmineApi"
import { fDate } from "utils/formatDate"

import { SectionTitle } from "pages/shared/SectionTitle"

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 5,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#ffd12e",
  },
}))

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  "&:hover": {
    ".MuiBox-root": {
      backgroundColor: theme.palette.mode === "light" ? "rgba(241,245,249, 0.5)" : "#252E38",
    },
  },
}))

const SprintCard = ({ name, project, end_date, issue_count }) => {
  const percentage = Math.round((issue_count.closed_issue_count / issue_count.total_issue_count) * 100)

  let isOverdue = false
  if (new Date(end_date) < new Date()) {
    isOverdue = true
  }
  return (
    <StyledLink to={`/account/projects/${project.identifier}/sprint`}>
      <Box sx={{ padding: "12px 24px", borderTop: theme => theme.palette.mode === "light" ? "1px solid #EEE" : "1px solid #444444" }}>
        <Grid container spacing={2} sx={{ display: "flex", alignItems: "center" }}>
          <Grid item lg={3}>
            <Typography variant="subtitle1" color="textPrimary" sx={{ fontSize: "0.90rem", fontWeight: 500, lineHeight: 1.2, marginBottom: "2px" }}>
              {name}
            </Typography>
            <Typography variant="body2" color={theme => theme.palette.primary.secondaryText} sx={{ fontSize: "0.8em" }}>
              Due on {fDate(end_date)}
            </Typography>
          </Grid>
          <Grid item lg={3}>
            <Typography variant="body2" color={theme => theme.palette.primary.secondaryText} sx={{ fontSize: "0.85em", marginBottom: "4px" }}>
              {project.name}
            </Typography>
          </Grid>
          <Grid item lg={3}>
            {isOverdue ? <Chip label="Overdue" color="error" variant="outlined" sx={{ height: 28 }} /> : <Chip label="In Progress" sx={{ height: 28 }} variant="outlined" color="success" />}
          </Grid>
          <Grid item lg={3}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <Typography variant="body2" color={theme => theme.palette.primary.secondaryText} sx={{ fontSize: "0.7rem", marginBottom: "1px" }}>
                {percentage}%
              </Typography>
              <Box sx={{ flexGrow: 1, margin: "4px 0 6px 0", width: "100%" }}>
                <BorderLinearProgress variant="determinate" value={percentage} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </StyledLink>
  )
}

const ActiveSprints = () => {
  const { data, isLoading } = useGetActiveSprintsQuery()
  if (isLoading) return <span />
  if (data.length === 0) return <span />

  return (
    <Box>
      <SectionTitle variant="h6">Active sprints</SectionTitle>
      <Box sx={{ padding: "10px 24px 10px 24px", backgroundColor: theme => theme.palette.background.modal, color: theme => theme.palette.primary.secondaryText, fontSize: "0.8rem" }}>
        <Grid container spacing={2} sx={{ display: "flex", alignItems: "center" }}>
          <Grid item lg={3}>
            Sprint
          </Grid>
          <Grid item lg={3}>
            Project
          </Grid>
          <Grid item lg={3}>
            Status
          </Grid>
          <Grid item lg={3}>
            Progress
          </Grid>
        </Grid>
      </Box>
      <Box variant="outlined" sx={{ backgroundColor: theme => theme.palette.background.modal, padding: "0px 0px 0 0" }}>
        {data.map(sprint => (sprint.name === "Board" ? "" : <SprintCard key={sprint.id} {...sprint} />))}
      </Box>
    </Box>
  )
}

export default ActiveSprints
