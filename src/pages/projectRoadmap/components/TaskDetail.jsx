import { LoadingButton } from "@mui/lab"
import { Box, DialogActions, DialogContent, Divider, MenuItem, TextField, Typography } from "@mui/material"
import Slider from "@mui/material/Slider"
// import Autocomplete from "@mui/material/Autocomplete"
import { useCreateIssuesMutation, useGetIssuePriorityQuery, useUpdateIssuesMutation } from "@redux/services/issueApi"
import { useGetProjectByIdQuery } from "@redux/services/projectApi"
import moment from "moment"
import { enqueueSnackbar } from "notistack"
import CustomDialogTitle from "pages/shared/CustomDialogTitle"
import { useEffect, useState } from "react"
import { getErrorMessage } from "utils/helper"

const initialState = { start_date: moment(), due_date: null, subject: "", done_ratio: 0 }

function TaskDetail({ onClose, project_id, parentId, editable, task }) {
  const [state, setState] = useState(initialState)
  const { data: project } = useGetProjectByIdQuery(project_id)
  const [createTask, { isLoading }] = useCreateIssuesMutation()
  const [updateTask, { isLoading: isUpdating }] = useUpdateIssuesMutation()
  const { data: priorities } = useGetIssuePriorityQuery()

  const handleChange = e => {
    setState({ ...state, [e.target.name]: e.target.value })
  }
  const handleSubmit = async e => {
    try {
      e.preventDefault()
      if (editable) {
        await updateTask({ ...state, id: task.id, start_date: moment(state.start_date).format("YYYY-MM-DD"), due_date: moment(state.due_date).format("YYYY-MM-DD") }).unwrap()
      } else {
        console.log(parentId)
        await createTask({
          ...state,
          sprint_id: project.project_type.name === "Kanban" ? project.active_sprint?.id : undefined,
          project_id,
          parent_issue_id: parentId,
          start_date: moment(state.start_date).format("YYYY-MM-DD"),
          due_date: moment(state.due_date).format("YYYY-MM-DD"),
          priority_id: priorities.find(p => p.name.toLowerCase() === "normal")?.id,
        }).unwrap()
      }
      onClose()
    } catch (r) {
      const { message } = getErrorMessage(r)
      enqueueSnackbar(message, { variant: "error" })
    }
  }

  useEffect(() => {
    if (editable) setState({ start_date: task.start, due_date: task.end, subject: task.title, done_ratio: task.progress })
    // eslint-disable-next-line
  }, [editable])

  return (
    <Box maxWidth={300} component="form" onSubmit={handleSubmit}>
      <CustomDialogTitle onClose={onClose}>Task details</CustomDialogTitle>
      <DialogContent>
        <TextField sx={{ mb: 2 }} fullWidth label="Summary*" value={state.subject} name="subject" onChange={handleChange} />
        <TextField
          type="date"
          required
          label="Start date"
          // inputProps={{ min: moment().format("YYYY-MM-DD") }}
          value={state.start_date ? moment(state.start_date).format("YYYY-MM-DD") : ""}
          onChange={e => setState({ ...state, start_date: moment(e.target.value) })}
          InputLabelProps={{ shrink: true }}
          fullWidth
          sx={{ my: 2 }}
        />
        <TextField
          type="date"
          label="End Date"
          // inputProps={{ min: moment().format("YYYY-MM-DD") }}
          value={state.due_date ? moment(state.due_date).format("YYYY-MM-DD") : ""}
          onChange={e => setState({ ...state, due_date: moment(e.target.value) })}
          InputLabelProps={{ shrink: true }}
          fullWidth
          sx={{ my: 2 }}
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
      </DialogContent>

      <DialogActions>
        <LoadingButton size="small" fullWidth loading={isLoading || isUpdating} type="submit" variant="contained" color="primary" size="normal">
          Submit
        </LoadingButton>
      </DialogActions>
    </Box>
  )
}

export default TaskDetail
