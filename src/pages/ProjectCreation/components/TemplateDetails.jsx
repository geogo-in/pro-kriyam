import BackIcon from "@mui/icons-material/KeyboardBackspace"
import { Box, Button, Container, Grid, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { LineCard as Card } from "pages/shared/StyledCard"
// import AboutTemplate from "./AboutTemplate"
import AboutKanban from "./AboutKanban"
import AboutScrum from "./AboutScrum"
import OtherDetails from "./OtherDetails"

const BackButton = styled(Button)(({ theme }) => ({
  margin: "20px 0",
  display: "flex",
  padding: 0,
  justifyContent: "flex-start",
  borderRadius: 4,
  color: theme.palette.mode === "light" ? theme.palette.primary.defaultText : theme.palette.text.default,
}))

const TemplateDetails = ({ template, setTemplate, setTemplateDetail }) => {
  const handleType = () => {
    setTemplateDetail("Company-managed")
  }
  const handleBack = () => {
    setTemplate()
  }
  return (
    <Container maxWidth="md">
      <Box>
        <BackButton onClick={handleBack} startIcon={<BackIcon />}>
          Back to templates
        </BackButton>
        <Box sx={{ display: "flex" }}>
          <Typography variant="h5" fontWeight={500} sx={{ color: theme => theme.palette.mode === "light" ? theme.palette.primary.secondaryText : theme.palette.text.secondary }}>
            Step 2 :
          </Typography>
          <Typography variant="h6" fontWeight={500} sx={{ color: theme => theme.palette.mode === "light" ? theme.palette.primary.defaultText: theme.palette.text.primary }}>
            &nbsp; Review project template
          </Typography>
        </Box>
      </Box>
      <Card sx={{ mt: 2, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", bgcolor: theme => theme.palette.mode === "light" ? "rgba(241,245,249, 0.6)" : theme.palette.background.paper }}>
          <Typography variant="h5" fontWeight={500}>
            {template.name}
          </Typography>
          <Button variant="contained" onClick={handleType}>
            Use template
          </Button>
        </Box>
        <Box>
          <Grid container mt={3}>
            <Grid item xs={8}>
              {template.name === "Scrum" ? <AboutScrum template={template} /> : <AboutKanban template={template} />}
            </Grid>
            <Grid item xs={4}>
              <OtherDetails template={template} />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "16px 24px", bgcolor: theme => theme.palette.mode === "light" ? "rgba(241,245,249, 0.6)" : theme.palette.background.paper }}>
          <Typography variant="body1">This project template fits well with your requirements?</Typography>
          <Button variant="contained" onClick={handleType} sx={{ ml: 2 }}>
            Use template
          </Button>
        </Box>
      </Card>
    </Container>
  )
}

export default TemplateDetails
