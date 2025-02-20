import { Box, Grid, Typography } from "@mui/material"
import Kanban from "assets/images/kanban-new.svg"
import ReportImg from "assets/images/report.png"

const AboutTemplate = ({ template }) => {
  return (
    <Box px={3} py={1}>
      <Typography variant="body2" gutterBottom sx={{ color: theme => theme.palette.mode === "light" ? theme.palette.primary.defaultText : theme.palette.primary.secondaryText }}>
        The Kanban methodology, which means "visual signal" in Japanese, aims to assist teams in visualizing their work, restricting ongoing work, and increasing efficiency. Utilize the
        Kanban template to promote transparency, minimize bottlenecks, and enhance planning flexibility throughout the development cycle.
      </Typography>
      <Grid container py={4} px={1} spacing={2}>
        <Grid item lg={6} display="flex" alignItems="center" justifyContent="center" sx={{ my: 1 }}>
          <img src={Kanban} height="100" alt="Icon" />
        </Grid>
        <Grid item lg={6} pl={2} sx={{ my: 2 }}>
          <Typography variant="h6" sx={{ py: 1, fontSize: "0.9rem", fontWeight: 500, marginBottom: 0 }}>
            Keep track of work by using a basic board
          </Typography>
          <Typography variant="body2" sx={{ color: theme => theme.palette.primary.secondaryText }}>
            Your team can monitor the progress of work items anytime, thanks to the visual representation of tasks on the Kanban board. The columns on the board symbolize the different
            stages of your team's workflow, spanning from to-do tasks to completed work items.
          </Typography>
        </Grid>
        <Grid item lg={6} sx={{ my: 2 }}>
          <Typography variant="h6" sx={{ py: 1, fontSize: "0.9rem", fontWeight: 500, marginBottom: 0 }}>
            Use agile reports to constantly enhance performance.
          </Typography>
          <Typography variant="body2" sx={{ color: theme => theme.palette.primary.secondaryText }}>
            Maximizing flow for continuous delivery is a fundamental principle of Kanban. Agile reports, such as the cumulative flow diagram, are valuable tools for ensuring that your team
            consistently delivers the highest possible value to your business.
          </Typography>
        </Grid>
        <Grid pl={2} item lg={6} display="flex" alignItems="center" justifyContent="center" sx={{ my: 2 }}>
          <img src={ReportImg} height="140" alt="Icon" />
        </Grid>
      </Grid>
    </Box>
  )
}

export default AboutTemplate
