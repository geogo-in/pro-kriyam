import { LoadingButton } from "@mui/lab";
import { Box, ListItemText, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { SleekSelectWithIcon } from "pages/shared/CustomTextField";
import { DialogContent, DialogHeader } from "pages/shared/StyledDialog";
import { useState } from "react";

export default function EditTracker({ onClose, trackerInfo, issueStatuses }) {
  
  const [ tracker, setTracker ] = useState({
    name: trackerInfo?.name || "",
    description: trackerInfo?.description || "",
    default_status: trackerInfo?.default_status || {},
  })
  
  const handleChange = event => {

    if(event.target.name === "default_status"){
      const selectedStatus = issueStatuses.find(item => item.id === event.target.value)
      setTracker({ ...tracker, default_status: { id: selectedStatus?.id, name: selectedStatus?.name } })
      return
    }
    setTracker({ ...tracker, [event.target.name]: event.target.value })
  }
  
  const params = { fullWidth: true, onChange: handleChange, variant: "outlined", margin: "dense", style: { minWidth: 300 } }
  return (
    <Box>
      <DialogHeader>
        <Typography variant="h6">{trackerInfo === "add_tracker" ? "Add Tracker" : "Edit tracker"}</Typography>
      </DialogHeader>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }} >
          <TextField
            sx={{"& fieldset": {borderColor: theme => theme.palette.mode === "light" ? "" : "#444444"}}}
            label="Name"
            value={tracker?.name}
            name="name"
            {...params}
          />
          <TextField
            sx={{"& fieldset": {borderColor: theme => theme.palette.mode === "light" ? "" : "#444444"}}}
            label="Description"
            value={tracker?.description}
            name="description"
            {...params}
          />
          <SleekSelectWithIcon
            sx={{ mt: 1, background: theme => theme.palette.mode === "light" ? "" : theme.palette.background.modal, ".MuiSelect-select": { padding: "10px 14px 10px 14px !important" }, "& fieldset": {borderColor: theme => theme.palette.mode === "light" ? "" : "#444444" }}}
            value={tracker?.default_status.id}
            label="Default Status"
            name="default_status"
            {...params}>
            {issueStatuses?.map(item => (
              <MenuItem key={item.id} value={item.id}>
                <ListItemText>{item.name}</ListItemText>
              </MenuItem>
            ))}
          </SleekSelectWithIcon>
        </Box>
        <Stack py={2} alignItems={`flex-start`}>
          <LoadingButton type="submit" variant="contained" sx={{ borderRadius: "4px" }}>
          {/* <LoadingButton loading={isLoading} type="submit" variant="contained" sx={{ borderRadius: "4px" }}> */}
            Save
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Box>
  )
}