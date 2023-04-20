import { Circle, DoneOutline as DoneIcon } from "@mui/icons-material"
import { Box, Button, Card, Dialog, List, Menu, MenuItem, Stack, Typography } from "@mui/material"
import { ISSUE_STATUS_COLORS } from "config/constants"
import { useSnackbar } from "notistack"
import { useState } from "react"
import { Draggable, Droppable } from "react-beautiful-dnd"
import { useUpdateProjectIssueStatusMutation } from "@redux/services/issueApi"
import { getErrorMessage } from "utils/helper"
import IssueStatusRemove from "./IssueStatusRemove"
import ProjectIssueStatusCreate from "./ProjectIssueStatusCreate"

const IssueStatusColumn = ({ id, column, project_id }) => {
  return (
    <Box elevation={0} sx={{ borderRadius: "4px", mt: 1.5, ml: 0, mr: 2, mb: 0.5, width: "285px", overflowX: "hidden" }}>
      <Stack direction="row" alignItems="center" spacing={1} px={1.5} py={1} sx={{ bgcolor: "rgba(228,238,245, 0.6)", border: "1px solid #E4EEF5", mb: 0 }}>
        <Typography variant="h6" sx={{ fontSize: "0.95rem", color: theme => theme.palette.primary.defaultText }}>
          {id === "project" ? "Active for this project" : "Other available statues"}
        </Typography>
      </Stack>
      <Droppable droppableId={id} isDropDisabled={id === "master"}>
        {provided => (
          <List ref={provided.innerRef} sx={{ border: "1px solid #f1f5f9", minHeight: "500px", background: "#f7fafc", px: 1, pt: 0 }}>
            {column.map((status, index) => (
              <Box my={0} key={`${status.id}`}>
                <Draggable draggableId={`${status.id}`} index={index}>
                  {provided => <StatusCard {...{ status, id, column, project_id, provided }} />}
                </Draggable>
              </Box>
            ))}
            {provided.placeholder}
            {id === "project" && <ProjectIssueStatusCreate project_id={project_id} />}
          </List>
        )}
      </Droppable>
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
  return (
    <>
      <Card
        sx={{ my: 1, py: 1.5, px: 2, borderRadius: 0.5, boxShadow: "1px 1px 8px -5px #00000080", background: status.color_code }}
        key={`${status.id}`}
        role={undefined}
        component="li"
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5" sx={{ color: "primary.defaultText", fontSize: "0.95rem", fontWeight: 500, mb: 1 }}>
            {status.name}
          </Typography>
          {status.is_closed && <DoneIcon sx={{ color: "green", height: 18, width: 18, ml: 1 }} />}
        </Box>
        {id !== "master" && (
          <Box sx={{ borderTop: "1px dashed rgba(117,117,117,0.3)", display: "flex", mt: 1, pt: 0.5, justifyContent: "space-between" }}>
            <Box display="flex" alignItems="center">
              <Button onClick={handleColorMenu} size="small" sx={{ padding: "0px", color: theme => theme.palette.primary.secondaryText }}>
                Change color
              </Button>
            </Box>
            {id !== "master" && (
              <>
                {status.name !== "New" && status.name !== "In Progress" && status.name !== "Done" && (
                  <Button
                    disabled={column.filter(c => c.is_closed).length < 2 && status.is_closed}
                    onClick={handleOpen}
                    sx={{ padding: "0px", color: theme => theme.palette.primary.secondaryText }}>
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
