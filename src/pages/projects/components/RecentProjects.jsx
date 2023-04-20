import { Card, CardHeader, CircularProgress, Divider, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material"
import projectIcon from "assets/images/project.svg"
import { Link as RouterLink } from "react-router-dom"
import { useGetProjectsQuery } from "@redux/services/projectApi"
import { fDate } from "utils/formatDate"

function RecentProjects({ project_id, ...props }) {
  const { data, isLoading } = useGetProjectsQuery({ limit: 4 })

  return (
    <Card variant="elevation">
      <CardHeader titleTypographyProps={{ variant: "h6" }} title="Recent Projects"></CardHeader>
      <Divider />
      <List>
        {isLoading ? (
          <CircularProgress />
        ) : (
          data?.projects.map(({ name, id, created_on, identifier }) => (
            <ListItemButton key={id} component={RouterLink} to={`/account/projects/${identifier}`}>
              <ListItemIcon sx={{ minWidth: 37 }}>
                <img src={projectIcon} alt="favorite" />
              </ListItemIcon>
              <ListItemText primary={name} />
              <Typography variant="tiny" color={"text.secondary"}>
                {fDate(created_on, "dd D/M, h:mm A z")}
              </Typography>
            </ListItemButton>
          ))
        )}
      </List>
    </Card>
  )
}

export default RecentProjects
