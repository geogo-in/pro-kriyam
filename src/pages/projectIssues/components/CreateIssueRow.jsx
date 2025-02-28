import { Add, Clear } from "@mui/icons-material"
import { Box, Button, CircularProgress, IconButton, InputBase, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Stack, Tooltip } from "@mui/material"
import { useCreateIssuesMutation, useGetIssuePriorityQuery, useGetIssueTypeQuery } from "@redux/services/issueApi"
import { useGetProjectByIdQuery } from "@redux/services/projectApi"
import IssueTypeIcon from "pages/shared/IssueTypeIcon"
import { useEffect, useState } from "react"

import { styled } from "@mui/material"

export const StickyContainer = styled(Box)(({ theme }) => ({
  position: "relative",
}))
export const FormPaper = styled(Paper)(({ theme }) => ({
  maxWidth: "100%",
  borderRadius: "4px",
  marginBottom: 3,
  boxShadow: "none",
  border: "1px solid #DFDFDF",
}))

const SmallButton = styled(Button)(({ theme }) => ({
  background: "#0069FF",
  borderRadius: 20,
  border: "1px solid #0069FF",
  color: "#FFF",
  lineHeight: 2.0,
  padding: "0px 12px",
  marginLeft: 4,
  "&:hover": {
    background: "#0069FF",
    opacity: 0.9,
  },
}))
export default function CreateIssueRow({ isEditable, sprint_id, parent_issue_id, project_id, parent_issue_priority, category_id }) {
  const [editable, setEditable] = useState(false)
  const [createTask, { isLoading }] = useCreateIssuesMutation()
  const { data: trackers } = useGetIssueTypeQuery()
  const [state, setState] = useState({ subject: "", tracker_id: "", tracker_name: "" })
  const [anchorEl, setAnchorEl] = useState()
  const { data: project } = useGetProjectByIdQuery(project_id)
  const { data: priorities } = useGetIssuePriorityQuery()

  useEffect(() => {
    setEditable(isEditable)
  }, [isEditable])

  useEffect(() => {
    const tracker = trackers?.[0]
    if (tracker) setState(s => ({ ...s, tracker_id: tracker.id, tracker_name: tracker.name }))
  }, [trackers])

  const handleEditable = () => {
    setEditable(!editable)
    setState({ ...state, subject: "" })
  }
  const handleChange = e => {
    setState({ ...state, [e.target.name]: e.target.value })
  }
  const handleCreateIssue = async () => {
    try {
      await createTask({
        project_id,
        parent_issue_id,
        priority_id: parent_issue_priority.id,
        category_id,
        sprint_id: sprint_id !== "backlog" ? sprint_id : undefined,
        subject: state.subject,
        tracker_id: state.tracker_id,
        priority_id: priorities.find(p => p.name.toLowerCase() === "normal")?.id,
      }).unwrap()
      handleEditable()
    } catch (r) {
      console.error(r)
    }
  }
  const handleKeyDown = e => {
    e.stopPropagation()
    if (e.keyCode === 27) handleEditable()
    else if (e.keyCode === 13 && e.target.value !== "") handleCreateIssue()
  }
  const handleTrackerMenu = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleIssueType = item => () => {
    setState({ ...state, tracker_id: item.id, tracker_name: item.name })
    setAnchorEl()
  }
  return (
    <Stack direction="row" alignItems="end" py={0}>
      <Stack direction="row">
        <StickyContainer>
          {editable ? (
            <>
              <FormPaper sx={{ display: "flex", width: `calc( 545px )` }}>
                <Box minWidth={10} sx={{ marginLeft: 1, marginRight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Tooltip title={state.tracker_name}>
                    <IconButton size="small" sx={{ alignSelf: "center" }} onClick={handleTrackerMenu}>
                      <IssueTypeIcon type_name={state.tracker_name} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => {
                    setAnchorEl()
                  }}>
                  {project?.tracker?.map(item => (
                    <MenuItem key={item.id} onClick={handleIssueType(item)}>
                      <ListItemIcon>
                        <IssueTypeIcon type_name={item.name} />
                      </ListItemIcon>
                      <ListItemText>{item.name}</ListItemText>
                    </MenuItem>
                  ))}
                </Menu>
                <InputBase
                  disabled={isLoading}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  placeholder="Start typing about the task ..."
                  sx={{ p: 0.5, width: 1, color: theme => theme.palette.primary.defaultText }}
                  value={state.subject}
                  name="subject"
                  onChange={handleChange}
                />
                <Box sx={{ position: "absolute", right: 0, padding: "3.5px 6px", width: 130, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                  {isLoading ? (
                    <Box sx={{ padding: "5px 0" }}>
                      <CircularProgress size={20} />
                    </Box>
                  ) : (
                    <>
                      <SmallButton variant="outlined" onClick={handleCreateIssue} loading={isLoading}>
                        Save
                      </SmallButton>
                      <IconButton size="small" onClick={handleEditable} sx={{ color: "#8d97a8", background: "#f7f7f9" }}>
                        <Clear />
                      </IconButton>
                    </>
                  )}
                </Box>
              </FormPaper>
            </>
          ) : (
            <Button onClick={handleEditable} sx={{ mt: 0.5, mb: "4.5px", justifyContent: "flex-start", position: "sticky", color: "#54637C" }} startIcon={<Add />}>
              Add new subtask
            </Button>
          )}
        </StickyContainer>
      </Stack>
    </Stack>
  )
}
