import GroupAddIcon from '@mui/icons-material/GroupAdd'
import { Box, Container, Grid, Typography } from "@mui/material"
import { useGetGroupsQuery } from "@redux/services/userApi"
import CreateTeam from "pages/members/Components/CreateTeam"
import CustomDialog from "pages/shared/CustomDialog"
import MemberAvatar from "pages/shared/MemberAvatar"
import { SectionTitle } from "pages/shared/SectionTitle"
import { Card } from "pages/shared/StyledCard"
import React, { useState } from "react"
import EditGroup from "./EditGroup"
import { StyledButton } from "./UserSettings"

export default function GroupSettings() {
  const { data: teams, isLoading } = useGetGroupsQuery()  
  const [open, setOpen] = useState()

  if (isLoading) return <span />
  if (!teams) return <span />
  return (
    <Container component={Box} sx={{minHeight: `calc( 100vh - 64px )`, display: "flex", flexDirection: "column", width: "100%" }}>
      <Box sx={ theme => ({ px: 3, py: 2, display: "flex", flexDirection: "column", flex: 1, width: "calc( 100% - 320px )", [theme.breakpoints.down("lg")]: { width: "100%" } })}>
        <SectionTitle variant="h6">
          Teams
          <Box>
            <StyledButton startIcon={<GroupAddIcon />} onClick={() => setOpen("create_team")}>
              Create a team
            </StyledButton>
          </Box>
        </SectionTitle>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          {teams.map(team => (
            <Grid item lg={4} key={team.id}>
              <Card onClick={() => setOpen(team.id)} sx={{ ":hover": { cursor: "pointer" }, background: theme => theme.palette.mode === "light" ? "" : theme.palette.background.modal }}>
                <Box sx={{ display: "flex", alignItems: "center", py: 1.5, px: 2 }}>
                  <MemberAvatar name={`${team.name}`} height={34} width={34} />
                  <Typography variant="subtitle1" sx={{ ml: 2, color: theme => theme.palette.primary.secondaryText }}>
                    {team.name}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
        <CustomDialog back open={Boolean(open)} onClose={() => setOpen(null)}>
          {open === "create_team" ? <CreateTeam onClose={() => setOpen(null)} /> : <EditGroup team_id={open} onClose={() => setOpen(null)} /> }
        </CustomDialog>
      </Box>
    </Container>
  )
}