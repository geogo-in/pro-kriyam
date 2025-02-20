import { Circle } from "@mui/icons-material"
import { LoadingButton } from "@mui/lab"
import { Checkbox, FormControlLabel, ListItemIcon, ListItemText, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material"
import { ISSUE_STATUS_COLORS } from "config/constants"
import { useSnackbar } from "notistack"
import { SelectWithIcon } from "pages/shared/CustomTextField"
import { useState } from "react"
import { useCreateProjectIssueStatusMutation } from "@redux/services/issueApi"

const initialState = { name: "", is_closed: false, color_code: ISSUE_STATUS_COLORS[0] }
export default function ProjectIssueStatusCreate({ project_id }) {
  const [createProjectIssueStatus, { isLoading: isCreating }] = useCreateProjectIssueStatusMutation()
  const [state, setState] = useState(initialState)
  const { enqueueSnackbar } = useSnackbar()

  const handleChange = e => {
    setState({ ...state, [e.target.name]: e.target.value })
  }
  const handleSubmit = async e => {
    try {
      e.preventDefault()
      await createProjectIssueStatus({ project_id, ...state }).unwrap()
      setState(initialState)
    } catch (error) {
      console.error(error)
      enqueueSnackbar(error.data?.message, { variant: "error" })
    }
  }
  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ p: 2, mb: 1 }}>
      <Typography variant="body2" sx={{ color: theme => theme.palette.mode === "light" ? "primary.defaultText" : theme.palette.primary.secondaryText, mb: 1 }}>
        Unable to find the issue status that you are looking for this project?
      </Typography>
      <Typography variant="h5" sx={{ color: "primary.defaultText", fontSize: "0.95rem", fontWeight: 500, mb: 1 }}>
        Create a new issue status
      </Typography>
      <TextField
        fullWidth
        inputProps={{ autoCapitalize: "words" }}
        required
        type="text"
        size="small"
        placeholder="Enter status name"
        name="name"
        onChange={handleChange}
        value={state.name}
        sx={{ mb: 1 }}
      />
      <SelectWithIcon margin="none" variant="outlined" required value={state.color_code} onChange={handleChange} name="color_code" sx={{ width: "100%" }}>
        {ISSUE_STATUS_COLORS.map(color => (
          <MenuItem key={color} value={color}>
            <ListItemIcon sx={{ color }}>
              <Circle sx={{ color }} />
            </ListItemIcon>

            <ListItemText>{color}</ListItemText>
          </MenuItem>
        ))}
      </SelectWithIcon>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" pb={1} mt={1}>
        <FormControlLabel
          control={
            <Checkbox
              value={state.is_closed}
              onChange={e => {
                setState({ ...state, is_closed: e.target.checked })
              }}
            />
          }
          sx={{color: theme => theme.palette.mode === "light" ? "" : theme.palette.primary.secondaryText}}
          label="Mark issues in this status as closed"
        />
      </Stack>

      <LoadingButton variant="contained" fullWidth loading={isCreating} type="submit">
        Submit
      </LoadingButton>
    </Paper>
  )
}
