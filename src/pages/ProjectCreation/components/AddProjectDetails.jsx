import { Box, TextField, Typography } from "@mui/material"
import { memo } from "react"
import { convertToSlug } from "utils/formatString"

const AddProjectDetails = ({ state, setState }) => {
  const handleNameChange = e => {
    setState({ ...state, identifier: convertToSlug(e.target.value), name: e.target.value })
  }
  const handleIdentifierChange = e => {
    setState({ ...state, identifier: convertToSlug(e.target.value) })
  }
  return (
    <Box p={0}>
      <Typography variant="body2" display="block" sx={{ color: theme => theme.palette.primary.defaultText }}>
        Project name
      </Typography>
      <TextField required autoFocus value={state.name} onChange={handleNameChange} fullWidth placeholder="Try a team name, project goal, milestone..." sx={{ mb: 2, "& fieldset": {borderColor: theme => theme.palette.mode === "light" ? "" : "#444444"} }} />
      <Typography variant="body2" display="block" sx={{ color: theme => theme.palette.primary.defaultText }}>
        Project key
      </Typography>
      <TextField placeholder="Try new-project" required id="filled-basic" value={state.identifier} onChange={handleIdentifierChange} sx={{ mb: 2, "& fieldset": {borderColor: theme => theme.palette.mode === "light" ? "" : "#444444"} }} />
    </Box>
  )
}

export default memo(AddProjectDetails)
