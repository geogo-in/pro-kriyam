import { LoadingButton } from "@mui/lab"
import { Box, Checkbox, LinearProgress, Stack, TextField, Typography } from "@mui/material"
import Avatar from "@mui/material/Avatar"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import { useCreateGroupsMutation, useGetUsersQuery, useUpdateGroupMutation } from "@redux/services/userApi"
import { useSnackbar } from "notistack"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PATH_DASHBOARD } from "routes/paths"
import { stringAvatar } from "utils/Avatar"
import { getErrorMessage } from "utils/helper"

export default function CreateTeam({ onClose, team }) {
  const [state, setState] = useState({ name: "", user_ids: [] })
  const [createTeam, { isLoading }] = useCreateGroupsMutation()
  const [updateTeam, { isLoading: isUpdating }] = useUpdateGroupMutation()
  const { data, isLoading: isUserLoading } = useGetUsersQuery()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const loading = isLoading || isUpdating

  useEffect(() => {
    if (team) setState(s => ({ ...s, name: team.name, user_ids: team.users.map(user => user.id) }))
  }, [team])

  const handleSubmit = async e => {
    try {
      e.preventDefault()

      if (team) {
        await updateTeam({ id: team.id, ...state }).unwrap()
        enqueueSnackbar("Group is successfully updated", { variant: "success" })
      } else {
        if (!state.user_ids.length) return enqueueSnackbar("Please select at least one member for this team", { variant: "error" })
        await createTeam(state).unwrap()
        enqueueSnackbar("Group is successfully created", { variant: "success" })
      }
      if (typeof onClose === "function") onClose()
      else navigate.replace(PATH_DASHBOARD.members.root)
    } catch (error) {
      const { message } = getErrorMessage(error)
      enqueueSnackbar(message, { variant: "error" })
    }
  }
  const handleChange = event => {
    setState({ ...state, [event.target.name]: event.target.value })
  }

  const handleToggle = value => () => {
    const currentIndex = state.user_ids.indexOf(value)
    const newChecked = [...state.user_ids]

    if (currentIndex === -1) newChecked.push(value)
    else newChecked.splice(currentIndex, 1)

    setState({ ...state, user_ids: newChecked })
  }

  if (isUserLoading) return <LinearProgress />
  return (
    <Box component="form" onSubmit={handleSubmit} p={3}>
      <Typography variant="h6">{team ? "Update Team" : "Create New Team"}</Typography>

      <TextField sx={{"& fieldset": {borderColor: theme => theme.palette.mode === "light" ? "" : "#444444"}}} label="Team Name" value={state.name} name="name" fullWidth required onChange={handleChange} variant="outlined" margin="dense" sx={{ minWidth: 300, my: 2 }} />

      <Typography>Select members</Typography>
      <List dense>
        {data?.users?.map(user => (
          <ListItem
            onClick={handleToggle(user.id)}
            key={user.id}
            secondaryAction={<Checkbox edge="end" onChange={handleToggle(user.id)} checked={state.user_ids.indexOf(user.id) !== -1} />}
            disablePadding>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar {...stringAvatar(`${user.firstname} ${user.lastname}`)} />
              </ListItemAvatar>
              <ListItemText primary={`${user.firstname} ${user.lastname}`} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Stack py={2} alignItems="flex-end">
        <LoadingButton loading={loading} type="submit" variant="contained">
          {team ? "Update" : "Create"} Team
        </LoadingButton>
      </Stack>
    </Box>
  )
}
