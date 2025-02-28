import { Box, Button, Container, LinearProgress, Stack, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useGetProjectTypesQuery } from "@redux/services/projectApi"
import TemplateItem from "./TemplateItem"

const Template = ({ setTemplate }) => {
  const { data: projectTypes, isLoading } = useGetProjectTypesQuery()
  const navigate = useNavigate()

  const handleClose = () => navigate(-1)

  return (
    <Container maxWidth="md">
      <Typography my={2.5}>New project</Typography>
      <Box sx={{ display: "flex" }}>
        <Typography variant="h5" fontWeight={500} sx={{ color: theme => theme.palette.primary.secondaryText }}>
          Step 1 :
        </Typography>
        <Typography variant="h6" fontWeight={500} sx={{ color: theme => theme.palette.primary.defaultText }}>
          &nbsp; Select a project template
        </Typography>
      </Box>
      <Typography my={1} sx={{ color: theme => theme.palette.mode === "light" ? theme.palette.primary.defaultText : theme.palette.primary.secondaryText }}>
        Get up and running quickly with templates that suit the way your team works. Plan, track and release great product.
      </Typography>
      {isLoading ? (
        <LinearProgress />
      ) : (
        <>
          <Box py={2}>
            {projectTypes?.map(template => (
              <TemplateItem template={template} setTemplate={setTemplate} key={template.id} /> //
            ))}
          </Box>
          <Stack direction="row" justifyContent="flex-start">
            <Button variant="text" onClick={handleClose} sx={{ color: theme => theme.palette.primary.defaultText, mr: 2 }}>
              Cancel
            </Button>
          </Stack>
        </>
      )}
    </Container>
  )
}

export default Template
