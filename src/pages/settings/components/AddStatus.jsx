import { LoadingButton } from '@mui/lab'
import { Box, Checkbox, FormControlLabel, FormGroup, Stack, TextField, Typography } from "@mui/material"
import { DialogContent, DialogHeader } from "pages/shared/StyledDialog"
import { useState } from "react"

export default function AddStatus({ onClose }) {

  const [ status, setStatus ] = useState({
    name: "",
    is_closed: "",
  })

  const handleChange = event => {
    setStatus({ ...status, [event.target.name]: event.target.value })
  }

  const handleChecked = event => {
    setStatus({ ...status, [event.target.name]: event.target.checked })
  }

  const params = { fullWidth: true, onChange: handleChange, variant: "outlined", margin: "dense", style: { minWidth: 300 } }
  return (
    <Box>
      <DialogHeader>
        <Typography variant="h6">Add new status</Typography>
      </DialogHeader>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }} >
          <TextField
            sx={{"& fieldset": {borderColor: theme => theme.palette.mode === "light" ? "" : "#444444"}}}
            label="Name"
            value={status?.name}
            name="name"
            {...params}
          />
          <FormGroup>
            <FormControlLabel
              sx={{color: theme => theme.palette.mode === "light" ? "" : theme.palette.primary.secondaryText}}
              control={<Checkbox name="is_closed" checked={status.is_closed} onChange={handleChecked} />}
              label="Set as closed state by default"
            />
          </FormGroup>
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