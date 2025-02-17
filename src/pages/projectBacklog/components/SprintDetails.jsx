import { LoadingButton } from "@mui/lab"
import { Box, Button, DialogActions, DialogContent, Stack, TextField, Typography } from "@mui/material"
import { useUpdateSprintMutation, useUpdateSprintStateMutation } from "@redux/services/redmineApi"
import moment from "moment"
import { useSnackbar } from "notistack"
import CustomDialogTitle from "pages/shared/CustomDialogTitle"
import { useState } from "react"
import { getErrorMessage } from "utils/helper"

export default function SprintDetails({ project_id, sprint_id, editable, onClose, type, ...sprint }) {
  const { name, description, end_date, start_date, goals } = sprint
  const [updateSprintState, { isLoading: isUpdatingState }] = useUpdateSprintStateMutation()
  const [updateSprint, { isLoading }] = useUpdateSprintMutation()
  const { enqueueSnackbar } = useSnackbar()
  const loading = isLoading || isUpdatingState
  const [state, setState] = useState({
    name,
    // description,
    end_date: end_date ? moment(end_date) : moment().add(1, "week"),
    start_date: start_date ? moment(start_date) : moment(),
    goals: goals || "",
  })
  const handleUpdateSprint = async e => {
    try {
      e.preventDefault()
      if (!state.start_date || !state.end_date) return enqueueSnackbar("Please choose sprint duration")
      if (type === "Start Sprint") await updateSprintState({ project_id, sprint_id, state: "activate", ...state }).unwrap()
      else if (type === "Edit Sprint") await updateSprint({ project_id, sprint_id, ...state }).unwrap()
      else throw Error("This dialog has no type")
      enqueueSnackbar(`${type} successful.`, { variant: "success" })
      onClose()
    } catch (r) {
      const { message } = getErrorMessage(r)
      enqueueSnackbar(message, { variant: "error" })
    }
  }
  const handleChange = e => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  return (
    <Box component="form" onSubmit={handleUpdateSprint} minWidth={500}>
      <CustomDialogTitle onClose={onClose}>
        {type}: {state.name}
      </CustomDialogTitle>
      <DialogContent sx={{ px: 2, mt: 2 }}>
        <Typography variant="body2" display="block" sx={{ color: theme => theme.palette.primary.defaultText }}>
          Sprint Name*
        </Typography>
        <TextField value={state.name} name="name" onChange={handleChange} fullWidth required sx={{ mb: 3 }} />
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} flexWrap={"wrap"} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="body2" display="block" sx={{ color: theme => theme.palette.primary.defaultText }}>
              Start Date*
            </Typography>
            <TextField
              type="date"
              value={state.start_date.format("YYYY-MM-DD")}
              onChange={e => setState({ ...state, start_date: moment(e.target.value) })}
              required
              sx={{ marginRight: 2 }}
              inputProps={{ min: moment().format("YYYY-MM-DD") }}
            />
          </Box>
          <Box>
            <Typography variant="body2" display="block" sx={{ color: theme => theme.palette.primary.defaultText }}>
              End Date*
            </Typography>
            <TextField
              type="date"
              value={state.end_date.format("YYYY-MM-DD")}
              onChange={e => setState({ ...state, end_date: moment(e.target.value) })}
              required
              inputProps={{ min: moment().format("YYYY-MM-DD") }}
            />
          </Box>
        </Stack>
        <Typography variant="body2" display="block" sx={{ color: theme => theme.palette.primary.defaultText }}>
          Sprint Goal*
        </Typography>
        <TextField required value={state.goals} name="goals" onChange={handleChange} fullWidth sx={{ mb: 3 }} />
      </DialogContent>
      <DialogActions sx={{ px: 2, py: 1.6, mt: 2, borderTop: "1px solid #E5E7EB" }}>
        <Button disabled={loading} onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton loading={loading} variant="contained" type="submit">
          {type === "Edit Sprint" ? "Update" : type}
        </LoadingButton>
      </DialogActions>
    </Box>
  )
}
