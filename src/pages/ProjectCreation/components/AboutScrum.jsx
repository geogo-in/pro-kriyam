import { Box, Grid, Typography } from "@mui/material"
import Backlog from "assets/images/backlog.png"
import ReportImg from "assets/images/report.png"
import SprintSetup from "assets/images/sprint-setup.png"

const AboutTemplate = ({ template }) => {
  return (
    <Box px={3} py={1}>
      <Typography variant="body2" gutterBottom sx={{ color: theme => theme.palette.primary.defaultText }}>
        Teams can use the Scrum framework to collaborate and divide complex projects into manageable sprints that deliver incremental value. It's important to encourage your team to
        self-organize, learn as they go, and regularly reflect on their successes and failures to keep improving.
      </Typography>
      <Grid container py={4} px={1} spacing={2}>
        <Grid item lg={6} display="flex" alignItems="center" justifyContent="center" sx={{ my: 2 }}>
          <img src={Backlog} alt="Icon" height="120" />
        </Grid>
        <Grid item lg={6} pl={2} sx={{ my: 2 }}>
          <Typography variant="h6" sx={{ py: 1, fontSize: "0.9rem", fontWeight: 500, marginBottom: 0 }}>
            Plan your tasks in a backlog
          </Typography>
          <Typography variant="body2" sx={{ color: theme => theme.palette.primary.secondaryText }}>
            It is essential to prioritize and plan your team's work by organizing the backlog. Break down the work items from the project roadmap and order them in a way that enables your
            team to understand which work items to deliver first.
          </Typography>
        </Grid>
        <Grid item lg={6} sx={{ my: 2 }}>
          <Typography variant="h6" sx={{ py: 1, fontSize: "0.9rem", fontWeight: 500, marginBottom: 0 }}>
            Arrange work cycles into sprints
          </Typography>
          <Typography variant="body2" sx={{ color: theme => theme.palette.primary.secondaryText }}>
            Use sprints to collaborate on completing customer value in short time periods, delivering value faster with high-quality work.
          </Typography>
        </Grid>
        <Grid pl={2} item lg={6} display="flex" alignItems="center" justifyContent="center" sx={{ my: 2 }}>
          <img src={SprintSetup} height="140" alt="Icon" />
        </Grid>
        <Grid item lg={6} display="flex" alignItems="center" justifyContent="center" sx={{ my: 2 }}>
          <img src={ReportImg} height="120" alt="Icon" />
        </Grid>
        <Grid item lg={6} pl={2} sx={{ my: 2 }}>
          <Typography variant="h6" sx={{ py: 1, fontSize: "0.9rem", fontWeight: 500, marginBottom: 0 }}>
            Analyze your team’s performance
          </Typography>
          <Typography variant="body2" sx={{ color: theme => theme.palette.primary.secondaryText }}>
            Enhance the predictability of planning and delivery by utilizing the ready-to-use reports such as the sprint report and velocity chart. These reports can empower your team to
            comprehend their capacity and continually improve their processes.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AboutTemplate
