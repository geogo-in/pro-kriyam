import { LoadingButton } from "@mui/lab"
import { Grid, ListItem, ListItemText, MenuItem, Typography } from "@mui/material"
import { useSnackbar } from "notistack"
import { SelectWithIcon } from "pages/shared/CustomTextField"
import { LineCard as Card } from "pages/shared/StyledCard"
import { useState } from "react"
import { useCreateProjectMembershipMutation } from "@redux/services/projectApi"
import { useGetGroupsQuery, useGetRolesQuery } from "@redux/services/userApi"
import { getErrorMessage } from "utils/helper"

const initialState = { user_id: "", role_ids: [] }
const AddGroup = ({ project_id, setShow }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [membership, setMembership] = useState(initialState)
  const { data: groups } = useGetGroupsQuery()
  const { data: roles } = useGetRolesQuery()
  const [createProjectMembership, { isLoading }] = useCreateProjectMembershipMutation()

  const handleChange = e => {
    setMembership({ ...membership, [e.target.name]: e.target.value })
  }

  const handleRole = e => {
    setMembership({ ...membership, role_ids: [e.target.value] }) //for single role
  }

  const handleSave = async e => {
    try {
      e.preventDefault()
      if (!membership.user_id || !membership.role_ids[0]) return enqueueSnackbar("Choose both user and role.", { variant: "error" })
      await createProjectMembership({ project_id, membership }).unwrap()
      setMembership(initialState)
    } catch (error) {
      const { message } = getErrorMessage(error)
      enqueueSnackbar(message, { variant: "error" })
    }
  }

  return (
    <Card sx={{ px: 3, py: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem", color: theme => theme.palette.primary.defaultText }}>
        Add a team to project
      </Typography>
      <Grid container spacing={2}>
        <Grid item lg={6}>
          <SelectWithIcon name="user_id" fullWidth sx={{ borderRadius: 1, ".MuiOutlinedInput-root": { borderRadius: 1 } }} value={membership.user_id} onChange={handleChange}>
            <ListItem value="">Select a team</ListItem>
            {groups?.map(group => (
              <MenuItem key={group.id} value={group.id}>
                <ListItemText>{group.name}</ListItemText>
              </MenuItem>
            ))}
          </SelectWithIcon>
        </Grid>
        <Grid item lg={6}>
          <SelectWithIcon name="role_ids" fullWidth sx={{ borderRadius: 1, ".MuiOutlinedInput-root": { borderRadius: 1 } }} value={membership.role_ids} onChange={handleRole}>
            <MenuItem value="">Assign role</MenuItem>
            {roles?.roles?.map(role => (
              <MenuItem key={role.id} value={role.id}>
                <ListItemText>{role.name}</ListItemText>
              </MenuItem>
            ))}
          </SelectWithIcon>
        </Grid>
        <Grid item lg={12}>
          <LoadingButton variant="contained" loading={isLoading} onClick={handleSave} sx={{ borderRadius: "4px" }}>
            Add group
          </LoadingButton>
        </Grid>
      </Grid>
    </Card>
  )
}

export default AddGroup
