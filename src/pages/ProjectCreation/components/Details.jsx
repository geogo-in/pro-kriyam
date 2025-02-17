import BackIcon from "@mui/icons-material/KeyboardBackspace"
import { LoadingButton } from "@mui/lab"
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useCreateProjectMutation } from "@redux/services/projectApi"
import { DEFAULT_ERROR_MSG } from "config/constants"
import { useSnackbar } from "notistack"
import { LineCard as Card } from "pages/shared/StyledCard"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AddProjectDetails from "./AddProjectDetails"
import ChangeTemplate from "./ChangeTemplate"

const BackButton = styled(Button)(({ theme }) => ({
  margin: "20px 0",
  display: "flex",
  padding: 0,
  justifyContent: "flex-start",
  borderRadius: 4,
  color: theme.palette.mode === "light" ? theme.palette.primary.defaultText : theme.palette.text.default,
}))

export default function Details({ template, setTemplateDetail, setTemplate }) {
  const [createProject, { isLoading }] = useCreateProjectMutation()
  const [state, setState] = useState({ name: "", identifier: "" })
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const handleBack = () => {
    setTemplate()
    setTemplateDetail()
  }
  const handleClose = () => navigate(-1)
  const handleSubmit = async e => {
    try {
      e.preventDefault()
      if (!template.id) return enqueueSnackbar("Select a valid project type.", { variant: "error" })
      const payload = await createProject({ ...state, project_type: template.id }).unwrap()
      navigate(`/account/projects/${payload?.project?.id || ""}`, { replace: true })
    } catch (error) {
      console.error(error)
      enqueueSnackbar(error.data?.message || error.data?.errors?.join(", ") || DEFAULT_ERROR_MSG, { variant: "error" })
    }
  }

  return (
    <Container maxWidth="md">
      <Box>
        <BackButton onClick={handleBack} startIcon={<BackIcon />}>
          Back to templates
        </BackButton>
        <Box sx={{ display: "flex" }}>
          <Typography variant="h5" fontWeight={500} sx={{ color: theme => theme.palette.mode === "light" ? theme.palette.primary.secondaryText : theme.palette.text.secondary }}>
            Step 3 :
          </Typography>
          <Typography variant="h6" fontWeight={500} sx={{ color: theme => theme.palette.mode === "light" ? theme.palette.primary.defaultText : theme.palette.text.primary }}>
            &nbsp; Fill project details
          </Typography>
        </Box>
      </Box>
      <Typography my={1} sx={{ color: theme => theme.palette.mode === "light" ? theme.palette.primary.defaultText : theme.palette.text.primary }}>
        You can change these details anytime in your project settings.
      </Typography>
      <Box component="form" onSubmit={handleSubmit} container maxWidth="md" sx={{ mx: "auto", mt: 3 }}>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <AddProjectDetails {...{ state, setState }} />
              <Stack direction="row" justifyContent="flex-start" sx={{ mt: 2 }}>
                <LoadingButton variant="contained" loading={isLoading} type="submit">
                  Create project
                </LoadingButton>
                <Button onClick={handleClose} sx={{ color: theme => theme.palette.mode === "light" ? "grey" : theme.palette.text.default, ml: 2 }}>
                  Cancel
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <ChangeTemplate onBack={handleBack} template={template} />
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Container>
  )
}
