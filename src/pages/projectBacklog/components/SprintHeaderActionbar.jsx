import { Close, Delete, Edit } from "@mui/icons-material"
import CloseIcon from "@mui/icons-material/CloseOutlined"
import EditIcon from "@mui/icons-material/EditOutlined"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import StartIcon from "@mui/icons-material/FlagOutlined"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import { Box, Dialog, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Typography, styled } from "@mui/material"
import { useGetProjectByIdQuery } from "@redux/services/projectApi"
import PrimaryRoundButton from "pages/shared/PrimaryRoundButton"
import { useState } from "react"
import { useSelector } from "react-redux"
import CreateSprint from "./CreateSprint"
import SprintClose from "./SprintClose"
import SprintDetails from "./SprintDetails"

const SimpleDiv = styled(Box)(({ theme }) => ({
  left: 0,
  position: "sticky",
  overflow: "hidden",
  zIndex: 1200,
}))

export default function SprintHeaderActionbar({ project_id, activeSprint, epicContainerWidth, ...sprint }) {
  const { name, id: sprint_id, aasm_state } = sprint
  const { data: project } = useGetProjectByIdQuery(project_id)
  const [anchorEl, setAnchorEl] = useState()
  const [sprintDialog, setSprintDialog] = useState()

  const backlogContainerWidth = useSelector(state => state.projectUi.backlogContainerWidth)
  const backlogTableWidth = useSelector(state => state.projectUi.backlogTableWidth)

  const handleSprintOption = e => {
    setAnchorEl(e.target)
  }
  const handleClose = () => {
    setAnchorEl()
  }
  const handleSprintMenu = e => async event => {
    switch (e) {
      case "Edit Sprint":
      case "Close Sprint":
      case "Start Sprint": {
        setSprintDialog({ type: e, project_id, sprint_id, ...sprint })
        handleClose()
        return
      }
      case "Delete Sprint": {
        if (!window.confirm("Are you sure? You want to delete this sprint.")) return
      }

      default:
        break
    }
  }
  const SPRINT_MENU_ITEM = [
    { title: "Close Sprint", icon: <CloseIcon />, hide: aasm_state !== "running", message: "Can be planned but not started until the completion of above active sprint" },
    { title: "Edit Sprint", icon: <EditIcon /> },
    { title: "Delete Sprint", icon: <DeleteIcon />, hide: aasm_state === "running" },
  ]
  let actionbarWidth = backlogContainerWidth
  let dummybarWidth = backlogTableWidth > backlogContainerWidth ? backlogTableWidth - backlogContainerWidth + 1 : 0 //containerWidth === 0 ? actionbarWidth / 2 : containerWidth - actionbarWidth + 6

  const handleDialogClose = () => {
    setSprintDialog()
  }

  return (
    <>
      <Stack direction="row" alignItems="end" py={0}>
        <Stack direction="row">
          <SimpleDiv sx={{ width: `calc( ${actionbarWidth}px )` }}>
            <Box sx={{ alignItems: "center", display: "flex", marginTop: "0px", marginBottom: 1 }}>
              <Typography variant="h6" sx={{ fontSize: "1.09rem" }}>
                {name}
              </Typography>
              <Typography variant="body2" sx={{ padding: "0 10px", color: "#54637c", flexGrow: 1 }}>
                {sprint.issues.length} issues
              </Typography>

              {project?.project_type?.id === 1 && sprint_id !== "backlog" && (
                <>
                  {aasm_state !== "running" && (
                    <PrimaryRoundButton
                      id="demo-customized-button"
                      variant="contained"
                      disableElevation
                      disabled={Boolean(activeSprint) || aasm_state !== "planned"}
                      onClick={handleSprintMenu("Start Sprint")}
                      sx={{ padding: "4px 18px" }}
                      startIcon={<StartIcon />}>
                      Start Sprint
                    </PrimaryRoundButton>
                  )}
                  <IconButton size="small" onClick={handleSprintOption} sx={{ background: "#f1f5f9", ml: 1, mr: 1, p: 0.8 }}>
                    <MoreHorizIcon />
                  </IconButton>
                  <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose}>
                    {SPRINT_MENU_ITEM.map(({ title, icon, message, disabled, hide }) => {
                      if (hide) return ""
                      return (
                        <MenuItem key={title} value={title} onClick={handleSprintMenu(title)} disabled={disabled}>
                          <ListItemIcon>{icon}</ListItemIcon>
                          <ListItemText>{title}</ListItemText>
                        </MenuItem>
                      )
                    })}
                  </Menu>
                </>
              )}
              {project?.project_type?.id === 1 && sprint_id === "backlog" && (
                <>
                  <CreateSprint project={project} />
                  {/* <IconButton size="small" onClick={handleSprintOption} sx={{ background: "#f1f5f9", ml: 1, mr: 1, p: 0.8 }}>
                    <MoreHorizIcon />
                  </IconButton> */}
                </>
              )}
            </Box>
          </SimpleDiv>
          <Box sx={{ width: dummybarWidth }}></Box>
        </Stack>
      </Stack>

      <Dialog open={!!sprintDialog} onClose={handleDialogClose}>
        {["Start Sprint", "Edit Sprint"].includes(sprintDialog?.type) ? (
          <SprintDetails editable {...sprintDialog} onClose={handleDialogClose} />
        ) : sprintDialog?.type === "Close Sprint" ? (
          <SprintClose {...sprintDialog} onClose={handleDialogClose} />
        ) : null}
      </Dialog>
    </>
  )
}
