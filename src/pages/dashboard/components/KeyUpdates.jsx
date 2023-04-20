import Grid from "@mui/material/Grid"
import Loading from "pages/shared/Loading"
import { useGetDashboardQuery } from "@redux/services/redmineApi"
import StatActiveMembers from "./StatActiveMembers"
import StatActiveProjects from "./StatActiveProjects"
import StatHoursSpent from "./StatHoursSpent"
import StatIssuesResolved from "./StatIssuesResolved"
import StatOpenIssues from "./StatOpenIssues"
import StatStoryPoints from "./StatStoryPoints"

const SystemAtAGlance = () => {
  const { data, isLoading } = useGetDashboardQuery()

  if (isLoading) return <Loading block height={300} />
  if (!data) return <></>
  return (
    <Grid container spacing={2} sx={{ marginBottom: 2 }}>
      <Grid item lg={4} md={4} xs={12}>
        <StatActiveProjects totalProjects={data.total_projects} />
      </Grid>
      <Grid item lg={4} md={4} xs={12}>
        <StatActiveMembers members={data.top_ten_active_user} activeMembers={data.active_members_count} />
      </Grid>
      <Grid item lg={4} md={4} xs={12}>
        <StatHoursSpent hoursSpent={0} />
      </Grid>
      <Grid item lg={4} md={4} xs={12}>
        <StatOpenIssues openIssues={0} />
      </Grid>
      <Grid item lg={4} md={4} xs={12}>
        <StatIssuesResolved issuesResolved={0} />
      </Grid>
      <Grid item lg={4} md={4} xs={12}>
        <StatStoryPoints storyPoints={0} />
      </Grid>
    </Grid>
  )
}

export default SystemAtAGlance
