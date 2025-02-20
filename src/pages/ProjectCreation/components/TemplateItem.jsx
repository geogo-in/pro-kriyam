import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { Box, ButtonBase, Typography } from "@mui/material"
import Kanban from "assets/images/kanban-new.svg"
import Scrum from "assets/images/scrum-new.svg"
import { LineCard as Card } from "pages/shared/StyledCard"

export default function TemplateItem({ setTemplate, template }) {
  const { name } = template
  return (
    <Card component={ButtonBase} onClick={() => setTemplate(template)} sx={{ width: "100%", mb: 2, "&:hover": { boxShadow: "1px 1px 8px -5px #00000080" } }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 140, width: "220px", bgcolor: theme => theme.palette.mode === "light" ? "rgba(241,245,249, 0.6)" : "#000" }}>
        {template && template.name === "Scrum" ? (
          <img src={Scrum} alt="Icon" width="130" />
        ) : template.name === "Kanban" ? (
          <img src={Kanban} width="170" alt="Icon" />
        ) : (
          <img src="" alt="Icon" />
        )}
      </Box>

      <Box py={4} px={2} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "" }}>
        <Typography variant="h5" fontWeight={500}>
          {name}
        </Typography>
        <Typography variant="body2" sx={{ color: theme => theme.palette.mode === "light" ? theme.palette.primary.tertiaryText : theme.palette.primary.secondaryText }}>
          {name === "Scrum"
            ? "Use a board, backlog, and roadmap to sprint towards your project goals."
            : name === "Kanban"
            ? "Use a powerful board to visualize issues and drive your project forward."
            : ""}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" pr={3}>
        <ArrowForwardIosIcon />
      </Box>
    </Card>
  )
}
