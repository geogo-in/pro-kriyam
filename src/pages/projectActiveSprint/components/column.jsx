import AddIcon from "@mui/icons-material/Add"
import { IconButton, List, Stack, Typography } from "@mui/material"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import { styled } from "@mui/system"
import CreateIssue from "pages/projectIssues/components/CreateIssue"
import CustomDialog from "pages/shared/CustomDialog"
import { StrictModeDroppable } from "pages/shared/StrictModeDroppable"
import { useState } from "react"
import ListItemCustom from "./ListItemComponent"

export const NumberChip = styled(Chip)(({ theme }) => ({
  height: 24,
  background: "white",
  border: "1px solid #f1f5f9",
  "& span": {
    paddingLeft: 8,
    paddingRight: 8,
  },
}))

const Column = ({ column, project_id, sprint_id }) => {
  const [open, setOpen] = useState()
  const handleNewIssue = () => {
    setOpen(!open)
  }

  return (
    <Box elevation={0} sx={{ borderRadius: "8px", ml: 0, mr: 2, mb: 0.5, width: "285px", overflowX: "hidden" }}>
      <Stack direction="row" alignItems="center" spacing={1} px={1.5} py={0.5} sx={{ bgcolor: theme =>  theme.palette.mode === "light" ? "rgba(228,238,245, 0.6)" : theme.palette.background.modal, border: theme => theme.palette.mode === "light" ? "1px solid #E4EEF5" : "", mb: 1, boxShadow: theme => theme.palette.mode === "light" ? "" : "var(--customShadows-card)", transitionProperty: "box-shadow, background, border", transitionDuration: "300ms", transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)", transitionDelay: "0s", }}>
        <Typography variant="h6" sx={{ fontSize: "0.95rem", color: theme => theme.palette.mode === "light" ? theme.palette.primary.defaultText : theme.palette.primary.secondaryText}}>
          {column.title}
        </Typography>
        <NumberChip label={column.list.length} sx={{ border: theme => theme.palette.mode === "light" ? `1px solid rgba(229,231,235, 1)` : "1px solid #5E5E5E", fontSize: "0.8rem", backgroundColor: theme => theme.palette.mode === "light" ? "" : theme.palette.background.modal , color: theme => theme.palette.mode === "light" ? theme.palette.primary.tertiaryText : theme.palette.primary.secondaryText }} />

        <Box flex={1} />
        <IconButton size="small" onClick={handleNewIssue}>
          <AddIcon />
        </IconButton>
      </Stack>
      <StrictModeDroppable droppableId={column.id}>
        {provided => (
          <List
            ref={provided.innerRef}
            sx={{ padding: "20px 0", borderRadius: "0 0 8px 8px", border: theme => theme.palette.mode === "light" ? "1px solid #f1f5f9" : "", minHeight: "calc( 100vh - 270px )", height: "calc(100% - 60px)", background: theme => theme.palette.mode === "light" ? "#f7fafc" : theme.palette.background.modal, px: 1, pt: 0, overflowY: "hidden", boxShadow: theme => theme.palette.mode === "light" ? "" : "var(--customShadows-card)", transitionProperty: "box-shadow, background, border", transitionDuration: "300ms", transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)", transitionDelay: "0s" }}>
            {column.list.map((itemObject, index) => (
              <ListItemCustom index={index} key={index} itemObject={itemObject} project_id={project_id} />
            ))}
            {provided.placeholder}
          </List>
        )}
      </StrictModeDroppable>
      <CustomDialog back open={open} onClose={handleNewIssue}>
        <CreateIssue onClose={handleNewIssue} project_id={project_id} status_id={column.id} sprint_id={sprint_id} />
      </CustomDialog>
    </Box>
  )
}

export default Column
