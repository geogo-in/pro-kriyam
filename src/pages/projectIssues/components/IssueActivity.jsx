import { Avatar, Box, Grid, Stack, Typography } from "@mui/material"
import { useGetEpicQuery, useGetIssuePriorityQuery, useGetIssuesQuery } from "@redux/services/issueApi"
import { useGetProjectMembershipsQuery } from "@redux/services/projectApi"
import { stringAvatar } from "utils/Avatar"
import { fDate } from "utils/formatDate"

export default function IssueActivity({ statuses, project, user, details, created_on, id, notes, ...props }) {

  const { data: epics } = useGetEpicQuery(project?.id)
  const { data: membership } = useGetProjectMembershipsQuery(project?.id)
  const { data: priorities } = useGetIssuePriorityQuery()
  const { data, isLoading, error } = useGetIssuesQuery({ project_id: project?.id, include: "relations" })

  const activityName = (name, property) => {
    if (property === "attachment") return "Attachment"
    else if (name === "assigned_to_id") return "Assignee"
    else if (name === "precedes" || name === "follows") return "Order"
    else if (name === "relates") return "Relation"
    else {
      return name
      .replace(/_id$/, "")
      .split("_")   
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
    }
  }

  const activityValue = (name,value) => {
    if (name === "assigned_to_id"){
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
    } else {
      return value
    }
  }

  return (
    <Stack spacing={1} direction="row" mt={1}>
      <Box>
        <Avatar {...stringAvatar(user?.name)} />
      </Box>

      <Grid container columns={12}>
        <Grid item xs={9}>
          <Typography>{user?.name}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography color="text.secondary" variant="tiny">
            Remark:{" "}
          </Typography>
          <Typography color="green" variant="tiny">
            OK
          </Typography>
        </Grid>

        <Grid container>
          <Grid item xs={9}>
            {details.map(({ property, name, new_value, old_value }, i) => (
              <Typography noWrap key={`details-${i}-${id}`} color="text.secondary" variant="tiny" component="div" lineHeight={1.2} fontWeight={300}>
                <Box component="span" color="green">
                  {activityName(name,property)}
                </Box>{" "}
                changed
                {name === "description" ? (
                  "."
                ) : name === "precedes" ? (
                  <>
                    {old_value ? `: Task no longer precedes Issue ID- ${activityValue(name,old_value)}` : ""}{""}
                    <Box component="span">
                        {new_value ? `: Task set to precede Issue ID- ${activityValue(name,new_value)}` : ""}
                    </Box>
                  </>
                ) : name === "relates" ? (
                  <>
                    {old_value ? `: Relation removed from Issue ID- ${activityValue(name,old_value)}` : ""}{""}
                    <Box component="span">
                        {new_value ? `: Relation added to Issue ID- ${activityValue(name,new_value)}` : ""}
                    </Box>
                  </>
                ) : name === "follows" ? (
                  <>
                    {old_value ? `: Task no longer to follow Issue ID- ${activityValue(name,old_value)}` : ""}{""}
                    <Box component="span">
                        {new_value ? `: Task to follow Issue ID- ${activityValue(name,new_value)}` : ""}
                    </Box>
                    </>
                ) : (
                  <>
                    {old_value ? ` from ${activityValue(name,old_value)}` : ""}{" "}
                    <Box component="span" color="text.primary" den>
                      {new_value ? ` to ${activityValue(name,new_value)}` : ""}
                    </Box>
                  </>
                )}
              </Typography>
            ))}
            <Typography noWrap color="text.secondary" variant="tiny" component="div" lineHeight={1.2} fontWeight={300}>
              <Box component="span" color="text.primary" dangerouslySetInnerHTML={{ __html: notes.substring(0, 100).concat(notes.length < 100 ? "." : "...") }} />
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography color="text.secondary" variant="tiny">
              {fDate(created_on, "dd D/M, h:mm A z")}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  )
}
