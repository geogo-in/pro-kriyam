import { LoadingButton } from "@mui/lab"
import { Button, DialogActions, DialogContent, Stack, TextField } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
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
      else if (type === "Update Sprint") await updateSprint({ project_id, sprint_id, ...state }).unwrap()
      else throw Error("This dialog has no type")

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
    <form onSubmit={handleUpdateSprint}>
      <CustomDialogTitle onClose={onClose}>Sprint Details</CustomDialogTitle>
      <DialogContent>
        <TextField label="Sprint Name" value={state.name} name="name" onChange={handleChange} fullWidth required />
        <TextField label="Goals" value={state.goals} name="goals" onChange={handleChange} fullWidth />
        {/* <TextField multiline minRows={3} fullWidth maxRows={5} label="Description" required name="description" value={state.description} onChange={handleChange} /> */}
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} flexWrap={"wrap"}>
          <DatePicker
            label="Start Date"
            disablePast
            format="DD/MM/YYYY"
            value={state.start_date}
            onChange={date => setState({ ...state, start_date: date })}
            slotProps={{ textField: { required: true, style: { marginRight: 12 } } }}
          />
          <DatePicker
            label="Due Date"
            disablePast
            format="DD/MM/YYYY"
            value={state.end_date}
            onChange={date => setState({ ...state, end_date: date })}
            slotProps={{ textField: { required: true } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton loading={loading} variant="contained" type="submit">
          {type}
        </LoadingButton>
      </DialogActions>
    </form>
  )
}
