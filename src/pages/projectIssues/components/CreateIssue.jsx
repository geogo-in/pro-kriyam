import { LoadingButton } from "@mui/lab"
import { Box, Button, Divider, Grid, LinearProgress, ListItemIcon, ListItemText, TextField } from "@mui/material"
import MenuItem from "@mui/material/MenuItem"
import Typography from "@mui/material/Typography"
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
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getErrorMessage } from "utils/helper"

export default function CreateIssue({ parent_issue_id, project_id, status_id = "", sprint_id, onClose }) {
  const { project_id: project_id_params } = useParams()
  const subjectRef = useRef(null)
  const [state, setState] = useState({
    assigned_to_id: "",
    category_id: "",
    description: "",
    status_id,
    tracker_id: "",
    priority_id: "",
    start_date: moment(),
    due_date: moment().add(1, "month"),
    subject: "",
    done_ratio: 0,
    project_id: project_id || project_id_params,
  })
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [showDescriptionField, setShowDescriptionField] = useState(false)
  const { data, isLoading: isProjectsLoading } = useGetProjectsQuery(state.project_id ? skipToken : undefined)
  const { data: project, isLoading: isProjectLoading } = useGetProjectByIdQuery(state.project_id || skipToken)
  const { data: statuses, isLoading: isStatusesLoading } = useGetProjectIssuesStatusesQuery(state.project_id || skipToken)
  const { data: memberships, isLoading: isMembershipsLoading } = useGetProjectMembershipsQuery(state.project_id || skipToken)
  const { data: epic } = useGetEpicQuery(state.project_id || skipToken)
  const { data: priorities, isLoading: isPrioritiesLoading } = useGetIssuePriorityQuery()
  const currentUser = useSelector(getCurrentUser)
  const [createTask, { isLoading }] = useCreateIssuesMutation()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    const extra = {}

    if (!state.status_id && statuses?.length) extra.status_id = statuses[0].id
    if (!state.priority_id && priorities?.length) {
      extra.priority_id = priorities.find(p => p.name.toLowerCase() === NEW_ISSUE_PRIORITY)?.id || priorities[0].id
    }
    if (!state.tracker_id && project?.tracker?.length) {
      extra.tracker_id = project.tracker.find(p => p.name.toLowerCase() === NEW_ISSUE_TRACKER)?.id || project.tracker[0].id
    }

    if (Object.keys(extra).length > 0) {
      setState(prevState => ({ ...prevState, ...extra }))
    }

    if (subjectRef.current) {
      console.log("focus on summary")
      subjectRef.current.focus()
    }
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
        parent_issue_id,
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
              <Typography sx={{color: theme => theme.palette.mode === "light" ? "white" : theme.palette.primary.defaultText}} variant="subtitle">First, select a project</Typography>
              <TextField sx={{"& fieldset": {borderColor: theme => theme.palette.mode === "light" ? "" : "#444444"}}} select fullWidth label="Project" name="project_id" value={state.project_id} onChange={handleChange}>
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

  // for Kanban Project
  if (project && project.project_type.name === "Kanban") {
    return (
      <Box component="form" onSubmit={handleSubmit}>
        <DialogHeader>
          {parent_issue_id ? (
            <Typography sx={{color: theme => theme.palette.mode === "light" ? "#000" : theme.palette.primary.defaultText}} variant="h6">
              Create new subtask in: <strong>{state.project_id}</strong> for issue ID <strong>#{parent_issue_id}</strong>
            </Typography>
          ) : (
            <Typography sx={{color: theme => theme.palette.mode === "light" ? "#000" : theme.palette.primary.defaultText}} variant="h6">
              Create new task in: <strong>{state.project_id}</strong>
            </Typography>
          )}
        </DialogHeader>
        <DialogContent>
          <Typography variant="body2" display="block" sx={{ fontWeight: 500, color: theme => theme.palette.primary.defaultText }}>
            Summary*
          </Typography>
          <TextField sx={{ "& fieldset": {borderColor: theme => theme.palette.mode === "light" ? "" : "#444444"}}} fullWidth inputRef={subjectRef} placeholder="Start typing about the task..." value={state.name} onChange={handleChange} name="subject"></TextField>
          <Typography variant="body2" display="block" sx={{ mt: 3, mb: 1, fontWeight: 500, color: theme => theme.palette.primary.defaultText }}>
            Description
          </Typography>
          {showDescriptionField ? (
            <Editor
              placeholder="Add a more detailed description..."
              value={state.description}
              onChange={data => {
                setState(s => ({ ...s, description: data }))
              }}
              autoFocus
            />
          ) : (
            <Box
              sx={{ px: 2, py: 6.6, borderRadius: 1, bgcolor: theme => theme.palette.mode === "light" ? "#f6f9fb" : theme.palette.background.default, fontStyle: "italic", color: "#657289", cursor: "text", fontSize: "0.8rem" }}
              onClick={() => setShowDescriptionField(true)}>
              Add a more detailed description...
            </Box>
          )}

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" display="block" sx={{ mt: 2, mb: 0, color: theme => theme.palette.primary.defaultText }}>
                Start Date*
              </Typography>
              <TextField
                sx={{ "& fieldset": {borderColor: theme => theme.palette.mode === "light" ? "" : "#444444"}, "input[type='date']::-webkit-calendar-picker-indicator": {filter: theme => theme.palette.mode === "light" ? "" : "invert(1)",},}}
                type="date"
                value={state.start_date ? moment(state.start_date).format("YYYY-MM-DD") : ""}
                onChange={e => setState(x => ({ ...x, start_date: e.target.value }))}
                required
                fullWidth
                inputProps={{ min: moment().format("YYYY-MM-DD") }}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" display="block" sx={{ mt: 2, mb: 0, color: theme => theme.palette.primary.defaultText }}>
                Due Date*
              </Typography>
              <TextField
                sx={{ "& fieldset": {borderColor: theme => theme.palette.mode === "light" ? "" : "#444444"}, "input[type='date']::-webkit-calendar-picker-indicator": {filter: theme => theme.palette.mode === "light" ? "" : "invert(1)",},}}
                type="date"
                value={state.due_date ? moment(state.due_date).format("YYYY-MM-DD") : ""}
                onChange={e => setState(x => ({ ...x, due_date: e.target.value }))}
                fullWidth
                required
                inputProps={{ min: moment().format("YYYY-MM-DD") }}
              />
            </Grid>
          </Grid>
          <Typography variant="body2" display="block" sx={{ mt: 3, mb: 0, color: theme => theme.palette.primary.defaultText }}>
            Assignee
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <SelectWithIcon sx={{ ".MuiOutlinedInput-root": { borderRadius: 0.5 } }} name="assigned_to_id" value={state.assigned_to_id} onChange={handleChange} minwidth={250}>
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
            <Button onClick={handleAssign} variant="text" sx={{ ml: 2 }}>
              Assign to me
            </Button>
          </Box>
          <Box sx={{ mt: 2 }}>
            {showMoreOptions ? (
              <>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={1} sx={{ mb: 1 }}>
                  <Grid item lg={4}>
                    <Typography variant="body2" display="block" sx={{ color: theme => theme.palette.primary.defaultText }}>
                      Task type*
                    </Typography>
                    <SelectWithIcon required name="tracker_id" value={state.tracker_id} onChange={handleChange} minwidth={175}>
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
                    <SelectWithIcon required name="status_id" value={state.status_id} onChange={handleChange} minwidth={175}>
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
                    <SelectWithIcon required name="priority_id" value={state.priority_id} onChange={handleChange} minwidth={175}>
                      <MenuItem value="">--- Select ---</MenuItem>
                      {priorities?.map(({ name, id }) => (
                        <MenuItem key={id} value={id}>
                          {name}
                        </MenuItem>
                      ))}
                    </SelectWithIcon>
                  </Grid>
                </Grid>
              </>
            ) : (
              <Button onClick={() => setShowMoreOptions(true)} variant="text" sx={{ textDecoration: "underline", color: "#657289" }}>
                Show more options like: Task type, Status, Priority etc.
              </Button>
            )}
          </Box>
        </DialogContent>
        <DialogFooter>
          <LoadingButton loading={isLoading} type="submit" variant="contained" size="large" fullWidth>
            Create Task
          </LoadingButton>
        </DialogFooter>
      </Box>
    )
  }
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <DialogHeader>
        <Typography sx={{color: theme => theme.palette.mode === "light" ? "#000" : theme.palette.primary.defaultText}} variant="h6">
          Create new issue in: <strong>{state.project_id}</strong>
        </Typography>
      </DialogHeader>
      <DialogContent>
        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid item lg={4}>
            <Typography variant="body2" display="block" sx={{ color: theme => theme.palette.primary.defaultText }}>
              Issue type*
            </Typography>
            <SelectWithIcon required name="tracker_id" value={state.tracker_id} onChange={handleChange} minwidth={175}>
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
            <SelectWithIcon required name="status_id" value={state.status_id} onChange={handleChange} minwidth={175}>
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
            <SelectWithIcon required name="priority_id" value={state.priority_id} onChange={handleChange} minwidth={175}>
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
        <TextField sx={{ "& fieldset": {borderColor: theme => theme.palette.mode === "light" ? "" : "#444444"}}} fullWidth autoFocus placeholder="Start typing about the task..." value={state.name} onChange={handleChange} name="subject"></TextField>
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
          <SelectWithIcon sx={{ ".MuiOutlinedInput-root": { borderRadius: 0.5, borderColor: theme => theme.palette.mode === "light" ? "" : "#444444", } }} name="assigned_to_id" value={state.assigned_to_id} onChange={handleChange} minwidth={250}>
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
          <Button onClick={handleAssign} variant="text" sx={{ ml: 2 }}>
            Assign to me
          </Button>
        </Box>
        <Typography variant="body2" display="block" sx={{ mt: 2, mb: 0, color: theme => theme.palette.primary.defaultText }}>
          Epic
        </Typography>
        <SelectWithIcon name="category_id" value={state.category_id} onChange={handleChange} minwidth={250}>
          <MenuItem value="">--- Select ---</MenuItem>
          {epic?.map(({ name, id }) => (
            <MenuItem key={id} value={id}>
              {name}
            </MenuItem>
          ))}
        </SelectWithIcon>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" display="block" sx={{ mt: 2, mb: 0, color: theme => theme.palette.primary.defaultText }}>
              Start Date*
            </Typography>
            <TextField
              sx={{ "& fieldset": {borderColor: theme => theme.palette.mode === "light" ? "" : "#444444"}, "input[type='date']::-webkit-calendar-picker-indicator": {filter: theme => theme.palette.mode === "light" ? "" : "invert(1)",},}}
              type="date"
              value={moment(state.start_date).format("YYYY-MM-DD")}
              // onChange={e => setState(x => ({ ...x, start_date: moment(e.target.value) }))}
              onChange={e => setState(x => ({ ...x, start_date: e.target.value }))}
              required
              fullWidth
              inputProps={{ min: moment().format("YYYY-MM-DD") }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" display="block" sx={{ mt: 2, mb: 0, color: theme => theme.palette.primary.defaultText }}>
              Due Date*
            </Typography>
            <TextField
              sx={{ "& fieldset": {borderColor: theme => theme.palette.mode === "light" ? "" : "#444444"}, "input[type='date']::-webkit-calendar-picker-indicator": {filter: theme => theme.palette.mode === "light" ? "" : "invert(1)",},}}
              type="date"
              value={state.due_date ? moment(state.due_date).format("YYYY-MM-DD") : ""}
              // onChange={e => setState(x => ({ ...x, due_date: moment(e.target.value) }))}
              onChange={e => setState(x => ({ ...x, due_date: e.target.value }))}
              fullWidth
              required
              inputProps={{ min: moment().format("YYYY-MM-DD") }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogFooter>
        <LoadingButton loading={isLoading} type="submit" variant="contained" size="large" fullWidth>
          Create Issue
        </LoadingButton>
      </DialogFooter>
    </Box>
  )
}
