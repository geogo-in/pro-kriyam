import { LoadingButton } from "@mui/lab"
import { Box, Divider, Grid, LinearProgress, ListItemIcon, ListItemText, TextField } from "@mui/material"
import MenuItem from "@mui/material/MenuItem"
import Typography from "@mui/material/Typography"
import { DatePicker } from "@mui/x-date-pickers"
import { getCurrentUser } from "@redux/reducerSlices/user/userAuthSlice"
import { useCreateIssuesMutation, useGetEpicQuery, useGetIssuePriorityQuery, useGetProjectIssuesStatusesQuery } from "@redux/services/issueApi"
import { useGetProjectByIdQuery, useGetProjectMembershipsQuery, useGetProjectsQuery } from "@redux/services/projectApi"
import { skipToken } from "@reduxjs/toolkit/dist/query"
import { NEW_ISSUE_PRIORITY, NEW_ISSUE_TRACKER } from "config/constants"
import moment from "moment"
import { useSnackbar } from "notistack"
import { SelectWithIcon } from "pages/shared/CustomTextField"
import Editor from "pages/shared/Editor"
import MemberAvatar from "pages/shared/MemberAvatar"
import { DialogContent, DialogFooter, DialogHeader } from "pages/shared/StyledDialog"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getErrorMessage } from "utils/helper"

export default function CreateIssue({ project_id, status_id = "", sprint_id, onClose }) {
  const { project_id: project_id_params } = useParams()
  const [state, setState] = useState({
    assigned_to_id: "",
    category_id: "",
    description: "",
    status_id,
    tracker_id: "",
    priority_id: "",
    start_date: moment(),
    due_date: null,
    subject: "",
    done_ratio: 0,
    project_id: project_id || project_id_params,
  })
  const { data, isLoading: isProjectsLoading } = useGetProjectsQuery(state.project_id ? skipToken : undefined)
  const { data: project } = useGetProjectByIdQuery(state.project_id || skipToken)
  const { data: statuses } = useGetProjectIssuesStatusesQuery(state.project_id || skipToken)
  const { data: memberships } = useGetProjectMembershipsQuery(state.project_id || skipToken)
  const { data: epic } = useGetEpicQuery(state.project_id || skipToken)
  const { data: priorities } = useGetIssuePriorityQuery()
  const currentUser = useSelector(getCurrentUser)
  const [createTask, { isLoading }] = useCreateIssuesMutation()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    const extra = {}

    if (!state.status_id && statuses?.length) extra.status_id = statuses[0].id
    if (priorities?.length) extra.priority_id = priorities.find(p => p.name.toLowerCase() === NEW_ISSUE_PRIORITY)?.id || priorities[0].id
    if (project?.tracker?.length) extra.tracker_id = project.tracker.find(p => p.name.toLowerCase() === NEW_ISSUE_TRACKER)?.id || project?.tracker[0].id
    // if (project?.default_assignee) extra.assigned_to_id = project.default_assignee.id || ""

    if (extra) setState(s => ({ ...s, ...extra }))
  }, [statuses, priorities, project])

  const handleChange = e => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    try {
      e.preventDefault()
      const payload = await createTask({
        ...state,
        sprint_id: sprint_id || (project.project_type.name === "Kanban" ? project.active_sprint?.id : undefined),
        start_date: moment(state.start_date).format("YYYY-MM-DD"),
        due_date: state.due_date ? moment(state.due_date).format("YYYY-MM-DD") : undefined,
      }).unwrap()
      if (payload) onClose()
    } catch (r) {
      const { message } = getErrorMessage(r)
      enqueueSnackbar(message, { variant: "error" })
    }
  }

  const handleAssign = () => {
    currentUser && setState(s => ({ ...s, assigned_to_id: currentUser.id }))
  }

  if (!state.project_id) {
    if (isProjectsLoading) return <LinearProgress />
    else
      return (
        <Box>
          <DialogHeader>
            <Typography variant="h6">Create new issue</Typography>
          </DialogHeader>

          <DialogContent>
            <Box>
              <Typography variant="subtitle">First, select a project</Typography>
              <TextField select fullWidth label="Project" name="project_id" value={state.project_id} onChange={handleChange}>
                <MenuItem>--- Select ---</MenuItem>
                {data.projects?.map(({ name, identifier }) => (
                  <MenuItem key={identifier} value={identifier}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </DialogContent>
        </Box>
      )
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <DialogHeader>
        <Typography variant="h6">
          Create new issue in: <strong>{state.project_id}</strong>
        </Typography>
      </DialogHeader>
      <DialogContent>
        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid item lg={4}>
            <Typography variant="body2" display="block" sx={{ color: theme => theme.palette.primary.defaultText }}>
              Issue type*
            </Typography>
            <SelectWithIcon required name="tracker_id" value={state.tracker_id} onChange={handleChange} minWidth={175}>
              <MenuItem value="">--- Select ---</MenuItem>
              {project?.tracker?.map(({ name, id }) => (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              ))}
            </SelectWithIcon>
          </Grid>
          <Grid item lg={4}>
            <Typography variant="body2" display="block" sx={{ color: theme => theme.palette.primary.defaultText }}>
              Status*
            </Typography>
            <SelectWithIcon required name="status_id" value={state.status_id} onChange={handleChange} minWidth={175}>
              <MenuItem value="">--- Select ---</MenuItem>
              {statuses?.map(({ name, id }) => (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              ))}
            </SelectWithIcon>
          </Grid>
          <Grid item lg={4}>
            <Typography variant="body2" display="block" sx={{ color: theme => theme.palette.primary.defaultText }}>
              Priority*
            </Typography>
            <SelectWithIcon required name="priority_id" value={state.priority_id} onChange={handleChange} minWidth={175}>
              <MenuItem value="">--- Select ---</MenuItem>
              {priorities?.map(({ name, id }) => (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              ))}
            </SelectWithIcon>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" display="block" sx={{ fontWeight: 500, color: theme => theme.palette.primary.defaultText }}>
          Summary*
        </Typography>
        <TextField fullWidth autoFocus placeholder="Start typing about the task..." value={state.name} onChange={handleChange} name="subject"></TextField>
        <Typography variant="body2" display="block" sx={{ mt: 3, mb: 1, fontWeight: 500, color: theme => theme.palette.primary.defaultText }}>
          Description
        </Typography>

        <Editor
          placeholder="Add a more detailed description..."
          value={state.description}
          onChange={data => {
            setState(s => ({ ...s, description: data }))
          }}
        />
        <Typography variant="body2" display="block" sx={{ mt: 3, mb: 0, color: theme => theme.palette.primary.defaultText }}>
          Assignee
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <SelectWithIcon sx={{ ".MuiOutlinedInput-root": { borderRadius: 0.5 } }} name="assigned_to_id" value={state.assigned_to_id} onChange={handleChange} minWidth={250}>
            <MenuItem value="">
              <ListItemIcon>
                <MemberAvatar name="Automatic" tooltipPosition="none" />
              </ListItemIcon>
              <ListItemText>Automatic</ListItemText>
            </MenuItem>
            {memberships?.map(({ user }) => {
              if (!user) return ""
              return (
                <MenuItem key={user.id} value={user.id}>
                  <ListItemIcon>
                    <MemberAvatar name={user.name} tooltipPosition="none" />
                  </ListItemIcon>
                  <ListItemText>{user.name}</ListItemText>
                </MenuItem>
              )
            })}
          </SelectWithIcon>
          {!state.assigned_to_id && (
            <Typography variant="caption" sx={{ mt: 0, ml: 1, color: theme => theme.palette.primary.defaultText }}>
              Note: The issue will be automatically assigned to the default assignee (if it's configured for this project).
            </Typography>
          )}
        </Box>
        <Typography gutterBottom variant="caption" color="primary" sx={{ fontWeight: 500, cursor: "pointer" }} onClick={handleAssign}>
          Assign To me
        </Typography>
        <Typography variant="body2" display="block" sx={{ mt: 2, mb: 0, color: theme => theme.palette.primary.defaultText }}>
          Epic
        </Typography>
        <SelectWithIcon name="category_id" value={state.category_id} onChange={handleChange} minWidth={250}>
          <MenuItem value="">--- Select ---</MenuItem>
          {epic?.map(({ name, id }) => (
            <MenuItem key={id} value={id}>
              {name}
            </MenuItem>
          ))}
        </SelectWithIcon>
        <Box sx={{ flexDirection: "row", display: "flex" }}>
          <Box sx={{ mr: 1 }}>
            <Typography variant="body2" display="block" sx={{ mt: 2, mb: 0, color: theme => theme.palette.primary.defaultText }}>
              Start Date
            </Typography>
            <DatePicker
              disableCloseOnSelect={false}
              value={state.start_date}
              disablePast
              inputFormat="DD/MM/YYYY"
              onChange={start_date => setState(x => ({ ...x, start_date }))}
              slotProps={{ textField: { required: true } }}
            />
          </Box>
          <Box sx={{ ml: 1 }}>
            <Typography variant="body2" display="block" sx={{ mt: 2, mb: 0, color: theme => theme.palette.primary.defaultText }}>
              Due Date
            </Typography>
            <DatePicker
              disableCloseOnSelect={false}
              value={state.due_date}
              disablePast
              inputFormat="DD/MM/YYYY"
              onChange={due_date => setState(x => ({ ...x, due_date }))}
              slotProps={{ textField: params => ({ required: true, error: state.due_date ? params.error : false }) }}
            />
          </Box>
        </Box>
        {/* <TextField
            select
            SelectProps={{ displayEmpty: true }}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
            label="Epic Link"
            name="category_id"
            value={state.category_id}
            onChange={handleChange}>
            <MenuItem value="">--- Select ---</MenuItem>
            {epic?.map(({ name, id }) => (
              <MenuItem value={id} key={id}>
                {name}
              </MenuItem>
            ))}
          </TextField> */}
        {/* <TextareaAutosize
            minRows={3}
            maxRows={5}
            aria-label="maximum height"
            placeholder="Start typing about the task..."
            name="subject"
            required
            onChange={handleChange}
            style={{
              // maxWidth: 350,
              width: "100%",
              border: "1px solid #E1E4E8",
              borderRadius: "4px",
              backgroundColor: "#FAFBFC",
              boxShadow: "inset 0px 2px 0px rgba(225, 228, 232, 0.2)",
            }}
          /> */}
      </DialogContent>
      <DialogFooter>
        <LoadingButton loading={isLoading} type="submit" variant="contained">
          Create Issue
        </LoadingButton>
      </DialogFooter>
    </Box>
  )
}
