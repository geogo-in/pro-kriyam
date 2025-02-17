import { Box, Chip, IconButton, Stack, Typography } from "@mui/material"
import Card from "@mui/material/Card"
import { useGetProjectByIdQuery } from "@redux/services/projectApi"
import IssuePriorityIcon from "pages/shared/IssuePriorityIcon"
import IssueTypeIcon from "pages/shared/IssueTypeIcon"
import MemberAvatar from "pages/shared/MemberAvatar"
import { StyledTooltip } from "pages/shared/StyledTooltip"
import { Draggable } from "react-beautiful-dnd"
import { useLocation, useNavigate } from "react-router-dom"
import { PATH_DASHBOARD } from "routes/paths"

const ListItemCustom = ({ itemObject: issue, index, project_id }) => {
  const { data: project } = useGetProjectByIdQuery(project_id)
  const location = useLocation()
  const navigate = useNavigate()
  const handleDetails = () => {
    const type = project?.project_type?.name === "Kanban" ? "board" : "sprint"
    navigate(`${PATH_DASHBOARD.projects.root}/${project_id}/${type}/issues/${issue.id}?referrer=${type}`, { state: { background: location } })
  }

  return (
    <Box my={0}>
      <Draggable draggableId={`${issue.id}`} key={`${issue.id}`} index={index}>
        {provided => (
          <Card
            sx={{ my: 1, p: 1, borderRadius: 0.5, boxShadow: "1px 1px 8px -5px #00000080" }}
            key={`${issue.id}`}
            onClick={handleDetails}
            role={undefined}
            component="li"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}>
            <Typography variant="h6" sx={{ color: theme => theme.palette.mode === "light" ? theme.palette.primary.defaultText : theme.palette.text.default, fontSize: "0.85rem", fontWeight: 500, mb: 1 }}>
              {issue.subject}
            </Typography>
            {issue.category?.name && (
              <StyledTooltip title={`Epic`} placement="right">
                <Chip size="small" label={issue.category.name} sx={{ borderRadius: "20px", color: "#FFF", background: issue.category?.color_code }} mt={1} />
              </StyledTooltip>
            )}

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ borderTop: "0px solid #f1f5f9", mt: 1, pt: 1 }}>
              <Stack direction="row" justifyContent="space-around" alignItems="center" spacing={1}>
                {issue.tracker && (
                  <StyledTooltip title={`Issue Type - ${issue.tracker.name}`}>
                    <IconButton size="small">
                      <IssueTypeIcon type_id={issue.tracker.id} />
                    </IconButton>
                  </StyledTooltip>
                )}

                {issue.priority?.name && (
                  <StyledTooltip title={`Issue Priority - ${issue.priority.name}`}>
                    {/* <Chip size="small" variant="outlined" label={issue.priority.name.charAt()} color="secondary" /> */}
                    <IconButton size="small" sx={{ marginLeft: "0px !important" }}>
                      <IssuePriorityIcon type_name={issue.priority?.name} />
                    </IconButton>
                  </StyledTooltip>
                )}

                <StyledTooltip title={`Story Point`}>
                  <Chip size="small" sx={{ background: theme => theme.palette.mode === "light" ? "#f1f5f9" :  theme.palette.background.secondary, ml: "4px !important" }} label={issue.story_point ? issue.story_point : "--"} />
                </StyledTooltip>
              </Stack>
              <Stack direction="row" justifyContent="flex-end" alignItems="center">
                <StyledTooltip title="Issue ID">
                  <Typography variant="subtitle2" pr={1} sx={{ color: theme => theme.palette.mode === "light" ? theme.palette.primary.tertiaryText : theme.palette.text.secondary, ":hover": { textDecoration: "underline", cursor: "pointer" } }}>
                    #{issue.id}
                  </Typography>
                </StyledTooltip>
                <MemberAvatar name={issue.assigned_to?.name} tooltipPosition="right" />
              </Stack>
            </Stack>
          </Card>
        )}
      </Draggable>
    </Box>
  )
}

export default ListItemCustom
