import { LoadingButton } from "@mui/lab"
import { Box, Button, DialogActions, DialogContent, MenuItem, TextField, Typography } from "@mui/material"
import { useSnackbar } from "notistack"
import CustomDialogTitle from "pages/shared/CustomDialogTitle"
import { useState } from "react"
import { useListSprintsQuery, useUpdateSprintMutation } from "@redux/services/redmineApi"
import { getErrorMessage } from "utils/helper"

export default function SprintClose({ project_id, sprint_id, onClose, ...sprint }) {
  const [updateSprint, { isLoading }] = useUpdateSprintMutation()
  const { data: sprints } = useListSprintsQuery({ project_id })
  const [move_sprint_id, setMoveSprintId] = useState("backlog")
  const { enqueueSnackbar } = useSnackbar()
  const completeIssue = sprint.issues?.filter(issue => issue.closed_on) || []

  const handleChange = e => {
    setMoveSprintId(e.target.value)
  }
  const handleUpdateSprint = async e => {
    try {
      e.preventDefault()
      await updateSprint({ project_id, sprint_id, state: "close", move_sprint_id }).unwrap()
      onClose()
    } catch (r) {
      const { message } = getErrorMessage(r)
      enqueueSnackbar(message, { variant: "error" })
    }
  }

  return (
    <Box component="form" onSubmit={handleUpdateSprint} minWidth={600}>
      <CustomDialogTitle onClose={onClose}>Complete {sprint.name}</CustomDialogTitle>
      <DialogContent>
        <img src="" alt="" height="100" />
        <Typography fontWeight="bold">This sprint contains</Typography>

        <Typography component={"li"}>{completeIssue.length} Completed issue</Typography>
        <Typography component={"li"}>{sprint.issues?.length - completeIssue.length || 0} Open issue</Typography>

        <TextField value={move_sprint_id} onChange={handleChange} select label="Move open issues to" fullWidth margin="normal">
          <MenuItem value={"backlog"}>Backlog</MenuItem>
          {sprints
            ?.filter(sprint => sprint.aasm_state !== "running")
            .map(sprint => (
              <MenuItem key={sprint.id} value={sprint.id}>
                {sprint.name}
              </MenuItem>
            ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button disabled={isLoading} onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton loading={isLoading} variant="contained" type="submit">
          Complete Sprint
        </LoadingButton>
      </DialogActions>
    </Box>
  )
}
