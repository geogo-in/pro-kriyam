import { Circle } from "@mui/icons-material"
import { LoadingButton } from "@mui/lab"
import { Box, DialogActions, DialogContent, Divider, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import { DEFAULT_ERROR_MSG, EPIC_COLORS } from "config/constants"
import { useSnackbar } from "notistack"
import CustomDialogTitle from "pages/shared/CustomDialogTitle"
import { useEffect, useState } from "react"
import { useCreateEpicMutation, useUpdateEpicMutation } from "@redux/services/issueApi"

export default function CreateEpic({ onClose, project_id, update, epic_id, name, color_code }) {
  const [createEpic, { isLoading }] = useCreateEpicMutation()
  const [updateEpic, { isLoading: isUpdating }] = useUpdateEpicMutation()
  const [state, setState] = useState({ name: "", color_code: "" })
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    setState(s => ({ ...s, name, color_code }))
  }, [update, name, color_code])
  const handleChange = e => {
    setState({ ...state, [e.target.name]: e.target.value })
  }
  const handleSubmit = async e => {
    try {
      e.preventDefault()
      if (update) await updateEpic({ epic_id, ...state }).unwrap()
      else await createEpic({ project_id, ...state }).unwrap()
      onClose()
    } catch (r) {
      console.error(r)
      enqueueSnackbar(r.data?.message || DEFAULT_ERROR_MSG)
    }
  }
  return (
    <Box component={"form"} maxWidth={300} onSubmit={handleSubmit}>
      {!update && (
        <>
          <CustomDialogTitle onClose={onClose}>Create EPIC</CustomDialogTitle>
          <Divider />
        </>
      )}
      <DialogContent sx={{ maxWidth: 490 }}>
        <Typography color="text.secondary" variant="caption" component="p">
          Color
        </Typography>
        <ToggleButtonGroup
          sx={{ flexWrap: "wrap" }}
          value={state.color_code}
          onChange={(e, color_code) => {
            setState({ ...state, color_code })
          }}
          exclusive>
          {EPIC_COLORS.map(color => (
            <ToggleButton key={color} disabled={isLoading || isUpdating} value={color} size="small" sx={{ border: "none", borderRadius: "50%!important" }} name="color_code">
              <Circle sx={{ color }} />
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Typography color="text.secondary" variant="caption" component="p">
          EPIC name*
        </Typography>
        <TextField disabled={isLoading || isUpdating} fullWidth name="name" margin="none" placeholder="Enter epic name" required value={state.name} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <LoadingButton variant="contained" type="submit" loading={isLoading || isUpdating}>
          {update ? "Update" : "Create"}
        </LoadingButton>
      </DialogActions>
    </Box>
  )
}
