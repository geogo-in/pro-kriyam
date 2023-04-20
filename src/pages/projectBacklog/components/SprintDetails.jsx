import { DatePicker, LoadingButton } from "@mui/lab"
import { Button, DialogActions, DialogContent, Stack, TextField } from "@mui/material"
import { useSnackbar } from "notistack"
import CustomDialogTitle from "pages/shared/CustomDialogTitle"
import { useState } from "react"
import { useUpdateSprintMutation } from "@redux/services/redmineApi"
import { getErrorMessage } from "utils/helper"

export default function SprintDetails({ project_id, sprint_id, editable, onClose, ...sprint }) {
  const { name, description, end_date, start_date, goals } = sprint

  const [updateSprint, { isLoading }] = useUpdateSprintMutation()
  const { enqueueSnackbar } = useSnackbar()
  const [state, setState] = useState({ name, description, end_date, start_date, goals: goals || "" })

  const handleUpdateSprint = async e => {
    try {
      e.preventDefault()
      if (!state.start_date || !state.end_date) return enqueueSnackbar("Please choose sprint duration")
      await updateSprint({ project_id, sprint_id, state: "activate", ...state }).unwrap()
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
        <TextField multiline minRows={3} fullWidth maxRows={5} label="Description" required name="description" onChange={handleChange} />
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} flexWrap={"wrap"}>
          <DatePicker
            label="Start Date"
            value={state.start_date}
            disablePast
            inputFormat="DD/MM/YYYY"
            onChange={date => setState({ ...state, start_date: date })}
            renderInput={params => <TextField required {...params} />}
          />
          <DatePicker
            label="Due Date"
            value={state.end_date}
            disablePast
            inputFormat="DD/MM/YYYY"
            onChange={date => setState({ ...state, end_date: date })}
            renderInput={params => <TextField required {...params} />}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={isLoading} onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton loading={isLoading} variant="contained" type="submit">
          Apply
        </LoadingButton>
      </DialogActions>
    </form>
  )
}
