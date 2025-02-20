import { Circle, DoneOutline as DoneIcon } from "@mui/icons-material"
import { Box, Button, Card, Dialog, List, Menu, MenuItem, Stack, Typography } from "@mui/material"
import { useUpdateProjectIssueStatusMutation } from "@redux/services/issueApi"
import { ISSUE_STATUS_COLORS } from "config/constants"
import { useSnackbar } from "notistack"
import { StrictModeDroppable } from "pages/shared/StrictModeDroppable"
import { useState } from "react"
import { Draggable } from "react-beautiful-dnd"
import { getErrorMessage } from "utils/helper"
import IssueStatusRemove from "./IssueStatusRemove"
import ProjectIssueStatusCreate from "./ProjectIssueStatusCreate"

const IssueStatusColumn = ({ id, column, project_id }) => {
  return (
    <Box elevation={0} sx={{ borderRadius: "8px", mt: 1.5, ml: 0, mr: 2, mb: 0.5, width: "285px", overflowX: "hidden" }}>
      <Stack direction="row" alignItems="center" spacing={1} px={1.5} py={1} sx={{ borderBottom: theme => theme.palette.mode === "light" ? "" : "1px solid #292929", bgcolor: theme =>  theme.palette.mode === "light" ? "rgba(228,238,245, 0.6)" : "#141A21", border: theme => theme.palette.mode === "light" ? "1px solid #E4EEF5" : "", mb: 0, boxShadow: "var(--customShadows-card)", transitionProperty: "box-shadow, background, border", transitionDuration: "300ms", transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)", transitionDelay: "0s", }}>
        <Typography variant="h6" sx={{ fontSize: "0.95rem", color: theme => theme.palette.primary.defaultText }}>
          {id === "project" ? "Active for this project" : "Other available statues"}
        </Typography>
      </Stack>
      <StrictModeDroppable droppableId={id} isDropDisabled={id === "master"}>
        {provided => (
          <List ref={provided.innerRef} sx={{ borderRadius: "0 0 8px 8px", border: theme => theme.palette.mode === "light" ? "1px solid #f1f5f9" : "", minHeight: "500px", background: theme => theme.palette.mode === "light" ? "#f7fafc" : "#141A21", px: 1, pt: 0, boxShadow: "var(--customShadows-card)", transitionProperty: "box-shadow, background, border", transitionDuration: "300ms", transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)", transitionDelay: "0s" }}>
            {column.map((status, index) => (
              <Box my={0} py={1} key={status.id}>
                <Draggable draggableId={`${status.id}`} key={`${status.id}`} index={index}>
                  {provided => <StatusCard {...{ status, id, column, project_id, provided }} />}
                </Draggable>
              </Box>
            ))}
            {provided.placeholder}
            {id === "project" && <ProjectIssueStatusCreate project_id={project_id} />}
          </List>
        )}
      </StrictModeDroppable>
    </Box>
  )
}

export default IssueStatusColumn

function StatusCard({ status, id, column, project_id, provided }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [open, setOpen] = useState(false)
  const [updateProjectIssueStatus] = useUpdateProjectIssueStatusMutation()
  const { enqueueSnackbar } = useSnackbar()

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    setAnchorEl(null)
  }

  const handleColorMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleColorUpdate = color_code => async () => {
    try {
      await updateProjectIssueStatus({ project_id, status_id: status.id, color_code }).unwrap()
      handleClose()
    } catch (error) {
      const { message } = getErrorMessage(error)
      enqueueSnackbar(message, { variant: "error" })
    }
  }
  console.log(status.color_code)
  return (
    <>
      <Card
        sx={{ my: 1, py: 1.5, px: 2, borderRadius: 0.5, boxShadow: "1px 1px 8px -5px #00000080", background: theme => status.color_code !== undefined ? status.color_code : theme.palette.mode === "light" ? "white" : "#27303B" }}
        key={`${status.id}`}
        role={undefined}
        component="li"
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5" sx={{ color: theme => theme.palette.mode === "light" ? theme.palette.primary.defaultText : status.color_code === undefined ? "white" : "#444444", fontSize: "0.95rem", fontWeight: 500, mb: 1 }}>
            {status.name}
          </Typography>
          {status.is_closed && <DoneIcon sx={{ color: "green", height: 18, width: 18, ml: 1 }} />}
        </Box>
        {id !== "master" && (
          <Box sx={{ borderTop: "1px dashed rgba(117,117,117,0.3)", display: "flex", mt: 1, pt: 0.5, justifyContent: "space-between" }}>
            <Box display="flex" alignItems="center">
              <Button onClick={handleColorMenu} size="small" sx={{ padding: "0px", color: theme => theme.palette.mode === "light" ? theme.palette.primary.secondaryText : "#5E5E5E" }}>
                Change color
              </Button>
            </Box>
            {id !== "master" && (
              <>
                {status.name !== "New" && status.name !== "In Progress" && status.name !== "Done" && (
                  <Button
                    disabled={column.filter(c => c.is_closed).length < 2 && status.is_closed}
                    onClick={handleOpen}
                    sx={{ padding: "0px", color: theme => theme.palette.mode === "light" ? theme.palette.primary.secondaryText : "#727272" }}>
                    Remove
                  </Button>
                )}

                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                  {ISSUE_STATUS_COLORS.map(color => (
                    <MenuItem key={color} value={color} onClick={handleColorUpdate(color)}>
                      <Circle sx={{ color }} />
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>
        )}
      </Card>
      <Dialog open={Boolean(open)} onClose={handleClose}>
        <IssueStatusRemove status_id={status.id} status_name={status.name} onClose={handleClose} project_id={project_id} />
      </Dialog>
    </>
  )
}
