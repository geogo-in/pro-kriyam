import { Avatar, Button, CircularProgress, Divider, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from "@mui/material"
import { isAdmin } from "@redux/reducerSlices/user/userAuthSlice"
import { useRemoveGroupUserMutation } from "@redux/services/userApi"
import { useSnackbar } from "notistack"
import { useSelector } from "react-redux"
import { stringAvatar } from "utils/Avatar"
import { getErrorMessage } from "utils/helper"

export default function User({ user, team_id }) {
  const Admin = useSelector(isAdmin)
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
          { isLoading ? <CircularProgress size={20} /> :
          Admin && (
            <Button sx={{ color: "error.main" }} onClick={handleDeleteUser} >
              Remove Member
            </Button>
          )}
          {/* <IconButton onClick={handleDeleteUser} disabled={isLoading}>
            {isLoading ? <CircularProgress size={20} /> : <Button sx={{ color: "error.main" }} >Remove Member</Button>}
          </IconButton> */}
        </ListItemSecondaryAction>
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  )
}