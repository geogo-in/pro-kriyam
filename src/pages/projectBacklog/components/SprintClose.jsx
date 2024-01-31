import { LoadingButton } from "@mui/lab"
import { Box, Button, DialogActions, DialogContent, MenuItem, TextField, Typography } from "@mui/material"
import { useDeleteSprintMutation, useListSprintsQuery, useUpdateSprintStateMutation } from "@redux/services/redmineApi"
import { useSnackbar } from "notistack"
import CustomDialogTitle from "pages/shared/CustomDialogTitle"
import { useState } from "react"
import { getErrorMessage } from "utils/helper"

export default function SprintClose({ project_id, sprint_id, onClose, type, ...sprint }) {
  const [updateSprintState, { isLoading }] = useUpdateSprintStateMutation()
  const [deleteSprint, { isLoading: isDeleting }] = useDeleteSprintMutation()
  const { data: sprints } = useListSprintsQuery({ project_id })
  const [move_sprint_id, setMoveSprintId] = useState("backlog")
  const { enqueueSnackbar } = useSnackbar()
  const completeIssue = sprint.issues?.filter(issue => issue.closed_on) || sprint.issue_status?.find(status => status.is_closed)?.issues || []
  const openIssueCount = sprint.issues?.length
    ? sprint.issues?.length - completeIssue.length
    : sprint.issue_status?.filter(status => !status.is_closed).reduce((acc, v) => [...acc, ...v.issues], []).length || 0

  const isDelete = type === "Delete Sprint"
  const loading = isDeleting || isLoading

  const handleChange = e => {
    setMoveSprintId(e.target.value)
  }
  const handleUpdateSprint = async e => {
    try {
      e.preventDefault()
      if (isDelete) {
        if (!window.confirm("Are you sure? You want to delete this sprint.")) return
        await deleteSprint({ project_id, sprint_id, move_sprint_id }).unwrap()
        enqueueSnackbar("This sprint is deleted successfully", { variant: "success" })
      } else {
        await updateSprintState({ project_id, sprint_id, state: "close", move_sprint_id }).unwrap()
        enqueueSnackbar(`This sprint is closed successfully.`, { variant: "success" })
      }

      onClose()
    } catch (r) {
      const { message } = getErrorMessage(r)
      enqueueSnackbar(message, { variant: "error" })
    }
  }
  return (
    <Box component="form" onSubmit={handleUpdateSprint} minWidth={500}>
      <CustomDialogTitle onClose={onClose}>Complete sprint: {sprint.name}</CustomDialogTitle>
      <DialogContent sx={{ px: 4, mt: 2 }}>
        <Typography variant="h6" fontWeight="bold" fontSize={16} color={theme => theme.palette.primary.defaultText}>
          This sprint contains:
        </Typography>
        <Typography component={"li"} variant="body2" color={theme => theme.palette.primary.defaultText}>
          {completeIssue.length} Completed issue(s)
        </Typography>
        <Typography component={"li"} variant="body2" color={theme => theme.palette.primary.defaultText}>
          {openIssueCount} Open issue(s)
        </Typography>
        <br />
        <Typography variant="body2" display="block" sx={{ color: theme => theme.palette.primary.defaultText, fontWeight: 500 }}>
          Move open issues to
        </Typography>
        <TextField value={move_sprint_id} onChange={handleChange} select sx={{ width: 300, mt: 1 }}>
          <MenuItem value={"backlog"}>Backlog</MenuItem>
          {sprints
            ?.filter(_sprint => _sprint.id != sprint_id)
            .map(_sprint => (
              <MenuItem key={_sprint.id} value={_sprint.id}>
                {_sprint.name}
              </MenuItem>
            ))}
        </TextField>
      </DialogContent>
      <DialogActions sx={{ px: 2, py: 1.6, mt: 2, borderTop: "1px solid #E5E7EB" }}>
        <Button disabled={loading} onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton loading={loading} variant="contained" color={isDelete ? "error" : "primary"} type="submit">
          {isDelete ? "Delete" : "Complete"}
        </LoadingButton>
      </DialogActions>
    </Box>
  )
}
