import { Box, List, ListItem, ListItemText, Typography } from "@mui/material"
import ListItemIcon from "@mui/material/ListItemIcon"
import IssueTypeIcon from "pages/shared/IssueTypeIcon"
import { useGetIssueTypeQuery } from "@redux/services/issueApi"

const OtherDetails = ({ template }) => {
  const { data: trackers } = useGetIssueTypeQuery()

  return (
    <Box p={3}>
      <Typography gutterBottom sx={{ fontWeight: 500, fontSize: "0.7rem", color: theme => theme.palette.primary.secondaryText }}>
        RECOMENDED FOR
      </Typography>
      <Typography variant="body2" gutterBottom sx={{ color: theme => theme.palette.primary.defaultText }}>
        {template.name === "Scrum" && <span>Teams that deliver work at a consistent pace</span>}
        {template.name === "Kanban" && <span>Teams that control work volume from a backlog</span>}
      </Typography>
      <Typography gutterBottom sx={{ mt: 4, fontWeight: 500, fontSize: "0.7rem", color: theme => theme.palette.primary.secondaryText }}>
        ISSUE TYPES
      </Typography>
      <List sx={{ mb: 2 }}>
        {trackers?.map(issue => (
          <ListItem disablePadding key={issue.id}>
            <ListItemIcon sx={{ minWidth: 30 }}>
              <IssueTypeIcon type_name={issue.name} type_id={issue.id} />
            </ListItemIcon>
            <ListItemText primary={issue.name} sx={{ "& .MuiTypography-root": { fontSize: "0.8rem" } }} />
          </ListItem>
        ))}
      </List>
      <Typography variant="caption">ISSUE STATUSES</Typography>
      <List>
        {["New", "In Progress", "Done"].map(status => (
          <ListItem disablePadding key={status} sx={{}}>
            <ListItemText primary={status} sx={{ "& .MuiTypography-root": { fontSize: "0.8rem", fontWeight: 500 } }} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default OtherDetails
