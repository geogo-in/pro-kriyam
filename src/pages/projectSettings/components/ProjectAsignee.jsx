import { Grid, ListItemText, MenuItem, Typography } from "@mui/material"
import { useGetProjectMembershipsQuery } from "@redux/services/projectApi"
import { SelectWithIcon } from "pages/shared/CustomTextField"

const ProjectAsignee = ({ project_id, state, setState }) => {
  const { data: membership } = useGetProjectMembershipsQuery(project_id, { skip: false })

  const changeAssignee = (e, type) => {
    setState({ ...state, [type]: e.target.value })
  }
  return (
    <Grid container spacing={2} sx={{ mt: 0 }}>
      <Grid item lg={6}>
        <Typography variant="body2" display="block" sx={{ color: theme => theme.palette.mode === "light" ? theme.palette.primary.defaultText : theme.palette.text.secondary }}>
          Default Assignee
        </Typography>
        <SelectWithIcon fullWidth value={state.default_assigned_to_id || ""} onChange={e => changeAssignee(e, "default_assigned_to_id")}>
          <MenuItem value="">Select Assignee</MenuItem>
          {membership
            ?.filter(x => x.user)
            .map(({ user }) => {
              if (!user) return ""
              return (
                <MenuItem key={user.id} value={user.id}>
                  <ListItemText>{user.name}</ListItemText>
                </MenuItem>
              )
            })}
        </SelectWithIcon>
      </Grid>
      <Grid item lg={6}>
        <Typography variant="body2" display="block" sx={{ color: theme => theme.palette.mode === "light" ? theme.palette.primary.defaultText : theme.palette.text.secondary }}>
          Project Lead
        </Typography>
        <SelectWithIcon fullWidth value={state.lead_id || ""} onChange={e => changeAssignee(e, "lead_id")}>
          <MenuItem value="">Select Assignee</MenuItem>
          {membership
            ?.filter(x => x.user)
            .map(({ user }) => {
              if (!user) return ""
              return (
                <MenuItem key={user.id} value={user.id}>
                  <ListItemText>{user.name}</ListItemText>
                </MenuItem>
              )
            })}
        </SelectWithIcon>
      </Grid>
    </Grid>
  )
}

export default ProjectAsignee
