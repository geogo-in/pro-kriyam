import { TrendingFlat } from '@mui/icons-material'
import { Box, Grid, Stack, Typography } from "@mui/material"
import { useGetEpicQuery, useGetIssuePriorityQuery, useGetIssuesQuery } from "@redux/services/issueApi"
import { useGetProjectMembershipsQuery } from "@redux/services/projectApi"
import MemberAvatar from "pages/shared/MemberAvatar"
import { fDate } from "utils/formatDate"

export default function IssueActivity({ tag, statuses, project, user, details, created_on, id, notes, ...props }) {

  const { data: epics } = useGetEpicQuery(project?.id)
  const { data: membership } = useGetProjectMembershipsQuery(project?.id)
  const { data: priorities } = useGetIssuePriorityQuery()
  const { data, isLoading, error } = useGetIssuesQuery({ project_id: project?.id, include: "relations" })

  const activityName = (name, property) => {
    if (property === "attachment") return "Attachment"
    else if (name === "assigned_to_id") return "Assignee"
    else if (name === "precedes" || name === "follows") return "Order"
    else if (name === "relates") return "Relation"
    else if (name === "category_id") return "Epic"
    else {
      return name
      .replace(/_id$/, "")
      .split("_")   
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
    }
  }

  const activityValue = (name,value) => {
    if( value === null){
      return "None"
    } else if (name === "assigned_to_id"){
      const member = membership?.find((m) => m.user.id.toString() === value)?.user
      return member ? member.name : value
    } else if (name === "priority_id") {
      const priority = priorities?.find((p) => p.id.toString() === value)
      return priority ? priority.name : value
    } else if (name  === "status_id") {
      const status = statuses?.find((s) => s.id.toString() === value)
      return status ? status.name : value
    } else if (name === "due_date" || name === "start_date") {
      const date = new Date(value);
      return date.toLocaleDateString("en-GB")
    } else if (name === "category_id") {
      const epic = epics?.find((e) => e.id.toString() === value)
      return epic ? epic.name : value
    } else {
      return value
    }
  }

  return (
    <Box pb={1.5}>
      {details.map(({ property, name, new_value, old_value }, i) => (
        <Stack spacing={1} direction="row" mt={1} pt={0.7}>
          <Box>
            <MemberAvatar name={user?.name} tooltipPosition="none" />
          </Box>
          <Grid container columns={12}>
            <Grid item xs={9}>
              <Typography>
                {user?.name}{" "}
                {name === "status_id" ? 
                  <Box sx={{fontSize: "0.8rem"}} component="span" noWrap key={`activity-${id}`} color="text.secondary" fontWeight={400}>
                    changed the {activityName(name,property)}
                  </Box> : 
                  <Box sx={{fontSize: "0.8rem"}} component="span" noWrap key={`activity-${id}`} color="text.secondary" fontWeight={400}>
                    updated the {activityName(name,property)}
                  </Box>
                }
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography color="text.secondary" variant="tiny">
                {fDate(created_on, "dd D/M, h:mm A z")}
              </Typography>
            </Grid>
            <Grid container>
              <Box sx={{ mt: 0.5, display: "flex", alignItems: "center", gap: 1 }} >
                <Box component="span" sx={{ fontWeight: old_value === null ? 300 : 400, fontSize: "0.8rem", backgroundColor: theme => theme.palette.mode === "light" ? "#F1F5F9" : theme.palette.background.default, px: 1, py: 0.5, borderRadius: 0.5, color: theme => theme.palette.mode === "light" ? "" : theme.palette.primary.defaultText }} >
                  {activityValue(name,old_value)}
                </Box>
                <TrendingFlat fontSize='small' />
                <Box component="span" sx={{ fontWeight: old_value === null ? 300 : 400, fontSize: "0.8rem", backgroundColor: theme => theme.palette.mode === "light" ? "#F1F5F9" : theme.palette.background.default, px: 1, py: 0.5, borderRadius: 0.5, color: theme => theme.palette.mode === "light" ? "" : theme.palette.primary.defaultText }} >
                  {activityValue(name,new_value)}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Stack>
      ))}
    </Box>
  )
}
