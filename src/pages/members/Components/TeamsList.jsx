import AddIcon from "@mui/icons-material/Add"
import { Box, Grid, Link, Typography } from "@mui/material"
import { useGetGroupsQuery } from "@redux/services/userApi"
import CustomDialog from "pages/shared/CustomDialog"
import MemberAvatar from "pages/shared/MemberAvatar"
import { SectionTitle } from "pages/shared/SectionTitle"
import { Card } from "pages/shared/StyledCard"
import React from "react"
import { Link as RouterLink } from "react-router-dom"
import { PATH_DASHBOARD } from "routes/paths"
import CreateTeam from "./CreateTeam"
import { StyledButton } from "./MembersList"

const TeamsList = () => {
  const { data: teams, isLoading } = useGetGroupsQuery()

  const [open, setOpen] = React.useState()

  const handleDialog = () => {
    setOpen(!open)
  }

  if (isLoading) return <span />
  if (!teams) return <span />
  return (
    <div>
      <SectionTitle variant="h6">
        Teams
        <Box>
          <StyledButton startIcon={<AddIcon />} onClick={handleDialog}>
            Create a team
          </StyledButton>
        </Box>
      </SectionTitle>
      <Grid container spacing={2} sx={{ mt: 0 }}>
        {teams.map(team => (
          <Grid item lg={4} key={team.id}>
            <Link component={RouterLink} to={`${PATH_DASHBOARD.members}/teams/${team.id}`}>
              <Card sx={{ ":hover": { cursor: "pointer" } }}>
                <Box sx={{ display: "flex", alignItems: "center", py: 1.5, px: 2 }}>
                  <MemberAvatar name={`${team.name}`} height={34} width={34} />
                  <Typography variant="subtitle1" sx={{ ml: 2, color: theme => theme.palette.mode === "light" ? theme.palette.primary.secondaryText : theme.palette.text.secondary }}>
                    {team.name}
                  </Typography>
                </Box>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
      <CustomDialog back open={open} onClose={handleDialog}>
        <CreateTeam onClose={handleDialog} />
      </CustomDialog>
    </div>
  )
}

export default TeamsList
