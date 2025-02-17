import { Box, Button, Stack, Typography } from "@mui/material"
import Kanban from "assets/images/kanban-new.svg"
import Scrum from "assets/images/scrum-new.svg"
import { LineCard as Card } from "pages/shared/StyledCard"
const ChangeTemplate = ({ onBack, template }) => {
  return (
    <Box px={3} py={2} sx={{ borderLeft: "2px dashed #f1f5f9" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>Template</Typography>
        <Button sx={{color: theme => theme.palette.mode === "light" ? "" : theme.palette.text.primary}} onClick={onBack}>Change Template</Button>
      </Stack>
      <Card sx={{ display: "flex", my: 2, justifyContent: "flex-start" }}>
        <Box minWidth="125px" bgcolor="rgba(241,245,249, 0.4)" p={2} sx={{ display: "flex", alignItems: "center", justifyContent: "center", background: theme => theme.palette.mode === "light" ? "rgba(241,245,249, 0.4)" : theme.palette.background.paper }}>
          {template && template.name === "Scrum" ? <img src={Scrum} alt="Icon" /> : template.name === "Kanban" ? <img src={Kanban} alt="Icon" /> : <img src="" alt="Icon" />}
        </Box>
        <Box py={1} px={2}>
          <Typography fontWeight={500}>{template.name}</Typography>
          <Typography variant="body2" sx={{ color: theme => theme.palette.mode === "light" ? theme.palette.primary.secondaryText : theme.palette.text.secondary }}>
            {" "}
            {template.name === "Scrum"
              ? "Use a board, backlog, and roadmap to sprint towards your project goals."
              : template.name === "Kanban"
              ? "Use a powerful board to visualize issues and drive your project forward."
              : ""}
          </Typography>
        </Box>
      </Card>
    </Box>
  )
}

export default ChangeTemplate
