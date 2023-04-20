import SettingsIcon from "@mui/icons-material/SettingsOutlined"
import BacklogIcon from "@mui/icons-material/TornadoOutlined"
import RoadmapIcon from "@mui/icons-material/ViewTimelineOutlined"
import IssuesIcon from "@mui/icons-material/WebStoriesOutlined"
import SprintIcon from "@mui/icons-material/WidthNormalOutlined"
import List from "@mui/material/List"
import MuiListItem from "@mui/material/ListItem"
import MuiListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import { styled } from "@mui/material/styles"
import { useSelector } from "react-redux"
import { Link, useLocation } from "react-router-dom"
import { isAdmin } from "@redux/reducerSlices/user/userAuthSlice"
import { PATH_DASHBOARD } from "routes/paths"

const activeLinkMixin = theme => ({
  backgroundColor: "#f1f5f9",
  color: "black",
  "& .MuiSvgIcon-root": {
    height: "1.6em",
    color: "black",
  },
  "& .MuiListItemText-primary": {
    transition: "font-size .1s",
    fontSize: "1.05rem",
    fontWeight: 500,
  },
})

const ListItem = styled(MuiListItem)(({ theme, active }) => ({
  padding: "7px 2px 7px 20px",
  marginBottom: 4,
  borderRadius: "4px",
  position: "relative",
  color: theme.palette.primary.defaultText,
  "& .MuiSvgIcon-root": {
    height: "1.6em",
  },
  "& .MuiListItemText-primary": {
    transition: "font-size .1s",
    fontSize: "0.9rem",
    fontWeight: 500,
  },
  ...(active === "true" && {
    ...activeLinkMixin(theme),
  }),
}))

const activeLinkIconMixin = theme => ({
  color: "#63F5AF",
})

const ListItemIcon = styled(MuiListItemIcon)(({ theme, active }) => ({
  color: "#5F6368",
  minWidth: 48,
  ...(active === "true" && {
    ...activeLinkIconMixin(theme),
  }),
}))

const ProjectSidebarLinks = ({ project }) => {
  const location = useLocation()
  const currentLocation = location.pathname
  const Admin = useSelector(isAdmin)

  const projectBaseUrl = `${PATH_DASHBOARD.projects.root}/${project.identifier}`
  const primaryLinks = [
    { icon: <IssuesIcon />, label: "Issues", to: `${projectBaseUrl}/issues` },
    // { icon: <ReportsIcon />, label: "Reports", to: `reports`, disabled: true },
    // { icon: <PokerIcon />, label: "Planning Poker", to: `planning-poker`, disabled: true },
    // { icon: <DocsIcon />, label: "Documents", to: `documents`, disabled: true },
  ]
  if (project.project_type.name === "Scrum") {
    primaryLinks.unshift({ icon: <SprintIcon />, label: "Active Sprint", to: `${projectBaseUrl}/sprint` })
    primaryLinks.unshift({ icon: <BacklogIcon />, label: "Backlog", to: `${projectBaseUrl}/backlog` })
  } else if (project.project_type.name === "Kanban") {
    primaryLinks.unshift({ icon: <RoadmapIcon />, label: "Roadmap", to: `${projectBaseUrl}/roadmap` })
    primaryLinks.unshift({ icon: <SprintIcon />, label: "Board", to: `${projectBaseUrl}/board` })
  }
  if (Admin) primaryLinks.push({ icon: <SettingsIcon />, label: "Settings", to: `${projectBaseUrl}/settings` })

  return (
    <List sx={{ paddingRight: 3, paddingTop: 1, paddingLeft: 3 }}>
      {primaryLinks.map((link, index) => {
        const isActive = currentLocation.includes(link.to)
        return (
          <ListItem button disabled={link.disabled} key={link.to} component={Link} to={link.to} active={`${isActive}`}>
            <ListItemIcon active={`${isActive}`}>{link.icon}</ListItemIcon>
            <ListItemText primary={link.label} active={`${isActive}`} />
          </ListItem>
        )
      })}
    </List>
  )
}

export default ProjectSidebarLinks
