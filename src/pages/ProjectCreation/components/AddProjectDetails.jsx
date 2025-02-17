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
      <Typography variant="body2" display="block" sx={{ color: theme => theme.palette.mode === "light" ? theme.palette.primary.defaultText : theme.palette.text.primary }}>
        Project name
      </Typography>
      <TextField required autoFocus value={state.name} onChange={handleNameChange} fullWidth placeholder="Try a team name, project goal, milestone..." sx={{ mb: 2 }} />
      <Typography variant="body2" display="block" sx={{ color: theme => theme.palette.mode === "light" ? theme.palette.primary.defaultText : theme.palette.text.primary }}>
        Project key
      </Typography>
      <TextField placeholder="Try new-project" required id="filled-basic" value={state.identifier} onChange={handleIdentifierChange} sx={{ mb: 2 }} />
    </Box>
  )
}

export default memo(AddProjectDetails)
