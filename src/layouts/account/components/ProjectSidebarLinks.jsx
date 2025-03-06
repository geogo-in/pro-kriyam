import SprintDetailsIcon from "@mui/icons-material/AssessmentOutlined"
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
import { isAdmin } from "@redux/reducerSlices/user/userAuthSlice"
import { useSelector } from "react-redux"
import { Link, useLocation } from "react-router-dom"
import { PATH_DASHBOARD } from "routes/paths"

const activeLinkMixin = theme => ({
  // backgroundColor: "#f1f5f9",
  backgroundColor: theme.palette.mode === "light" ? "#f1f5f9" : "#132741",
  color: theme.palette.mode === "light" ? "black" : "#69ADF3",
  "& .MuiSvgIcon-root": {
    height: "1.6em",
    color: theme.palette.mode === "light" ? "black" : "#69ADF3",
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
    color: theme.palette.primary.defaultText,
  },
  "& .MuiListItemText-primary": {
    transition: "font-size .1s",
    fontSize: "0.9rem",
    fontWeight: 500,
  },
  ...(active === "true" && {
    ...activeLinkMixin(theme),
    ...(theme.palette.mode === "dark" && {
      "&:hover": {
        backgroundColor: "#132741 !important",
      },
    }),
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
    // { icon: <IssuesIcon />, label: "Issues", to: `${projectBaseUrl}/issues` },
    // { icon: <ReportsIcon />, label: "Reports", to: `reports`, disabled: true },
    // { icon: <PokerIcon />, label: "Planning Poker", to: `planning-poker`, disabled: true },
    // { icon: <DocsIcon />, label: "Documents", to: `documents`, disabled: true },
  ]
  if (project.project_type.name === "Scrum") {
    primaryLinks.unshift({ icon: <SprintIcon />, label: "Active Sprint", to: `${projectBaseUrl}/sprint` })
    primaryLinks.unshift({ icon: <BacklogIcon />, label: "Backlog", to: `${projectBaseUrl}/backlog` })
    primaryLinks.push({ icon: <IssuesIcon />, label: "Issues", to: `${projectBaseUrl}/issues` })
    primaryLinks.push({ icon: <SprintDetailsIcon />, label: "Sprint Report", to: `${projectBaseUrl}/report` })
  } else if (project.project_type.name === "Kanban") {
    primaryLinks.unshift({ icon: <SprintIcon />, label: "Board", to: `${projectBaseUrl}/board` })
    primaryLinks.unshift({ icon: <RoadmapIcon />, label: "Roadmap", to: `${projectBaseUrl}/roadmap` })
    // primaryLinks.push({ icon: <IssuesIcon />, label: "Tasks", to: `${projectBaseUrl}/issues` })
  }
  if (Admin) primaryLinks.push({ icon: <SettingsIcon />, label: "Project Settings", to: `${projectBaseUrl}/settings` })

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
