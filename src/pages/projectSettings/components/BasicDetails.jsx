import { LoadingButton } from "@mui/lab"
import { Grid, Stack, TextField, Typography } from "@mui/material"
import { useGetProjectByIdQuery, useUpdateProjectDetailsMutation } from "@redux/services/projectApi"
import { DEFAULT_ERROR_MSG } from "config/constants"
import { useSnackbar } from "notistack"
import Loading from "pages/shared/Loading"
import { LineCard as Card } from "pages/shared/StyledCard"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ProjectAsignee from "./ProjectAsignee"

const BasicDetails = () => {
  const { project_id } = useParams()
  const [state, setState] = useState({ name: "", description: "", type: "", default_assigned_to_id: "", lead_id: "" })
  const [updateProjectDetails, { isLoading }] = useUpdateProjectDetailsMutation()
  const { enqueueSnackbar } = useSnackbar()
  const { data: project, isLoading: loading } = useGetProjectByIdQuery(project_id)
  const { name, description, lead, default_assignee } = project || {}

  useEffect(() => {
    setState(s => ({ ...s, name, description, lead_id: lead?.id, default_assigned_to_id: default_assignee?.id }))
  }, [name, description, lead, default_assignee])

  const handleStateChange = e => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleSave = async e => {
    try {
      e.preventDefault()
      if (!state.name) return enqueueSnackbar("Enter name & key.", { variant: "error" })
      const data = { project_id }
      if (state.name !== name) data.name = state.name
      if (state.description !== description) data.description = state.description
      if (state.lead_id !== lead?.id) data.lead_id = state.lead_id
      if (state.default_assigned_to_id !== default_assignee?.id) data.default_assigned_to_id = state.default_assigned_to_id
      await updateProjectDetails(data).unwrap()
      enqueueSnackbar("Project details updated", { variant: "success" })
    } catch (error) {
      console.error(error)
      enqueueSnackbar(error.data?.message || error.data?.errors?.join(", ") || DEFAULT_ERROR_MSG, { variant: "error" })
    }
  }

  if (loading) return <Loading grid />
  if (!project) return <></>
  return (
    <Grid component={"form"} onSubmit={handleSave} container spacing={2} sx={{ mt: 0 }}>
      <Grid item lg={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="body2" display="block" sx={{ color: theme => theme.palette.mode === "light" ? theme.palette.primary.defaultText : theme.palette.text.secondary }}>
            Project name
          </Typography>
          <TextField fullWidth placeholder="Enter project name" value={state.name} onChange={e => handleStateChange(e)} name="name"></TextField>
          <ProjectAsignee {...{ project_id, state, setState }} />
          {/* <CKEditor
                editor={ClassicEditor}
                data={state.description}
                onChange={(event, editor) => {
                  const data = editor.getData()
                  setState(s => ({ ...s, description: data }))
                }}
                onReady={editor => {
                  editor.editing.view.change(writer => {
                    writer.setStyle("height", "200px", editor.editing.view.document.getRoot())
                  })
                }}
              /> */}
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

export default BasicDetails
