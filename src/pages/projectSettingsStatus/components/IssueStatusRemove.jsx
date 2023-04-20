import { LoadingButton } from "@mui/lab"
import { Box, Button, DialogActions, DialogContent, Grid, MenuItem, TextField, Typography } from "@mui/material"
import { useSnackbar } from "notistack"
import CustomDialogTitle from "pages/shared/CustomDialogTitle"
import { useState } from "react"
import { useDeleteProjectIssueStatusMutation, useGetProjectIssuesStatusesQuery } from "@redux/services/issueApi"
import { getErrorMessage } from "utils/helper"

export default function IssueStatusRemove({ onClose, project_id, status_id, status_name }) {
  const [state, setState] = useState("")
  const [deleteProjectIssueStatus, { isLoading }] = useDeleteProjectIssueStatusMutation()
  const { data: projectIssueStatus } = useGetProjectIssuesStatusesQuery(project_id)
  const { enqueueSnackbar } = useSnackbar()

  const handleChange = e => {
    setState(e.target.value)
  }
  const handleRemoveStatus = async e => {
    try {
      e.preventDefault()
      await deleteProjectIssueStatus({ project_id, status_id, transfer_to_status: state }).unwrap()
      onClose()
    } catch (error) {
      const { message } = getErrorMessage(error)
      enqueueSnackbar(message, { variant: "error" })
    }
  }
  return (
    <Box component="form" onSubmit={handleRemoveStatus} minWidth={500} sx={{ px: 1 }}>
      <CustomDialogTitle onClose={onClose}>Move issues from {status_name.toUpperCase()} status</CustomDialogTitle>
      <DialogContent sx={{ px: 2, mt: 2 }}>
        <Typography variant="body2">Select a new place for any work with the {status_name.toUpperCase()} status, including the ones in the backlog.</Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item lg={6}>
            <Typography variant="body2" gutterBottom>
              This status will be deleted:
            </Typography>
            <Typography variant="subtitle" fontWeight={500}>
              {status_name.toUpperCase()}
            </Typography>
          </Grid>
          <Grid item lg={6}>
            <Typography variant="body2">Move existing issues to:</Typography>
            <TextField required value={state} onChange={handleChange} select label="--- select ---" fullWidth margin="normal" sx={{ mt: 1 }}>
              {projectIssueStatus
                .filter(status => status.id !== status_id)
                .map(status => (
                  <MenuItem key={status.id} value={status.id}>
                    {status.name}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 2, py: 2 }}>
        <Button disabled={isLoading} onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton loading={isLoading} variant="contained" type="submit">
          Submit
        </LoadingButton>
      </DialogActions>
    </Box>
  )
}
