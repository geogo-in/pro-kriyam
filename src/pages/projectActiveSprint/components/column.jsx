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

const Column = ({ column, project_id }) => {
  const [open, setOpen] = useState()
  const handleNewIssue = () => {
    setOpen(!open)
  }

  return (
    <Box elevation={0} sx={{ borderRadius: "4px", ml: 0, mr: 2, mb: 0.5, width: "285px", overflowX: "hidden" }}>
      <Stack direction="row" alignItems="center" spacing={1} px={1.5} py={0.5} sx={{ bgcolor: "rgba(228,238,245, 0.6)", border: "1px solid #E4EEF5", mb: 1 }}>
        <Typography variant="h6" sx={{ fontSize: "0.95rem", color: theme => theme.palette.primary.defaultText }}>
          {column.title}
        </Typography>
        <NumberChip label={column.list.length} sx={{ fontSize: "0.8rem", color: theme => theme.palette.primary.tertiaryText }} />

        <Box flex={1} />
        <IconButton size="small" onClick={handleNewIssue}>
          <AddIcon />
        </IconButton>
      </Stack>
      <StrictModeDroppable droppableId={column.id}>
        {provided => (
          <List
            ref={provided.innerRef}
            sx={{ border: "1px solid #f1f5f9", minHeight: "calc( 100vh - 270px )", height: "calc(100% - 60px)", background: "#f7fafc", px: 1, pt: 0, overflowY: "hidden" }}>
            {column.list.map((itemObject, index) => (
              <ListItemCustom index={index} key={index} itemObject={itemObject} project_id={project_id} />
            ))}
            {provided.placeholder}
          </List>
        )}
      </StrictModeDroppable>
      <CustomDialog back open={open} onClose={handleNewIssue}>
        <CreateIssue onClose={handleNewIssue} project_id={project_id} status_id={column.id} />
      </CustomDialog>
    </Box>
  )
}

export default Column
