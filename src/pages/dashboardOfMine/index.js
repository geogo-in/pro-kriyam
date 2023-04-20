import { Container } from "@mui/material"
import Grid from "@mui/material/Grid"

const Dashboard = () => (
  <div>
    {/* <PageHeader /> */}
    <Container sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item lg={8} xs={12}>
          {/* <SystemAtAGlance />
          <StarredProjects />
          <ActiveProjects /> */}
          {/* <ProjectList /> */}
        </Grid>
        <Grid item lg={4} xs={12}>
          {/* <ActiveSprints />
          <MemberWorkloads />
          <ActivityStream /> */}
        </Grid>
      </Grid>
    </Container>
  </div>
)

export default Dashboard
