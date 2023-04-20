import { Delete } from "@mui/icons-material"
import { Avatar, CircularProgress, Divider, IconButton, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from "@mui/material"
import { useSnackbar } from "notistack"
import { useRemoveGroupUserMutation } from "@redux/services/userApi"
import { stringAvatar } from "utils/Avatar"
import { getErrorMessage } from "utils/helper"

export default function User({ user, team_id }) {
  const [removeGroupUser, { isLoading }] = useRemoveGroupUserMutation()
  const { enqueueSnackbar } = useSnackbar()

  const handleDeleteUser = async e => {
    try {
      if (!window.confirm("Are you sure?")) return
      await removeGroupUser({ uid: user.id, id: team_id })
    } catch (error) {
      const { message } = getErrorMessage(error)
      enqueueSnackbar(message, { variant: "error" })
    }
  }
  return (
    <>
      <ListItem>
        <ListItemAvatar>
          <Avatar {...stringAvatar(user.name)} />
        </ListItemAvatar>
        <ListItemText primary={user.name} secondary={"#" + user.id} />
        <ListItemSecondaryAction>
          <IconButton onClick={handleDeleteUser} disabled={isLoading}>
            {isLoading ? <CircularProgress size={20} /> : <Delete />}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  )
}
