import { Add, Clear } from "@mui/icons-material"
import { Box, Button, CircularProgress, IconButton, InputBase, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Stack, Tooltip } from "@mui/material"
import IssueTypeIcon from "pages/shared/IssueTypeIcon"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useCreateIssueFromSprintMutation, useGetIssueTypeQuery } from "@redux/services/issueApi"
import { useGetProjectByIdQuery } from "@redux/services/projectApi"

import { styled } from "@mui/material"

export const StickyContainer = styled(Box)(({ theme }) => ({
  // width: "900px",
  position: "sticky",
  left: 0,
}))
export const FormPaper = styled(Paper)(({ theme }) => ({
  maxWidth: "100%",
  borderRadius: 0,
  marginBottom: 4,
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
    // borderColor: "#007FFF",
    background: "#0069FF",
    opacity: 0.9,
  },
}))
export default function SprintCreateIssue({ sprint_id, parent_issue_id, project_id, category_id, epicContainerWidth }) {
  const [editable, setEditable] = useState(false)
  const [createTask, { isLoading }] = useCreateIssueFromSprintMutation()
  const { data: trackers } = useGetIssueTypeQuery()
  const [state, setState] = useState({ subject: "", tracker_id: "", tracker_name: "" })
  const [anchorEl, setAnchorEl] = useState()
  const backlogContainerWidth = useSelector(state => state.projectUi.backlogContainerWidth)
  const backlogTableWidth = useSelector(state => state.projectUi.backlogTableWidth)
  const { data: project } = useGetProjectByIdQuery(project_id)

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
        category_id,
        sprint_id: sprint_id !== "backlog" ? sprint_id : undefined,
        subject: state.subject,
        tracker_id: state.tracker_id,
      }).unwrap()
      handleEditable()
    } catch (r) {
      console.error(r)
    }
  }
  const handleEnter = e => {
    if (e.keyCode === 13 && e.target.value !== "") handleCreateIssue()
  }
  const handleTrackerMenu = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleIssueType = item => () => {
    setState({ ...state, tracker_id: item.id, tracker_name: item.name })
    setAnchorEl()
  }

  let actionbarWidth = backlogContainerWidth
  let dummybarWidth = backlogTableWidth > backlogContainerWidth ? backlogTableWidth - backlogContainerWidth + 1 : 0

  return (
    <Stack direction="row" alignItems="end" py={0}>
      <Stack direction="row">
        <StickyContainer>
          {editable ? (
            <>
              <FormPaper sx={{ display: "flex", width: parent_issue_id ? 1 : `calc( ${actionbarWidth}px )` }}>
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
                  onKeyDown={handleEnter}
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
            <Button onClick={handleEditable} sx={{ my: 0.5, justifyContent: "flex-start", position: "sticky", color: "#54637C" }} startIcon={<Add />}>
              New issue
            </Button>
          )}
        </StickyContainer>
        <Box sx={{ width: dummybarWidth }}></Box>
      </Stack>
    </Stack>
  )
}
