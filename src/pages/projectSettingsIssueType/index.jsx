import { LoadingButton } from "@mui/lab"
import { Checkbox, FormControlLabel, FormGroup, Grid, Stack, Typography } from "@mui/material"
import { useGetIssueTypeQuery } from "@redux/services/issueApi"
import { useGetProjectByIdQuery, useUpdateProjectDetailsMutation } from "@redux/services/projectApi"
import { useSnackbar } from "notistack"
import IssueTypeIcon from "pages/shared/IssueTypeIcon"
import Loading from "pages/shared/Loading"
import { LineCard as Card } from "pages/shared/StyledCard"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getErrorMessage } from "utils/helper"
const ProjectSettingsIssueType = () => {
  const { project_id } = useParams()
  const { data: project, isLoading } = useGetProjectByIdQuery(project_id)
  const { data: trackers, isLoading: isGISLoading } = useGetIssueTypeQuery()

  const [trackerIds, setTrackerIds] = useState([])
  const [updateProject] = useUpdateProjectDetailsMutation()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (project?.tracker?.length) setTrackerIds(project.tracker.map(dd => dd.id))
  }, [project, trackers])

  const handleChange = id => event => {
    const tracker_ids = new Set(trackerIds)

    if (event.target.checked) tracker_ids.add(id)
    else tracker_ids.delete(id)

    setTrackerIds([...tracker_ids])
  }
  const handleSubmit = async e => {
    try {
      e.preventDefault()
      await updateProject({ project_id, tracker_ids: trackerIds }).unwrap()
      enqueueSnackbar("Done", { variant: "success" })
    } catch (error) {
      const { message } = getErrorMessage(error)
      enqueueSnackbar(message, { variant: "error" })
    }
  }
  if (isLoading || isGISLoading) return <Loading />
  return (
    <Grid component={"form"} onSubmit={handleSubmit} container spacing={2} sx={{ mt: 0 }}>
      <Grid item lg={6}>
        <Card sx={{ px: 3, py: 2, my: 0 }}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem", color: theme => theme.palette.primary.defaultText }}>
            Project issue types
          </Typography>
          <Typography variant="body2" sx={{ color: "primary.defaultText", mb: 1 }}>
            Select the issue types or trackers that you want in this project.
          </Typography>
          <FormGroup column>
            {trackers.map(tracker => (
              <FormControlLabel
                key={tracker.id}
                control={<Checkbox checked={trackerIds.includes(tracker.id)} onChange={handleChange(tracker.id)} />}
                label={<IssueTypeIcon type_name={tracker.name} />}
              />
            ))}
          </FormGroup>
          <Stack direction="row" alignItems="center" sx={{ mt: 2 }}>
            <LoadingButton variant="contained" loading={isLoading} type="submit" sx={{ borderRadius: "4px" }}>
              Update
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  )
}
export default ProjectSettingsIssueType
