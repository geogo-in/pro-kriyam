import BackIcon from "@mui/icons-material/KeyboardBackspace"
import { Box, Button, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import ToggleStarProject from "./ToggleStarProject"

const MainFlexRow = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  padding: "8px 12px",
  borderRadius: "4px",
  background: "#f4f7fa",
}))

const BackButton = styled(Button)(({ theme }) => ({
  marginBottom: 12,
  width: "100%",
  display: "flex",
  justifyContent: "flex-start",
  borderRadius: 4,
  color: theme.palette.primary.defaultText,
}))

const ProjectSidebarHeader = ({ project }) => {
  return (
    <Box sx={{ px: 3, pt: 2, pb: 2 }}>
      <BackButton component={"a"} href="/account/projects" startIcon={<BackIcon />}>
        Back to projects
      </BackButton>
      <MainFlexRow>
        <Box>
          <Typography variant="h6" fontWeight={500} sx={{ color: "black", fontSize: "1.05rem", lineHeight: "1.4" }}>
            {project.name}
          </Typography>
          <Typography variant="body2" sx={{ color: theme => theme.palette.primary.secondaryText, fontSize: "0.8rem" }}>
            {project.project_type?.name}
          </Typography>
        </Box>
        <Box sx={{ ml: 1 }}>
          <ToggleStarProject project={project} />
        </Box>
      </MainFlexRow>
    </Box>
  )
}

export default ProjectSidebarHeader
