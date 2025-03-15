import { Add, Delete, MoreVert } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, IconButton, LinearProgress, List, ListItemIcon, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { isAdmin } from "@redux/reducerSlices/user/userAuthSlice";
import { useDeleteGroupMutation, useGetGroupQuery } from "@redux/services/userApi";
import { useSnackbar } from "notistack";
import CreateTeam from "pages/members/Components/CreateTeam";
import CustomDialog from "pages/shared/CustomDialog";
import { DialogContent, DialogHeader } from "pages/shared/StyledDialog";
import User from "pages/teamDetails/Components/User";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function EditGroup({ team_id, onClose }) {
  const Admin = useSelector(isAdmin)
  const { data, error, isLoading } = useGetGroupQuery(team_id)
  const [open, setOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [deleteGroup] = useDeleteGroupMutation()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleDelete = async () => {
    try {
      if (!window.confirm("Are you sure?")) return
      await deleteGroup(team_id).unwrap()
      onClose()
    } catch (error) {
      const { message } = getErrorMessage(error)
      enqueueSnackbar(message, { variant: "error" })
    }
  }

  function handleDialog() {
    setOpen(!open)
  }

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  if (isLoading) return <LinearProgress />
  return (
    <Box>
      <DialogHeader sx={{ display: "flex", justifyContent: "space-between" }} >
        <Typography variant="h6">{Admin ? `Edit Team: ${data?.name}` : `View Team: ${data?.name}` }</Typography>
        {Admin && (
          <>
            <IconButton onClick={handleClick}>
              <MoreVert />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleDelete}>
                <ListItemIcon>
                  <Delete fontSize="small" />
                </ListItemIcon>
                Delete
              </MenuItem>
            </Menu>
          </>
        )}
      </DialogHeader>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }} >
          <Typography>Team Members</Typography>
          {data?.users.length ? (
            <List>
              {data.users.map(user => (
                <User user={user} team_id={team_id} />
              ))}
            </List>
          ) : (
            <Typography color="text.secondary" pt={2}>
              No member in this team
            </Typography>
          )}
        </Box>
        {Admin && (
          <>
            <Stack py={2} alignItems={`flex-start`}>
              <LoadingButton onClick={handleDialog} startIcon={<Add />} type="submit" variant="contained" sx={{ borderRadius: "4px" }}>
              {/* <LoadingButton loading={isLoading} type="submit" variant="contained" sx={{ borderRadius: "4px" }}> */}
                Add member
              </LoadingButton>
            </Stack>
          </>
        )}
      </DialogContent>

      <CustomDialog back open={open} onClose={handleDialog}>
        <CreateTeam onClose={handleDialog} team={data} />
      </CustomDialog>
    </Box>
  )
}