import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Grid from "@mui/material/Grid"
import { styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import LineCard from "pages/shared/LineCard"
import Loading from "pages/shared/Loading"
import ActiveMembers from "pages/shared/MemberAvatars"
import { useGetDashboardQuery } from "@redux/services/redmineApi"

const DeepBlueCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(to right bottom, ${theme.palette.primary.main}, ${theme.palette.primary.dark} 120%)`,
  color: "white",
  boxShadow: "none",
  position: "relative",
  "&:before": {
    content: '""',
    position: "absolute",
    width: "210px",
    height: "210px",
    background: "linear-gradient(140.9deg, rgb(144, 202, 249) -14.02%, rgba(144, 202, 249, 0) 77.58%)",
    top: "-120px",
    right: "-110px",
    rotate: "45deg",
  },
  "&:after": {
    content: '""',
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "linear-gradient(140.9deg, rgb(144, 202, 249) -14.02%, rgba(144, 202, 249, 0) 77.58%)",
    bottom: "-230px",
    right: "-190px",
    rotate: "225deg",
  },
}))
const BlueCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#e3edf9",
  boxShadow: "none",
}))
const GreenCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#e6f4f2",
  boxShadow: "none",
}))
const RedCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#fff3f3",
  boxShadow: "none",
}))

const SystemAtAGlance = () => {
  const { data, isLoading } = useGetDashboardQuery()

  if (isLoading) return <Loading block height={300} />
  if (!data) return <></>
  return (
    <Grid container spacing={2} sx={{ marginBottom: 3 }}>
      <Grid item lg={9} md={9} xs={12}>
        <LineCard variant="outlined">
          <CardContent sx={{ px: 3, pt: 2, pb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                {/* <Typography variant="body2" color={theme => theme.palette.primary.defaultText}>
                  Updates
                </Typography> */}
                <Typography variant="h6" color={theme => theme.palette.primary.defaultText} sx={{ fontSize: "1.2rem", fontWeight: 400 }}>
                  Key updates
                </Typography>
                <Typography variant="body2" color={theme => theme.palette.primary.secondaryText} gutterBottom>
                  Of past 30 days
                </Typography>
              </Box>
            </Box>
            <Grid container spacing={2} sx={{ marginTop: "1px", marginBottom: "16px" }}>
              <Grid item lg={4} md={4} xs={12}>
                <BlueCard>
                  <CardContent sx={{ padding: "12px 16px !important" }}>
                    <Typography variant="h5">{data.total_projects}</Typography>
                    <Typography variant="body2" color={theme => theme.palette.primary.defaultText}>
                      Active projects
                    </Typography>
                  </CardContent>
                </BlueCard>
              </Grid>
              <Grid item lg={4} md={4} xs={12}>
                <GreenCard>
                  <CardContent sx={{ padding: "12px 16px !important" }}>
                    <Typography variant="h5">{data.active_members_count}</Typography>
                    <Typography variant="body2" color={theme => theme.palette.primary.defaultText}>
                      Active members
                    </Typography>
                  </CardContent>
                </GreenCard>
              </Grid>
              <Grid item lg={4} md={4} xs={12}>
                <RedCard>
                  <CardContent sx={{ padding: "12px 16px !important" }}>
                    <Typography variant="h5">{data.issue_resolved_count}</Typography>
                    <Typography variant="body2" color={theme => theme.palette.primary.defaultText}>
                      Issues resolved
                    </Typography>
                  </CardContent>
                </RedCard>
              </Grid>
            </Grid>
          </CardContent>
          <Box sx={{ display: "flex", pt: 1, pb: 1.5, px: 3, alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgb(218,220,224)" }}>
            <Box>
              <Typography variant="h6" color={theme => theme.palette.primary.defaultText}>
                Top 10
              </Typography>
              <Typography variant="body2" color={theme => theme.palette.primary.defaultText} gutterBottom>
                Most active members
              </Typography>
            </Box>
            <ActiveMembers members={data.top_ten_active_user} />
            {/* <Box>Download Report</Box> */}
          </Box>
        </LineCard>
      </Grid>
      <Grid item lg={3} md={3} xs={12}>
        <DeepBlueCard sx={{ minHeight: 272, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <CardContent>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }} gutterBottom>
              Total
            </Typography>
            <Typography variant="h4">
              {data.total_time_entry_in_hour}
              <span style={{ fontSize: "1.2rem", padding: "0 4px", color: "rgba(255,255,255,0.8)" }}>hours</span>
            </Typography>
            <Typography variant="subtitle" sx={{ display: "block", color: "rgba(255,255,255,0.8)" }} gutterBottom>
              was spent in the last 30 days
            </Typography>
            <br />
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
              And
            </Typography>
            <Typography variant="h4">
              {data.total_story_points}
              <span style={{ fontSize: "1.2rem", padding: "0 4px", color: "rgba(255,255,255,0.8)" }}>story points</span>
            </Typography>
            <Typography variant="subtitle" sx={{ color: "rgba(255,255,255,0.8)" }}>
              got delivered
            </Typography>
          </CardContent>
        </DeepBlueCard>
      </Grid>
    </Grid>
  )
}

export default SystemAtAGlance
