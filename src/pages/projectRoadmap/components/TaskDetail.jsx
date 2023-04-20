import { LoadingButton } from "@mui/lab"
import { Box, DialogActions, DialogContent, Divider, MenuItem, TextField, Typography } from "@mui/material"
import Slider from "@mui/material/Slider"
// import Autocomplete from "@mui/material/Autocomplete"
import { DatePicker } from "@mui/x-date-pickers"
import { useCreateIssuesMutation, useUpdateIssuesMutation } from "@redux/services/issueApi"
import moment from "moment"
import CustomDialogTitle from "pages/shared/CustomDialogTitle"
import { useEffect, useState } from "react"

const initialState = { start_date: moment(), due_date: "", subject: "", done_ratio: 0 }

function TaskDetail({ onClose, project_id, editable, task }) {
  const [state, setState] = useState(initialState)
  const [createTask, { isLoading }] = useCreateIssuesMutation()
  const [updateTask, { isLoading: isUpdating }] = useUpdateIssuesMutation()

  const handleChange = e => {
    setState({ ...state, [e.target.name]: e.target.value })
  }
  const handleSubmit = async e => {
    try {
      e.preventDefault()
      if (editable) {
        await updateTask({ ...state, id: task.id, start_date: state.start_date.format("YYYY-MM-DD"), due_date: moment(state.due_date).format("YYYY-MM-DD") }).unwrap()
      } else {
        await createTask({ ...state, project_id, start_date: state.start_date.format("YYYY-MM-DD"), due_date: moment(state.due_date).format("YYYY-MM-DD") }).unwrap()
      }
      onClose()
    } catch (r) {
      console.error(r)
      window.alert(r.data?.errors?.[0])
    }
  }

  useEffect(() => {
    if (editable) setState({ start_date: task.start, due_date: task.end, subject: task.title, done_ratio: task.progress })
    // eslint-disable-next-line
  }, [editable])

  return (
    <Box maxWidth={300} component="form" onSubmit={handleSubmit}>
      <CustomDialogTitle onClose={onClose}>Task Details</CustomDialogTitle>
      <DialogContent>
        <TextField sx={{ mb: 2 }} fullWidth label="Task Title" value={state.subject} name="subject" onChange={handleChange} />

        <DatePicker
          format="DD/MM/YYYY"
          required
          label="Start date"
          value={state.start_date}
          onChange={e => setState({ ...state, start_date: e })}
          slotProps={{ textField: { required: true, sx: { my: 2 }, fullWidth: true } }}
        />
        <DatePicker
          label="End Date"
          format="DD/MM/yyyy"
          value={state.due_date}
          onChange={e => setState({ ...state, due_date: e })}
          slotProps={{ textField: { required: true, sx: { my: 2 }, fullWidth: true } }}
        />
        <Box display="flex" alignItems="center">
          <Typography sx={{ flex: "none" }} pr={1} variant="caption" noWrap>
            Task Progress
          </Typography>
          <Slider size="small" value={state.done_ratio} onChange={handleChange} name="done_ratio" valueLabelDisplay="auto" />
        </Box>
        <TextField select fullWidth size="small" value={state.done_ratio} onChange={handleChange} name="done_ratio">
          {![...Array(10).keys()].includes(state.done_ratio / 10) && [
            <MenuItem key={state.done_ratio} value={state.done_ratio}>
              {state.done_ratio}%
            </MenuItem>,
            <Divider key={"hr"} />,
          ]}
          {[...Array(10).keys()].map(d => (
            <MenuItem key={d * 10} value={d * 10}>
              {d * 10}%
            </MenuItem>
          ))}
        </TextField>

        {/* <Autocomplete
            multiple
            id="tags-standard"
            options={top100Films}
            getOptionLabel={option => option.title} 
            renderInput={params => <TextField {...params} variant="standard" label="Multiple values" placeholder="Favorites" />}
          /> */}
      </DialogContent>

      <DialogActions>
        <LoadingButton size="small" fullWidth loading={isLoading || isUpdating} type="submit" variant="contained" color="primary">
          Create or Update Task
        </LoadingButton>
      </DialogActions>
    </Box>
  )
}

export default TaskDetail
